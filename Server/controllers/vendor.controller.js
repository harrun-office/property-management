const data = require('../data/mockData');
const { createAuditLog, getUser } = require('../middleware/auth');
const { getIpAddress } = require('../utils/helpers');

const { properties, tasks, vendors, users } = data;

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

    const { status } = req.body;
    if (status) {
      task.status = status;
      if (status === 'completed') {
        task.completedDate = new Date().toISOString();
      }
    }
    task.updatedAt = new Date().toISOString();

    createAuditLog(user.id, 'update_task_status', 'task', taskId, { oldStatus: task.status, newStatus: status }, getIpAddress(req));

    res.json(task);
  } catch (error) {
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

