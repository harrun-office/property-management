const User = require('../models/user.model');
const Property = require('../models/property.model');
const Task = require('../models/task.model');
const Vendor = require('../models/vendor.model');
const { createAuditLog, getUser } = require('../middleware/auth');
const { getIpAddress } = require('../utils/helpers');
const sql = require('../config/db');

exports.getProperties = (req, res) => {
  try {
    const user = getUser(req);
    const vendorProperties = properties.filter(p => {
      if (!p.assignedVendors) return false;
      return p.assignedVendors.some(v => v.vendorId === user.id);
    });

    res.json(vendorProperties);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching properties' });
  }
};

exports.getTasks = (req, res) => {
  try {
    const user = getUser(req);
    const vendorTasks = tasks.filter(t => t.assignedVendorId === user.id);

    res.json(vendorTasks);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching tasks' });
  }
};

const { TICKET_STATES, APPROVAL_THRESHOLDS } = require('../config/constants'); // Import Constants

exports.updateTaskStatus = (req, res) => {
  try {
    const taskId = parseInt(req.params.id);
    const task = tasks.find(t => t.id === taskId);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const user = getUser(req);
    if (task.assignedVendorId !== user.id) {
      return res.status(403).json({ error: 'Access denied to this task' });
    }

    const { status, quotationAmount } = req.body;

    if (status) {
      // Define Allowed State Transitions
      const ALLOWED_TRANSITIONS = {
        [TICKET_STATES.OPEN]: [TICKET_STATES.QUOTATION_SUBMITTED, TICKET_STATES.IN_PROGRESS],
        [TICKET_STATES.IN_PROGRESS]: [TICKET_STATES.COMPLETED, TICKET_STATES.AWAITING_APPROVAL], // Can move to valid next steps
        [TICKET_STATES.QUOTATION_SUBMITTED]: [], // Vendor waits for approval
        [TICKET_STATES.AWAITING_APPROVAL]: [], // Vendor waits for approval
        [TICKET_STATES.COMPLETED]: [], // Terminal state for vendor
        [TICKET_STATES.VENDOR_ASSIGNED]: [TICKET_STATES.OPEN, TICKET_STATES.QUOTATION_SUBMITTED, TICKET_STATES.IN_PROGRESS] // Alias for OPEN mostly
      };

      // Check for illegal transition
      const allowedNextStates = ALLOWED_TRANSITIONS[task.status] || [];
      // Allow self-transition (updating meta without changing state) is effectively handled by not sending status, but if they send same status is ok
      if (status !== task.status && !allowedNextStates.includes(status)) {
        return res.status(400).json({
          error: 'Invalid state transition',
          currentStatus: task.status,
          allowedStatuses: allowedNextStates
        });
      }

      // Logic for Quotation Submission
      if (status === TICKET_STATES.QUOTATION_SUBMITTED) {
        if (!quotationAmount) {
          return res.status(400).json({ error: 'Quotation amount is required when submitting a quote.' });
        }
        task.quotationAmount = parseFloat(quotationAmount);

        // Check Threshold
        if (task.quotationAmount <= APPROVAL_THRESHOLDS.MAINTENANCE_AUTO_APPROVE_LIMIT) {
          task.status = TICKET_STATES.IN_PROGRESS; // Auto-Approve
          task.autoApproved = true;
        } else {
          task.status = TICKET_STATES.AWAITING_APPROVAL; // Require Approval
        }
      }
      else if (status === 'completed' || status === TICKET_STATES.COMPLETED) {
        task.status = TICKET_STATES.COMPLETED;
        task.completedDate = new Date().toISOString();
      } else {
        task.status = status;
      }
    }
    task.updatedAt = new Date().toISOString();

    createAuditLog(user.id, 'update_task_status', 'task', taskId, { oldStatus: task.status, newStatus: task.status, quotationAmount }, getIpAddress(req));

    res.json(task);
  } catch (error) {
    console.error("Error updating task status:", error);
    res.status(500).json({ error: 'Server error updating task' });
  }
};

exports.uploadFile = (req, res) => {
  try {
    const taskId = parseInt(req.params.id);
    const { fileType, fileUrl, fileName } = req.body;

    if (!fileType || !fileUrl) {
      return res.status(400).json({ error: 'File type and URL are required' });
    }

    const task = tasks.find(t => t.id === taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const user = getUser(req);
    if (task.assignedVendorId !== user.id) {
      return res.status(403).json({ error: 'Access denied to this task' });
    }

    if (!task.attachments) {
      task.attachments = [];
    }

    task.attachments.push({
      type: fileType,
      url: fileUrl,
      fileName: fileName || 'file',
      uploadedBy: user.id,
      uploadedAt: new Date().toISOString()
    });

    task.updatedAt = new Date().toISOString();

    createAuditLog(user.id, 'upload_file', 'task', taskId, { fileType, fileName }, getIpAddress(req));

    res.json({
      message: 'File uploaded successfully',
      task: task
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error uploading file' });
  }
};

exports.getProfile = (req, res) => {
  try {
    const user = getUser(req);
    const vendor = vendors.find(v => v.userId === user.id);

    if (!vendor) {
      return res.status(404).json({ error: 'Vendor profile not found' });
    }

    res.json(vendor);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching vendor profile' });
  }
};

