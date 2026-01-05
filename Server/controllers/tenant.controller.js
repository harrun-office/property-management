// const data = require('../data/mockData'); // Deprecated
const User = require('../models/user.model');
const Property = require('../models/property.model');
const MaintenanceRequest = require('../models/maintenanceRequest.model');
const Payment = require('../models/payment.model');
const Message = require('../models/message.model');
const Tenant = require('../models/tenant.model');
const { createAuditLog, getUser } = require('../middleware/auth');
const { getIpAddress } = require('../utils/helpers');

// Get Dashboard
exports.getDashboard = async (req, res) => {
  try {
    const user = getUser(req);
    // RBAC check usually done in middleware, but double check here if needed
    if (user.role !== 'tenant') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get tenant's current property via Tenant model (Lease)
    const tenantRecord = await Tenant.findByUserId(user.id);
    let currentProperty = null;
    if (tenantRecord) {
      currentProperty = await Property.findById(tenantRecord.property_id);
    }

    // Upcoming payments
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    // Fetch all payments for this tenant
    const allPayments = await Payment.findAllByTenant(user.id);
    const upcomingPayments = allPayments
      .filter(p => p.status === 'pending' && new Date(p.due_date) >= today && new Date(p.due_date) <= nextMonth)
      .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
      .slice(0, 3);

    // Unread messages
    // Messages where recipient is user and !read
    const allMessages = await Message.findByUser(user.id);
    const unreadMessages = allMessages.filter(m =>
      m.recipient_id === user.id && !m.is_read
    ).length;

    // Pending maintenance requests
    const allMaintenance = await MaintenanceRequest.findAllByTenant(user.id);
    const pendingMaintenance = allMaintenance.filter(mr =>
      (mr.status === 'open' || mr.status === 'in_progress')
    ).length;

    // Recent messages
    const recentMessages = await Promise.all(allMessages
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5)
      .map(async m => {
        const property = await Property.findById(m.property_id);
        const sender = await User.findById(m.sender_id);
        const recipient = await User.findById(m.recipient_id);
        return {
          ...m,
          property: property ? { id: property.id, title: property.title } : null,
          sender: sender ? { id: sender.id, name: sender.name } : null,
          recipient: recipient ? { id: recipient.id, name: recipient.name } : null
        };
      }));

    // Active maintenance requests
    const activeMaintenanceDesc = await Promise.all(allMaintenance
      .filter(mr => (mr.status === 'open' || mr.status === 'in_progress'))
      .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)) // Check schema for created_at
      .slice(0, 3)
      .map(async mr => {
        const property = await Property.findById(mr.property_id);
        return {
          ...mr,
          property: property ? { id: property.id, title: property.title } : null
        };
      }));

    // Payment statistics
    const totalPaid = allPayments
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);

    const pendingAmount = allPayments
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);

    res.json({
      metrics: {
        upcomingRent: upcomingPayments.length > 0 ? upcomingPayments[0].amount : 0,
        nextDueDate: upcomingPayments.length > 0 ? upcomingPayments[0].due_date : null,
        unreadMessages,
        pendingMaintenance,
        totalPaid,
        pendingAmount
      },
      currentProperty: currentProperty ? {
        id: currentProperty.id,
        title: currentProperty.title,
        address: currentProperty.address,
        monthlyRent: tenantRecord ? tenantRecord.monthly_rent : currentProperty.price // Use tenant rent or property price fallback
      } : null,
      upcomingPayments,
      recentMessages,
      activeMaintenance: activeMaintenanceDesc
    });
  } catch (error) {
    console.error('Error fetching tenant dashboard:', error);
    res.status(500).json({ error: 'Server error fetching dashboard' });
  }
};

// Get Payments
exports.getPayments = async (req, res) => {
  try {
    const user = getUser(req);
    const { status, startDate, endDate } = req.query;
    let tenantPayments = await Payment.findAllByTenant(user.id);

    if (status) {
      tenantPayments = tenantPayments.filter(p => p.status === status);
    }

    if (startDate) {
      tenantPayments = tenantPayments.filter(p => new Date(p.due_date) >= new Date(startDate));
    }

    if (endDate) {
      tenantPayments = tenantPayments.filter(p => new Date(p.due_date) <= new Date(endDate));
    }

    const detailedPayments = await Promise.all(tenantPayments
      .sort((a, b) => new Date(b.due_date) - new Date(a.due_date))
      .map(async p => {
        const property = await Property.findById(p.property_id);
        return {
          ...p,
          property: property ? { id: property.id, title: property.title, address: property.address } : null
        };
      }));

    res.json(detailedPayments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Server error fetching payments' });
  }
};

// Get Upcoming Payments
exports.getUpcomingPayments = async (req, res) => {
  try {
    const user = getUser(req);
    const today = new Date();
    const allPayments = await Payment.findAllByTenant(user.id);

    const upcoming = await Promise.all(allPayments
      .filter(p => p.status === 'pending' && new Date(p.due_date) >= today)
      .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
      .map(async p => {
        const property = await Property.findById(p.property_id);
        return {
          ...p,
          property: property ? { id: property.id, title: property.title } : null
        };
      }));

    res.json(upcoming);
  } catch (error) {
    console.error('Error fetching upcoming payments:', error);
    res.status(500).json({ error: 'Server error fetching upcoming payments' });
  }
};

// Get Payment by ID
exports.getPaymentById = async (req, res) => {
  try {
    const user = getUser(req);
    const paymentId = parseInt(req.params.id);
    const payment = await Payment.findById(paymentId);

    if (!payment || payment.tenant_id !== user.id) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    const property = await Property.findById(payment.property_id);
    res.json({
      ...payment,
      property: property ? { id: property.id, title: property.title, address: property.address } : null
    });
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({ error: 'Server error fetching payment' });
  }
};

// Get Messages
exports.getMessages = async (req, res) => {
  try {
    const user = getUser(req);
    const allMessages = await Message.findByUser(user.id);

    const detailedMessages = await Promise.all(allMessages
      .map(async m => {
        const property = await Property.findById(m.property_id);
        const sender = await User.findById(m.sender_id);
        const recipient = await User.findById(m.recipient_id);
        return {
          ...m,
          property: property ? { id: property.id, title: property.title } : null,
          sender: sender ? { id: sender.id, name: sender.name, email: sender.email } : null,
          recipient: recipient ? { id: recipient.id, name: recipient.name, email: recipient.email } : null
        };
      }));

    res.json(detailedMessages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Server error fetching messages' });
  }
};

// Get Message by ID
exports.getMessageById = async (req, res) => {
  try {
    const user = getUser(req);
    const messageId = parseInt(req.params.id);
    const message = await Message.findById(messageId);

    if (!message || (message.tenant_id !== user.id && message.sender_id !== user.id && message.recipient_id !== user.id)) {
      // Note: message model doesn't have 'tenant_id', just sender/recipient. Logic:
      if (!message || (message.sender_id !== user.id && message.recipient_id !== user.id)) {
        return res.status(404).json({ error: 'Message not found' });
      }
    }

    // Get thread? Filter by property and participants.
    // Simplifying to just return single message with details for now, or thread logic if feasible.
    // Tenant usually sees thread.
    const allUserMessages = await Message.findByUser(user.id);
    const threadMessages = allUserMessages.filter(m => m.property_id === message.property_id &&
      (m.sender_id === message.sender_id || m.recipient_id === message.sender_id || m.sender_id === message.recipient_id || m.recipient_id === message.recipient_id) // rough thread logic
    ).sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    const detailedThread = await Promise.all(threadMessages.map(async m => {
      const s = await User.findById(m.sender_id);
      const r = await User.findById(m.recipient_id);
      return {
        ...m,
        sender: s ? { id: s.id, name: s.name, email: s.email } : null,
        recipient: r ? { id: r.id, name: r.name, email: r.email } : null
      };
    }));

    res.json(detailedThread);
  } catch (error) {
    console.error('Error fetching message:', error);
    res.status(500).json({ error: 'Server error fetching message' });
  }
};

// Send Message
exports.sendMessage = async (req, res) => {
  try {
    const user = getUser(req);
    const { propertyId, recipientId, subject, message: messageText } = req.body;

    if (!propertyId || !recipientId || !messageText) {
      return res.status(400).json({ error: 'Property ID, recipient ID, and message are required' });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const newMessage = await Message.create({
      propertyId: parseInt(propertyId),
      senderId: user.id,
      recipientId: parseInt(recipientId),
      subject: subject || 'Message about property',
      message: messageText,
      read: false
    });

    createAuditLog(user.id, 'send_message', 'message', newMessage.id, { propertyId, recipientId }, getIpAddress(req));

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Server error sending message' });
  }
};

// Mark Message as Read
exports.markMessageRead = async (req, res) => {
  try {
    const user = getUser(req);
    const messageId = parseInt(req.params.id);
    const message = await Message.findById(messageId);

    if (!message || message.recipient_id !== user.id) { // Only recipient can mark as read
      return res.status(404).json({ error: 'Message not found' });
    }

    await Message.markAsRead(messageId);
    // Fetch updated
    const updated = await Message.findById(messageId);

    res.json({ message: 'Message marked as read', message: updated });
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ error: 'Server error marking message as read' });
  }
};

// Get Maintenance Requests
exports.getMaintenance = async (req, res) => {
  try {
    const user = getUser(req);
    const { status } = req.query;
    let tenantMaintenance = await MaintenanceRequest.findAllByTenant(user.id);

    if (status) {
      tenantMaintenance = tenantMaintenance.filter(mr => mr.status === status);
    }

    const detailedMaintenance = await Promise.all(tenantMaintenance
      .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
      .map(async mr => {
        const property = await Property.findById(mr.property_id);
        return {
          ...mr,
          property: property ? { id: property.id, title: property.title, address: property.address } : null
        };
      }));

    res.json(detailedMaintenance);
  } catch (error) {
    console.error('Error fetching maintenance requests:', error);
    res.status(500).json({ error: 'Server error fetching maintenance requests' });
  }
};

// Create Maintenance Request
exports.createMaintenance = async (req, res) => {
  try {
    const user = getUser(req);
    const { propertyId, title, description, priority, photos } = req.body;

    if (!propertyId || !title || !description) {
      return res.status(400).json({ error: 'Property ID, title, and description are required' });
    }

    const property = await Property.findById(propertyId);
    // Verify tenant access?
    const tenantRecord = await Tenant.findByUserId(user.id);
    if (!property || !tenantRecord || tenantRecord.property_id !== parseInt(propertyId)) {
      return res.status(403).json({ error: 'Access denied to this property' });
    }

    const newRequest = await MaintenanceRequest.create({
      propertyId: parseInt(propertyId),
      tenantId: user.id,
      title,
      description,
      priority: priority || 'medium',
      status: 'open',
      photos: photos || [],
      notes: []
    });

    createAuditLog(user.id, 'create_maintenance_request', 'maintenance', newRequest.id, { propertyId, title }, getIpAddress(req));

    res.status(201).json(newRequest);
  } catch (error) {
    console.error('Error creating maintenance request:', error);
    res.status(500).json({ error: 'Server error creating maintenance request' });
  }
};

// Get Maintenance by ID
exports.getMaintenanceById = async (req, res) => {
  try {
    const user = getUser(req);
    const requestId = parseInt(req.params.id);
    const request = await MaintenanceRequest.findById(requestId);

    if (!request || request.tenant_id !== user.id) {
      return res.status(404).json({ error: 'Maintenance request not found' });
    }

    const property = await Property.findById(request.property_id);
    res.json({
      ...request,
      property: property ? { id: property.id, title: property.title, address: property.address } : null
    });
  } catch (error) {
    console.error('Error fetching maintenance request:', error);
    res.status(500).json({ error: 'Server error fetching maintenance request' });
  }
};

// Update Maintenance Request
exports.updateMaintenance = async (req, res) => {
  try {
    const user = getUser(req);
    const requestId = parseInt(req.params.id);
    const request = await MaintenanceRequest.findById(requestId);

    if (!request || request.tenant_id !== user.id) {
      return res.status(404).json({ error: 'Maintenance request not found' });
    }

    const { note, photos } = req.body;

    // Construct updates. Note: Model.update expects object mapping to columns or handling JSON internally.
    // My MaintenanceRequest.update in previous step handled 'notes' and 'photos' updates.

    let notes = request.notes ? ((typeof request.notes === 'string') ? JSON.parse(request.notes) : request.notes) : [];
    if (note) {
      notes.push({
        note,
        addedBy: user.id,
        addedAt: new Date().toISOString()
      });
    }

    let existingPhotos = request.photos ? ((typeof request.photos === 'string') ? JSON.parse(request.photos) : request.photos) : [];
    if (photos && Array.isArray(photos)) {
      existingPhotos = [...existingPhotos, ...photos];
    }

    await MaintenanceRequest.update(requestId, {
      notes: notes,
      photos: existingPhotos
    });

    const updatedRequest = await MaintenanceRequest.findById(requestId);

    createAuditLog(user.id, 'update_maintenance_request', 'maintenance', requestId, { note: note ? 'Note added' : null, photos: photos ? photos.length : 0 }, getIpAddress(req));

    res.json(updatedRequest);
  } catch (error) {
    console.error('Error updating maintenance request:', error);
    res.status(500).json({ error: 'Server error updating maintenance request' });
  }
};

// Get Current Property
exports.getCurrentProperty = async (req, res) => {
  try {
    const user = getUser(req);
    const tenantRecord = await Tenant.findByUserId(user.id);

    if (!tenantRecord) return res.json(null);

    const currentProperty = await Property.findById(tenantRecord.property_id);
    if (!currentProperty) return res.json(null);

    res.json({
      id: currentProperty.id,
      title: currentProperty.title,
      address: currentProperty.address,
      propertyType: currentProperty.property_type,
      bedrooms: currentProperty.bedrooms,
      bathrooms: currentProperty.bathrooms,
      squareFeet: currentProperty.area_sqft,
      monthlyRent: tenantRecord.monthly_rent, // Specific to tenant
      status: currentProperty.status,
      images: currentProperty.images,
      amenities: currentProperty.amenities,
      description: currentProperty.description
    });
  } catch (error) {
    console.error('Error fetching current property:', error);
    res.status(500).json({ error: 'Server error fetching current property' });
  }
};

// Get Lease Information
exports.getLease = async (req, res) => {
  try {
    const user = getUser(req);
    const tenantRecord = await Tenant.findByUserId(user.id);

    if (!tenantRecord) {
      return res.status(404).json({ error: 'No active lease found' });
    }

    const currentProperty = await Property.findById(tenantRecord.property_id);
    const owner = await User.findById(currentProperty.owner_id);

    const lease = {
      id: tenantRecord.id,
      propertyId: tenantRecord.property_id,
      tenantId: user.id,
      ownerId: currentProperty.owner_id,
      startDate: tenantRecord.lease_start_date,
      endDate: tenantRecord.lease_end_date,
      monthlyRent: tenantRecord.monthly_rent,
      securityDeposit: tenantRecord.security_deposit,
      status: tenantRecord.status,
      terms: 'Standard lease agreement terms apply.', // Placeholder or fetch from doc?
      property: {
        id: currentProperty.id,
        title: currentProperty.title,
        address: currentProperty.address
      },
      owner: owner ? {
        id: owner.id,
        name: owner.name,
        email: owner.email
      } : null
    };

    res.json(lease);
  } catch (error) {
    console.error('Error fetching lease:', error);
    res.status(500).json({ error: 'Server error fetching lease' });
  }
};

// Get Documents - Placeholder/Stub as Document model not created yet
exports.getDocuments = async (req, res) => {
  try {
    const user = getUser(req);
    const documents = [];
    // Return empty for now to avoid breaking UI
    res.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Server error fetching documents' });
  }
};

// Get Profile
exports.getProfile = async (req, res) => {
  try {
    const user = getUser(req);
    // Fetch fresh user data?
    const freshUser = await User.findById(user.id);
    res.json({
      id: freshUser.id,
      name: freshUser.name,
      email: freshUser.email,
      mobileNumber: freshUser.phone, // Mapped to 'phone' in schema?
      role: freshUser.role,
      status: freshUser.status,
      createdAt: freshUser.created_at
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Server error fetching profile' });
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const user = getUser(req);
    const { name, mobileNumber } = req.body;

    // User.update method? Need to check if I implemented it.
    // Auth controller might have it. Or I use direct SQL if not sure.
    // Let's use SQL for safety here.
    const sql = require('../config/db');
    const params = [];
    let query = 'UPDATE users SET updated_at = NOW()';
    if (name) { query += ', name = ?'; params.push(name); }
    if (mobileNumber) { query += ', phone = ?'; params.push(mobileNumber); }

    query += ' WHERE id = ?';
    params.push(user.id);

    await sql.query(query, params);

    const updatedUser = await User.findById(user.id);
    createAuditLog(user.id, 'update_profile', 'user', user.id, { name, mobileNumber }, getIpAddress(req));

    res.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      mobileNumber: updatedUser.phone,
      role: updatedUser.role,
      status: updatedUser.status
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Server error updating profile' });
  }
};


// Get Saved Properties
exports.getSavedProperties = async (req, res) => {
  try {
    const user = getUser(req);
    // Join with properties table
    const query = `
            SELECT p.*, sp.saved_at
            FROM saved_properties sp
            JOIN properties p ON sp.property_id = p.id
            WHERE sp.user_id = ?
            ORDER BY sp.saved_at DESC
        `;
    const [rows] = await require('../config/db').query(query, [user.id]);

    // Map images if needed (assuming properties table has JSON images)
    const mappedRows = rows.map(row => ({
      ...row,
      images: typeof row.images === 'string' ? JSON.parse(row.images) : row.images,
      amenities: typeof row.amenities === 'string' ? JSON.parse(row.amenities) : row.amenities
    }));

    res.json(mappedRows);
  } catch (error) {
    console.error('Error fetching saved properties:', error);
    res.status(500).json({ error: 'Server error fetching saved properties' });
  }
};

// Save Property
exports.saveProperty = async (req, res) => {
  try {
    const user = getUser(req);
    const { propertyId } = req.body;

    if (!propertyId) return res.status(400).json({ error: 'Property ID required' });

    await require('../config/db').query(
      'INSERT IGNORE INTO saved_properties (user_id, property_id) VALUES (?, ?)',
      [user.id, propertyId]
    );

    res.json({ message: 'Property saved successfully' });
  } catch (error) {
    console.error('Error saving property:', error);
    res.status(500).json({ error: 'Server error saving property' });
  }
};

// Unsave Property
exports.unsaveProperty = async (req, res) => {
  try {
    const user = getUser(req);
    const propertyId = req.params.id;

    await require('../config/db').query(
      'DELETE FROM saved_properties WHERE user_id = ? AND property_id = ?',
      [user.id, propertyId]
    );

    res.json({ message: 'Property removed from saved' });
  } catch (error) {
    console.error('Error unsaving property:', error);
    res.status(500).json({ error: 'Server error removing saved property' });
  }
};

// Get My Applications
exports.getMyApplications = async (req, res) => {
  try {
    const user = getUser(req);

    const query = `
            SELECT ra.*, p.title as property_title, p.address as property_address, p.price, p.bedrooms, p.bathrooms, p.monthly_rent
            FROM applications ra
            JOIN properties p ON ra.property_id = p.id
            WHERE ra.applicant_id = ?
            ORDER BY ra.created_at DESC
        `;
    const [rows] = await require('../config/db').query(query, [user.id]);

    // Format for frontend
    const applications = rows.map(app => ({
      id: app.id,
      status: app.status,
      createdAt: app.created_at,
      message: app.notes ? (typeof app.notes === 'string' ? JSON.parse(app.notes) : app.notes) : null,
      property: {
        id: app.property_id,
        title: app.property_title,
        address: app.property_address,
        price: app.monthly_rent || app.price,
        bedrooms: app.bedrooms,
        bathrooms: app.bathrooms
      }
    }));

    res.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Server error fetching applications' });
  }
};
