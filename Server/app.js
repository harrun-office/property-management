const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const data = require('./data/mockData');
const {
  generateToken,
  authenticate,
  requireSuperAdmin,
  requirePropertyManager,
  requireVendor,
  requirePropertyOwner,
  checkPermission,
  checkPropertyAccess,
  checkVendorAccess,
  generateInvitationToken,
  validateInvitationToken,
  createAuditLog,
  getUser
} = require('./middleware/auth');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Get references to data arrays
const { users, properties, vendors, tasks, auditLogs, applications, tenants, messages, viewingRequests, payments, maintenanceRequests, ownerSettings } = data;

// Helper function to get IP address from request
function getIpAddress(req) {
  return req.headers['x-forwarded-for'] || req.connection.remoteAddress || '127.0.0.1';
}

// ==================== AUTHENTICATION ROUTES ====================

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (user.status !== 'active') {
      return res.status(401).json({ error: 'Account is not active' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user.id);
    createAuditLog(user.id, 'login', 'user', user.id, {}, getIpAddress(req));

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error during login' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    if (!email || !password || !name || !role) {
      return res.status(400).json({ error: 'Email, password, name, and role are required' });
    }

    // Validate role
    const validRoles = ['tenant', 'property_owner', 'user'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Allowed roles: tenant, property_owner, user' });
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: data.nextUserId,
      email,
      password: hashedPassword,
      name,
      role,
      status: 'active',
      invitedBy: null,
      invitationToken: null,
      invitationExpires: null,
      assignedProperties: [],
      permissions: role === 'tenant' ? {
        viewProperties: true,
        applyForProperties: true,
        viewApplications: true
      } : role === 'property_owner' ? {
        createProperties: true,
        manageOwnProperties: true,
        viewOwnProperties: true
      } : {
        viewProperties: true
      },
      twoFactorEnabled: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    users.push(newUser);
    data.nextUserId = data.nextUserId + 1;

    const token = generateToken(newUser.id);
    createAuditLog(newUser.id, 'register', 'user', newUser.id, { email, role }, getIpAddress(req));

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        status: newUser.status
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// ==================== INVITATION ROUTES ====================

app.get('/api/invitations/validate/:token', (req, res) => {
  try {
    const { token } = req.params;
    const user = validateInvitationToken(token);

    if (!user) {
      return res.status(404).json({ error: 'Invalid or expired invitation token' });
    }

    res.json({
      valid: true,
      email: user.email,
      name: user.name,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error validating invitation' });
  }
});

app.post('/api/invitations/accept', async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ error: 'Token and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const user = validateInvitationToken(token);
    if (!user) {
      return res.status(404).json({ error: 'Invalid or expired invitation token' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.invitationToken = null;
    user.invitationExpires = null;
    user.status = 'active';
    user.updatedAt = new Date().toISOString();

    const authToken = generateToken(user.id);
    createAuditLog(user.id, 'accept_invitation', 'user', user.id, {}, getIpAddress(req));

    res.json({
      message: 'Invitation accepted successfully',
      token: authToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error accepting invitation' });
  }
});

// ==================== PUBLIC PROPERTY ROUTES ====================

// Get all properties (public - for browsing)
app.get('/api/properties', (req, res) => {
  try {
    const { propertyType, minPrice, maxPrice, bedrooms } = req.query;
    let filteredProperties = [...properties];

    // Apply filters
    if (propertyType) {
      filteredProperties = filteredProperties.filter(p => p.propertyType === propertyType);
    }
    if (minPrice) {
      filteredProperties = filteredProperties.filter(p => p.price >= parseInt(minPrice));
    }
    if (maxPrice) {
      filteredProperties = filteredProperties.filter(p => p.price <= parseInt(maxPrice));
    }
    if (bedrooms) {
      filteredProperties = filteredProperties.filter(p => p.bedrooms >= parseInt(bedrooms));
    }

    res.json(filteredProperties);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching properties' });
  }
});

// Get property by ID (public)
app.get('/api/properties/:id', (req, res) => {
  try {
    const property = properties.find(p => p.id === parseInt(req.params.id));
    
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json(property);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching property' });
  }
});

// ==================== SUPER ADMIN ROUTES ====================

// Create Property Manager
app.post('/api/admin/property-managers', authenticate, requireSuperAdmin, async (req, res) => {
  try {
    const { email, name, assignedProperties } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: 'Email and name are required' });
    }

    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const invitationToken = generateInvitationToken();
    const invitationExpires = new Date();
    invitationExpires.setDate(invitationExpires.getDate() + 7); // 7 days

    const newUser = {
      id: data.nextUserId,
      email,
      password: '', // Will be set when invitation is accepted
      name,
      role: 'property_manager',
      status: 'pending_invitation',
      invitedBy: req.userId,
      invitationToken,
      invitationExpires: invitationExpires.toISOString(),
      assignedProperties: assignedProperties || [],
      permissions: {
        createVendor: true,
        assignVendors: true,
        createTasks: true,
        viewReports: true,
        manageAssignedProperties: true
      },
      twoFactorEnabled: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    users.push(newUser);
    data.nextUserId = data.nextUserId + 1;

    createAuditLog(req.userId, 'create_property_manager', 'user', newUser.id, { email, name }, getIpAddress(req));

    res.status(201).json({
      message: 'Property Manager created successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        status: newUser.status
      },
      invitationToken // In production, this would be sent via email
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error creating property manager' });
  }
});

// List all Property Managers
app.get('/api/admin/property-managers', authenticate, requireSuperAdmin, (req, res) => {
  try {
    const propertyManagers = users
      .filter(u => u.role === 'property_manager')
      .map(u => ({
        id: u.id,
        email: u.email,
        name: u.name,
        status: u.status,
        assignedProperties: u.assignedProperties,
        invitedBy: u.invitedBy,
        createdAt: u.createdAt
      }));

    res.json(propertyManagers);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching property managers' });
  }
});

// Update Property Manager
app.put('/api/admin/property-managers/:id', authenticate, requireSuperAdmin, (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId && u.role === 'property_manager');

    if (!user) {
      return res.status(404).json({ error: 'Property Manager not found' });
    }

    const { name, status, assignedProperties } = req.body;

    if (name) user.name = name;
    if (status) user.status = status;
    if (assignedProperties) user.assignedProperties = assignedProperties;
    user.updatedAt = new Date().toISOString();

    createAuditLog(req.userId, 'update_property_manager', 'user', userId, req.body, getIpAddress(req));

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      status: user.status,
      assignedProperties: user.assignedProperties
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error updating property manager' });
  }
});

// Suspend/Delete Property Manager
app.delete('/api/admin/property-managers/:id', authenticate, requireSuperAdmin, (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId && u.role === 'property_manager');

    if (!user) {
      return res.status(404).json({ error: 'Property Manager not found' });
    }

    user.status = 'suspended';
    user.updatedAt = new Date().toISOString();

    createAuditLog(req.userId, 'suspend_property_manager', 'user', userId, {}, getIpAddress(req));

    res.json({ message: 'Property Manager suspended successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error suspending property manager' });
  }
});

// Assign properties to Property Manager
app.post('/api/admin/property-managers/:id/assign-properties', authenticate, requireSuperAdmin, (req, res) => {
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
});

// System Analytics
app.get('/api/admin/analytics', authenticate, requireSuperAdmin, (req, res) => {
  try {
    const analytics = {
      totalUsers: users.length,
      propertyManagers: users.filter(u => u.role === 'property_manager').length,
      vendors: users.filter(u => u.role === 'vendor').length,
      totalProperties: properties.length,
      activeProperties: properties.filter(p => p.status === 'active').length,
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.status === 'completed').length,
      pendingTasks: tasks.filter(t => t.status === 'pending').length,
      inProgressTasks: tasks.filter(t => t.status === 'in_progress').length
    };

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching analytics' });
  }
});

// Audit Logs
app.get('/api/admin/audit-logs', authenticate, requireSuperAdmin, (req, res) => {
  try {
    const { userId, action, limit = 100 } = req.query;
    let filteredLogs = [...auditLogs];

    if (userId) {
      filteredLogs = filteredLogs.filter(log => log.userId === parseInt(userId));
    }
    if (action) {
      filteredLogs = filteredLogs.filter(log => log.action === action);
    }

    filteredLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    filteredLogs = filteredLogs.slice(0, parseInt(limit));

    res.json(filteredLogs);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching audit logs' });
  }
});

// ==================== PROPERTY MANAGER ROUTES ====================

// Get assigned properties
app.get('/api/property-manager/properties', authenticate, requirePropertyManager, (req, res) => {
  try {
    const user = getUser(req);
    let managerProperties = [];

    if (user.role === 'super_admin') {
      managerProperties = properties;
    } else {
      managerProperties = properties.filter(p => user.assignedProperties.includes(p.id));
    }

    res.json(managerProperties);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching properties' });
  }
});

// Create/Invite Vendor
app.post('/api/property-manager/vendors', authenticate, requirePropertyManager, async (req, res) => {
  try {
    const { email, name, companyName, phone, serviceTypes, assignedProperties, permissionScope } = req.body;

    if (!email || !name || !companyName || !serviceTypes) {
      return res.status(400).json({ error: 'Email, name, company name, and service types are required' });
    }

    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const invitationToken = generateInvitationToken();
    const invitationExpires = new Date();
    invitationExpires.setDate(invitationExpires.getDate() + 7);

    const newUser = {
      id: data.nextUserId,
      email,
      password: '',
      name,
      role: 'vendor',
      status: 'pending_invitation',
      invitedBy: req.userId,
      invitationToken,
      invitationExpires: invitationExpires.toISOString(),
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
      phone: phone || '',
      serviceTypes: Array.isArray(serviceTypes) ? serviceTypes : [serviceTypes],
      certifications: [],
      availabilitySchedule: {},
      performanceRating: 0,
      contractInfo: {},
      assignedProperties: assignedProperties || [],
      permissionScope: permissionScope || 'task-based',
      status: 'pending',
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
        status: newVendor.status
      },
      invitationToken
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error creating vendor' });
  }
});

// List assigned vendors
app.get('/api/property-manager/vendors', authenticate, requirePropertyManager, (req, res) => {
  try {
    const user = getUser(req);
    let managerVendors = [];

    if (user.role === 'super_admin') {
      managerVendors = vendors;
    } else {
      // Get vendors invited by this property manager
      managerVendors = vendors.filter(v => {
        const vendorUser = users.find(u => u.id === v.userId);
        return vendorUser && vendorUser.invitedBy === user.id;
      });
    }

    res.json(managerVendors);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching vendors' });
  }
});

// Update vendor
app.put('/api/property-manager/vendors/:id', authenticate, requirePropertyManager, (req, res) => {
  try {
    const vendorId = parseInt(req.params.id);
    const vendor = vendors.find(v => v.id === vendorId);

    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    const user = getUser(req);
    const vendorUser = users.find(u => u.id === vendor.userId);

    // Check if property manager has permission (invited this vendor or is super admin)
    if (user.role !== 'super_admin' && vendorUser.invitedBy !== user.id) {
      return res.status(403).json({ error: 'Access denied to this vendor' });
    }

    const { companyName, phone, serviceTypes, permissionScope, status } = req.body;

    if (companyName) vendor.companyName = companyName;
    if (phone) vendor.phone = phone;
    if (serviceTypes) vendor.serviceTypes = Array.isArray(serviceTypes) ? serviceTypes : [serviceTypes];
    if (permissionScope) vendor.permissionScope = permissionScope;
    if (status) vendor.status = status;
    vendor.updatedAt = new Date().toISOString();

    createAuditLog(req.userId, 'update_vendor', 'vendor', vendorId, req.body, getIpAddress(req));

    res.json(vendor);
  } catch (error) {
    res.status(500).json({ error: 'Server error updating vendor' });
  }
});

// Assign vendor to property
app.post('/api/property-manager/vendors/:id/assign-property', authenticate, requirePropertyManager, (req, res) => {
  try {
    const vendorId = parseInt(req.params.id);
    const { propertyId, permissionScope } = req.body;

    const vendor = vendors.find(v => v.id === vendorId);
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    const property = properties.find(p => p.id === propertyId);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const user = getUser(req);
    if (user.role !== 'super_admin' && !user.assignedProperties.includes(propertyId)) {
      return res.status(403).json({ error: 'Access denied to this property' });
    }

    // Add vendor to property if not already assigned
    if (!property.assignedVendors) {
      property.assignedVendors = [];
    }

    const existingIndex = property.assignedVendors.findIndex(v => v.vendorId === vendor.userId);
    if (existingIndex >= 0) {
      property.assignedVendors[existingIndex].permissionScope = permissionScope || 'task-based';
    } else {
      property.assignedVendors.push({
        vendorId: vendor.userId,
        permissionScope: permissionScope || 'task-based'
      });
    }

    // Update vendor's assigned properties
    if (!vendor.assignedProperties.includes(propertyId)) {
      vendor.assignedProperties.push(propertyId);
    }

    // Update user's assigned properties
    const vendorUser = users.find(u => u.id === vendor.userId);
    if (vendorUser && !vendorUser.assignedProperties.includes(propertyId)) {
      vendorUser.assignedProperties.push(propertyId);
    }

    property.updatedAt = new Date().toISOString();
    vendor.updatedAt = new Date().toISOString();

    createAuditLog(req.userId, 'assign_vendor_to_property', 'property', propertyId, { vendorId, permissionScope }, getIpAddress(req));

    res.json({
      message: 'Vendor assigned to property successfully',
      property: property
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error assigning vendor to property' });
  }
});

// Create task
app.post('/api/property-manager/tasks', authenticate, requirePropertyManager, (req, res) => {
  try {
    const { propertyId, assignedVendorId, title, description, priority, dueDate } = req.body;

    if (!propertyId || !assignedVendorId || !title || !description) {
      return res.status(400).json({ error: 'Property ID, vendor ID, title, and description are required' });
    }

    const user = getUser(req);
    if (user.role !== 'super_admin' && !user.assignedProperties.includes(propertyId)) {
      return res.status(403).json({ error: 'Access denied to this property' });
    }

    const property = properties.find(p => p.id === propertyId);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const vendor = vendors.find(v => v.userId === assignedVendorId);
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    const newTask = {
      id: data.nextTaskId,
      propertyId: parseInt(propertyId),
      assignedVendorId: parseInt(assignedVendorId),
      assignedBy: req.userId,
      title,
      description,
      priority: priority || 'medium',
      status: 'pending',
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      completedDate: null,
      attachments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    tasks.push(newTask);
    data.nextTaskId = data.nextTaskId + 1;

    createAuditLog(req.userId, 'create_task', 'task', newTask.id, { propertyId, assignedVendorId, title }, getIpAddress(req));

    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Server error creating task' });
  }
});

// List tasks
app.get('/api/property-manager/tasks', authenticate, requirePropertyManager, (req, res) => {
  try {
    const user = getUser(req);
    let managerTasks = [];

    if (user.role === 'super_admin') {
      managerTasks = tasks;
    } else {
      managerTasks = tasks.filter(t => {
        return user.assignedProperties.includes(t.propertyId) || t.assignedBy === user.id;
      });
    }

    res.json(managerTasks);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching tasks' });
  }
});

// Update task
app.put('/api/property-manager/tasks/:id', authenticate, requirePropertyManager, (req, res) => {
  try {
    const taskId = parseInt(req.params.id);
    const task = tasks.find(t => t.id === taskId);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const user = getUser(req);
    if (user.role !== 'super_admin' && task.assignedBy !== user.id) {
      return res.status(403).json({ error: 'Access denied to this task' });
    }

    const { title, description, priority, status, dueDate } = req.body;

    if (title) task.title = title;
    if (description) task.description = description;
    if (priority) task.priority = priority;
    if (status) task.status = status;
    if (dueDate) task.dueDate = new Date(dueDate).toISOString();
    task.updatedAt = new Date().toISOString();

    createAuditLog(req.userId, 'update_task', 'task', taskId, req.body, getIpAddress(req));

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Server error updating task' });
  }
});

// Get reports
app.get('/api/property-manager/reports', authenticate, requirePropertyManager, (req, res) => {
  try {
    const user = getUser(req);
    let managerTasks = tasks;
    let managerProperties = properties;

    if (user.role !== 'super_admin') {
      managerTasks = tasks.filter(t => user.assignedProperties.includes(t.propertyId));
      managerProperties = properties.filter(p => user.assignedProperties.includes(p.id));
    }

    const reports = {
      totalProperties: managerProperties.length,
      totalTasks: managerTasks.length,
      completedTasks: managerTasks.filter(t => t.status === 'completed').length,
      pendingTasks: managerTasks.filter(t => t.status === 'pending').length,
      inProgressTasks: managerTasks.filter(t => t.status === 'in_progress').length,
      tasksByPriority: {
        high: managerTasks.filter(t => t.priority === 'high').length,
        medium: managerTasks.filter(t => t.priority === 'medium').length,
        low: managerTasks.filter(t => t.priority === 'low').length
      }
    };

    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching reports' });
  }
});

// ==================== VENDOR ROUTES ====================

// Get assigned properties
app.get('/api/vendor/properties', authenticate, requireVendor, (req, res) => {
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
});

// Get assigned tasks
app.get('/api/vendor/tasks', authenticate, requireVendor, (req, res) => {
  try {
    const user = getUser(req);
    const vendorTasks = tasks.filter(t => t.assignedVendorId === user.id);

    res.json(vendorTasks);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching tasks' });
  }
});

// Update task status
app.put('/api/vendor/tasks/:id', authenticate, requireVendor, (req, res) => {
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
});

// Upload file to task
app.post('/api/vendor/tasks/:id/upload', authenticate, requireVendor, (req, res) => {
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
});

// Get vendor profile
app.get('/api/vendor/profile', authenticate, requireVendor, (req, res) => {
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
});

// ==================== PROPERTY OWNER ROUTES ====================

// Dashboard Overview
app.get('/api/owner/dashboard', authenticate, requirePropertyOwner, (req, res) => {
  try {
    const user = getUser(req);
    
    // Get owner's properties
    const ownerProperties = properties.filter(p => p.ownerId === user.id);
    
    // Calculate metrics
    const totalProperties = ownerProperties.length;
    const activeProperties = ownerProperties.filter(p => p.status === 'active').length;
    const vacantProperties = ownerProperties.filter(p => p.status === 'active' && !p.tenantId).length;
    const maintenanceProperties = ownerProperties.filter(p => p.status === 'maintenance').length;
    
    // Calculate monthly income (sum of rent from properties with tenants)
    const monthlyIncome = ownerProperties
      .filter(p => p.tenantId && p.monthlyRent)
      .reduce((sum, p) => sum + (p.monthlyRent || 0), 0);
    
    // Calculate occupancy rate
    const occupiedProperties = ownerProperties.filter(p => p.tenantId).length;
    const occupancyRate = totalProperties > 0 ? Math.round((occupiedProperties / totalProperties) * 100) : 0;
    
    // Get pending applications
    const pendingApplications = applications.filter(a => 
      ownerProperties.some(p => p.id === a.propertyId) && a.status === 'pending'
    ).length;
    
    // Get upcoming rent due (next 30 days)
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const upcomingRentDue = payments.filter(p => {
      const dueDate = new Date(p.dueDate);
      return dueDate >= today && dueDate <= nextMonth && p.status === 'pending' &&
        ownerProperties.some(prop => prop.id === p.propertyId);
    }).length;
    
    // Get open maintenance requests
    const openMaintenanceRequests = maintenanceRequests.filter(mr =>
      ownerProperties.some(p => p.id === mr.propertyId) && 
      (mr.status === 'open' || mr.status === 'in_progress')
    ).length;
    
    // Recent activity (last 10)
    const recentActivity = [
      ...applications.filter(a => ownerProperties.some(p => p.id === a.propertyId))
        .map(a => ({ type: 'application', id: a.id, message: `New application for property ${a.propertyId}`, timestamp: a.createdAt })),
      ...messages.filter(m => ownerProperties.some(p => p.id === m.propertyId))
        .map(m => ({ type: 'message', id: m.id, message: `New message about property ${m.propertyId}`, timestamp: m.createdAt })),
      ...maintenanceRequests.filter(mr => ownerProperties.some(p => p.id === mr.propertyId))
        .map(mr => ({ type: 'maintenance', id: mr.id, message: `Maintenance request for property ${mr.propertyId}`, timestamp: mr.createdAt }))
    ]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10);
    
    // Top properties (by views or inquiries)
    const topProperties = ownerProperties
      .map(p => ({
        id: p.id,
        title: p.title,
        address: p.address,
        status: p.status,
        monthlyRent: p.monthlyRent || 0,
        views: p.views || 0,
        inquiries: applications.filter(a => a.propertyId === p.id).length,
        applications: applications.filter(a => a.propertyId === p.id && a.status === 'pending').length
      }))
      .sort((a, b) => (b.views + b.inquiries) - (a.views + a.inquiries))
      .slice(0, 5);
    
    res.json({
      metrics: {
        totalProperties,
        activeProperties,
        vacantProperties,
        maintenanceProperties,
        monthlyIncome,
        occupancyRate,
        pendingApplications,
        upcomingRentDue,
        openMaintenanceRequests
      },
      recentActivity,
      topProperties
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching dashboard data' });
  }
});

// Get owner's properties
app.get('/api/owner/properties', authenticate, requirePropertyOwner, (req, res) => {
  try {
    const user = getUser(req);
    const { status, propertyType, search } = req.query;
    
    let ownerProperties = properties.filter(p => p.ownerId === user.id);
    
    // Apply filters
    if (status) {
      ownerProperties = ownerProperties.filter(p => p.status === status);
    }
    if (propertyType) {
      ownerProperties = ownerProperties.filter(p => p.propertyType === propertyType);
    }
    if (search) {
      const searchLower = search.toLowerCase();
      ownerProperties = ownerProperties.filter(p =>
        p.title.toLowerCase().includes(searchLower) ||
        p.address.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Add additional stats to each property
    const propertiesWithStats = ownerProperties.map(p => ({
      ...p,
      views: p.views || 0,
      inquiries: applications.filter(a => a.propertyId === p.id).length,
      applications: applications.filter(a => a.propertyId === p.id).length,
      pendingApplications: applications.filter(a => a.propertyId === p.id && a.status === 'pending').length
    }));
    
    res.json(propertiesWithStats);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching properties' });
  }
});

// Create new property
app.post('/api/owner/properties', authenticate, requirePropertyOwner, (req, res) => {
  try {
    const user = getUser(req);
    const {
      title,
      description,
      price,
      address,
      bedrooms,
      bathrooms,
      area,
      propertyType,
      images,
      amenities,
      petPolicy,
      utilities,
      yearBuilt,
      parking,
      leaseTerms,
      monthlyRent,
      securityDeposit,
      availableDate
    } = req.body;
    
    if (!title || !description || !address || !price) {
      return res.status(400).json({ error: 'Title, description, address, and price are required' });
    }
    
    const newProperty = {
      id: data.nextPropertyId,
      title,
      description,
      price: parseInt(price),
      address,
      bedrooms: parseInt(bedrooms) || 0,
      bathrooms: parseFloat(bathrooms) || 0,
      area: parseInt(area) || 0,
      propertyType: propertyType || 'apartment',
      images: images || [],
      amenities: amenities || [],
      petPolicy: petPolicy || 'not_allowed',
      utilities: utilities || [],
      yearBuilt: yearBuilt || null,
      parking: parking || 0,
      leaseTerms: leaseTerms || '12 months',
      monthlyRent: monthlyRent ? parseInt(monthlyRent) : null,
      securityDeposit: securityDeposit ? parseInt(securityDeposit) : null,
      availableDate: availableDate || null,
      ownerId: user.id,
      status: 'active',
      views: 0,
      tenantId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    properties.push(newProperty);
    data.nextPropertyId = data.nextPropertyId + 1;
    
    createAuditLog(user.id, 'create_property', 'property', newProperty.id, { title, address }, getIpAddress(req));
    
    res.status(201).json(newProperty);
  } catch (error) {
    res.status(500).json({ error: 'Server error creating property' });
  }
});

// Update property
app.put('/api/owner/properties/:id', authenticate, requirePropertyOwner, (req, res) => {
  try {
    const user = getUser(req);
    const propertyId = parseInt(req.params.id);
    const property = properties.find(p => p.id === propertyId);
    
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    if (property.ownerId !== user.id) {
      return res.status(403).json({ error: 'Access denied to this property' });
    }
    
    // Update allowed fields
    const allowedFields = [
      'title', 'description', 'price', 'address', 'bedrooms', 'bathrooms', 'area',
      'propertyType', 'images', 'amenities', 'petPolicy', 'utilities', 'yearBuilt',
      'parking', 'leaseTerms', 'monthlyRent', 'securityDeposit', 'availableDate'
    ];
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'price' || field === 'bedrooms' || field === 'area' || field === 'parking' || field === 'monthlyRent' || field === 'securityDeposit') {
          property[field] = parseInt(req.body[field]);
        } else if (field === 'bathrooms') {
          property[field] = parseFloat(req.body[field]);
        } else {
          property[field] = req.body[field];
        }
      }
    });
    
    property.updatedAt = new Date().toISOString();
    
    createAuditLog(user.id, 'update_property', 'property', propertyId, req.body, getIpAddress(req));
    
    res.json(property);
  } catch (error) {
    res.status(500).json({ error: 'Server error updating property' });
  }
});

// Delete property
app.delete('/api/owner/properties/:id', authenticate, requirePropertyOwner, (req, res) => {
  try {
    const user = getUser(req);
    const propertyId = parseInt(req.params.id);
    const propertyIndex = properties.findIndex(p => p.id === propertyId);
    
    if (propertyIndex === -1) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    const property = properties[propertyIndex];
    if (property.ownerId !== user.id) {
      return res.status(403).json({ error: 'Access denied to this property' });
    }
    
    // Check if property has active tenants
    if (property.tenantId) {
      return res.status(400).json({ error: 'Cannot delete property with active tenant' });
    }
    
    properties.splice(propertyIndex, 1);
    
    createAuditLog(user.id, 'delete_property', 'property', propertyId, {}, getIpAddress(req));
    
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error deleting property' });
  }
});

// Update property status
app.patch('/api/owner/properties/:id/status', authenticate, requirePropertyOwner, (req, res) => {
  try {
    const user = getUser(req);
    const propertyId = parseInt(req.params.id);
    const property = properties.find(p => p.id === propertyId);
    
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    if (property.ownerId !== user.id) {
      return res.status(403).json({ error: 'Access denied to this property' });
    }
    
    const { status } = req.body;
    if (!['active', 'inactive', 'maintenance', 'rented'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    property.status = status;
    property.updatedAt = new Date().toISOString();
    
    createAuditLog(user.id, 'update_property_status', 'property', propertyId, { status }, getIpAddress(req));
    
    res.json(property);
  } catch (error) {
    res.status(500).json({ error: 'Server error updating property status' });
  }
});

// Get all applications for owner's properties
app.get('/api/owner/applications', authenticate, requirePropertyOwner, (req, res) => {
  try {
    const user = getUser(req);
    const ownerProperties = properties.filter(p => p.ownerId === user.id);
    const propertyIds = ownerProperties.map(p => p.id);
    
    const ownerApplications = applications
      .filter(a => propertyIds.includes(a.propertyId))
      .map(a => {
        const property = properties.find(p => p.id === a.propertyId);
        const applicant = users.find(u => u.id === a.applicantId);
        return {
          ...a,
          property: property ? { id: property.id, title: property.title, address: property.address } : null,
          applicant: applicant ? { id: applicant.id, name: applicant.name, email: applicant.email } : null
        };
      });
    
    res.json(ownerApplications);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching applications' });
  }
});

// Get application details
app.get('/api/owner/applications/:id', authenticate, requirePropertyOwner, (req, res) => {
  try {
    const user = getUser(req);
    const applicationId = parseInt(req.params.id);
    const application = applications.find(a => a.id === applicationId);
    
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    
    const property = properties.find(p => p.id === application.propertyId);
    if (!property || property.ownerId !== user.id) {
      return res.status(403).json({ error: 'Access denied to this application' });
    }
    
    const applicant = users.find(u => u.id === application.applicantId);
    
    res.json({
      ...application,
      property,
      applicant: applicant ? {
        id: applicant.id,
        name: applicant.name,
        email: applicant.email,
        phone: applicant.phone || null
      } : null
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching application' });
  }
});

// Update application status
app.put('/api/owner/applications/:id', authenticate, requirePropertyOwner, (req, res) => {
  try {
    const user = getUser(req);
    const applicationId = parseInt(req.params.id);
    const application = applications.find(a => a.id === applicationId);
    
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    
    const property = properties.find(p => p.id === application.propertyId);
    if (!property || property.ownerId !== user.id) {
      return res.status(403).json({ error: 'Access denied to this application' });
    }
    
    const { status, notes } = req.body;
    
    if (status && !['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    if (status) {
      application.status = status;
      application.updatedAt = new Date().toISOString();
      
      // If approved, link tenant to property
      if (status === 'approved') {
        property.tenantId = application.applicantId;
        property.status = 'rented';
        
        // Create tenant record
        const newTenant = {
          id: data.nextTenantId,
          userId: application.applicantId,
          propertyId: property.id,
          leaseStartDate: new Date().toISOString(),
          leaseEndDate: null, // Calculate based on lease terms
          monthlyRent: property.monthlyRent || property.price,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        tenants.push(newTenant);
        data.nextTenantId = data.nextTenantId + 1;
      }
    }
    
    if (notes) {
      if (!application.notes) {
        application.notes = [];
      }
      application.notes.push({
        note: notes,
        addedBy: user.id,
        addedAt: new Date().toISOString()
      });
    }
    
    createAuditLog(user.id, 'update_application', 'application', applicationId, { status, notes }, getIpAddress(req));
    
    res.json(application);
  } catch (error) {
    res.status(500).json({ error: 'Server error updating application' });
  }
});

// Add notes to application
app.post('/api/owner/applications/:id/notes', authenticate, requirePropertyOwner, (req, res) => {
  try {
    const user = getUser(req);
    const applicationId = parseInt(req.params.id);
    const application = applications.find(a => a.id === applicationId);
    
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    
    const property = properties.find(p => p.id === application.propertyId);
    if (!property || property.ownerId !== user.id) {
      return res.status(403).json({ error: 'Access denied to this application' });
    }
    
    const { note } = req.body;
    if (!note) {
      return res.status(400).json({ error: 'Note is required' });
    }
    
    if (!application.notes) {
      application.notes = [];
    }
    
    application.notes.push({
      note,
      addedBy: user.id,
      addedAt: new Date().toISOString()
    });
    
    application.updatedAt = new Date().toISOString();
    
    createAuditLog(user.id, 'add_application_note', 'application', applicationId, { note }, getIpAddress(req));
    
    res.json(application);
  } catch (error) {
    res.status(500).json({ error: 'Server error adding note' });
  }
});

// Get all tenants for owner's properties
app.get('/api/owner/tenants', authenticate, requirePropertyOwner, (req, res) => {
  try {
    const user = getUser(req);
    const ownerProperties = properties.filter(p => p.ownerId === user.id);
    const propertyIds = ownerProperties.map(p => p.id);
    
    const ownerTenants = tenants
      .filter(t => propertyIds.includes(t.propertyId))
      .map(t => {
        const property = properties.find(p => p.id === t.propertyId);
        const tenantUser = users.find(u => u.id === t.userId);
        return {
          ...t,
          property: property ? { id: property.id, title: property.title, address: property.address } : null,
          tenant: tenantUser ? { id: tenantUser.id, name: tenantUser.name, email: tenantUser.email } : null
        };
      });
    
    res.json(ownerTenants);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching tenants' });
  }
});

// Get tenant details
app.get('/api/owner/tenants/:id', authenticate, requirePropertyOwner, (req, res) => {
  try {
    const user = getUser(req);
    const tenantId = parseInt(req.params.id);
    const tenant = tenants.find(t => t.id === tenantId);
    
    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }
    
    const property = properties.find(p => p.id === tenant.propertyId);
    if (!property || property.ownerId !== user.id) {
      return res.status(403).json({ error: 'Access denied to this tenant' });
    }
    
    const tenantUser = users.find(u => u.id === tenant.userId);
    const tenantPayments = payments.filter(p => p.tenantId === tenant.userId && p.propertyId === tenant.propertyId);
    const tenantMaintenance = maintenanceRequests.filter(mr => mr.propertyId === tenant.propertyId && mr.tenantId === tenant.userId);
    
    res.json({
      ...tenant,
      property,
      tenant: tenantUser ? {
        id: tenantUser.id,
        name: tenantUser.name,
        email: tenantUser.email,
        phone: tenantUser.phone || null
      } : null,
      payments: tenantPayments,
      maintenanceRequests: tenantMaintenance
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching tenant' });
  }
});

// Get all messages for owner
app.get('/api/owner/messages', authenticate, requirePropertyOwner, (req, res) => {
  try {
    const user = getUser(req);
    const ownerProperties = properties.filter(p => p.ownerId === user.id);
    const propertyIds = ownerProperties.map(p => p.id);
    
    const ownerMessages = messages
      .filter(m => propertyIds.includes(m.propertyId))
      .map(m => {
        const property = properties.find(p => p.id === m.propertyId);
        const sender = users.find(u => u.id === m.senderId);
        return {
          ...m,
          property: property ? { id: property.id, title: property.title } : null,
          sender: sender ? { id: sender.id, name: sender.name, email: sender.email } : null
        };
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json(ownerMessages);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching messages' });
  }
});

// Get message thread
app.get('/api/owner/messages/:id', authenticate, requirePropertyOwner, (req, res) => {
  try {
    const user = getUser(req);
    const messageId = parseInt(req.params.id);
    const message = messages.find(m => m.id === messageId);
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    const property = properties.find(p => p.id === message.propertyId);
    if (!property || property.ownerId !== user.id) {
      return res.status(403).json({ error: 'Access denied to this message' });
    }
    
    // Get all messages in this thread (same property and participants)
    const threadMessages = messages
      .filter(m => m.propertyId === message.propertyId && 
        (m.senderId === message.senderId || m.senderId === user.id || m.recipientId === message.senderId || m.recipientId === user.id))
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .map(m => {
        const sender = users.find(u => u.id === m.senderId);
        return {
          ...m,
          sender: sender ? { id: sender.id, name: sender.name, email: sender.email } : null
        };
      });
    
    res.json(threadMessages);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching message thread' });
  }
});

// Send message
app.post('/api/owner/messages', authenticate, requirePropertyOwner, (req, res) => {
  try {
    const user = getUser(req);
    const { propertyId, recipientId, message } = req.body;
    
    if (!propertyId || !recipientId || !message) {
      return res.status(400).json({ error: 'Property ID, recipient ID, and message are required' });
    }
    
    const property = properties.find(p => p.id === propertyId);
    if (!property || property.ownerId !== user.id) {
      return res.status(403).json({ error: 'Access denied to this property' });
    }
    
    const newMessage = {
      id: data.nextMessageId,
      propertyId: parseInt(propertyId),
      senderId: user.id,
      recipientId: parseInt(recipientId),
      message,
      read: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    messages.push(newMessage);
    data.nextMessageId = data.nextMessageId + 1;
    
    createAuditLog(user.id, 'send_message', 'message', newMessage.id, { propertyId, recipientId }, getIpAddress(req));
    
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: 'Server error sending message' });
  }
});

// Mark message as read
app.put('/api/owner/messages/:id/read', authenticate, requirePropertyOwner, (req, res) => {
  try {
    const user = getUser(req);
    const messageId = parseInt(req.params.id);
    const message = messages.find(m => m.id === messageId);
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    const property = properties.find(p => p.id === message.propertyId);
    if (!property || property.ownerId !== user.id) {
      return res.status(403).json({ error: 'Access denied to this message' });
    }
    
    message.read = true;
    message.updatedAt = new Date().toISOString();
    
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: 'Server error updating message' });
  }
});

// Get viewing requests
app.get('/api/owner/viewings', authenticate, requirePropertyOwner, (req, res) => {
  try {
    const user = getUser(req);
    const ownerProperties = properties.filter(p => p.ownerId === user.id);
    const propertyIds = ownerProperties.map(p => p.id);
    
    const ownerViewings = viewingRequests
      .filter(vr => propertyIds.includes(vr.propertyId))
      .map(vr => {
        const property = properties.find(p => p.id === vr.propertyId);
        const applicant = users.find(u => u.id === vr.applicantId);
        return {
          ...vr,
          property: property ? { id: property.id, title: property.title, address: property.address } : null,
          applicant: applicant ? { id: applicant.id, name: applicant.name, email: applicant.email } : null
        };
      })
      .sort((a, b) => new Date(b.requestedDate) - new Date(a.requestedDate));
    
    res.json(ownerViewings);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching viewing requests' });
  }
});

// Update viewing request status
app.put('/api/owner/viewings/:id', authenticate, requirePropertyOwner, (req, res) => {
  try {
    const user = getUser(req);
    const viewingId = parseInt(req.params.id);
    const viewing = viewingRequests.find(vr => vr.id === viewingId);
    
    if (!viewing) {
      return res.status(404).json({ error: 'Viewing request not found' });
    }
    
    const property = properties.find(p => p.id === viewing.propertyId);
    if (!property || property.ownerId !== user.id) {
      return res.status(403).json({ error: 'Access denied to this viewing request' });
    }
    
    const { status, rescheduledDate } = req.body;
    
    if (status && !['pending', 'approved', 'declined', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    if (status) {
      viewing.status = status;
    }
    if (rescheduledDate) {
      viewing.requestedDate = rescheduledDate;
    }
    viewing.updatedAt = new Date().toISOString();
    
    createAuditLog(user.id, 'update_viewing', 'viewing', viewingId, { status, rescheduledDate }, getIpAddress(req));
    
    res.json(viewing);
  } catch (error) {
    res.status(500).json({ error: 'Server error updating viewing request' });
  }
});

// Get all payments for owner's properties
app.get('/api/owner/payments', authenticate, requirePropertyOwner, (req, res) => {
  try {
    const user = getUser(req);
    const ownerProperties = properties.filter(p => p.ownerId === user.id);
    const propertyIds = ownerProperties.map(p => p.id);
    
    const ownerPayments = payments
      .filter(p => propertyIds.includes(p.propertyId))
      .map(p => {
        const property = properties.find(prop => prop.id === p.propertyId);
        const tenant = users.find(u => u.id === p.tenantId);
        return {
          ...p,
          property: property ? { id: property.id, title: property.title, address: property.address } : null,
          tenant: tenant ? { id: tenant.id, name: tenant.name, email: tenant.email } : null
        };
      })
      .sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
    
    res.json(ownerPayments);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching payments' });
  }
});

// Get payment summary
app.get('/api/owner/payments/summary', authenticate, requirePropertyOwner, (req, res) => {
  try {
    const user = getUser(req);
    const ownerProperties = properties.filter(p => p.ownerId === user.id);
    const propertyIds = ownerProperties.map(p => p.id);
    
    const ownerPayments = payments.filter(p => propertyIds.includes(p.propertyId));
    const today = new Date();
    const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    
    const totalCollected = ownerPayments
      .filter(p => p.status === 'paid' && new Date(p.paidDate) >= currentMonth)
      .reduce((sum, p) => sum + (p.amount || 0), 0);
    
    const pendingPayments = ownerPayments.filter(p => p.status === 'pending').length;
    const overduePayments = ownerPayments.filter(p => {
      const dueDate = new Date(p.dueDate);
      return p.status === 'pending' && dueDate < today;
    }).length;
    
    res.json({
      totalCollected,
      pendingPayments,
      overduePayments,
      totalExpected: ownerProperties
        .filter(p => p.tenantId && p.monthlyRent)
        .reduce((sum, p) => sum + (p.monthlyRent || 0), 0)
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching payment summary' });
  }
});

// Record manual payment
app.post('/api/owner/payments', authenticate, requirePropertyOwner, (req, res) => {
  try {
    const user = getUser(req);
    const { propertyId, tenantId, amount, dueDate, paidDate, paymentMethod } = req.body;
    
    if (!propertyId || !tenantId || !amount || !dueDate) {
      return res.status(400).json({ error: 'Property ID, tenant ID, amount, and due date are required' });
    }
    
    const property = properties.find(p => p.id === propertyId);
    if (!property || property.ownerId !== user.id) {
      return res.status(403).json({ error: 'Access denied to this property' });
    }
    
    const newPayment = {
      id: data.nextPaymentId,
      propertyId: parseInt(propertyId),
      tenantId: parseInt(tenantId),
      amount: parseFloat(amount),
      dueDate: dueDate,
      paidDate: paidDate || new Date().toISOString(),
      status: paidDate ? 'paid' : 'pending',
      paymentMethod: paymentMethod || 'manual',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    payments.push(newPayment);
    data.nextPaymentId = data.nextPaymentId + 1;
    
    createAuditLog(user.id, 'create_payment', 'payment', newPayment.id, { propertyId, tenantId, amount }, getIpAddress(req));
    
    res.status(201).json(newPayment);
  } catch (error) {
    res.status(500).json({ error: 'Server error creating payment' });
  }
});

// Update payment status
app.put('/api/owner/payments/:id', authenticate, requirePropertyOwner, (req, res) => {
  try {
    const user = getUser(req);
    const paymentId = parseInt(req.params.id);
    const payment = payments.find(p => p.id === paymentId);
    
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    
    const property = properties.find(p => p.id === payment.propertyId);
    if (!property || property.ownerId !== user.id) {
      return res.status(403).json({ error: 'Access denied to this payment' });
    }
    
    const { status, paidDate, paymentMethod } = req.body;
    
    if (status) {
      payment.status = status;
    }
    if (paidDate) {
      payment.paidDate = paidDate;
    }
    if (paymentMethod) {
      payment.paymentMethod = paymentMethod;
    }
    payment.updatedAt = new Date().toISOString();
    
    createAuditLog(user.id, 'update_payment', 'payment', paymentId, { status, paidDate }, getIpAddress(req));
    
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Server error updating payment' });
  }
});

// Get income reports
app.get('/api/owner/reports/income', authenticate, requirePropertyOwner, (req, res) => {
  try {
    const user = getUser(req);
    const ownerProperties = properties.filter(p => p.ownerId === user.id);
    const propertyIds = ownerProperties.map(p => p.id);
    const ownerPayments = payments.filter(p => propertyIds.includes(p.propertyId) && p.status === 'paid');
    
    const monthlyIncome = {};
    ownerPayments.forEach(payment => {
      const date = new Date(payment.paidDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyIncome[monthKey]) {
        monthlyIncome[monthKey] = 0;
      }
      monthlyIncome[monthKey] += payment.amount || 0;
    });
    
    res.json({ monthlyIncome });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching income report' });
  }
});

// Get monthly reports
app.get('/api/owner/reports/monthly', authenticate, requirePropertyOwner, (req, res) => {
  try {
    const user = getUser(req);
    const { month, year } = req.query;
    const targetDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const nextMonth = new Date(parseInt(year), parseInt(month), 1);
    
    const ownerProperties = properties.filter(p => p.ownerId === user.id);
    const propertyIds = ownerProperties.map(p => p.id);
    
    const monthPayments = payments.filter(p =>
      propertyIds.includes(p.propertyId) &&
      new Date(p.paidDate) >= targetDate &&
      new Date(p.paidDate) < nextMonth &&
      p.status === 'paid'
    );
    
    const totalIncome = monthPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
    
    res.json({
      month: parseInt(month),
      year: parseInt(year),
      totalIncome,
      payments: monthPayments.length,
      properties: ownerProperties.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching monthly report' });
  }
});

// Get yearly reports
app.get('/api/owner/reports/yearly', authenticate, requirePropertyOwner, (req, res) => {
  try {
    const user = getUser(req);
    const { year } = req.query;
    const targetYear = new Date(parseInt(year), 0, 1);
    const nextYear = new Date(parseInt(year) + 1, 0, 1);
    
    const ownerProperties = properties.filter(p => p.ownerId === user.id);
    const propertyIds = ownerProperties.map(p => p.id);
    
    const yearPayments = payments.filter(p =>
      propertyIds.includes(p.propertyId) &&
      new Date(p.paidDate) >= targetYear &&
      new Date(p.paidDate) < nextYear &&
      p.status === 'paid'
    );
    
    const totalIncome = yearPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
    
    res.json({
      year: parseInt(year),
      totalIncome,
      payments: yearPayments.length,
      properties: ownerProperties.length,
      averageMonthlyIncome: totalIncome / 12
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching yearly report' });
  }
});

// Get property performance analytics
app.get('/api/owner/analytics/property-performance', authenticate, requirePropertyOwner, (req, res) => {
  try {
    const user = getUser(req);
    const ownerProperties = properties.filter(p => p.ownerId === user.id);
    
    const performance = ownerProperties.map(property => {
      const propertyApplications = applications.filter(a => a.propertyId === property.id);
      const propertyPayments = payments.filter(p => p.propertyId === property.id && p.status === 'paid');
      
      return {
        propertyId: property.id,
        title: property.title,
        views: property.views || 0,
        inquiries: propertyApplications.length,
        applications: propertyApplications.filter(a => a.status === 'pending').length,
        approvedApplications: propertyApplications.filter(a => a.status === 'approved').length,
        conversionRate: propertyApplications.length > 0
          ? Math.round((propertyApplications.filter(a => a.status === 'approved').length / propertyApplications.length) * 100)
          : 0,
        totalRevenue: propertyPayments.reduce((sum, p) => sum + (p.amount || 0), 0),
        daysOnMarket: property.createdAt
          ? Math.floor((Date.now() - new Date(property.createdAt).getTime()) / (1000 * 60 * 60 * 24))
          : 0
      };
    });
    
    res.json(performance);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching property performance' });
  }
});

// Get financial analytics
app.get('/api/owner/analytics/financial', authenticate, requirePropertyOwner, (req, res) => {
  try {
    const user = getUser(req);
    const ownerProperties = properties.filter(p => p.ownerId === user.id);
    const propertyIds = ownerProperties.map(p => p.id);
    const ownerPayments = payments.filter(p => propertyIds.includes(p.propertyId) && p.status === 'paid');
    
    const monthlyData = {};
    ownerPayments.forEach(payment => {
      const date = new Date(payment.paidDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = 0;
      }
      monthlyData[monthKey] += payment.amount || 0;
    });
    
    const revenueByProperty = {};
    ownerPayments.forEach(payment => {
      if (!revenueByProperty[payment.propertyId]) {
        revenueByProperty[payment.propertyId] = 0;
      }
      revenueByProperty[payment.propertyId] += payment.amount || 0;
    });
    
    res.json({
      monthlyIncome: monthlyData,
      revenueByProperty,
      totalRevenue: ownerPayments.reduce((sum, p) => sum + (p.amount || 0), 0),
      averageMonthlyIncome: Object.values(monthlyData).length > 0
        ? Object.values(monthlyData).reduce((sum, val) => sum + val, 0) / Object.values(monthlyData).length
        : 0
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching financial analytics' });
  }
});

// Get tenant analytics
app.get('/api/owner/analytics/tenant', authenticate, requirePropertyOwner, (req, res) => {
  try {
    const user = getUser(req);
    const ownerProperties = properties.filter(p => p.ownerId === user.id);
    const propertyIds = ownerProperties.map(p => p.id);
    const ownerTenants = tenants.filter(t => propertyIds.includes(t.propertyId));
    const ownerApplications = applications.filter(a => propertyIds.includes(a.propertyId));
    
    const approvalRate = ownerApplications.length > 0
      ? Math.round((ownerApplications.filter(a => a.status === 'approved').length / ownerApplications.length) * 100)
      : 0;
    
    res.json({
      totalTenants: ownerTenants.length,
      activeTenants: ownerTenants.filter(t => t.status === 'active').length,
      applicationApprovalRate: approvalRate,
      totalApplications: ownerApplications.length,
      pendingApplications: ownerApplications.filter(a => a.status === 'pending').length
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching tenant analytics' });
  }
});

// Get maintenance requests
app.get('/api/owner/maintenance', authenticate, requirePropertyOwner, (req, res) => {
  try {
    const user = getUser(req);
    const ownerProperties = properties.filter(p => p.ownerId === user.id);
    const propertyIds = ownerProperties.map(p => p.id);
    
    const ownerMaintenance = maintenanceRequests
      .filter(mr => propertyIds.includes(mr.propertyId))
      .map(mr => {
        const property = properties.find(p => p.id === mr.propertyId);
        const tenant = users.find(u => u.id === mr.tenantId);
        return {
          ...mr,
          property: property ? { id: property.id, title: property.title, address: property.address } : null,
          tenant: tenant ? { id: tenant.id, name: tenant.name, email: tenant.email } : null
        };
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json(ownerMaintenance);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching maintenance requests' });
  }
});

// Get maintenance request details
app.get('/api/owner/maintenance/:id', authenticate, requirePropertyOwner, (req, res) => {
  try {
    const user = getUser(req);
    const maintenanceId = parseInt(req.params.id);
    const maintenance = maintenanceRequests.find(mr => mr.id === maintenanceId);
    
    if (!maintenance) {
      return res.status(404).json({ error: 'Maintenance request not found' });
    }
    
    const property = properties.find(p => p.id === maintenance.propertyId);
    if (!property || property.ownerId !== user.id) {
      return res.status(403).json({ error: 'Access denied to this maintenance request' });
    }
    
    const tenant = users.find(u => u.id === maintenance.tenantId);
    
    res.json({
      ...maintenance,
      property,
      tenant: tenant ? {
        id: tenant.id,
        name: tenant.name,
        email: tenant.email,
        phone: tenant.phone || null
      } : null
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching maintenance request' });
  }
});

// Update maintenance request status
app.put('/api/owner/maintenance/:id', authenticate, requirePropertyOwner, (req, res) => {
  try {
    const user = getUser(req);
    const maintenanceId = parseInt(req.params.id);
    const maintenance = maintenanceRequests.find(mr => mr.id === maintenanceId);
    
    if (!maintenance) {
      return res.status(404).json({ error: 'Maintenance request not found' });
    }
    
    const property = properties.find(p => p.id === maintenance.propertyId);
    if (!property || property.ownerId !== user.id) {
      return res.status(403).json({ error: 'Access denied to this maintenance request' });
    }
    
    const { status } = req.body;
    if (status && !['open', 'in_progress', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    if (status) {
      maintenance.status = status;
      if (status === 'completed') {
        maintenance.completedDate = new Date().toISOString();
      }
    }
    maintenance.updatedAt = new Date().toISOString();
    
    createAuditLog(user.id, 'update_maintenance', 'maintenance', maintenanceId, { status }, getIpAddress(req));
    
    res.json(maintenance);
  } catch (error) {
    res.status(500).json({ error: 'Server error updating maintenance request' });
  }
});

// Add notes to maintenance request
app.post('/api/owner/maintenance/:id/notes', authenticate, requirePropertyOwner, (req, res) => {
  try {
    const user = getUser(req);
    const maintenanceId = parseInt(req.params.id);
    const maintenance = maintenanceRequests.find(mr => mr.id === maintenanceId);
    
    if (!maintenance) {
      return res.status(404).json({ error: 'Maintenance request not found' });
    }
    
    const property = properties.find(p => p.id === maintenance.propertyId);
    if (!property || property.ownerId !== user.id) {
      return res.status(403).json({ error: 'Access denied to this maintenance request' });
    }
    
    const { note } = req.body;
    if (!note) {
      return res.status(400).json({ error: 'Note is required' });
    }
    
    if (!maintenance.notes) {
      maintenance.notes = [];
    }
    
    maintenance.notes.push({
      note,
      addedBy: user.id,
      addedAt: new Date().toISOString()
    });
    
    maintenance.updatedAt = new Date().toISOString();
    
    createAuditLog(user.id, 'add_maintenance_note', 'maintenance', maintenanceId, { note }, getIpAddress(req));
    
    res.json(maintenance);
  } catch (error) {
    res.status(500).json({ error: 'Server error adding note' });
  }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
