const data = require('../data/mockData');
const { generateInvitationToken, createAuditLog, getUser } = require('../middleware/auth');
const { getIpAddress } = require('../utils/helpers');

const { users, properties, vendors, tasks, managerSubscriptions, subscriptionPlans, subscriptionPayments, serviceAgreements, managerReviews, managerProfiles } = data;

exports.getProperties = (req, res) => {
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
};

exports.createVendor = async (req, res) => {
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
};

exports.getVendors = (req, res) => {
  try {
    const user = getUser(req);
    let managerVendors = [];

    if (user.role === 'super_admin') {
      managerVendors = vendors;
    } else {
      managerVendors = vendors.filter(v => {
        const vendorUser = users.find(u => u.id === v.userId);
        return vendorUser && vendorUser.invitedBy === user.id;
      });
    }

    res.json(managerVendors);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching vendors' });
  }
};

exports.updateVendor = (req, res) => {
  try {
    const vendorId = parseInt(req.params.id);
    const vendor = vendors.find(v => v.id === vendorId);

    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    const user = getUser(req);
    const vendorUser = users.find(u => u.id === vendor.userId);

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
};

exports.assignVendorToProperty = (req, res) => {
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

    if (!vendor.assignedProperties.includes(propertyId)) {
      vendor.assignedProperties.push(propertyId);
    }

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
};

exports.createTask = (req, res) => {
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
};

exports.getTasks = (req, res) => {
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
};

exports.updateTask = (req, res) => {
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
};

exports.getReports = (req, res) => {
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
};

// Get Manager's Subscriptions
exports.getMySubscriptions = (req, res) => {
  try {
    const user = getUser(req);
    const subscriptions = managerSubscriptions.filter(s => s.managerId === user.id);

    const enrichedSubscriptions = subscriptions.map(sub => {
      const owner = users.find(u => u.id === sub.ownerId);
      const property = properties.find(p => p.id === sub.propertyId);
      const plan = subscriptionPlans.find(p => p.id === sub.planId);
      const agreement = serviceAgreements.find(a => a.subscriptionId === sub.id);
      const payments = subscriptionPayments.filter(p => p.subscriptionId === sub.id && p.status === 'paid');

      return {
        ...sub,
        owner: owner ? { id: owner.id, name: owner.name, email: owner.email, mobileNumber: owner.mobileNumber } : null,
        property: property ? { id: property.id, title: property.title, address: property.address } : null,
        plan: plan || null,
        agreement: agreement || null,
        totalRevenue: payments.reduce((sum, p) => sum + p.amount, 0),
        paymentsReceived: payments.length
      };
    });

    res.json(enrichedSubscriptions);
  } catch (error) {
    console.error('Error fetching manager subscriptions:', error);
    res.status(500).json({ error: 'Server error fetching subscriptions' });
  }
};

// Get Subscription Details
exports.getSubscriptionDetails = (req, res) => {
  try {
    const user = getUser(req);
    const subscriptionId = parseInt(req.params.id);
    const subscription = managerSubscriptions.find(s => s.id === subscriptionId && s.managerId === user.id);

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    const owner = users.find(u => u.id === subscription.ownerId);
    const property = properties.find(p => p.id === subscription.propertyId);
    const plan = subscriptionPlans.find(p => p.id === subscription.planId);
    const agreement = serviceAgreements.find(a => a.subscriptionId === subscription.id);
    const payments = subscriptionPayments.filter(p => p.subscriptionId === subscription.id);
    const reviews = managerReviews.filter(r => r.subscriptionId === subscription.id);

    res.json({
      subscription,
      owner: owner ? { id: owner.id, name: owner.name, email: owner.email, mobileNumber: owner.mobileNumber } : null,
      property: property || null,
      plan: plan || null,
      agreement: agreement || null,
      payments,
      reviews
    });
  } catch (error) {
    console.error('Error fetching subscription details:', error);
    res.status(500).json({ error: 'Server error fetching subscription details' });
  }
};

// Initiate Contact with Owner
exports.initiateContact = (req, res) => {
  try {
    const user = getUser(req);
    const subscriptionId = parseInt(req.params.id);
    const subscription = managerSubscriptions.find(s => s.id === subscriptionId && s.managerId === user.id);

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    const { message, contactMethod } = req.body;
    const owner = users.find(u => u.id === subscription.ownerId);

    if (!owner) {
      return res.status(404).json({ error: 'Owner not found' });
    }

    // Create a message/notification record (using messages array)
    const contactRecord = {
      id: data.nextMessageId || 100,
      propertyId: subscription.propertyId,
      senderId: user.id,
      recipientId: owner.id,
      subject: 'Manager Contact - Property Management Onboarding',
      message: message || `Hello ${owner.name}, I'm ${user.name}, your assigned property manager. I'd like to schedule a time to discuss property management services for your property. Please let me know your availability.`,
      read: false,
      createdAt: new Date().toISOString()
    };

    if (!data.messages) {
      data.messages = [];
    }
    data.messages.push(contactRecord);
    if (data.nextMessageId) {
      data.nextMessageId = data.nextMessageId + 1;
    }

    createAuditLog(user.id, 'initiate_owner_contact', 'subscription', subscriptionId, { ownerId: owner.id, contactMethod }, getIpAddress(req));

    res.json({
      message: 'Contact initiated successfully',
      contactRecord,
      owner: { id: owner.id, name: owner.name, email: owner.email, mobileNumber: owner.mobileNumber }
    });
  } catch (error) {
    console.error('Error initiating contact:', error);
    res.status(500).json({ error: 'Server error initiating contact' });
  }
};

// Upload Property Details
exports.uploadPropertyDetails = (req, res) => {
  try {
    const user = getUser(req);
    const subscriptionId = parseInt(req.params.id);
    const subscription = managerSubscriptions.find(s => s.id === subscriptionId && s.managerId === user.id);

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    const property = properties.find(p => p.id === subscription.propertyId);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const { details, documentation } = req.body;

    // Update property with manager-uploaded details
    if (details) {
      Object.assign(property, details);
    }

    property.updatedAt = new Date().toISOString();

    // Update service agreement if manager signs
    const agreement = serviceAgreements.find(a => a.subscriptionId === subscription.id);
    if (agreement && !agreement.signedByManager) {
      agreement.signedByManager = true;
      agreement.updatedAt = new Date().toISOString();
    }

    createAuditLog(user.id, 'upload_property_details', 'subscription', subscriptionId, { propertyId: property.id }, getIpAddress(req));

    res.json({
      message: 'Property details uploaded successfully',
      property
    });
  } catch (error) {
    console.error('Error uploading property details:', error);
    res.status(500).json({ error: 'Server error uploading property details' });
  }
};

// Get Subscription Revenue
exports.getSubscriptionRevenue = (req, res) => {
  try {
    const user = getUser(req);
    const { startDate, endDate } = req.query;

    let payments = subscriptionPayments.filter(
      p => {
        const sub = managerSubscriptions.find(s => s.id === p.subscriptionId && s.managerId === user.id);
        return sub && p.status === 'paid';
      }
    );

    if (startDate) {
      payments = payments.filter(p => new Date(p.paidDate) >= new Date(startDate));
    }

    if (endDate) {
      payments = payments.filter(p => new Date(p.paidDate) <= new Date(endDate));
    }

    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
    const monthlyRevenue = payments.reduce((acc, p) => {
      const month = new Date(p.paidDate).toISOString().substring(0, 7); // YYYY-MM
      acc[month] = (acc[month] || 0) + p.amount;
      return acc;
    }, {});

    res.json({
      totalRevenue,
      paymentCount: payments.length,
      monthlyRevenue,
      payments: payments.sort((a, b) => new Date(b.paidDate) - new Date(a.paidDate))
    });
  } catch (error) {
    console.error('Error fetching subscription revenue:', error);
    res.status(500).json({ error: 'Server error fetching subscription revenue' });
  }
};

// Get Owner Reviews
exports.getOwnerReviews = (req, res) => {
  try {
    const user = getUser(req);
    const reviews = managerReviews.filter(r => r.managerId === user.id);

    const enrichedReviews = reviews.map(review => {
      const owner = users.find(u => u.id === review.ownerId);
      const subscription = managerSubscriptions.find(s => s.id === review.subscriptionId);
      const property = subscription ? properties.find(p => p.id === subscription.propertyId) : null;

      return {
        ...review,
        owner: owner ? { id: owner.id, name: owner.name } : null,
        property: property ? { id: property.id, title: property.title } : null
      };
    });

    const averageRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    res.json({
      reviews: enrichedReviews,
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: reviews.length
    });
  } catch (error) {
    console.error('Error fetching owner reviews:', error);
    res.status(500).json({ error: 'Server error fetching reviews' });
  }
};

