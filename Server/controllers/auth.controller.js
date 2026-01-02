const bcrypt = require('bcryptjs');
// const data = require('../data/mockData'); // Deprecated
const User = require('../models/user.model');
const Tenant = require('../models/tenant.model');
const { generateToken, generateInvitationToken, validateInvitationToken, createAuditLog } = require('../middleware/auth');
const { getIpAddress } = require('../utils/helpers');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findByEmail(email);
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

    const token = generateToken(user.id, user.role);

    let hasActiveTenancy = false;
    if (user.role === 'tenant') {
      const activeTenancy = await Tenant.findActiveTenancy(user.id);
      hasActiveTenancy = !!activeTenancy;
    }

    // Audit log can be async, don't block
    createAuditLog(user.id, 'login', 'user', user.id, {}, getIpAddress(req));

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
        hasActiveTenancy,
        permissions: (typeof user.permissions === 'string' ? JSON.parse(user.permissions) : user.permissions) || {}
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
};

exports.register = async (req, res) => {
  try {
    const { email, password, name, role, mobileNumber } = req.body;

    if (!email || !password || !name || !role) {
      return res.status(400).json({ error: 'Email, password, name, and role are required' });
    }

    // Validate role
    const validRoles = ['tenant', 'property_owner', 'user'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Allowed roles: tenant, property_owner, user' });
    }

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Permissions Logic
    const permissions = role === 'tenant' ? {
      viewProperties: true,
      applyForProperties: true,
      viewApplications: true
    } : role === 'property_owner' ? {
      createProperties: true,
      manageOwnProperties: true,
      viewOwnProperties: true
    } : {
      viewProperties: true
    };

    const newUserObj = {
      email,
      password: hashedPassword,
      name,
      role,
      status: 'active',
      permissions
    };

    const newUser = await User.create(newUserObj);

    const token = generateToken(newUser.id, newUser.role);
    createAuditLog(newUser.id, 'register', 'user', newUser.id, { email, role }, getIpAddress(req));

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        status: newUser.status,
        permissions: newUser.permissions
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration', details: error.message, sqlMessage: error.sqlMessage });
  }
};

// ... Invitation logic requires DB schema for invitations (currently separate or tokens)
// For now, retaining basic structure but invites need DB table or User field update
exports.validateInvitation = (req, res) => {
  // TODO: implement DB-based invitation lookup
  res.status(501).json({ error: 'Invitation logic pending DB migration' });
};

exports.acceptInvitation = async (req, res) => {
  // TODO: implement DB-based invitation acceptance
  res.status(501).json({ error: 'Invitation logic pending DB migration' });
};

