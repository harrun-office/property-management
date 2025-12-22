const data = require('../data/mockData');
const { createAuditLog, getUser } = require('../middleware/auth');
const { getIpAddress } = require('../utils/helpers');

const { users, properties, applications, tenants, messages, viewingRequests, payments, maintenanceRequests, subscriptionPlans, managerSubscriptions, subscriptionPayments, serviceAgreements, managerReviews, managerProfiles } = data;

exports.getDashboard = (req, res) => {
  try {
    const user = getUser(req);
    const ownerProperties = properties.filter(p => p.ownerId === user.id);
    
    const totalProperties = ownerProperties.length;
    const activeProperties = ownerProperties.filter(p => p.status === 'active').length;
    const vacantProperties = ownerProperties.filter(p => p.status === 'active' && !p.tenantId).length;
    const maintenanceProperties = ownerProperties.filter(p => p.status === 'maintenance').length;
    
    const monthlyIncome = ownerProperties
      .filter(p => p.tenantId && p.monthlyRent)
      .reduce((sum, p) => sum + (p.monthlyRent || 0), 0);
    
    const occupiedProperties = ownerProperties.filter(p => p.tenantId).length;
    const occupancyRate = totalProperties > 0 ? Math.round((occupiedProperties / totalProperties) * 100) : 0;
    
    const pendingApplications = applications.filter(a => 
      ownerProperties.some(p => p.id === a.propertyId) && a.status === 'pending'
    ).length;
    
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const upcomingRentDue = payments.filter(p => {
      const dueDate = new Date(p.dueDate);
      return dueDate >= today && dueDate <= nextMonth && p.status === 'pending' &&
        ownerProperties.some(prop => prop.id === p.propertyId);
    }).length;
    
    const openMaintenanceRequests = maintenanceRequests.filter(mr =>
      ownerProperties.some(p => p.id === mr.propertyId) && 
      (mr.status === 'open' || mr.status === 'in_progress')
    ).length;
    
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
};

exports.getProperties = (req, res) => {
  try {
    const user = getUser(req);
    const { status, propertyType, search } = req.query;
    
    let ownerProperties = properties.filter(p => p.ownerId === user.id);
    
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
};

exports.createProperty = (req, res) => {
  try {
    const user = getUser(req);
    const {
      title, description, price, address, bedrooms, bathrooms, area,
      propertyType, images, amenities, petPolicy, utilities, yearBuilt,
      parking, leaseTerms, monthlyRent, securityDeposit, availableDate
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
};

exports.updateProperty = (req, res) => {
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
};

exports.deleteProperty = (req, res) => {
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
    
    if (property.tenantId) {
      return res.status(400).json({ error: 'Cannot delete property with active tenant' });
    }
    
    properties.splice(propertyIndex, 1);
    
    createAuditLog(user.id, 'delete_property', 'property', propertyId, {}, getIpAddress(req));
    
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error deleting property' });
  }
};

exports.updatePropertyStatus = (req, res) => {
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
};

exports.getApplications = (req, res) => {
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
};

exports.getApplicationById = (req, res) => {
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
};

exports.updateApplication = (req, res) => {
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
      
      if (status === 'approved') {
        property.tenantId = application.applicantId;
        property.status = 'rented';
        
        const newTenant = {
          id: data.nextTenantId,
          userId: application.applicantId,
          propertyId: property.id,
          leaseStartDate: new Date().toISOString(),
          leaseEndDate: null,
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
};

exports.addApplicationNote = (req, res) => {
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
};

exports.getTenants = (req, res) => {
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
};

exports.getTenantById = (req, res) => {
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
};

exports.getMessages = (req, res) => {
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
};

exports.getMessageById = (req, res) => {
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
};

exports.sendMessage = (req, res) => {
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
};

exports.markMessageRead = (req, res) => {
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
};

exports.getViewings = (req, res) => {
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
};

exports.updateViewing = (req, res) => {
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
};

exports.getPayments = (req, res) => {
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
};

exports.getPaymentSummary = (req, res) => {
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
};

exports.createPayment = (req, res) => {
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
};

exports.updatePayment = (req, res) => {
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
    
    if (status) payment.status = status;
    if (paidDate) payment.paidDate = paidDate;
    if (paymentMethod) payment.paymentMethod = paymentMethod;
    payment.updatedAt = new Date().toISOString();
    
    createAuditLog(user.id, 'update_payment', 'payment', paymentId, { status, paidDate }, getIpAddress(req));
    
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Server error updating payment' });
  }
};

exports.getIncomeReport = (req, res) => {
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
};

exports.getMonthlyReport = (req, res) => {
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
};

exports.getYearlyReport = (req, res) => {
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
};

exports.getPropertyPerformance = (req, res) => {
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
};

exports.getFinancialAnalytics = (req, res) => {
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
};

exports.getTenantAnalytics = (req, res) => {
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
};

exports.getMaintenance = (req, res) => {
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
};

exports.getMaintenanceById = (req, res) => {
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
};

exports.updateMaintenance = (req, res) => {
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
};

exports.addMaintenanceNote = (req, res) => {
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
};

// Get Available Managers for Subscription
exports.getAvailableManagers = (req, res) => {
  try {
    const user = getUser(req);
    const { rating, priceRange, search } = req.query;

    // Get all active property managers
    let managers = users.filter(u => u.role === 'property_manager' && u.status === 'active');

    // Enrich with profile data
    let enrichedManagers = managers.map(manager => {
      const profile = managerProfiles.find(p => p.managerId === manager.id);
      const reviews = managerReviews.filter(r => r.managerId === manager.id);
      const activeSubscriptions = managerSubscriptions.filter(s => s.managerId === manager.id && s.status === 'active');
      
      // Calculate average rating
      const avgRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

      return {
        id: manager.id,
        name: manager.name,
        email: manager.email,
        profile: profile || null,
        averageRating: Math.round(avgRating * 10) / 10,
        totalReviews: reviews.length,
        activeSubscriptions: activeSubscriptions.length,
        availablePlans: subscriptionPlans.filter(p => p.isActive),
        responseTime: profile?.responseTime || 'N/A',
        experience: profile?.experience || 0,
        specialties: profile?.specialties || [],
        location: profile?.location || 'N/A'
      };
    });

    // Filter by rating
    if (rating) {
      const minRating = parseFloat(rating);
      enrichedManagers = enrichedManagers.filter(m => m.averageRating >= minRating);
    }

    // Filter by price range
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      enrichedManagers = enrichedManagers.filter(m => {
        const minPlanPrice = Math.min(...m.availablePlans.map(p => p.price));
        return minPlanPrice >= min && minPlanPrice <= max;
      });
    }

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      enrichedManagers = enrichedManagers.filter(m =>
        m.name.toLowerCase().includes(searchLower) ||
        m.email.toLowerCase().includes(searchLower) ||
        (m.profile?.bio && m.profile.bio.toLowerCase().includes(searchLower))
      );
    }

    // Sort by rating (highest first)
    enrichedManagers.sort((a, b) => b.averageRating - a.averageRating);

    res.json(enrichedManagers);
  } catch (error) {
    console.error('Error fetching available managers:', error);
    res.status(500).json({ error: 'Server error fetching available managers' });
  }
};

// Get Manager by ID
exports.getManagerById = (req, res) => {
  try {
    const managerId = parseInt(req.params.id);
    const manager = users.find(u => u.id === managerId && u.role === 'property_manager');

    if (!manager) {
      return res.status(404).json({ error: 'Manager not found' });
    }

    const profile = managerProfiles.find(p => p.managerId === manager.id);
    const reviews = managerReviews.filter(r => r.managerId === manager.id);
    const activeSubscriptions = managerSubscriptions.filter(s => s.managerId === manager.id && s.status === 'active');
    
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    res.json({
      id: manager.id,
      name: manager.name,
      email: manager.email,
      profile: profile || null,
      averageRating: Math.round(avgRating * 10) / 10,
      totalReviews: reviews.length,
      reviews: reviews.slice(0, 10), // Latest 10 reviews
      activeSubscriptions: activeSubscriptions.length,
      availablePlans: subscriptionPlans.filter(p => p.isActive),
      responseTime: profile?.responseTime || 'N/A',
      experience: profile?.experience || 0,
      specialties: profile?.specialties || [],
      location: profile?.location || 'N/A',
      certifications: profile?.certifications || [],
      languages: profile?.languages || []
    });
  } catch (error) {
    console.error('Error fetching manager:', error);
    res.status(500).json({ error: 'Server error fetching manager' });
  }
};

// Get Owner's Subscriptions
exports.getMySubscriptions = (req, res) => {
  try {
    const user = getUser(req);
    const subscriptions = managerSubscriptions.filter(s => s.ownerId === user.id);

    const enrichedSubscriptions = subscriptions.map(sub => {
      const manager = users.find(u => u.id === sub.managerId);
      const property = properties.find(p => p.id === sub.propertyId);
      const plan = subscriptionPlans.find(p => p.id === sub.planId);
      const agreement = serviceAgreements.find(a => a.subscriptionId === sub.id);
      const payments = subscriptionPayments.filter(p => p.subscriptionId === sub.id);
      const nextPayment = subscriptionPayments.find(p => p.subscriptionId === sub.id && p.status === 'pending');

      return {
        ...sub,
        manager: manager ? { id: manager.id, name: manager.name, email: manager.email } : null,
        property: property ? { id: property.id, title: property.title, address: property.address } : null,
        plan: plan || null,
        agreement: agreement || null,
        paymentHistory: payments,
        nextPayment: nextPayment || null
      };
    });

    res.json(enrichedSubscriptions);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({ error: 'Server error fetching subscriptions' });
  }
};

// Subscribe to Manager
exports.subscribeToManager = (req, res) => {
  try {
    const user = getUser(req);
    const { managerId, propertyId, planId, paymentMethod } = req.body;

    if (!managerId || !propertyId || !planId) {
      return res.status(400).json({ error: 'Manager ID, Property ID, and Plan ID are required' });
    }

    // Validate manager
    const manager = users.find(u => u.id === parseInt(managerId) && u.role === 'property_manager' && u.status === 'active');
    if (!manager) {
      return res.status(404).json({ error: 'Manager not found or not available' });
    }

    // Validate property belongs to owner
    const property = properties.find(p => p.id === parseInt(propertyId) && p.ownerId === user.id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found or access denied' });
    }

    // Validate plan
    const plan = subscriptionPlans.find(p => p.id === parseInt(planId) && p.isActive);
    if (!plan) {
      return res.status(404).json({ error: 'Subscription plan not found' });
    }

    // Check if property already has active subscription
    const existingSubscription = managerSubscriptions.find(
      s => s.propertyId === parseInt(propertyId) && s.status === 'active'
    );
    if (existingSubscription) {
      return res.status(400).json({ error: 'Property already has an active subscription' });
    }

    // Create subscription
    const newSubscription = {
      id: data.nextManagerSubscriptionId,
      ownerId: user.id,
      managerId: parseInt(managerId),
      propertyId: parseInt(propertyId),
      planId: parseInt(planId),
      status: 'active',
      startDate: new Date().toISOString(),
      endDate: null,
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      monthlyFee: plan.price,
      setupFee: 0,
      autoRenew: true,
      cancelledAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    managerSubscriptions.push(newSubscription);
    data.nextManagerSubscriptionId = data.nextManagerSubscriptionId + 1;

    // Create first payment
    const firstPayment = {
      id: data.nextSubscriptionPaymentId,
      subscriptionId: newSubscription.id,
      amount: plan.price,
      status: 'paid',
      dueDate: new Date().toISOString(),
      paidDate: new Date().toISOString(),
      paymentMethod: paymentMethod || 'credit_card',
      transactionId: `txn_${Date.now()}`,
      receiptUrl: `/receipts/subscription_${newSubscription.id}_payment_${data.nextSubscriptionPaymentId}.pdf`,
      createdAt: new Date().toISOString()
    };

    subscriptionPayments.push(firstPayment);
    data.nextSubscriptionPaymentId = data.nextSubscriptionPaymentId + 1;

    // Create next payment (for next month)
    const nextPayment = {
      id: data.nextSubscriptionPaymentId,
      subscriptionId: newSubscription.id,
      amount: plan.price,
      status: 'pending',
      dueDate: newSubscription.nextBillingDate,
      paidDate: null,
      paymentMethod: paymentMethod || 'credit_card',
      transactionId: null,
      receiptUrl: null,
      createdAt: new Date().toISOString()
    };

    subscriptionPayments.push(nextPayment);
    data.nextSubscriptionPaymentId = data.nextSubscriptionPaymentId + 1;

    // Create service agreement
    const newAgreement = {
      id: data.nextServiceAgreementId,
      subscriptionId: newSubscription.id,
      ownerId: user.id,
      managerId: parseInt(managerId),
      propertyId: parseInt(propertyId),
      services: plan.features,
      commissionRate: 0,
      terms: `This agreement covers ${plan.name} services. The subscription fee is $${plan.price}/month per property. Either party may cancel with 30 days notice.`,
      status: 'active',
      signedDate: new Date().toISOString(),
      signedByOwner: true,
      signedByManager: false, // Manager will sign during onboarding
      agreementUrl: `/agreements/subscription_${newSubscription.id}_agreement.pdf`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    serviceAgreements.push(newAgreement);
    data.nextServiceAgreementId = data.nextServiceAgreementId + 1;

    // Assign manager to property
    property.assignedManagerId = parseInt(managerId);
    property.updatedAt = new Date().toISOString();

    createAuditLog(user.id, 'subscribe_to_manager', 'subscription', newSubscription.id, { managerId, propertyId, planId }, getIpAddress(req));

    res.status(201).json({
      subscription: newSubscription,
      payment: firstPayment,
      agreement: newAgreement
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ error: 'Server error creating subscription: ' + error.message });
  }
};

// Update Subscription
exports.updateSubscription = (req, res) => {
  try {
    const user = getUser(req);
    const subscriptionId = parseInt(req.params.id);
    const subscription = managerSubscriptions.find(s => s.id === subscriptionId && s.ownerId === user.id);

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    const { planId, autoRenew } = req.body;

    if (planId) {
      const newPlan = subscriptionPlans.find(p => p.id === parseInt(planId) && p.isActive);
      if (!newPlan) {
        return res.status(404).json({ error: 'Plan not found' });
      }

      // Update plan and fee
      subscription.planId = parseInt(planId);
      subscription.monthlyFee = newPlan.price;
      
      // Update service agreement
      const agreement = serviceAgreements.find(a => a.subscriptionId === subscription.id);
      if (agreement) {
        agreement.services = newPlan.features;
        agreement.updatedAt = new Date().toISOString();
      }
    }

    if (autoRenew !== undefined) {
      subscription.autoRenew = autoRenew;
    }

    subscription.updatedAt = new Date().toISOString();

    createAuditLog(user.id, 'update_subscription', 'subscription', subscriptionId, { planId, autoRenew }, getIpAddress(req));

    res.json(subscription);
  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({ error: 'Server error updating subscription' });
  }
};

// Cancel Subscription
exports.cancelSubscription = (req, res) => {
  try {
    const user = getUser(req);
    const subscriptionId = parseInt(req.params.id);
    const subscription = managerSubscriptions.find(s => s.id === subscriptionId && s.ownerId === user.id);

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    if (subscription.status === 'cancelled') {
      return res.status(400).json({ error: 'Subscription already cancelled' });
    }

    // Set cancellation date (30 days notice)
    subscription.status = 'cancelled';
    subscription.cancelledAt = new Date().toISOString();
    subscription.endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days from now
    subscription.updatedAt = new Date().toISOString();

    // Update service agreement
    const agreement = serviceAgreements.find(a => a.subscriptionId === subscription.id);
    if (agreement) {
      agreement.status = 'cancelled';
      agreement.updatedAt = new Date().toISOString();
    }

    createAuditLog(user.id, 'cancel_subscription', 'subscription', subscriptionId, {}, getIpAddress(req));

    res.json({ message: 'Subscription cancelled successfully', subscription });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({ error: 'Server error cancelling subscription' });
  }
};

// Get Subscription Payments
exports.getSubscriptionPayments = (req, res) => {
  try {
    const user = getUser(req);
    const subscriptionId = parseInt(req.params.id);
    const subscription = managerSubscriptions.find(s => s.id === subscriptionId && s.ownerId === user.id);

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    const payments = subscriptionPayments
      .filter(p => p.subscriptionId === subscriptionId)
      .sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));

    res.json(payments);
  } catch (error) {
    console.error('Error fetching subscription payments:', error);
    res.status(500).json({ error: 'Server error fetching subscription payments' });
  }
};

// Pay Subscription
exports.paySubscription = (req, res) => {
  try {
    const user = getUser(req);
    const subscriptionId = parseInt(req.params.id);
    const subscription = managerSubscriptions.find(s => s.id === subscriptionId && s.ownerId === user.id);

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    const { paymentMethod } = req.body;

    // Find pending payment
    const pendingPayment = subscriptionPayments.find(
      p => p.subscriptionId === subscriptionId && p.status === 'pending'
    );

    if (!pendingPayment) {
      return res.status(400).json({ error: 'No pending payment found' });
    }

    // Process payment
    pendingPayment.status = 'paid';
    pendingPayment.paidDate = new Date().toISOString();
    pendingPayment.paymentMethod = paymentMethod || 'credit_card';
    pendingPayment.transactionId = `txn_${Date.now()}`;
    pendingPayment.receiptUrl = `/receipts/subscription_${subscriptionId}_payment_${pendingPayment.id}.pdf`;

    // Update next billing date
    subscription.nextBillingDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    subscription.updatedAt = new Date().toISOString();

    // Create next payment
    const nextPayment = {
      id: data.nextSubscriptionPaymentId,
      subscriptionId: subscriptionId,
      amount: subscription.monthlyFee,
      status: 'pending',
      dueDate: subscription.nextBillingDate,
      paidDate: null,
      paymentMethod: paymentMethod || 'credit_card',
      transactionId: null,
      receiptUrl: null,
      createdAt: new Date().toISOString()
    };

    subscriptionPayments.push(nextPayment);
    data.nextSubscriptionPaymentId = data.nextSubscriptionPaymentId + 1;

    createAuditLog(user.id, 'pay_subscription', 'subscription', subscriptionId, { paymentId: pendingPayment.id }, getIpAddress(req));

    res.json({ payment: pendingPayment, nextPayment });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ error: 'Server error processing payment' });
  }
};

// Get Service Agreement
exports.getServiceAgreement = (req, res) => {
  try {
    const user = getUser(req);
    const subscriptionId = parseInt(req.params.id);
    const subscription = managerSubscriptions.find(s => s.id === subscriptionId && s.ownerId === user.id);

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    const agreement = serviceAgreements.find(a => a.subscriptionId === subscriptionId);
    if (!agreement) {
      return res.status(404).json({ error: 'Service agreement not found' });
    }

    const plan = subscriptionPlans.find(p => p.id === subscription.planId);
    const manager = users.find(u => u.id === subscription.managerId);
    const property = properties.find(p => p.id === subscription.propertyId);

    res.json({
      ...agreement,
      plan: plan || null,
      manager: manager ? { id: manager.id, name: manager.name, email: manager.email } : null,
      property: property ? { id: property.id, title: property.title, address: property.address } : null
    });
  } catch (error) {
    console.error('Error fetching service agreement:', error);
    res.status(500).json({ error: 'Server error fetching service agreement' });
  }
};

// Submit Manager Review
exports.submitManagerReview = (req, res) => {
  try {
    const user = getUser(req);
    const subscriptionId = parseInt(req.params.id);
    const subscription = managerSubscriptions.find(s => s.id === subscriptionId && s.ownerId === user.id);

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    const { rating, review } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Check if owner already reviewed this subscription
    const existingReview = managerReviews.find(
      r => r.subscriptionId === subscriptionId && r.ownerId === user.id
    );

    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this manager' });
    }

    const newReview = {
      id: data.nextManagerReviewId,
      managerId: subscription.managerId,
      ownerId: user.id,
      subscriptionId: subscriptionId,
      rating: parseInt(rating),
      review: review || '',
      createdAt: new Date().toISOString()
    };

    managerReviews.push(newReview);
    data.nextManagerReviewId = data.nextManagerReviewId + 1;

    // Update manager profile average rating
    const managerProfile = managerProfiles.find(p => p.managerId === subscription.managerId);
    if (managerProfile) {
      const allReviews = managerReviews.filter(r => r.managerId === subscription.managerId);
      const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
      managerProfile.averageRating = Math.round(avgRating * 10) / 10;
      managerProfile.totalReviews = allReviews.length;
    }

    createAuditLog(user.id, 'submit_manager_review', 'review', newReview.id, { managerId: subscription.managerId, rating }, getIpAddress(req));

    res.status(201).json(newReview);
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ error: 'Server error submitting review' });
  }
};

