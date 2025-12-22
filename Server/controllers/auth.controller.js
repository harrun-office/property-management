const bcrypt = require('bcryptjs');
const data = require('../data/mockData');
const { generateToken, generateInvitationToken, validateInvitationToken, createAuditLog } = require('../middleware/auth');
const { getIpAddress } = require('../utils/helpers');

const { users } = data;

exports.login = async (req, res) => {
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
      mobileNumber: mobileNumber || null,
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
};

exports.validateInvitation = (req, res) => {
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
};

exports.acceptInvitation = async (req, res) => {
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
};

