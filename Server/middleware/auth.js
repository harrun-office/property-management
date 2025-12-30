// Authentication and authorization middleware for hierarchical RBAC system

const jwt = require('jsonwebtoken');

// Secret key for JWT (in production should be in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production';

// Generate a real JWT token
function generateToken(userId, role) {
  return jwt.sign(
    { userId, role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

// Verify token
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Get user from request
function getUser(req) {
  const data = require('../data/mockData');
  return data.users.find(u => u.id === req.userId);
}

// Middleware to check authentication
function authenticate(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '') || req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  req.userId = decoded.userId;
  req.userRole = decoded.role;

  const user = getUser(req);

  // If user not found in mock data (e.g. server restart), we might still want to trust the token
  // but for this app we rely on the mock data being there.
  if (!user || user.status !== 'active') {
    return res.status(401).json({ error: 'User account is not active' });
  }

  // Ensure the role in token matches current user role (in case it changed)
  if (user.role !== decoded.role) {
    // Optional: decide if we want to fail or just update
    // For safety, let's update req.userRole to match the DB
    req.userRole = user.role;
  }

  req.user = user;
  next();
}

// Middleware to require Super Admin
function requireSuperAdmin(req, res, next) {
  const user = getUser(req);

  if (!user || user.role !== 'super_admin') {
    return res.status(403).json({ error: 'Super Admin access required' });
  }

  next();
}

// Middleware to require Property Manager (or Super Admin)
function requirePropertyManager(req, res, next) {
  const user = getUser(req);

  if (!user || (user.role !== 'property_manager' && user.role !== 'super_admin')) {
    return res.status(403).json({ error: 'Property Manager access required' });
  }

  next();
}

// Middleware to require Vendor (or Property Manager, or Super Admin)
function requireVendor(req, res, next) {
  const user = getUser(req);

  if (!user || (user.role !== 'vendor' && user.role !== 'property_manager' && user.role !== 'super_admin')) {
    return res.status(403).json({ error: 'Vendor access required' });
  }

  next();
}

// Middleware to require Property Owner (or Super Admin)
function requirePropertyOwner(req, res, next) {
  const user = getUser(req);

  if (!user || (user.role !== 'property_owner' && user.role !== 'super_admin')) {
    return res.status(403).json({ error: 'Property Owner access required' });
  }

  next();
}

// Check if user has specific permission
function checkPermission(permission) {
  return (req, res, next) => {
    const user = getUser(req);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Super Admin has all permissions
    if (user.role === 'super_admin') {
      return next();
    }

    // Check user's permissions object
    if (user.permissions && user.permissions[permission] === true) {
      return next();
    }

    return res.status(403).json({ error: `Permission denied: ${permission} required` });
  };
}

// Check if user has access to a specific property
function checkPropertyAccess(req, res, next) {
  const user = getUser(req);
  const propertyId = parseInt(req.params.propertyId || req.body.propertyId || req.query.propertyId);

  if (!propertyId) {
    return res.status(400).json({ error: 'Property ID required' });
  }

  // Super Admin has access to all properties
  if (user.role === 'super_admin') {
    return next();
  }

  // Property Manager: check if property is assigned
  if (user.role === 'property_manager') {
    if (user.assignedProperties && user.assignedProperties.includes(propertyId)) {
      return next();
    }
    return res.status(403).json({ error: 'Access denied to this property' });
  }

  // Vendor: check if vendor is assigned to property
  if (user.role === 'vendor') {
    const data = require('../data/mockData');
    const property = data.properties.find(p => p.id === propertyId);

    if (property && property.assignedVendors) {
      const hasAccess = property.assignedVendors.some(v => v.vendorId === user.id);
      if (hasAccess) {
        return next();
      }
    }
    return res.status(403).json({ error: 'Access denied to this property' });
  }

  return res.status(403).json({ error: 'Access denied' });
}

// Check if vendor has access to a specific property
function checkVendorAccess(req, res, next) {
  const user = getUser(req);
  const propertyId = parseInt(req.params.propertyId || req.body.propertyId || req.query.propertyId);

  if (!propertyId) {
    return res.status(400).json({ error: 'Property ID required' });
  }

  // Super Admin and Property Managers have access
  if (user.role === 'super_admin' || user.role === 'property_manager') {
    return next();
  }

  // Vendor: check if vendor is assigned to property
  if (user.role === 'vendor') {
    const data = require('../data/mockData');
    const property = data.properties.find(p => p.id === propertyId);

    if (property && property.assignedVendors) {
      const hasAccess = property.assignedVendors.some(v => v.vendorId === user.id);
      if (hasAccess) {
        return next();
      }
    }
    return res.status(403).json({ error: 'Vendor not assigned to this property' });
  }

  return res.status(403).json({ error: 'Access denied' });
}

// Generate invitation token
function generateInvitationToken() {
  return `inv_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
}

// Validate invitation token
function validateInvitationToken(token) {
  if (!token) return null;

  const data = require('../data/mockData');
  const user = data.users.find(u => u.invitationToken === token);

  if (!user) return null;

  // Check if invitation expired (7 days)
  if (user.invitationExpires) {
    const expires = new Date(user.invitationExpires).getTime();
    if (Date.now() > expires) {
      return null; // Expired
    }
  }

  return user;
}

// Create audit log entry
function createAuditLog(userId, action, resourceType, resourceId, details = {}, ipAddress = '127.0.0.1') {
  const data = require('../data/mockData');

  const auditLog = {
    id: data.nextAuditLogId,
    userId,
    action,
    resourceType,
    resourceId,
    details,
    timestamp: new Date().toISOString(),
    ipAddress
  };

  data.auditLogs.push(auditLog);
  data.nextAuditLogId = data.nextAuditLogId + 1;

  return auditLog;
}

module.exports = {
  generateToken,
  verifyToken,
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
};
