const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const Property = require('../models/property.model');
const Task = require('../models/task.model');
const Vendor = require('../models/vendor.model');
const MaintenanceRequest = require('../models/maintenanceRequest.model');
const Payment = require('../models/payment.model');
const { createAuditLog, getUser } = require('../middleware/auth');
const { getIpAddress } = require('../utils/helpers');
const sql = require('../config/db');

// Property Manager Management
exports.createPropertyManager = async (req, res) => {
  try {
    const { email, name, password, mobileNumber, assignedProperties } = req.body;

    if (!email || !name || !password) {
      return res.status(400).json({ error: 'Email, name, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const userPermissions = {
      createVendor: true,
      assignVendors: true,
      createTasks: true,
      viewReports: true,
      manageAssignedProperties: true
    };

    const newUser = {
      email,
      password: hashedPassword,
      name,
      role: 'property_manager',
      status: 'active',
      mobile_number: mobileNumber || null,
      invited_by: req.userId,
      permissions: userPermissions
    };

    const createdUser = await User.create(newUser);

    // Create manager profile
    const managerProfileData = {
      manager_id: createdUser.id,
      bio: '',
      experience: 0,
      specialties: JSON.stringify([]),
      response_time: '24 hours',
      properties_managed: 0,
      average_rating: 0,
      total_reviews: 0,
      location: '',
      languages: JSON.stringify(['English']),
      certifications: JSON.stringify([])
    };

    await sql.query(`
      INSERT INTO manager_profiles
      (manager_id, bio, experience, specialties, response_time, properties_managed, average_rating, total_reviews, location, languages, certifications)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      managerProfileData.manager_id,
      managerProfileData.bio,
      managerProfileData.experience,
      managerProfileData.specialties,
      managerProfileData.response_time,
      managerProfileData.properties_managed,
      managerProfileData.average_rating,
      managerProfileData.total_reviews,
      managerProfileData.location,
      managerProfileData.languages,
      managerProfileData.certifications
    ]);

    // Assign properties if provided
    if (assignedProperties && assignedProperties.length > 0) {
      for (const propertyId of assignedProperties) {
        await sql.query(`
          INSERT INTO property_managers (property_id, manager_id, assigned_by)
          VALUES (?, ?, ?)
          ON DUPLICATE KEY UPDATE assigned_by = VALUES(assigned_by)
        `, [propertyId, createdUser.id, req.userId]);
      }
    }

    createAuditLog(req.userId, 'create_property_manager', 'user', createdUser.id, { email, name }, getIpAddress(req));

    res.status(201).json({
      message: 'Property Manager created successfully',
      user: {
        id: createdUser.id,
        email: createdUser.email,
        name: createdUser.name,
        role: createdUser.role,
        status: createdUser.status,
        mobile_number: mobileNumber
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error creating property manager' });
  }
};

exports.getPropertyManagers = (req, res) => {
  try {
    if (!users || !Array.isArray(users)) {
      return res.status(500).json({ error: 'Users data not available' });
    }

    const propertyManagers = users
      .filter(u => u.role === 'property_manager')
      .map(u => ({
        id: u.id,
        email: u.email || '',
        name: u.name || 'Unknown',
        mobileNumber: u.mobileNumber || null,
        status: u.status || 'active',
        assignedProperties: u.assignedProperties || [],
        invitedBy: u.invitedBy || null,
        createdAt: u.createdAt || new Date().toISOString()
      }));

    res.json(propertyManagers);
  } catch (error) {
    console.error('Error fetching property managers:', error);
    res.status(500).json({ error: 'Server error fetching property managers: ' + error.message });
  }
};

exports.updatePropertyManager = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId && u.role === 'property_manager');

    if (!user) {
      return res.status(404).json({ error: 'Property Manager not found' });
    }

    const { name, email, mobileNumber, status, assignedProperties, password } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;
    if (mobileNumber !== undefined) user.mobileNumber = mobileNumber;
    if (status) user.status = status;
    if (assignedProperties) user.assignedProperties = assignedProperties;

    // Handle password reset
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }
      user.password = await bcrypt.hash(password, 10);
    }

    user.updatedAt = new Date().toISOString();

    createAuditLog(req.userId, 'update_property_manager', 'user', userId, { ...req.body, password: password ? '***' : undefined }, getIpAddress(req));

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      mobileNumber: user.mobileNumber,
      status: user.status,
      assignedProperties: user.assignedProperties
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error updating property manager' });
  }
};

exports.suspendPropertyManager = (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { reason, note } = req.body;
    const user = users.find(u => u.id === userId && u.role === 'property_manager');

    if (!user) {
      return res.status(404).json({ error: 'Property Manager not found' });
    }

    user.status = 'suspended';
    user.updatedAt = new Date().toISOString();

    createAuditLog(req.userId, 'suspend_property_manager', 'user', userId, { reason, note }, getIpAddress(req));

    res.json({ message: 'Property Manager suspended successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error suspending property manager' });
  }
};

exports.activatePropertyManager = (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId && u.role === 'property_manager');

    if (!user) {
      return res.status(404).json({ error: 'Property Manager not found' });
    }

    user.status = 'active';
    user.updatedAt = new Date().toISOString();

    createAuditLog(req.userId, 'activate_property_manager', 'user', userId, {}, getIpAddress(req));

    res.json({ message: 'Property Manager activated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error activating property manager' });
  }
};

exports.assignProperties = (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { propertyIds } = req.body;

    const user = users.find(u => u.id === userId && u.role === 'property_manager');
    if (!user) {
      return res.status(404).json({ error: 'Property Manager not found' });
    }

    if (!Array.isArray(propertyIds)) {
      return res.status(400).json({ error: 'propertyIds must be an array' });
    }

    user.assignedProperties = propertyIds;
    user.updatedAt = new Date().toISOString();

    createAuditLog(req.userId, 'assign_properties', 'user', userId, { propertyIds }, getIpAddress(req));

    res.json({
      message: 'Properties assigned successfully',
      assignedProperties: user.assignedProperties
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error assigning properties' });
  }
};

// Vendor Management (Admin can create vendors)
exports.createVendor = async (req, res) => {
  try {
    const { email, name, password, mobileNumber, companyName, phone, serviceTypes, assignedProperties, permissionScope } = req.body;

    if (!email || !name || !password || !companyName || !serviceTypes) {
      return res.status(400).json({ error: 'Email, name, password, company name, and service types are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: data.nextUserId,
      email,
      password: hashedPassword,
      name,
      role: 'vendor',
      status: 'active',
      mobileNumber: mobileNumber || null,
      invitedBy: req.userId,
      invitationToken: null,
      invitationExpires: null,
      assignedProperties: assignedProperties || [],
      permissions: {
        viewAssignedProperties: true,
        viewAssignedTasks: true,
        updateTaskStatus: true,
        uploadFiles: true
      },
      twoFactorEnabled: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    users.push(newUser);
    const newUserId = data.nextUserId;
    data.nextUserId = data.nextUserId + 1;

    const newVendor = {
      id: data.nextVendorId,
      userId: newUserId,
      companyName,
      contactName: name,
      email,
      phone: phone || mobileNumber || '',
      serviceTypes: Array.isArray(serviceTypes) ? serviceTypes : [serviceTypes],
      certifications: [],
      availabilitySchedule: {},
      performanceRating: 0,
      contractInfo: {},
      assignedProperties: assignedProperties || [],
      permissionScope: permissionScope || 'task-based',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    vendors.push(newVendor);
    data.nextVendorId = data.nextVendorId + 1;

    createAuditLog(req.userId, 'create_vendor', 'vendor', newVendor.id, { email, companyName }, getIpAddress(req));

    res.status(201).json({
      message: 'Vendor created successfully',
      vendor: {
        id: newVendor.id,
        userId: newUserId,
        email: newVendor.email,
        companyName: newVendor.companyName,
        status: newVendor.status,
        mobileNumber: newUser.mobileNumber
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error creating vendor' });
  }
};

// Vendor Management
exports.getVendors = (req, res) => {
  try {
    const vendorUsers = users.filter(u => u.role === 'vendor');

    const vendorsList = vendorUsers.map(vendorUser => {
      const vendor = vendors.find(v => v.userId === vendorUser.id);
      return {
        id: vendorUser.id,
        vendorId: vendor?.id || null,
        email: vendorUser.email,
        name: vendorUser.name,
        mobileNumber: vendorUser.mobileNumber,
        status: vendorUser.status || 'active',
        companyName: vendor?.companyName || 'N/A',
        phone: vendor?.phone || '',
        serviceTypes: vendor?.serviceTypes || [],
        createdAt: vendorUser.createdAt,
        updatedAt: vendorUser.updatedAt
      };
    });

    res.json(vendorsList);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching vendors' });
  }
};

exports.getVendorById = (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const vendorUser = users.find(u => u.id === userId && u.role === 'vendor');

    if (!vendorUser) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    const vendor = vendors.find(v => v.userId === vendorUser.id);

    res.json({
      id: vendorUser.id,
      vendorId: vendor?.id || null,
      email: vendorUser.email,
      name: vendorUser.name,
      mobileNumber: vendorUser.mobileNumber,
      status: vendorUser.status || 'active',
      companyName: vendor?.companyName || 'N/A',
      phone: vendor?.phone || '',
      serviceTypes: vendor?.serviceTypes || [],
      assignedProperties: vendorUser.assignedProperties || [],
      createdAt: vendorUser.createdAt,
      updatedAt: vendorUser.updatedAt
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching vendor' });
  }
};

exports.updateVendor = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const vendorUser = users.find(u => u.id === userId && u.role === 'vendor');

    if (!vendorUser) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    const vendor = vendors.find(v => v.userId === userId);
    const { name, email, mobileNumber, companyName, phone, serviceTypes, password } = req.body;

    // Update user record
    if (name) vendorUser.name = name;
    if (email) vendorUser.email = email;
    if (mobileNumber !== undefined) vendorUser.mobileNumber = mobileNumber;

    // Handle password reset
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }
      vendorUser.password = await bcrypt.hash(password, 10);
    }

    vendorUser.updatedAt = new Date().toISOString();

    // Update vendor record
    if (vendor) {
      if (companyName) vendor.companyName = companyName;
      if (phone !== undefined) vendor.phone = phone;
      if (serviceTypes) vendor.serviceTypes = Array.isArray(serviceTypes) ? serviceTypes : [serviceTypes];
      vendor.updatedAt = new Date().toISOString();
    }

    createAuditLog(req.userId, 'update_vendor', 'vendor', vendor?.id || userId, { ...req.body, password: password ? '***' : undefined }, getIpAddress(req));

    res.json({
      id: vendorUser.id,
      vendorId: vendor?.id || null,
      email: vendorUser.email,
      name: vendorUser.name,
      mobileNumber: vendorUser.mobileNumber,
      status: vendorUser.status,
      companyName: vendor?.companyName || 'N/A',
      phone: vendor?.phone || '',
      serviceTypes: vendor?.serviceTypes || []
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error updating vendor' });
  }
};

exports.suspendVendor = (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { reason, note } = req.body;
    const vendorUser = users.find(u => u.id === userId && u.role === 'vendor');

    if (!vendorUser) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    vendorUser.status = 'suspended';
    vendorUser.updatedAt = new Date().toISOString();

    const vendor = vendors.find(v => v.userId === userId);
    if (vendor) {
      vendor.status = 'suspended';
      vendor.updatedAt = new Date().toISOString();
    }

    createAuditLog(req.userId, 'suspend_vendor', 'vendor', vendor?.id || userId, { reason, note }, getIpAddress(req));

    res.json({ message: 'Vendor suspended successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error suspending vendor' });
  }
};

exports.activateVendor = (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const vendorUser = users.find(u => u.id === userId && u.role === 'vendor');

    if (!vendorUser) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    vendorUser.status = 'active';
    vendorUser.updatedAt = new Date().toISOString();

    const vendor = vendors.find(v => v.userId === userId);
    if (vendor) {
      vendor.status = 'active';
      vendor.updatedAt = new Date().toISOString();
    }

    createAuditLog(req.userId, 'activate_vendor', 'vendor', vendor?.id || userId, {}, getIpAddress(req));

    res.json({ message: 'Vendor activated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error activating vendor' });
  }
};

// Password Reset (works for both managers and vendors)
exports.resetPassword = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ error: 'New password is required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Only allow reset for managers and vendors
    if (user.role !== 'property_manager' && user.role !== 'vendor') {
      return res.status(403).json({ error: 'Password reset only allowed for managers and vendors' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.updatedAt = new Date().toISOString();

    createAuditLog(req.userId, 'reset_password', 'user', userId, {}, getIpAddress(req));

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error resetting password' });
  }
};

// Performance Endpoints
exports.getManagersPerformance = (req, res) => {
  try {
    if (!users || !Array.isArray(users)) {
      return res.status(500).json({ error: 'Users data not available' });
    }

    if (!tasks || !Array.isArray(tasks)) {
      return res.status(500).json({ error: 'Tasks data not available' });
    }

    const managers = users.filter(u => u.role === 'property_manager');

    const performanceData = managers.map(manager => {
      const managerTasks = tasks.filter(t =>
        (t.assignedTo === manager.id || t.createdBy === manager.id)
      );
      const completedTasks = managerTasks.filter(t => t.status === 'completed');
      const assignedTasks = managerTasks.length;
      const completionRate = assignedTasks > 0 ? (completedTasks.length / assignedTasks) * 100 : 0;
      const propertiesManaged = manager.assignedProperties?.length || 0;

      return {
        id: manager.id,
        name: manager.name || 'Unknown',
        email: manager.email || '',
        status: manager.status || 'active',
        tasksAssigned: assignedTasks,
        tasksCompleted: completedTasks.length,
        completionRate: Math.round(completionRate * 100) / 100,
        propertiesManaged: propertiesManaged,
        createdAt: manager.createdAt || new Date().toISOString()
      };
    });

    res.json(performanceData);
  } catch (error) {
    console.error('Error fetching managers performance:', error);
    res.status(500).json({ error: 'Server error fetching managers performance: ' + error.message });
  }
};

exports.getVendorsPerformance = (req, res) => {
  try {
    if (!users || !Array.isArray(users)) {
      return res.status(500).json({ error: 'Users data not available' });
    }

    if (!tasks || !Array.isArray(tasks)) {
      return res.status(500).json({ error: 'Tasks data not available' });
    }

    if (!vendors || !Array.isArray(vendors)) {
      return res.status(500).json({ error: 'Vendors data not available' });
    }

    const vendorUsers = users.filter(u => u.role === 'vendor');

    const performanceData = vendorUsers.map(vendorUser => {
      const vendor = vendors.find(v => v.userId === vendorUser.id);
      const vendorTasks = tasks.filter(t => t.assignedVendorId === vendor?.id);
      const completedTasks = vendorTasks.filter(t => t.status === 'completed');
      const assignedTasks = vendorTasks.length;
      const completionRate = assignedTasks > 0 ? (completedTasks.length / assignedTasks) * 100 : 0;
      const performanceRating = vendor?.performanceRating || 0;

      return {
        id: vendorUser.id,
        vendorId: vendor?.id || null,
        name: vendorUser.name || 'Unknown',
        email: vendorUser.email || '',
        companyName: vendor?.companyName || 'N/A',
        status: vendorUser.status || 'active',
        tasksAssigned: assignedTasks,
        tasksCompleted: completedTasks.length,
        completionRate: Math.round(completionRate * 100) / 100,
        performanceRating: performanceRating,
        createdAt: vendorUser.createdAt || new Date().toISOString()
      };
    });

    res.json(performanceData);
  } catch (error) {
    console.error('Error fetching vendors performance:', error);
    res.status(500).json({ error: 'Server error fetching vendors performance: ' + error.message });
  }
};

// Get Audit Logs
exports.getAuditLogs = (req, res) => {
  try {
    const { limit = 100, offset = 0, action, resourceType, userId, startDate, endDate } = req.query;

    if (!auditLogs || !Array.isArray(auditLogs)) {
      return res.status(500).json({ error: 'Audit logs data not available' });
    }

    let filteredLogs = [...auditLogs];

    // Filter by action
    if (action) {
      filteredLogs = filteredLogs.filter(log => log.action === action);
    }

    // Filter by resource type
    if (resourceType) {
      filteredLogs = filteredLogs.filter(log => log.resourceType === resourceType);
    }

    // Filter by user ID
    if (userId) {
      filteredLogs = filteredLogs.filter(log => log.userId === parseInt(userId));
    }

    // Filter by date range
    if (startDate) {
      filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= new Date(startDate));
    }
    if (endDate) {
      filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) <= new Date(endDate));
    }

    // Sort by timestamp (newest first)
    filteredLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Paginate
    const paginatedLogs = filteredLogs.slice(parseInt(offset), parseInt(offset) + parseInt(limit));

    // Enrich with user names
    const enrichedLogs = paginatedLogs.map(log => {
      const user = getUser(log.userId);
      return {
        ...log,
        userName: user?.name || 'Unknown User',
        userEmail: user?.email || 'N/A',
        userRole: user?.role || 'N/A'
      };
    });

    res.json({
      logs: enrichedLogs,
      total: filteredLogs.length,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ error: 'Server error fetching audit logs: ' + error.message });
  }
};

// Get System Overview/Statistics
exports.getSystemOverview = async (req, res) => {
  try {
    // User statistics
    const [userStats] = await sql.query(`
      SELECT
        COUNT(*) as total_users,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_users,
        SUM(CASE WHEN status = 'suspended' THEN 1 ELSE 0 END) as suspended_users,
        SUM(CASE WHEN role = 'super_admin' THEN 1 ELSE 0 END) as super_admins,
        SUM(CASE WHEN role = 'property_manager' THEN 1 ELSE 0 END) as property_managers,
        SUM(CASE WHEN role = 'vendor' THEN 1 ELSE 0 END) as vendors,
        SUM(CASE WHEN role = 'property_owner' THEN 1 ELSE 0 END) as property_owners,
        SUM(CASE WHEN role = 'tenant' THEN 1 ELSE 0 END) as tenants,
        SUM(CASE WHEN is_online = TRUE THEN 1 ELSE 0 END) as online_users
      FROM users
    `);

    const usersByRole = {
      super_admin: userStats[0].super_admins,
      property_manager: userStats[0].property_managers,
      vendor: userStats[0].vendors,
      property_owner: userStats[0].property_owners,
      tenant: userStats[0].tenants
    };

    // Property statistics
    const [propertyStats] = await sql.query(`
      SELECT
        COUNT(*) as total_properties,
        SUM(CASE WHEN status = 'LISTED' THEN 1 ELSE 0 END) as listed_properties,
        SUM(CASE WHEN status = 'OCCUPIED' THEN 1 ELSE 0 END) as occupied_properties,
        SUM(CASE WHEN status = 'MAINTENANCE_ACTIVE' THEN 1 ELSE 0 END) as maintenance_properties,
        SUM(CASE WHEN status = 'INACTIVE' THEN 1 ELSE 0 END) as inactive_properties
      FROM properties
    `);

    // Task statistics
    const [taskStats] = await sql.query(`
      SELECT
        COUNT(*) as total_tasks,
        SUM(CASE WHEN status = 'OPEN' THEN 1 ELSE 0 END) as open_tasks,
        SUM(CASE WHEN status = 'IN_PROGRESS' THEN 1 ELSE 0 END) as in_progress_tasks,
        SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) as completed_tasks,
        SUM(CASE WHEN status = 'CLOSED' THEN 1 ELSE 0 END) as closed_tasks
      FROM vendor_tasks
    `);

    // Vendor statistics
    const [vendorStats] = await sql.query(`
      SELECT COUNT(*) as total_vendors FROM users WHERE role = 'vendor'
    `);

    // Application statistics
    const totalApplications = applications.length;
    const pendingApplications = applications.filter(a => a.status === 'pending').length;
    const approvedApplications = applications.filter(a => a.status === 'approved').length;
    const rejectedApplications = applications.filter(a => a.status === 'rejected').length;

    // Recent activity (last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentActivity = auditLogs.filter(log => new Date(log.timestamp) >= oneDayAgo).length;

    // Activity by type (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentLogs = auditLogs.filter(log => new Date(log.timestamp) >= sevenDaysAgo);
    const activityByType = {};
    recentLogs.forEach(log => {
      activityByType[log.action] = (activityByType[log.action] || 0) + 1;
    });

    res.json({
      users: {
        total: userStats[0].total_users,
        active: userStats[0].active_users,
        suspended: userStats[0].suspended_users,
        online: userStats[0].online_users,
        byRole: usersByRole
      },
      properties: {
        total: propertyStats[0].total_properties,
        listed: propertyStats[0].listed_properties,
        occupied: propertyStats[0].occupied_properties,
        maintenance: propertyStats[0].maintenance_properties,
        inactive: propertyStats[0].inactive_properties
      },
      tasks: {
        total: taskStats[0].total_tasks,
        open: taskStats[0].open_tasks,
        inProgress: taskStats[0].in_progress_tasks,
        completed: taskStats[0].completed_tasks,
        closed: taskStats[0].closed_tasks
      },
      vendors: {
        total: vendorStats[0].total_vendors,
        active: vendorStats[0].total_vendors // For now, all vendors are active
      },
      applications: {
        total: totalApplications,
        pending: pendingApplications,
        approved: approvedApplications,
        rejected: rejectedApplications
      },
      activity: {
        last24Hours: recentActivity,
        last7Days: recentLogs.length,
        byType: activityByType
      }
    });
  } catch (error) {
    console.error('Error fetching system overview:', error);
    res.status(500).json({ error: 'Server error fetching system overview: ' + error.message });
  }
};

// Get Property Activity
exports.getPropertyActivity = (req, res) => {
  try {
    const { limit = 50, offset = 0, action, propertyId, startDate, endDate, userId } = req.query;

    if (!auditLogs || !Array.isArray(auditLogs)) {
      return res.status(500).json({ error: 'Audit logs data not available' });
    }

    // Property-related actions
    const propertyActions = [
      'create_property',
      'update_property',
      'delete_property',
      'update_property_status',
      'assign_properties',
      'assign_vendor_to_property',
      'create_task' // Tasks are property-related
    ];

    let filteredLogs = auditLogs.filter(log =>
      log.resourceType === 'property' || propertyActions.includes(log.action)
    );

    // Filter by action
    if (action) {
      filteredLogs = filteredLogs.filter(log => log.action === action);
    }

    // Filter by property ID (check resourceId or details.propertyId)
    if (propertyId) {
      const propId = parseInt(propertyId);
      filteredLogs = filteredLogs.filter(log =>
        log.resourceId === propId ||
        (log.details && (log.details.propertyId === propId || log.details.propertyIds?.includes(propId)))
      );
    }

    // Filter by user ID
    if (userId) {
      filteredLogs = filteredLogs.filter(log => log.userId === parseInt(userId));
    }

    // Filter by date range
    if (startDate) {
      filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= new Date(startDate));
    }
    if (endDate) {
      filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) <= new Date(endDate));
    }

    // Sort by timestamp (newest first)
    filteredLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Paginate
    const paginatedLogs = filteredLogs.slice(parseInt(offset), parseInt(offset) + parseInt(limit));

    // Enrich with user and property details
    const enrichedLogs = paginatedLogs.map(log => {
      const user = getUser(log.userId);
      let propertyInfo = null;

      // Try to get property details
      if (log.resourceId && log.resourceType === 'property') {
        const property = properties.find(p => p.id === log.resourceId);
        if (property) {
          propertyInfo = {
            id: property.id,
            title: property.title,
            address: property.address
          };
        }
      } else if (log.details && log.details.propertyId) {
        const property = properties.find(p => p.id === log.details.propertyId);
        if (property) {
          propertyInfo = {
            id: property.id,
            title: property.title,
            address: property.address
          };
        }
      }

      return {
        ...log,
        userName: user?.name || 'Unknown User',
        userEmail: user?.email || 'N/A',
        userRole: user?.role || 'N/A',
        property: propertyInfo
      };
    });

    res.json({
      logs: enrichedLogs,
      total: filteredLogs.length,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error fetching property activity:', error);
    res.status(500).json({ error: 'Server error fetching property activity: ' + error.message });
  }
};

// Get Property Activity Statistics
exports.getPropertyActivityStats = (req, res) => {
  try {
    if (!properties || !Array.isArray(properties)) {
      return res.status(500).json({ error: 'Properties data not available' });
    }
    if (!auditLogs || !Array.isArray(auditLogs)) {
      return res.status(500).json({ error: 'Audit logs data not available' });
    }

    const propertyActions = [
      'create_property',
      'update_property',
      'delete_property',
      'update_property_status',
      'assign_properties',
      'assign_vendor_to_property',
      'create_task'
    ];

    const propertyLogs = auditLogs.filter(log =>
      log.resourceType === 'property' || propertyActions.includes(log.action)
    );

    // Total properties
    const totalProperties = properties.length;

    // Properties created today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const propertiesCreatedToday = propertyLogs.filter(log =>
      log.action === 'create_property' && new Date(log.timestamp) >= today
    ).length;

    // Properties created this week
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const propertiesCreatedThisWeek = propertyLogs.filter(log =>
      log.action === 'create_property' && new Date(log.timestamp) >= weekAgo
    ).length;

    // Recent activity (last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentActivity24h = propertyLogs.filter(log =>
      new Date(log.timestamp) >= oneDayAgo
    ).length;

    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentActivity7d = propertyLogs.filter(log =>
      new Date(log.timestamp) >= sevenDaysAgo
    ).length;

    // Activity by type
    const activityByType = {};
    propertyLogs.forEach(log => {
      activityByType[log.action] = (activityByType[log.action] || 0) + 1;
    });

    // Properties by status
    const propertiesByStatus = {
      available: properties.filter(p => p.status === 'available').length,
      rented: properties.filter(p => p.status === 'rented').length,
      maintenance: properties.filter(p => p.status === 'maintenance').length
    };

    res.json({
      totalProperties,
      propertiesCreatedToday,
      propertiesCreatedThisWeek,
      recentActivity: {
        last24Hours: recentActivity24h,
        last7Days: recentActivity7d
      },
      activityByType,
      propertiesByStatus
    });
  } catch (error) {
    console.error('Error fetching property activity stats:', error);
    res.status(500).json({ error: 'Server error fetching property activity stats: ' + error.message });
  }
};

// Get Subscription Plans (Admin)
exports.getSubscriptionPlans = (req, res) => {
  try {
    res.json(subscriptionPlans);
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    res.status(500).json({ error: 'Server error fetching subscription plans' });
  }
};

// Create Subscription Plan (Admin)
exports.createSubscriptionPlan = (req, res) => {
  try {
    const { name, description, price, features, maxProperties } = req.body;

    if (!name || !price || !features || !Array.isArray(features)) {
      return res.status(400).json({ error: 'Name, price, and features array are required' });
    }

    const newPlan = {
      id: data.nextSubscriptionPlanId,
      name,
      description: description || '',
      price: parseFloat(price),
      features,
      maxProperties: maxProperties || -1,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    subscriptionPlans.push(newPlan);
    data.nextSubscriptionPlanId = data.nextSubscriptionPlanId + 1;

    createAuditLog(getUser(req).id, 'create_subscription_plan', 'subscription_plan', newPlan.id, { name, price }, getIpAddress(req));

    res.status(201).json(newPlan);
  } catch (error) {
    console.error('Error creating subscription plan:', error);
    res.status(500).json({ error: 'Server error creating subscription plan' });
  }
};

// Update Subscription Plan (Admin)
exports.updateSubscriptionPlan = (req, res) => {
  try {
    const planId = parseInt(req.params.id);
    const plan = subscriptionPlans.find(p => p.id === planId);

    if (!plan) {
      return res.status(404).json({ error: 'Subscription plan not found' });
    }

    const { name, description, price, features, maxProperties, isActive } = req.body;

    if (name) plan.name = name;
    if (description !== undefined) plan.description = description;
    if (price) plan.price = parseFloat(price);
    if (features && Array.isArray(features)) plan.features = features;
    if (maxProperties !== undefined) plan.maxProperties = maxProperties;
    if (isActive !== undefined) plan.isActive = isActive;

    createAuditLog(getUser(req).id, 'update_subscription_plan', 'subscription_plan', planId, {}, getIpAddress(req));

    res.json(plan);
  } catch (error) {
    console.error('Error updating subscription plan:', error);
    res.status(500).json({ error: 'Server error updating subscription plan' });
  }
};

// Get All Subscriptions (Admin)
exports.getAllSubscriptions = (req, res) => {
  try {
    const { status, managerId, ownerId } = req.query;

    let subscriptions = [...managerSubscriptions];

    if (status) {
      subscriptions = subscriptions.filter(s => s.status === status);
    }
    if (managerId) {
      subscriptions = subscriptions.filter(s => s.managerId === parseInt(managerId));
    }
    if (ownerId) {
      subscriptions = subscriptions.filter(s => s.ownerId === parseInt(ownerId));
    }

    const enrichedSubscriptions = subscriptions.map(sub => {
      const manager = users.find(u => u.id === sub.managerId);
      const owner = users.find(u => u.id === sub.ownerId);
      const property = properties.find(p => p.id === sub.propertyId);
      const plan = subscriptionPlans.find(p => p.id === sub.planId);

      return {
        ...sub,
        manager: manager ? { id: manager.id, name: manager.name, email: manager.email } : null,
        owner: owner ? { id: owner.id, name: owner.name, email: owner.email } : null,
        property: property ? { id: property.id, title: property.title } : null,
        plan: plan || null
      };
    });

    res.json(enrichedSubscriptions);
  } catch (error) {
    console.error('Error fetching all subscriptions:', error);
    res.status(500).json({ error: 'Server error fetching subscriptions' });
  }
};

// Get Subscription Analytics (Admin)
exports.getSubscriptionAnalytics = (req, res) => {
  try {
    const activeSubscriptions = managerSubscriptions.filter(s => s.status === 'active');
    const cancelledSubscriptions = managerSubscriptions.filter(s => s.status === 'cancelled');
    const totalRevenue = subscriptionPayments
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0);

    const revenueByPlan = subscriptionPlans.map(plan => {
      const planSubscriptions = managerSubscriptions.filter(s => s.planId === plan.id && s.status === 'active');
      const planPayments = subscriptionPayments.filter(
        p => planSubscriptions.some(s => s.id === p.subscriptionId) && p.status === 'paid'
      );
      return {
        planId: plan.id,
        planName: plan.name,
        activeSubscriptions: planSubscriptions.length,
        revenue: planPayments.reduce((sum, p) => sum + p.amount, 0)
      };
    });

    const monthlyRevenue = subscriptionPayments
      .filter(p => p.status === 'paid')
      .reduce((acc, p) => {
        const month = new Date(p.paidDate).toISOString().substring(0, 7);
        acc[month] = (acc[month] || 0) + p.amount;
        return acc;
      }, {});

    const managerPerformance = users
      .filter(u => u.role === 'property_manager')
      .map(manager => {
        const managerSubs = managerSubscriptions.filter(s => s.managerId === manager.id);
        const managerPayments = subscriptionPayments.filter(
          p => managerSubs.some(s => s.id === p.subscriptionId) && p.status === 'paid'
        );
        const reviews = managerReviews.filter(r => r.managerId === manager.id);
        const avgRating = reviews.length > 0
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          : 0;

        return {
          managerId: manager.id,
          managerName: manager.name,
          activeSubscriptions: managerSubs.filter(s => s.status === 'active').length,
          totalRevenue: managerPayments.reduce((sum, p) => sum + p.amount, 0),
          averageRating: Math.round(avgRating * 10) / 10,
          totalReviews: reviews.length
        };
      });

    res.json({
      totalSubscriptions: managerSubscriptions.length,
      activeSubscriptions: activeSubscriptions.length,
      cancelledSubscriptions: cancelledSubscriptions.length,
      totalRevenue,
      revenueByPlan,
      monthlyRevenue,
      managerPerformance
    });
  } catch (error) {
    console.error('Error fetching subscription analytics:', error);
    res.status(500).json({ error: 'Server error fetching subscription analytics' });
  }
};
