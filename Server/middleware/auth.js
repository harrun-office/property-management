// Authentication and authorization middleware for hierarchical RBAC system

const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Property = require('../models/property.model');

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

// Get user from request (DB version)
// Note: This is now just a helper or we can allow it to return promise
// BUT synchronous middlewares rely on req.user being set by authenticate()
// So we won't export a sync getUser anymore.
async function fetchUserById(userId) {
  return await User.findById(userId);
}

// Middleware to check authentication
async function authenticate(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '') || req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  req.userId = decoded.userId;
  req.userRole = decoded.role; // Token role

  try {
    const user = await fetchUserById(req.userId);

    if (!user || user.status !== 'active') {
      return res.status(401).json({ error: 'User account is not active' });
    }

    // Ensure the role in token matches current user role
    if (user.role !== decoded.role) {
      req.userRole = user.role;
    }

    req.user = user; // Attach full user object to request
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Middleware to require Super Admin
function requireSuperAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'super_admin') {
    return res.status(403).json({ error: 'Super Admin access required' });
  }
  next();
}

// Middleware to require Property Manager
function requirePropertyManager(req, res, next) {
  if (!req.user || (req.user.role !== 'property_manager' && req.user.role !== 'super_admin')) {
    return res.status(403).json({ error: 'Property Manager access required' });
  }
  next();
}

// Middleware to require Vendor
function requireVendor(req, res, next) {
  if (!req.user || (req.user.role !== 'vendor' && req.user.role !== 'property_manager' && req.user.role !== 'super_admin')) {
    return res.status(403).json({ error: 'Vendor access required' });
  }
  next();
}

// Middleware to require Property Owner
function requirePropertyOwner(req, res, next) {
  if (!req.user || (req.user.role !== 'property_owner' && req.user.role !== 'super_admin')) {
    return res.status(403).json({ error: 'Property Owner access required' });
  }
  next();
}

// Middleware to require Tenant
function requireTenant(req, res, next) {
  if (!req.user || (req.user.role !== 'tenant' && req.user.role !== 'super_admin')) {
    return res.status(403).json({ error: 'Tenant access required' });
  }
  next();
}

const { ROLE_PERMISSIONS } = require('../config/permissions');

// Check if user has specific permission
function checkPermission(permission) {
  return (req, res, next) => {
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'User not authenticated' });

    if (user.role === 'super_admin') return next();

    if (ROLE_PERMISSIONS[user.role] && ROLE_PERMISSIONS[user.role].includes(permission)) {
      return next();
    }

    // Check user.permissions JSON (Database stores it as JSON)
    // Note: Database driver usually deserializes JSON columns automatically.
    // If not, we might need JSON.parse(user.permissions). Assuming 'mysql2' does handle it or model does.
    const userPerms = typeof user.permissions === 'string' ? JSON.parse(user.permissions) : user.permissions;

    if (userPerms && userPerms[permission] === true) {
      return next();
    }

    return res.status(403).json({ error: `Permission denied: ${permission} required` });
  };
}

// Check if user has access to a specific property
async function checkPropertyAccess(req, res, next) {
  const user = req.user;
  const propertyId = parseInt(req.params.propertyId || req.body.propertyId || req.query.propertyId);

  if (!propertyId) {
    // If no property ID pending, we cannot check.
    // Some routes might not require it, but if this middleware is used, it implies requirement.
    return res.status(400).json({ error: 'Property ID required' });
  }

  if (user.role === 'super_admin') return next();

  try {
    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ error: 'Property not found' });

    if (user.role === 'property_manager') {
      // Check if manager is assigned (Primary or Secondary)
      // Current DB model returns assignedManagerId (primary) and assignedManagers array (secondary)
      const isPrimary = property.assignedManagerId === user.id;
      const isSecondary = property.assignedManagers && property.assignedManagers.includes(user.id);

      // Also check user's assignedProperties list (from Users table/mock)
      // In DB, this relationship is in property_managers table.
      // For now, trust the Property's loaded relationship data.
      if (isPrimary || isSecondary) {
        return next();
      }
      return res.status(403).json({ error: 'Access denied to this property' });
    }

    if (user.role === 'vendor') {
      const hasAccess = property.assignedVendors && property.assignedVendors.some(v => v.vendorId === user.id);
      if (hasAccess) return next();
      return res.status(403).json({ error: 'Access denied to this property' });
    }

    // Owner Check
    if (user.role === 'property_owner') {
      if (property.ownerId === user.id) return next();
      return res.status(403).json({ error: 'Access denied to this property' });
    }

    // Tenant Check (optional, but good to have)
    if (user.role === 'tenant') {
      if (property.tenantId === user.id) return next();
      return res.status(403).json({ error: 'Access denied to this property' });
    }

    return res.status(403).json({ error: 'Access denied' });
  } catch (err) {
    console.error('CheckPropertyAccess Error:', err);
    return res.status(500).json({ error: 'Server error checking access' });
  }
}

// Check if vendor has access to a specific property (Specific for Vendor Routes)
async function checkVendorAccess(req, res, next) {
  // Logic is largely same as checkPropertyAccess but scoped for Vendor
  return checkPropertyAccess(req, res, next);
}

// Invitation helpers - Stubbed or need DB
function generateInvitationToken() {
  return `inv_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
}

// Stub for now or needs a lookup if invites stored in DB users table
function validateInvitationToken(token) {
  // Logic requires finding user by token.
  // We can't do sync DB lookup here.
  // This function is mainly used in auth controller, so it should be async there.
  return null;
}

// Secure Audit Logging
const crypto = require('crypto');
const sql = require('../config/db'); // Need direct sql for hash chain lookup

const createAuditLog = async (userId, action, resourceType, resourceId, details = {}, ipAddress = '127.0.0.1', req = null) => {
  try {
    const userAgent = req ? req.headers['user-agent'] : 'system';

    // 1. Fetch Previous Hash for Chaining
    const [lastLog] = await sql.query('SELECT hash FROM audit_logs ORDER BY id DESC LIMIT 1');
    const previousHash = lastLog.length > 0 ? lastLog[0].hash : 'GENESIS_HASH';

    // 2. Calculate New Hash
    const timestamp = new Date().toISOString();
    const dataToHash = `${previousHash}|${userId}|${action}|${resourceType}|${resourceId}|${JSON.stringify(details)}|${timestamp}`;
    const hash = crypto.createHash('sha256').update(dataToHash).digest('hex');

    // 3. Insert
    const query = `INSERT INTO audit_logs 
                       (user_id, action, resource_type, resource_id, details, ip_address, user_agent, hash, timestamp) 
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    await sql.query(query, [
      userId,
      action,
      resourceType,
      String(resourceId),
      JSON.stringify(details),
      ipAddress,
      userAgent,
      hash,
      timestamp
    ]);

    console.log(`[AUDIT] ${action} logged for User ${userId} (Hash: ${hash.substring(0, 8)}...)`);
  } catch (err) {
    console.error('Audit Log Failure:', err);
    // In high-security, we might want to throw error to fail the transaction, 
    // but for now we log error to avoid crashing user flow if log db is busy.
  }
};

// Helper to get user (Legacy support if needed, but prefer req.user)
function getUser(req) {
  return req.user;
}

module.exports = {
  generateToken,
  verifyToken,
  authenticate,
  requireSuperAdmin,
  requirePropertyManager,
  requireVendor,
  requirePropertyOwner,
  requireTenant,
  checkPermission,
  checkPropertyAccess,
  checkVendorAccess,
  generateInvitationToken,
  validateInvitationToken,
  createAuditLog,
  getUser
};
