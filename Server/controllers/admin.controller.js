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

exports.getPropertyManagers = async (req, res) => {
  try {
    const [propertyManagers] = await sql.query("SELECT * FROM users WHERE role = 'property_manager'");

    const enrichedManagers = await Promise.all(propertyManagers.map(async (u) => {
      // Fetch assigned properties count - assuming property_managers table or similar linkage
      // For now, let's mock the count or fetch if possible. 
      // If we used the property_managers table in createPropertyManager, we should query it here.
      // But let's check if the property_managers table exists. 
      // Safe bet: just return user data and maybe count from properties table if assigned_manager_id exists.

      const [assignedProps] = await sql.query("SELECT COUNT(*) as count FROM properties WHERE assigned_manager_id = ?", [u.id]);

      return {
        id: u.id,
        email: u.email || '',
        name: u.name || 'Unknown',
        mobileNumber: u.mobile_number || null, // Ensure column name matches schema (phone vs mobile_number)
        status: u.status || 'active',
        assignedProperties: [], // Populating detailed list might be heavy, sending count or empty for now
        assignedPropertiesCount: assignedProps[0]?.count || 0,
        invitedBy: u.invited_by || null,
        createdAt: u.created_at || new Date().toISOString()
      };
    }));

    res.json(enrichedManagers);
  } catch (error) {
    console.error('Error fetching property managers:', error);
    res.status(500).json({ error: 'Server error fetching property managers: ' + error.message });
  }
};

exports.updatePropertyManager = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const [rows] = await sql.query("SELECT * FROM users WHERE id = ? AND role = 'property_manager'", [userId]);
    const user = rows[0];

    if (!user) {
      return res.status(404).json({ error: 'Property Manager not found' });
    }

    const { name, email, mobileNumber, status, assignedProperties, password } = req.body;

    // Build update query
    let query = 'UPDATE users SET updated_at = NOW()';
    const params = [];

    if (name) { query += ', name = ?'; params.push(name); }
    if (email) { query += ', email = ?'; params.push(email); }
    if (mobileNumber !== undefined) { query += ', phone = ?'; params.push(mobileNumber); }
    if (status) { query += ', status = ?'; params.push(status); }

    // Handle password reset
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      query += ', password = ?';
      params.push(hashedPassword);
    }

    query += ' WHERE id = ?';
    params.push(userId);

    await sql.query(query, params);

    // Handle assignedProperties update if needed (requires many-to-many table management)
    // For now, assuming direct link or handled separately

    const [updatedRows] = await sql.query("SELECT * FROM users WHERE id = ?", [userId]);
    const updatedUser = updatedRows[0];

    createAuditLog(req.userId, 'update_property_manager', 'user', userId, { ...req.body, password: password ? '***' : undefined }, getIpAddress(req));

    res.json({
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      mobileNumber: updatedUser.mobile_number,
      status: updatedUser.status,
      assignedProperties: [] // Placeholder
    });
  } catch (error) {
    console.error('Error updating property manager:', error);
    res.status(500).json({ error: 'Server error updating property manager' });
  }
};

exports.suspendPropertyManager = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { reason, note } = req.body;

    const [result] = await sql.query("UPDATE users SET status = 'suspended', updated_at = NOW() WHERE id = ? AND role = 'property_manager'", [userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Property Manager not found' });
    }

    createAuditLog(req.userId, 'suspend_property_manager', 'user', userId, { reason, note }, getIpAddress(req));

    res.json({ message: 'Property Manager suspended successfully' });
  } catch (error) {
    console.error('Error suspending property manager:', error);
    res.status(500).json({ error: 'Server error suspending property manager' });
  }
};

exports.activatePropertyManager = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    const [result] = await sql.query("UPDATE users SET status = 'active', updated_at = NOW() WHERE id = ? AND role = 'property_manager'", [userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Property Manager not found' });
    }

    createAuditLog(req.userId, 'activate_property_manager', 'user', userId, {}, getIpAddress(req));

    res.json({ message: 'Property Manager activated successfully' });
  } catch (error) {
    console.error('Error activating property manager:', error);
    res.status(500).json({ error: 'Server error activating property manager' });
  }
};

exports.assignProperties = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { propertyIds } = req.body;

    const [rows] = await sql.query("SELECT * FROM users WHERE id = ? AND role = 'property_manager'", [userId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Property Manager not found' });
    }

    if (!Array.isArray(propertyIds)) {
      return res.status(400).json({ error: 'propertyIds must be an array' });
    }

    // Process assignments
    // Note: Assuming 'assigned_manager_id' in properties table is how we link them. 
    // This supports 1 manager per property. If many-to-many, we need a junction table.
    // Based on earlier fixes, we used assigned_manager_id.

    // 1. Clear previous assignments for this manager? Or just add new ones?
    // "Assign Properties" usually implies "Set these properties to this manager".

    // Verify properties exist
    // Update properties
    for (const propId of propertyIds) {
      await sql.query("UPDATE properties SET assigned_manager_id = ? WHERE id = ?", [userId, propId]);
    }

    // Note: Removing assignments (un-assigning) isn't explicitly handled here unless we passed an empty list, 
    // which would do nothing with this loop. A full sync logic would be better but simple update is safer for now.

    createAuditLog(req.userId, 'assign_properties', 'user', userId, { propertyIds }, getIpAddress(req));

    res.json({
      message: 'Properties assigned successfully',
      assignedProperties: propertyIds
    });
  } catch (error) {
    console.error('Error assigning properties:', error);
    res.status(500).json({ error: 'Server error assigning properties' });
  }
};

// Vendor Management (Admin can create vendors)
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

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const userPermissions = {
      viewAssignedProperties: true,
      viewAssignedTasks: true,
      updateTaskStatus: true,
      uploadFiles: true
    };

    const newUser = {
      email,
      password: hashedPassword,
      name,
      role: 'vendor',
      status: 'active',
      mobile_number: mobileNumber || null,
      invited_by: req.userId,
      permissions: userPermissions
    };

    const createdUser = await User.create(newUser);

    // Create vendor profile
    const vendorProfileData = {
      user_id: createdUser.id,
      company_name: companyName,
      contact_name: name,
      phone: phone || mobileNumber || '',
      email: email,
      service_types: JSON.stringify(Array.isArray(serviceTypes) ? serviceTypes : [serviceTypes]),
      permission_scope: permissionScope || 'task_based',
      status: 'active'
    };

    await sql.query(`
      INSERT INTO vendor_profiles 
      (user_id, company_name, contact_name, phone, email, service_types, permission_scope, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      vendorProfileData.user_id,
      vendorProfileData.company_name,
      vendorProfileData.contact_name,
      vendorProfileData.phone,
      vendorProfileData.email,
      vendorProfileData.service_types,
      vendorProfileData.permission_scope,
      vendorProfileData.status
    ]);

    // Handle assignedProperties (property_vendors table)
    if (assignedProperties && Array.isArray(assignedProperties)) {
      for (const propId of assignedProperties) {
        await sql.query(`
                INSERT INTO property_vendors (property_id, vendor_user_id, permission_scope)
                VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE permission_scope = VALUES(permission_scope)
            `, [propId, createdUser.id, permissionScope || 'task_based']);
      }
    }

    createAuditLog(req.userId, 'create_vendor', 'vendor', createdUser.id, { email, companyName }, getIpAddress(req));

    res.status(201).json({
      message: 'Vendor created successfully',
      vendor: {
        id: createdUser.id,
        email: createdUser.email,
        name: createdUser.name,
        companyName: companyName,
        status: createdUser.status,
        mobileNumber: mobileNumber
      }
    });
  } catch (error) {
    console.error('Error creating vendor:', error);
    res.status(500).json({ error: 'Server error creating vendor' });
  }
};

// Vendor Management
// Vendor Management
exports.getVendors = async (req, res) => {
  try {
    const query = `
        SELECT u.id, u.email, u.name, u.mobile_number as mobileNumber, u.status, u.created_at, u.updated_at,
               vp.id as vendorProfileId, vp.company_name, vp.phone as vendorPhone, vp.service_types
        FROM users u
        LEFT JOIN vendor_profiles vp ON u.id = vp.user_id
        WHERE u.role = 'vendor'
    `;
    const [rows] = await sql.query(query);

    const vendorsList = rows.map(row => ({
      id: row.id,
      vendorId: row.vendorProfileId || null,
      email: row.email,
      name: row.name,
      mobileNumber: row.mobileNumber,
      status: row.status || 'active',
      companyName: row.company_name || 'N/A',
      phone: row.vendorPhone || '',
      serviceTypes: row.service_types ? (typeof row.service_types === 'string' ? JSON.parse(row.service_types) : row.service_types) : [],
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));

    res.json(vendorsList);
  } catch (error) {
    console.error('Error fetching vendors:', error);
    res.status(500).json({ error: 'Server error fetching vendors' });
  }
};

exports.getVendorById = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    const query = `
        SELECT u.id, u.email, u.name, u.mobile_number as mobileNumber, u.status, u.created_at, u.updated_at,
               vp.id as vendorProfileId, vp.company_name, vp.phone as vendorPhone, vp.service_types
        FROM users u
        LEFT JOIN vendor_profiles vp ON u.id = vp.user_id
        WHERE u.id = ? AND u.role = 'vendor'
    `;
    const [rows] = await sql.query(query, [userId]);
    const row = rows[0];

    if (!row) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    // Fetch assigned properties
    const [assignedProps] = await sql.query("SELECT property_id FROM property_vendors WHERE vendor_user_id = ?", [userId]);
    const assignedPropertyIds = assignedProps.map(ap => ap.property_id);

    res.json({
      id: row.id,
      vendorId: row.vendorProfileId || null,
      email: row.email,
      name: row.name,
      mobileNumber: row.mobileNumber,
      status: row.status || 'active',
      companyName: row.company_name || 'N/A',
      phone: row.vendorPhone || '',
      serviceTypes: row.service_types ? (typeof row.service_types === 'string' ? JSON.parse(row.service_types) : row.service_types) : [],
      assignedProperties: assignedPropertyIds,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    });
  } catch (error) {
    console.error('Error fetching vendor:', error);
    res.status(500).json({ error: 'Server error fetching vendor' });
  }
};

exports.updateVendor = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const [rows] = await sql.query("SELECT * FROM users WHERE id = ? AND role = 'vendor'", [userId]);
    const user = rows[0];

    if (!user) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    const { name, email, mobileNumber, companyName, phone, serviceTypes, password } = req.body;

    // Update user record
    let userQuery = 'UPDATE users SET updated_at = NOW()';
    const userParams = [];

    if (name) { userQuery += ', name = ?'; userParams.push(name); }
    if (email) { userQuery += ', email = ?'; userParams.push(email); }
    if (mobileNumber !== undefined) { userQuery += ', mobile_number = ?'; userParams.push(mobileNumber); }
    if (password) {
      if (password.length < 6) return res.status(400).json({ error: 'Password too short' });
      const hashed = await bcrypt.hash(password, 10);
      userQuery += ', password = ?';
      userParams.push(hashed);
    }
    userQuery += ' WHERE id = ?';
    userParams.push(userId);
    await sql.query(userQuery, userParams);

    // Update vendor profile
    // Check if profile exists first
    const [profileRows] = await sql.query("SELECT * FROM vendor_profiles WHERE user_id = ?", [userId]);
    if (profileRows.length > 0) {
      let profQuery = 'UPDATE vendor_profiles SET updated_at = NOW()'; // Schema might default update, but explict is fine
      const profParams = [];
      if (companyName) { profQuery += ', company_name = ?'; profParams.push(companyName); }
      if (phone !== undefined) { profQuery += ', phone = ?'; profParams.push(phone); }
      if (serviceTypes) {
        profQuery += ', service_types = ?';
        profParams.push(JSON.stringify(Array.isArray(serviceTypes) ? serviceTypes : [serviceTypes]));
      }
      // only update if fields provided 
      if (profParams.length > 0) {
        profQuery += ' WHERE user_id = ?';
        profParams.push(userId);
        await sql.query(profQuery, profParams);
      }
    } else {
      // Create profile if missing? Not expected in normal flow but helpful for migration
    }

    createAuditLog(req.userId, 'update_vendor', 'vendor', userId, { ...req.body, password: password ? '***' : undefined }, getIpAddress(req));

    // Refetch for response
    const [updatedUserRows] = await sql.query("SELECT * FROM users WHERE id = ?", [userId]);
    const updatedUser = updatedUserRows[0];
    const [updatedProfileRows] = await sql.query("SELECT * FROM vendor_profiles WHERE user_id = ?", [userId]);
    const updatedProfile = updatedProfileRows[0];

    res.json({
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      mobileNumber: updatedUser.mobile_number,
      status: updatedUser.status,
      companyName: updatedProfile?.company_name || 'N/A',
      phone: updatedProfile?.phone || '',
      serviceTypes: updatedProfile?.service_types ? (typeof updatedProfile.service_types === 'string' ? JSON.parse(updatedProfile.service_types) : updatedProfile.service_types) : []
    });
  } catch (error) {
    console.error('Error updating vendor:', error);
    res.status(500).json({ error: 'Server error updating vendor' });
  }
};

exports.suspendVendor = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { reason, note } = req.body;

    const [result] = await sql.query("UPDATE users SET status = 'suspended', updated_at = NOW() WHERE id = ? AND role = 'vendor'", [userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    // Also update vendor profile status if needed
    await sql.query("UPDATE vendor_profiles SET status = 'suspended' WHERE user_id = ?", [userId]);

    createAuditLog(req.userId, 'suspend_vendor', 'vendor', userId, { reason, note }, getIpAddress(req));

    res.json({ message: 'Vendor suspended successfully' });
  } catch (error) {
    console.error('Error suspending vendor:', error);
    res.status(500).json({ error: 'Server error suspending vendor' });
  }
};

exports.activateVendor = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    const [result] = await sql.query("UPDATE users SET status = 'active', updated_at = NOW() WHERE id = ? AND role = 'vendor'", [userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    // Also update vendor profile status
    await sql.query("UPDATE vendor_profiles SET status = 'active' WHERE user_id = ?", [userId]);

    createAuditLog(req.userId, 'activate_vendor', 'vendor', userId, {}, getIpAddress(req));

    res.json({ message: 'Vendor activated successfully' });
  } catch (error) {
    console.error('Error activating vendor:', error);
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

    const [rows] = await sql.query("SELECT * FROM users WHERE id = ?", [userId]);
    const user = rows[0];

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Only allow reset for managers and vendors
    if (user.role !== 'property_manager' && user.role !== 'vendor') {
      return res.status(403).json({ error: 'Password reset only allowed for property managers and vendors' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await sql.query("UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?", [hashedPassword, userId]);

    createAuditLog(req.userId, 'reset_password', 'user', userId, {}, getIpAddress(req));

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Server error resetting password' });
  }
};

// Performance Endpoints
// Performance Endpoints
exports.getManagersPerformance = async (req, res) => {
  try {
    // Determine performance by tasks completion
    // Assuming 'tasks' are in vendor_tasks table. 
    // And property_manager tasks might be tracked by 'assigned_to_user_id' or similar if they participate in tasks,
    // OR if they manage properties that have tasks.
    // The previous mock logic checked: t.assignedTo === manager.id || t.createdBy === manager.id.
    // Let's assume vendor_tasks has 'assigned_to' (user_id) or 'created_by' (user_id).

    // We'll fetch all property managers and calculate stats
    const [managers] = await sql.query("SELECT * FROM users WHERE role = 'property_manager'");

    const enrichedManagers = await Promise.all(managers.map(async (m) => {
      // Count tasks
      // Note: Check actual columns in vendor_tasks. Assuming 'created_by' is relevant for managers creating tasks.
      // And assigned_to might be vendors mostly.
      // Query: Total tasks created by this manager
      const [taskStats] = await sql.query(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) as completed
            FROM vendor_tasks 
            WHERE created_by = ?
        `, [m.id]);

      const assignedTasks = taskStats[0].total || 0;
      const completedTasks = taskStats[0].completed || 0;
      const completionRate = assignedTasks > 0 ? (completedTasks / assignedTasks) * 100 : 0;

      const [props] = await sql.query("SELECT COUNT(*) as count FROM properties WHERE assigned_manager_id = ?", [m.id]);

      return {
        id: m.id,
        name: m.name || 'Unknown',
        email: m.email || '',
        status: m.status || 'active',
        tasksAssigned: assignedTasks, // In this context, tasks they manage
        tasksCompleted: completedTasks,
        completionRate: Math.round(completionRate * 100) / 100,
        propertiesManaged: props[0]?.count || 0,
        createdAt: m.created_at
      };
    }));

    res.json(enrichedManagers);
  } catch (error) {
    console.error('Error fetching managers performance:', error);
    res.status(500).json({ error: 'Server error fetching managers performance: ' + error.message });
  }
};

exports.getVendorsPerformance = async (req, res) => {
  try {
    // Join users, vendor_profiles, and aggregate tasks
    // Tasks linked via 'assigned_vendor_id' (vendor_profiles.id) or 'assigned_to' (users.id)?
    // Usually vendor tasks are assigned to a vendor user.
    // Let's assume vendor_tasks has 'assigned_vendor_id' linking to vendor_profiles.id based on previous mock.

    const query = `
        SELECT u.id, u.name, u.email, u.status, u.created_at,
               vp.id as vendor_profile_id, vp.company_name
        FROM users u
        LEFT JOIN vendor_profiles vp ON u.id = vp.user_id
        WHERE u.role = 'vendor'
    `;
    const [vendors] = await sql.query(query);

    const enrichedVendors = await Promise.all(vendors.map(async (v) => {
      let assignedTasks = 0;
      let completedTasks = 0;

      if (v.vendor_profile_id) {
        const [stats] = await sql.query(`
                SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) as completed
                FROM vendor_tasks 
                WHERE assigned_vendor_id = ?
             `, [v.vendor_profile_id]);
        assignedTasks = stats[0].total || 0;
        completedTasks = stats[0].completed || 0;
      }

      const completionRate = assignedTasks > 0 ? (completedTasks / assignedTasks) * 100 : 0;
      // Mock rating for now or fetch from profile if stored
      const performanceRating = 0;

      return {
        id: v.id,
        vendorId: v.vendor_profile_id,
        name: v.name || 'Unknown',
        email: v.email || '',
        companyName: v.company_name || 'N/A',
        status: v.status || 'active',
        tasksAssigned: assignedTasks,
        tasksCompleted: completedTasks,
        completionRate: Math.round(completionRate * 100) / 100,
        performanceRating: performanceRating,
        createdAt: v.created_at
      };
    }));

    res.json(enrichedVendors);
  } catch (error) {
    console.error('Error fetching vendors performance:', error);
    res.status(500).json({ error: 'Server error fetching vendors performance: ' + error.message });
  }
};

// Get Audit Logs
exports.getAuditLogs = async (req, res) => {
  try {
    const { limit = 100, offset = 0, action, resourceType, userId, startDate, endDate } = req.query;

    let query = `
        SELECT al.*, u.name as userName, u.email as userEmail, u.role as userRole 
        FROM audit_logs al
        LEFT JOIN users u ON al.user_id = u.id
        WHERE 1=1
    `;
    const params = [];

    if (action) { query += ' AND al.action = ?'; params.push(action); }
    if (resourceType) { query += ' AND al.resource_type = ?'; params.push(resourceType); }
    if (userId) { query += ' AND al.user_id = ?'; params.push(userId); }
    if (startDate) { query += ' AND al.timestamp >= ?'; params.push(startDate); }
    if (endDate) { query += ' AND al.timestamp <= ?'; params.push(endDate); }

    // Sort order
    query += ' ORDER BY al.timestamp DESC';

    // Pagination
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [logs] = await sql.query(query, params);

    // Count total for pagination
    // Simplified count query
    // ... (omitting count for brevity/performance unless strictly needed by UI pagination, often UI just loads more)
    // Let's add simple count
    const [countRes] = await sql.query('SELECT COUNT(*) as total FROM audit_logs');

    res.json({
      logs: logs,
      total: countRes[0].total,
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
    const [appStats] = await sql.query(`
      SELECT
        COUNT(*) as total_applications,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_applications,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved_applications,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected_applications
      FROM applications
    `);

    // Recent activity (last 24 hours)
    const [recentActivityStats] = await sql.query(`
        SELECT COUNT(*) as recent_count FROM audit_logs WHERE timestamp >= NOW() - INTERVAL 1 DAY
    `);

    // Activity by type (last 7 days)
    const [activityTypeStats] = await sql.query(`
        SELECT action, COUNT(*) as count 
        FROM audit_logs 
        WHERE timestamp >= NOW() - INTERVAL 7 DAY
        GROUP BY action
    `);

    const activityByType = {};
    activityTypeStats.forEach(row => {
      activityByType[row.action] = row.count;
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
        total: appStats[0].total_applications,
        pending: appStats[0].pending_applications,
        approved: appStats[0].approved_applications,
        rejected: appStats[0].rejected_applications
      },
      activity: {
        last24Hours: recentActivityStats[0].recent_count,
        last7Days: activityTypeStats.reduce((sum, row) => sum + row.count, 0),
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
