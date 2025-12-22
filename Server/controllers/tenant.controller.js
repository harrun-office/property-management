const data = require('../data/mockData');
const { createAuditLog, getUser } = require('../middleware/auth');
const { getIpAddress } = require('../utils/helpers');

const { users, properties, applications, tenants, messages, payments, maintenanceRequests } = data;

// Get Dashboard
exports.getDashboard = (req, res) => {
  try {
    const user = getUser(req);
    if (user.role !== 'tenant') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get tenant's current property
    const currentProperty = properties.find(p => p.tenantId === user.id);
    
    // Upcoming payments
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const upcomingPayments = payments
      .filter(p => p.tenantId === user.id && p.status === 'pending' && new Date(p.dueDate) >= today && new Date(p.dueDate) <= nextMonth)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 3);

    // Unread messages
    const unreadMessages = messages.filter(m => 
      m.recipientId === user.id && !m.read
    ).length;

    // Pending maintenance requests
    const pendingMaintenance = maintenanceRequests.filter(mr => 
      mr.tenantId === user.id && (mr.status === 'open' || mr.status === 'in_progress')
    ).length;

    // Recent messages
    const recentMessages = messages
      .filter(m => m.tenantId === user.id || m.senderId === user.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(m => {
        const property = properties.find(p => p.id === m.propertyId);
        const sender = users.find(u => u.id === m.senderId);
        const recipient = users.find(u => u.id === m.recipientId);
        return {
          ...m,
          property: property ? { id: property.id, title: property.title } : null,
          sender: sender ? { id: sender.id, name: sender.name } : null,
          recipient: recipient ? { id: recipient.id, name: recipient.name } : null
        };
      });

    // Active maintenance requests
    const activeMaintenance = maintenanceRequests
      .filter(mr => mr.tenantId === user.id && (mr.status === 'open' || mr.status === 'in_progress'))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3)
      .map(mr => {
        const property = properties.find(p => p.id === mr.propertyId);
        return {
          ...mr,
          property: property ? { id: property.id, title: property.title } : null
        };
      });

    // Payment statistics
    const totalPaid = payments
      .filter(p => p.tenantId === user.id && p.status === 'paid')
      .reduce((sum, p) => sum + (p.amount || 0), 0);
    
    const pendingAmount = payments
      .filter(p => p.tenantId === user.id && p.status === 'pending')
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    res.json({
      metrics: {
        upcomingRent: upcomingPayments.length > 0 ? upcomingPayments[0].amount : 0,
        nextDueDate: upcomingPayments.length > 0 ? upcomingPayments[0].dueDate : null,
        unreadMessages,
        pendingMaintenance,
        totalPaid,
        pendingAmount
      },
      currentProperty: currentProperty ? {
        id: currentProperty.id,
        title: currentProperty.title,
        address: currentProperty.address,
        monthlyRent: currentProperty.monthlyRent
      } : null,
      upcomingPayments,
      recentMessages,
      activeMaintenance
    });
  } catch (error) {
    console.error('Error fetching tenant dashboard:', error);
    res.status(500).json({ error: 'Server error fetching dashboard' });
  }
};

// Get Payments
exports.getPayments = (req, res) => {
  try {
    const user = getUser(req);
    if (user.role !== 'tenant') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { status, startDate, endDate } = req.query;
    let tenantPayments = payments.filter(p => p.tenantId === user.id);

    if (status) {
      tenantPayments = tenantPayments.filter(p => p.status === status);
    }

    if (startDate) {
      tenantPayments = tenantPayments.filter(p => new Date(p.dueDate) >= new Date(startDate));
    }

    if (endDate) {
      tenantPayments = tenantPayments.filter(p => new Date(p.dueDate) <= new Date(endDate));
    }

    tenantPayments = tenantPayments
      .sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate))
      .map(p => {
        const property = properties.find(prop => prop.id === p.propertyId);
        return {
          ...p,
          property: property ? { id: property.id, title: property.title, address: property.address } : null
        };
      });

    res.json(tenantPayments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Server error fetching payments' });
  }
};

// Get Upcoming Payments
exports.getUpcomingPayments = (req, res) => {
  try {
    const user = getUser(req);
    if (user.role !== 'tenant') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const today = new Date();
    const upcoming = payments
      .filter(p => p.tenantId === user.id && p.status === 'pending' && new Date(p.dueDate) >= today)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .map(p => {
        const property = properties.find(prop => prop.id === p.propertyId);
        return {
          ...p,
          property: property ? { id: property.id, title: property.title } : null
        };
      });

    res.json(upcoming);
  } catch (error) {
    console.error('Error fetching upcoming payments:', error);
    res.status(500).json({ error: 'Server error fetching upcoming payments' });
  }
};

// Get Payment by ID
exports.getPaymentById = (req, res) => {
  try {
    const user = getUser(req);
    if (user.role !== 'tenant') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const paymentId = parseInt(req.params.id);
    const payment = payments.find(p => p.id === paymentId && p.tenantId === user.id);

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    const property = properties.find(p => p.id === payment.propertyId);
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
exports.getMessages = (req, res) => {
  try {
    const user = getUser(req);
    if (user.role !== 'tenant') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const tenantMessages = messages
      .filter(m => m.tenantId === user.id || m.senderId === user.id || m.recipientId === user.id)
      .map(m => {
        const property = properties.find(p => p.id === m.propertyId);
        const sender = users.find(u => u.id === m.senderId);
        const recipient = users.find(u => u.id === m.recipientId);
        return {
          ...m,
          property: property ? { id: property.id, title: property.title } : null,
          sender: sender ? { id: sender.id, name: sender.name, email: sender.email } : null,
          recipient: recipient ? { id: recipient.id, name: recipient.name, email: recipient.email } : null
        };
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(tenantMessages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Server error fetching messages' });
  }
};

// Get Message by ID
exports.getMessageById = (req, res) => {
  try {
    const user = getUser(req);
    if (user.role !== 'tenant') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const messageId = parseInt(req.params.id);
    const message = messages.find(m => m.id === messageId && (m.tenantId === user.id || m.senderId === user.id || m.recipientId === user.id));

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    const property = properties.find(p => p.id === message.propertyId);
    const sender = users.find(u => u.id === message.senderId);
    const recipient = users.find(u => u.id === message.recipientId);

    // Get thread messages
    const threadMessages = messages
      .filter(m => m.propertyId === message.propertyId && 
        (m.senderId === user.id || m.recipientId === user.id || m.senderId === message.senderId || m.recipientId === message.senderId))
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .map(m => {
        const s = users.find(u => u.id === m.senderId);
        const r = users.find(u => u.id === m.recipientId);
        return {
          ...m,
          sender: s ? { id: s.id, name: s.name, email: s.email } : null,
          recipient: r ? { id: r.id, name: r.name, email: r.email } : null
        };
      });

    res.json(threadMessages);
  } catch (error) {
    console.error('Error fetching message:', error);
    res.status(500).json({ error: 'Server error fetching message' });
  }
};

// Send Message
exports.sendMessage = (req, res) => {
  try {
    const user = getUser(req);
    if (user.role !== 'tenant') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { propertyId, recipientId, subject, message: messageText } = req.body;

    if (!propertyId || !recipientId || !messageText) {
      return res.status(400).json({ error: 'Property ID, recipient ID, and message are required' });
    }

    const property = properties.find(p => p.id === propertyId);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const newMessage = {
      id: data.nextMessageId,
      propertyId: parseInt(propertyId),
      tenantId: user.id,
      senderId: user.id,
      recipientId: parseInt(recipientId),
      subject: subject || 'Message about property',
      message: messageText,
      read: false,
      createdAt: new Date().toISOString()
    };

    messages.push(newMessage);
    data.nextMessageId = data.nextMessageId + 1;

    createAuditLog(user.id, 'send_message', 'message', newMessage.id, { propertyId, recipientId }, getIpAddress(req));

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Server error sending message' });
  }
};

// Mark Message as Read
exports.markMessageRead = (req, res) => {
  try {
    const user = getUser(req);
    if (user.role !== 'tenant') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const messageId = parseInt(req.params.id);
    const message = messages.find(m => m.id === messageId && (m.recipientId === user.id || m.senderId === user.id));

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    message.read = true;
    message.readAt = new Date().toISOString();

    res.json({ message: 'Message marked as read', message });
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ error: 'Server error marking message as read' });
  }
};

// Get Maintenance Requests
exports.getMaintenance = (req, res) => {
  try {
    const user = getUser(req);
    if (user.role !== 'tenant') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { status } = req.query;
    let tenantMaintenance = maintenanceRequests.filter(mr => mr.tenantId === user.id);

    if (status) {
      tenantMaintenance = tenantMaintenance.filter(mr => mr.status === status);
    }

    tenantMaintenance = tenantMaintenance
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(mr => {
        const property = properties.find(p => p.id === mr.propertyId);
        return {
          ...mr,
          property: property ? { id: property.id, title: property.title, address: property.address } : null
        };
      });

    res.json(tenantMaintenance);
  } catch (error) {
    console.error('Error fetching maintenance requests:', error);
    res.status(500).json({ error: 'Server error fetching maintenance requests' });
  }
};

// Create Maintenance Request
exports.createMaintenance = (req, res) => {
  try {
    const user = getUser(req);
    if (user.role !== 'tenant') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { propertyId, title, description, priority, photos } = req.body;

    if (!propertyId || !title || !description) {
      return res.status(400).json({ error: 'Property ID, title, and description are required' });
    }

    const property = properties.find(p => p.id === propertyId && p.tenantId === user.id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found or access denied' });
    }

    const newRequest = {
      id: data.nextMaintenanceRequestId,
      propertyId: parseInt(propertyId),
      tenantId: user.id,
      title,
      description,
      priority: priority || 'medium',
      status: 'open',
      photos: photos || [],
      notes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    maintenanceRequests.push(newRequest);
    data.nextMaintenanceRequestId = data.nextMaintenanceRequestId + 1;

    createAuditLog(user.id, 'create_maintenance_request', 'maintenance', newRequest.id, { propertyId, title }, getIpAddress(req));

    res.status(201).json(newRequest);
  } catch (error) {
    console.error('Error creating maintenance request:', error);
    res.status(500).json({ error: 'Server error creating maintenance request' });
  }
};

// Get Maintenance by ID
exports.getMaintenanceById = (req, res) => {
  try {
    const user = getUser(req);
    if (user.role !== 'tenant') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const requestId = parseInt(req.params.id);
    const request = maintenanceRequests.find(mr => mr.id === requestId && mr.tenantId === user.id);

    if (!request) {
      return res.status(404).json({ error: 'Maintenance request not found' });
    }

    const property = properties.find(p => p.id === request.propertyId);
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
exports.updateMaintenance = (req, res) => {
  try {
    const user = getUser(req);
    if (user.role !== 'tenant') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const requestId = parseInt(req.params.id);
    const request = maintenanceRequests.find(mr => mr.id === requestId && mr.tenantId === user.id);

    if (!request) {
      return res.status(404).json({ error: 'Maintenance request not found' });
    }

    const { note, photos } = req.body;

    if (note) {
      if (!request.notes) {
        request.notes = [];
      }
      request.notes.push({
        note,
        addedBy: user.id,
        addedAt: new Date().toISOString()
      });
    }

    if (photos && Array.isArray(photos)) {
      if (!request.photos) {
        request.photos = [];
      }
      request.photos = [...request.photos, ...photos];
    }

    request.updatedAt = new Date().toISOString();

    createAuditLog(user.id, 'update_maintenance_request', 'maintenance', requestId, { note: note ? 'Note added' : null, photos: photos ? photos.length : 0 }, getIpAddress(req));

    res.json(request);
  } catch (error) {
    console.error('Error updating maintenance request:', error);
    res.status(500).json({ error: 'Server error updating maintenance request' });
  }
};

// Get Current Property
exports.getCurrentProperty = (req, res) => {
  try {
    const user = getUser(req);
    if (user.role !== 'tenant') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const currentProperty = properties.find(p => p.tenantId === user.id);

    if (!currentProperty) {
      return res.json(null);
    }

    res.json({
      id: currentProperty.id,
      title: currentProperty.title,
      address: currentProperty.address,
      propertyType: currentProperty.propertyType,
      bedrooms: currentProperty.bedrooms,
      bathrooms: currentProperty.bathrooms,
      squareFeet: currentProperty.squareFeet,
      monthlyRent: currentProperty.monthlyRent,
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
exports.getLease = (req, res) => {
  try {
    const user = getUser(req);
    if (user.role !== 'tenant') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const currentProperty = properties.find(p => p.tenantId === user.id);

    if (!currentProperty) {
      return res.status(404).json({ error: 'No active lease found' });
    }

    const owner = users.find(u => u.id === currentProperty.ownerId);

    // Mock lease data - in real app, this would come from a leases table
    const lease = {
      id: 1,
      propertyId: currentProperty.id,
      tenantId: user.id,
      ownerId: currentProperty.ownerId,
      startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days ago
      endDate: new Date(Date.now() + 275 * 24 * 60 * 60 * 1000).toISOString(), // 275 days from now
      monthlyRent: currentProperty.monthlyRent,
      securityDeposit: currentProperty.monthlyRent * 1.5,
      status: 'active',
      terms: 'Standard lease agreement terms apply.',
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

// Get Documents
exports.getDocuments = (req, res) => {
  try {
    const user = getUser(req);
    if (user.role !== 'tenant') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const currentProperty = properties.find(p => p.tenantId === user.id);

    // Mock documents - in real app, this would come from a documents table
    const documents = [];

    // Add lease document if tenant has active property
    if (currentProperty) {
      documents.push({
        id: 1,
        type: 'lease',
        name: 'Lease Agreement',
        propertyId: currentProperty.id,
        url: `/documents/lease-${currentProperty.id}.pdf`,
        uploadedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
      });
    }

    // Add payment receipts
    const paidPayments = payments
      .filter(p => p.tenantId === user.id && p.status === 'paid')
      .slice(0, 5)
      .map((p, index) => ({
        id: 100 + index,
        type: 'receipt',
        name: `Payment Receipt - ${new Date(p.paidDate || p.dueDate).toLocaleDateString()}`,
        propertyId: p.propertyId,
        url: `/documents/receipt-${p.id}.pdf`,
        uploadedAt: p.paidDate || p.dueDate
      }));

    documents.push(...paidPayments);

    res.json(documents.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)));
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Server error fetching documents' });
  }
};

// Get Profile
exports.getProfile = (req, res) => {
  try {
    const user = getUser(req);
    if (user.role !== 'tenant') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      mobileNumber: user.mobileNumber,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Server error fetching profile' });
  }
};

// Update Profile
exports.updateProfile = (req, res) => {
  try {
    const user = getUser(req);
    if (user.role !== 'tenant') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { name, mobileNumber } = req.body;

    if (name) {
      user.name = name;
    }

    if (mobileNumber !== undefined) {
      user.mobileNumber = mobileNumber;
    }

    user.updatedAt = new Date().toISOString();

    createAuditLog(user.id, 'update_profile', 'user', user.id, { name, mobileNumber }, getIpAddress(req));

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      mobileNumber: user.mobileNumber,
      role: user.role,
      status: user.status
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Server error updating profile' });
  }
};

