const User = require('../models/user.model');
const Property = require('../models/property.model');
// const Task = require('../models/task.model'); // Using direct SQL for vendor tasks now
// const Vendor = require('../models/vendor.model'); // Using direct SQL
const { createAuditLog, getUser } = require('../middleware/auth');
const { getIpAddress } = require('../utils/helpers');
const sql = require('../config/db');
const { TICKET_STATES, APPROVAL_THRESHOLDS } = require('../config/constants');

exports.getProperties = async (req, res) => {
  try {
    const user = getUser(req); // This is req.user
    // Fix: getUser returns the user object attached by auth middleware. 
    // If not, we use req.user directly.
    const userId = req.user ? req.user.id : user.id;

    // Fetch properties assigned to this vendor
    // Assuming property_vendors table maps propery_id <-> vendor_user_id
    const query = `
      SELECT p.* 
      FROM properties p
      JOIN property_vendors pv ON p.id = pv.property_id
      WHERE pv.vendor_user_id = ?
    `;
    const [properties] = await sql.query(query, [userId]);

    res.json(properties);
  } catch (error) {
    console.error('Error fetching vendor properties:', error);
    res.status(500).json({ error: 'Server error fetching properties' });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch vendor profile id first? Or is vendor_tasks linked to user_id?
    // In fix_schema, vendor_tasks links to vendor_profiles(id). 
    // We need to find the profile first.

    // 1. Get Vendor Profile ID
    const [profiles] = await sql.query("SELECT id FROM vendor_profiles WHERE user_id = ?", [userId]);
    if (profiles.length === 0) {
      return res.json([]); // No profile, no tasks
    }
    const vendorProfileId = profiles[0].id;

    // 2. Fetch Tasks
    const [tasks] = await sql.query("SELECT * FROM vendor_tasks WHERE assigned_vendor_id = ?", [vendorProfileId]);

    // Parse necessary JSON fields if any (attachments might be needed)
    const enrichedTasks = tasks.map(t => ({
      ...t,
      attachments: t.attachments ? (typeof t.attachments === 'string' ? JSON.parse(t.attachments) : t.attachments) : []
    }));

    res.json(enrichedTasks);
  } catch (error) {
    console.error('Error fetching vendor tasks:', error);
    res.status(500).json({ error: 'Server error fetching tasks' });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const taskId = parseInt(req.params.id);
    const { status, quotationAmount } = req.body;
    const userId = req.user.id;

    // Verify ownership via profile
    const [profiles] = await sql.query("SELECT id FROM vendor_profiles WHERE user_id = ?", [userId]);
    if (profiles.length === 0) return res.status(403).json({ error: 'Vendor profile not found' });
    const vendorProfileId = profiles[0].id;

    const [tasks] = await sql.query("SELECT * FROM vendor_tasks WHERE id = ? AND assigned_vendor_id = ?", [taskId, vendorProfileId]);
    if (tasks.length === 0) {
      return res.status(404).json({ error: 'Task not found or access denied' });
    }
    const task = tasks[0];

    if (status) {
      // Define Allowed State Transitions
      const ALLOWED_TRANSITIONS = {
        [TICKET_STATES.OPEN]: [TICKET_STATES.QUOTATION_SUBMITTED, TICKET_STATES.IN_PROGRESS],
        [TICKET_STATES.IN_PROGRESS]: [TICKET_STATES.COMPLETED, TICKET_STATES.AWAITING_APPROVAL],
        [TICKET_STATES.QUOTATION_SUBMITTED]: [],
        [TICKET_STATES.AWAITING_APPROVAL]: [],
        [TICKET_STATES.COMPLETED]: [],
        [TICKET_STATES.VENDOR_ASSIGNED]: [TICKET_STATES.OPEN, TICKET_STATES.QUOTATION_SUBMITTED, TICKET_STATES.IN_PROGRESS]
      };

      const allowedNextStates = ALLOWED_TRANSITIONS[task.status] || [];
      if (status !== task.status && !allowedNextStates.includes(status)) {
        return res.status(400).json({ error: 'Invalid state transition', currentStatus: task.status, allowedStatuses: allowedNextStates });
      }

      let newStatus = status;
      let autoApproved = false;

      // Logic for Quotation Submission
      if (status === TICKET_STATES.QUOTATION_SUBMITTED) {
        if (!quotationAmount) {
          return res.status(400).json({ error: 'Quotation amount required' });
        }

        const amount = parseFloat(quotationAmount);
        if (amount <= APPROVAL_THRESHOLDS.MAINTENANCE_AUTO_APPROVE_LIMIT) {
          newStatus = TICKET_STATES.IN_PROGRESS;
          autoApproved = true;
        } else {
          newStatus = TICKET_STATES.AWAITING_APPROVAL;
        }

        // Update quotation in DB (assuming column exists or we store in description/notes? 
        // fix_schema doesn't have quotation_amount. Let's assume we need to add it or store in description for now.
        // Ideally we add a column. I'll add 'quotation_amount' to schema.)
        await sql.query("UPDATE vendor_tasks SET quotation_amount = ? WHERE id = ?", [amount, taskId]);
      }

      await sql.query("UPDATE vendor_tasks SET status = ?, updated_at = NOW() WHERE id = ?", [newStatus, taskId]);

      // Update object for response
      task.status = newStatus;
    }

    createAuditLog(userId, 'update_task_status', 'vendor_task', taskId, { oldStatus: task.status, newStatus: status, quotationAmount }, getIpAddress(req));

    // Return updated task
    const [updatedTasks] = await sql.query("SELECT * FROM vendor_tasks WHERE id = ?", [taskId]);
    res.json(updatedTasks[0]);
  } catch (error) {
    console.error("Error updating task status:", error);
    res.status(500).json({ error: 'Server error updating task' });
  }
};

exports.uploadFile = async (req, res) => {
  try {
    const taskId = parseInt(req.params.id);
    const { fileType, fileUrl, fileName } = req.body;
    const userId = req.user.id;

    if (!fileType || !fileUrl) {
      return res.status(400).json({ error: 'File type and URL are required' });
    }

    // Verify access
    const [profiles] = await sql.query("SELECT id FROM vendor_profiles WHERE user_id = ?", [userId]);
    if (profiles.length === 0) return res.status(403).json({ error: 'Vendor profile not found' });
    const vendorProfileId = profiles[0].id;

    const [tasks] = await sql.query("SELECT * FROM vendor_tasks WHERE id = ? AND assigned_vendor_id = ?", [taskId, vendorProfileId]);
    if (tasks.length === 0) return res.status(404).json({ error: 'Task not found' });

    let existingAttachments = [];
    try {
      existingAttachments = tasks[0].attachments ? (typeof tasks[0].attachments === 'string' ? JSON.parse(tasks[0].attachments) : tasks[0].attachments) : [];
    } catch (e) { }

    const newAttachment = {
      type: fileType,
      url: fileUrl,
      fileName: fileName || 'file',
      uploadedBy: userId,
      uploadedAt: new Date().toISOString()
    };

    existingAttachments.push(newAttachment);

    await sql.query("UPDATE vendor_tasks SET attachments = ?, updated_at = NOW() WHERE id = ?", [JSON.stringify(existingAttachments), taskId]);

    createAuditLog(userId, 'upload_file', 'vendor_task', taskId, { fileType, fileName }, getIpAddress(req));

    res.json({
      message: 'File uploaded successfully',
      attachment: newAttachment
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Server error uploading file' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const query = `
      SELECT u.id, u.name, u.email, u.mobile_number, u.status,
             vp.company_name, vp.phone, vp.service_types, vp.permission_scope, vp.created_at
      FROM users u
      LEFT JOIN vendor_profiles vp ON u.id = vp.user_id
      WHERE u.id = ?
    `;
    const [rows] = await sql.query(query, [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Vendor profile not found' });
    }

    const row = rows[0];
    const profile = {
      userId: row.id,
      name: row.name,
      email: row.email,
      mobileNumber: row.mobile_number,
      status: row.status,
      companyName: row.company_name,
      phone: row.phone,
      serviceTypes: row.service_types ? (typeof row.service_types === 'string' ? JSON.parse(row.service_types) : row.service_types) : [],
      permissionScope: row.permission_scope,
      createdAt: row.created_at
    };

    res.json(profile);
  } catch (error) {
    console.error('Error fetching vendor profile:', error);
    res.status(500).json({ error: 'Server error fetching vendor profile' });
  }
};

