// const data = require('../data/mockData'); // Deprecated
const User = require('../models/user.model');
const Property = require('../models/property.model');
const MaintenanceRequest = require('../models/maintenanceRequest.model');
const Application = require('../models/application.model');
const Payment = require('../models/payment.model');
const AssignmentService = require('../services/assignment.service');
const { createAuditLog } = require('../middleware/auth');
const { getIpAddress } = require('../utils/helpers');
const sql = require('../config/db'); // Added for direct DB interaction where models are not yet fully implemented

// Helper to get user from request
const getUser = (req) => req.user;

exports.getDashboard = async (req, res) => {
  try {
    const user = getUser(req);
    // Fetch all properties for owner - In real DB, we should have Property.findByOwner(id)
    const allProps = await Property.findAll();
    const ownerProperties = allProps.filter(p => p.owner_id === user.id); // Optimized query preferred in Model

    const totalProperties = ownerProperties.length;
    const activeProperties = ownerProperties.filter(p => p.status === 'active').length;
    // Vacant means active but no tenant (tenant_id is null)
    const vacantProperties = ownerProperties.filter(p => p.status === 'active' && !p.tenant_id).length;
    const maintenanceProperties = ownerProperties.filter(p => p.status === 'maintenance').length;

    // Monthly Income calculation (sum of rent of properties with tenants)
    const monthlyIncome = ownerProperties
      .filter(p => p.tenant_id && p.price) // In DB it might be 'price' or 'monthly_rent' depending on mapping. Model uses 'price' as mapping for 'monthlyRent'? No, Model maps DB columns.
      // Schema says 'price' is DECIMAL. Let's assume price is rent for simplicity.
      .reduce((sum, p) => sum + Number(p.price || 0), 0);

    const occupiedProperties = ownerProperties.filter(p => p.tenant_id).length;
    const occupancyRate = totalProperties > 0 ? Math.round((occupiedProperties / totalProperties) * 100) : 0;

    // Pending Applications
    const allApps = await Application.findAll();
    const pendingApplications = allApps.filter(a =>
      ownerProperties.some(p => p.id === a.property_id) && a.status === 'pending'
    ).length;

    // Upcoming Rent Due
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    // Payments: Fetch all? Too heavy. Should be filtered by DB.
    // For Migration Step 1: Filter in logic.
    const allPayments = await Payment.findAll();
    const upcomingRentDue = allPayments.filter(p => {
      const dueDate = new Date(p.due_date);
      return dueDate >= today && dueDate <= nextMonth && p.status === 'pending' &&
        ownerProperties.some(prop => prop.id === p.property_id);
    }).length;

    // Open Maintenance Requests
    const allMaintenance = await MaintenanceRequest.findAll();
    const openMaintenanceRequests = allMaintenance.filter(mr =>
      ownerProperties.some(p => p.id === mr.property_id) &&
      (mr.status === 'open' || mr.status === 'in_progress')
    ).length;

    // Recent Activity (Aggregated)
    const recentActivity = [
      ...allApps.filter(a => ownerProperties.some(p => p.id === a.property_id))
        .map(a => ({ type: 'application', id: a.id, message: `New application for property ${a.property_id}`, timestamp: a.created_at || new Date().toISOString() })), // DB might optionally have created_at
      // Messages skipped for now as Message Model not created yet
      ...allMaintenance.filter(mr => ownerProperties.some(p => p.id === mr.property_id))
        .map(mr => ({ type: 'maintenance', id: mr.id, message: `Maintenance request for property ${mr.property_id}`, timestamp: mr.created_at || new Date().toISOString() }))
    ]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10);

    const topProperties = ownerProperties
      .map(p => ({
        id: p.id,
        title: p.title,
        address: p.address,
        status: p.status,
        monthlyRent: p.price || 0,
        views: p.views || 0,
        inquiries: allApps.filter(a => a.property_id === p.id).length,
        applications: allApps.filter(a => a.property_id === p.id && a.status === 'pending').length
      }))
      .slice(0, 5); // Sort logic skipped for brevity, just slice

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
    console.error(error);
    res.status(500).json({ error: 'Server error fetching dashboard data' });
  }
};

exports.getProperties = async (req, res) => {
  try {
    const user = getUser(req);
    const { status, propertyType, search } = req.query;

    const allProps = await Property.findAll();
    let ownerProperties = allProps.filter(p => p.owner_id === user.id);

    if (status) {
      ownerProperties = ownerProperties.filter(p => p.status === status);
    }
    if (propertyType) {
      ownerProperties = ownerProperties.filter(p => p.property_type === propertyType);
    }
    if (search) {
      const searchLower = search.toLowerCase();
      ownerProperties = ownerProperties.filter(p =>
        (p.title && p.title.toLowerCase().includes(searchLower)) ||
        (p.address && p.address.toLowerCase().includes(searchLower)) ||
        (p.description && p.description.toLowerCase().includes(searchLower))
      );
    }

    // Stats - Fetch Applications count
    // Optimally: JOIN query. Here: Separate fetch.
    const allApps = await Application.findAll(); // Caching or specialized count query preferable

    const propertiesWithStats = ownerProperties.map(p => ({
      ...p,
      views: p.views || 0,
      inquiries: allApps.filter(a => a.property_id === p.id).length,
      applications: allApps.filter(a => a.property_id === p.id).length,
      pendingApplications: allApps.filter(a => a.property_id === p.id && a.status === 'pending').length
    }));

    res.json(propertiesWithStats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching properties' });
  }
};

exports.createProperty = async (req, res) => {
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

    // Create Property in DB
    // Current Model implementation assumes simple INSERT.
    // Fields must match schema logic or Model constructor.
    // Let's rely on Model if it existed fully, or basic SQL query in loop.

    // We haven't fully implemented `Property.create` in a reusable way in previous step?
    // Let's implement itinline or assume it's added. `Property.create` helper doesn't exist in my previous artifact for `property.model.js`.
    // I need to add it or use raw SQL here.

    const query = `INSERT INTO properties (
        owner_id, title, description, price, address, property_type, status, 
        bedrooms, bathrooms, area_sqft, images, amenities, pet_policy, utilities, year_built,
        parking_spaces, lease_terms, monthly_rent, security_deposit, available_date, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;

    // Note: Schema mapping required. 
    const [result] = await sql.query(query, [
      user.id, title, description, price, address, propertyType || 'apartment', 'active',
      bedrooms || 0, bathrooms || 0, area || 0,
      JSON.stringify(images || []), JSON.stringify(amenities || []),
      petPolicy || 'not_allowed', JSON.stringify(utilities || []), yearBuilt || null,
      parking || 0, leaseTerms || '12 months', monthlyRent ? parseFloat(monthlyRent) : null,
      securityDeposit ? parseFloat(securityDeposit) : null, availableDate || null
    ]);

    const newPropertyId = result.insertId;
    const createdProperty = await Property.findById(newPropertyId); // Re-fetch

    createAuditLog(user.id, 'create_property', 'property', newPropertyId, { title, address }, getIpAddress(req));

    // Auto-Assignment Logic (Stubbed call to Service which likely needs DB refactor too)
    // Assuming AssignmentService returns just IDs, we can update DB.
    // For now, let's keep it safe: Log only if Service fails.
    // Determine city from address (Simple split for mock)
    const city = address.split(',')[1]?.trim() || 'New York'; // Fallback for mock

    try {
      const assignmentResult = await AssignmentService.assignManager(newPropertyId, city, propertyType || 'apartment');
      // Update property in DB with assigned manager and status
      await sql.query('UPDATE properties SET assigned_manager_id = ?, status = ? WHERE id = ?', [assignmentResult.manager.id, assignmentResult.property.status, newPropertyId]);

      console.log(`Auto-assigned Manager ${assignmentResult.manager.name} to Property ${newPropertyId}`);
      createAuditLog(user.id, 'auto_assign_manager', 'property', newPropertyId, { managerId: assignmentResult.manager.id }, getIpAddress(req));

    } catch (assignError) {
      console.warn(`Auto-assignment failed for Property ${newPropertyId}: ${assignError.message}`);

      // Failure Handling: Admin Notification Only
      createAuditLog(
        user.id,
        'AUTO_ASSIGNMENT_FAILED',
        'property',
        newPropertyId,
        {
          reason: assignError.message,
          actionRequired: 'Manual Assignment by Admin'
        },
        getIpAddress(req)
      );
      // Do not fail the request; just leave Unassigned
    }

    res.status(201).json(createdProperty);
  } catch (error) {
    console.error("Error creating property:", error);
    res.status(500).json({ error: 'Server error creating property' });
  }
};

exports.updateProperty = async (req, res) => {
  try {
    const user = getUser(req);
    const propertyId = parseInt(req.params.id);
    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    if (property.owner_id !== user.id) {
      return res.status(403).json({ error: 'Access denied to this property' });
    }

    const allowedFields = [
      'title', 'description', 'price', 'address', 'bedrooms', 'bathrooms', 'area',
      'propertyType', 'images', 'amenities', 'petPolicy', 'utilities', 'yearBuilt',
      'parking', 'leaseTerms', 'monthlyRent', 'securityDeposit', 'availableDate'
    ];

    const updateFields = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        // Map request body field names to DB column names
        let dbFieldName = field;
        if (field === 'propertyType') dbFieldName = 'property_type';
        else if (field === 'yearBuilt') dbFieldName = 'year_built';
        else if (field === 'parking') dbFieldName = 'parking_spaces';
        else if (field === 'leaseTerms') dbFieldName = 'lease_terms';
        else if (field === 'monthlyRent') dbFieldName = 'monthly_rent';
        else if (field === 'securityDeposit') dbFieldName = 'security_deposit';
        else if (field === 'availableDate') dbFieldName = 'available_date';
        else if (field === 'area') dbFieldName = 'area_sqft';
        else if (field === 'petPolicy') dbFieldName = 'pet_policy';
        else if (field === 'images' || field === 'amenities' || field === 'utilities') {
          updateFields[dbFieldName] = JSON.stringify(req.body[field]);
          return;
        }

        if (['price', 'bedrooms', 'area', 'parking', 'monthlyRent', 'securityDeposit'].includes(field)) {
          updateFields[dbFieldName] = parseInt(req.body[field]);
        } else if (field === 'bathrooms') {
          updateFields[dbFieldName] = parseFloat(req.body[field]);
        } else {
          updateFields[dbFieldName] = req.body[field];
        }
      }
    });

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    const setClauses = Object.keys(updateFields).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updateFields);

    await sql.query(`UPDATE properties SET ${setClauses}, updated_at = NOW() WHERE id = ?`, [...values, propertyId]);
    const updatedProperty = await Property.findById(propertyId); // Re-fetch updated property

    createAuditLog(user.id, 'update_property', 'property', propertyId, req.body, getIpAddress(req));
    res.json(updatedProperty);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error updating property' });
  }
};

exports.deleteProperty = async (req, res) => {
  try {
    const user = getUser(req);
    const propertyId = parseInt(req.params.id);
    const property = await Property.findById(propertyId);

    if (!property) return res.status(404).json({ error: 'Property not found' });
    if (property.owner_id !== user.id) return res.status(403).json({ error: 'Access denied' });
    if (property.tenant_id) return res.status(400).json({ error: 'Cannot delete property with active tenant' });

    await sql.query('DELETE FROM properties WHERE id = ?', [propertyId]);

    createAuditLog(user.id, 'delete_property', 'property', propertyId, {}, getIpAddress(req));
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error deleting property' });
  }
};


exports.getApplications = async (req, res) => {
  try {
    const user = getUser(req);
    const allProps = await Property.findAll();
    const ownerPropIds = allProps.filter(p => p.owner_id === user.id).map(p => p.id);

    if (ownerPropIds.length === 0) return res.json([]);

    // Manual query for "IN" clause
    const [apps] = await sql.query(`SELECT * FROM applications WHERE property_id IN (?)`, [ownerPropIds]);

    // Fetch related property and applicant details
    const applicationsWithDetails = await Promise.all(apps.map(async (app) => {
      const property = await Property.findById(app.property_id);
      const applicant = await User.findById(app.applicant_id); // Assuming User model has findById
      return {
        ...app,
        property: property ? { id: property.id, title: property.title, address: property.address } : null,
        applicant: applicant ? { id: applicant.id, name: applicant.name, email: applicant.email } : null
      };
    }));

    res.json(applicationsWithDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching applications' });
  }
};

exports.getApplicationById = async (req, res) => {
  try {
    const user = getUser(req);
    const applicationId = parseInt(req.params.id);
    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const property = await Property.findById(application.property_id);
    if (!property || property.owner_id !== user.id) {
      return res.status(403).json({ error: 'Access denied to this application' });
    }

    const applicant = await User.findById(application.applicant_id);

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
    console.error(error);
    res.status(500).json({ error: 'Server error fetching application' });
  }
};

exports.updateApplication = async (req, res) => {
  try {
    const user = getUser(req);
    const applicationId = parseInt(req.params.id);
    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const property = await Property.findById(application.property_id);
    if (!property || property.owner_id !== user.id) {
      return res.status(403).json({ error: 'Access denied to this application' });
    }

    const { status, notes } = req.body;
    const updateFields = {};

    if (status && !['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    if (status) {
      updateFields.status = status;
      if (status === 'approved') {
        // Update property tenant_id and status
        await sql.query('UPDATE properties SET tenant_id = ?, status = ?, updated_at = NOW() WHERE id = ?', [application.applicant_id, 'rented', property.id]);

        // Create new tenant entry
        await sql.query(`INSERT INTO tenants (user_id, property_id, lease_start_date, monthly_rent, status, created_at, updated_at)
                         VALUES (?, ?, NOW(), ?, ?, NOW(), NOW())`,
          [application.applicant_id, property.id, property.price, 'active']); // Assuming property.price is monthly rent
      }
    }

    if (notes) {
      let currentNotes = application.notes ? JSON.parse(application.notes) : [];
      currentNotes.push({
        note: notes,
        addedBy: user.id,
        addedAt: new Date().toISOString()
      });
      updateFields.notes = JSON.stringify(currentNotes);
    }

    if (Object.keys(updateFields).length > 0) {
      const setClauses = Object.keys(updateFields).map(key => `${key} = ?`).join(', ');
      const values = Object.values(updateFields);
      await sql.query(`UPDATE applications SET ${setClauses}, updated_at = NOW() WHERE id = ?`, [...values, applicationId]);
    }

    const updatedApplication = await Application.findById(applicationId); // Re-fetch
    createAuditLog(user.id, 'update_application', 'application', applicationId, { status, notes }, getIpAddress(req));

    res.json(updatedApplication);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error updating application' });
  }
};

exports.addApplicationNote = async (req, res) => {
  try {
    const user = getUser(req);
    const applicationId = parseInt(req.params.id);
    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const property = await Property.findById(application.property_id);
    if (!property || property.owner_id !== user.id) {
      return res.status(403).json({ error: 'Access denied to this application' });
    }

    const { note } = req.body;
    if (!note) {
      return res.status(400).json({ error: 'Note is required' });
    }

    let currentNotes = application.notes ? JSON.parse(application.notes) : [];
    currentNotes.push({
      note,
      addedBy: user.id,
      addedAt: new Date().toISOString()
    });

    await sql.query('UPDATE applications SET notes = ?, updated_at = NOW() WHERE id = ?', [JSON.stringify(currentNotes), applicationId]);
    const updatedApplication = await Application.findById(applicationId); // Re-fetch

    createAuditLog(user.id, 'add_application_note', 'application', applicationId, { note }, getIpAddress(req));

    res.json(updatedApplication);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error adding note' });
  }
};

exports.getTenants = async (req, res) => {
  try {
    const user = getUser(req);
    const allProps = await Property.findAll();
    const ownerPropIds = allProps.filter(p => p.owner_id === user.id).map(p => p.id);

    if (ownerPropIds.length === 0) return res.json([]);

    const [tenants] = await sql.query(`SELECT * FROM tenants WHERE property_id IN (?)`, [ownerPropIds]);

    const tenantsWithDetails = await Promise.all(tenants.map(async (t) => {
      const property = await Property.findById(t.property_id);
      const tenantUser = await User.findById(t.user_id);
      return {
        ...t,
        property: property ? { id: property.id, title: property.title, address: property.address } : null,
        tenant: tenantUser ? { id: tenantUser.id, name: tenantUser.name, email: tenantUser.email } : null
      };
    }));

    res.json(tenantsWithDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching tenants' });
  }
};

exports.getTenantById = async (req, res) => {
  try {
    const user = getUser(req);
    const tenantId = parseInt(req.params.id);
    const [tenantRows] = await sql.query('SELECT * FROM tenants WHERE id = ?', [tenantId]);
    const tenant = tenantRows[0];

    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    const property = await Property.findById(tenant.property_id);
    if (!property || property.owner_id !== user.id) {
      return res.status(403).json({ error: 'Access denied to this tenant' });
    }

    const tenantUser = await User.findById(tenant.user_id);
    const [tenantPayments] = await sql.query('SELECT * FROM payments WHERE tenant_id = ? AND property_id = ?', [tenant.user_id, tenant.property_id]);
    const [tenantMaintenance] = await sql.query('SELECT * FROM maintenance_requests WHERE property_id = ? AND tenant_id = ?', [tenant.property_id, tenant.user_id]);

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
    console.error(error);
    res.status(500).json({ error: 'Server error fetching tenant' });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const user = getUser(req);
    const allProps = await Property.findAll();
    const ownerPropIds = allProps.filter(p => p.owner_id === user.id).map(p => p.id);

    if (ownerPropIds.length === 0) return res.json([]);

    const [messages] = await sql.query(`SELECT * FROM messages WHERE property_id IN (?) ORDER BY created_at DESC`, [ownerPropIds]);

    const messagesWithDetails = await Promise.all(messages.map(async (m) => {
      const property = await Property.findById(m.property_id);
      const sender = await User.findById(m.sender_id);
      return {
        ...m,
        property: property ? { id: property.id, title: property.title } : null,
        sender: sender ? { id: sender.id, name: sender.name, email: sender.email } : null
      };
    }));

    res.json(messagesWithDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching messages' });
  }
};

exports.getMessageById = async (req, res) => {
  try {
    const user = getUser(req);
    const messageId = parseInt(req.params.id);
    const [messageRows] = await sql.query('SELECT * FROM messages WHERE id = ?', [messageId]);
    const message = messageRows[0];

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    const property = await Property.findById(message.property_id);
    if (!property || property.owner_id !== user.id) {
      return res.status(403).json({ error: 'Access denied to this message' });
    }

    // Fetch all messages related to this property and involving these two users (sender of current message and current user)
    const [threadMessages] = await sql.query(
      `SELECT * FROM messages WHERE property_id = ? AND 
       ((sender_id = ? AND recipient_id = ?) OR (sender_id = ? AND recipient_id = ?))
       ORDER BY created_at ASC`,
      [message.property_id, message.sender_id, user.id, user.id, message.sender_id]
    );

    const threadMessagesWithSender = await Promise.all(threadMessages.map(async (m) => {
      const sender = await User.findById(m.sender_id);
      return {
        ...m,
        sender: sender ? { id: sender.id, name: sender.name, email: sender.email } : null
      };
    }));

    res.json(threadMessagesWithSender);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching message thread' });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const user = getUser(req);
    const { propertyId, recipientId, message } = req.body;

    if (!propertyId || !recipientId || !message) {
      return res.status(400).json({ error: 'Property ID, recipient ID, and message are required' });
    }

    const property = await Property.findById(propertyId);
    if (!property || property.owner_id !== user.id) {
      return res.status(403).json({ error: 'Access denied to this property' });
    }

    const [result] = await sql.query(
      `INSERT INTO messages (property_id, sender_id, recipient_id, message_text, created_at, updated_at)
       VALUES (?, ?, ?, ?, NOW(), NOW())`,
      [parseInt(propertyId), user.id, parseInt(recipientId), message]
    );

    const newMessageId = result.insertId;
    const [newMessageRows] = await sql.query('SELECT * FROM messages WHERE id = ?', [newMessageId]);
    const newMessage = newMessageRows[0];

    createAuditLog(user.id, 'send_message', 'message', newMessageId, { propertyId, recipientId }, getIpAddress(req));

    res.status(201).json(newMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error sending message' });
  }
};

exports.markMessageRead = async (req, res) => {
  try {
    const user = getUser(req);
    const messageId = parseInt(req.params.id);
    const [messageRows] = await sql.query('SELECT * FROM messages WHERE id = ?', [messageId]);
    const message = messageRows[0];

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    const property = await Property.findById(message.property_id);
    if (!property || property.owner_id !== user.id) {
      return res.status(403).json({ error: 'Access denied to this message' });
    }

    await sql.query('UPDATE messages SET is_read = TRUE, updated_at = NOW() WHERE id = ?', [messageId]);
    const [updatedMessageRows] = await sql.query('SELECT * FROM messages WHERE id = ?', [messageId]);
    const updatedMessage = updatedMessageRows[0];

    res.json(updatedMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error updating message' });
  }
};

exports.getViewings = async (req, res) => {
  try {
    const user = getUser(req);
    const allProps = await Property.findAll();
    const ownerPropIds = allProps.filter(p => p.owner_id === user.id).map(p => p.id);

    if (ownerPropIds.length === 0) return res.json([]);

    const [viewingRequests] = await sql.query(`SELECT * FROM viewing_requests WHERE property_id IN (?) ORDER BY requested_date DESC`, [ownerPropIds]);

    const viewingsWithDetails = await Promise.all(viewingRequests.map(async (vr) => {
      const property = await Property.findById(vr.property_id);
      const applicant = await User.findById(vr.applicant_id);
      return {
        ...vr,
        property: property ? { id: property.id, title: property.title, address: property.address } : null,
        applicant: applicant ? { id: applicant.id, name: applicant.name, email: applicant.email } : null
      };
    }));

    res.json(viewingsWithDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching viewing requests' });
  }
};

exports.updateViewing = async (req, res) => {
  try {
    const user = getUser(req);
    const viewingId = parseInt(req.params.id);
    const [viewingRows] = await sql.query('SELECT * FROM viewing_requests WHERE id = ?', [viewingId]);
    const viewing = viewingRows[0];

    if (!viewing) {
      return res.status(404).json({ error: 'Viewing request not found' });
    }

    const property = await Property.findById(viewing.property_id);
    if (!property || property.owner_id !== user.id) {
      return res.status(403).json({ error: 'Access denied to this viewing request' });
    }

    const { status, rescheduledDate } = req.body;
    const updateFields = {};

    if (status && !['pending', 'approved', 'declined', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    if (status) {
      updateFields.status = status;
    }
    if (rescheduledDate) {
      updateFields.requested_date = rescheduledDate; // Assuming DB column is requested_date
    }

    if (Object.keys(updateFields).length > 0) {
      const setClauses = Object.keys(updateFields).map(key => `${key} = ?`).join(', ');
      const values = Object.values(updateFields);
      await sql.query(`UPDATE viewing_requests SET ${setClauses}, updated_at = NOW() WHERE id = ?`, [...values, viewingId]);
    }

    const [updatedViewingRows] = await sql.query('SELECT * FROM viewing_requests WHERE id = ?', [viewingId]);
    const updatedViewing = updatedViewingRows[0];

    createAuditLog(user.id, 'update_viewing', 'viewing', viewingId, { status, rescheduledDate }, getIpAddress(req));

    res.json(updatedViewing);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error updating viewing request' });
  }
};

exports.getPayments = async (req, res) => {
  try {
    const user = getUser(req);
    const allProps = await Property.findAll();
    const ownerPropIds = allProps.filter(p => p.owner_id === user.id).map(p => p.id);

    if (ownerPropIds.length === 0) return res.json([]);

    const [payments] = await sql.query(`SELECT * FROM payments WHERE property_id IN (?) ORDER BY due_date DESC`, [ownerPropIds]);

    const paymentsWithDetails = await Promise.all(payments.map(async (p) => {
      const property = await Property.findById(p.property_id);
      const tenant = await User.findById(p.tenant_id);
      return {
        ...p,
        property: property ? { id: property.id, title: property.title, address: property.address } : null,
        tenant: tenant ? { id: tenant.id, name: tenant.name, email: tenant.email } : null
      };
    }));

    res.json(paymentsWithDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching payments' });
  }
};

exports.getPaymentSummary = async (req, res) => {
  try {
    const user = getUser(req);
    const allProps = await Property.findAll();
    const ownerProperties = allProps.filter(p => p.owner_id === user.id);
    const propertyIds = ownerProperties.map(p => p.id);

    if (propertyIds.length === 0) {
      return res.json({ totalCollected: 0, pendingPayments: 0, overduePayments: 0, totalExpected: 0 });
    }

    const [ownerPayments] = await sql.query(`SELECT * FROM payments WHERE property_id IN (?)`, [propertyIds]);
    const today = new Date();
    const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const totalCollected = ownerPayments
      .filter(p => p.status === 'paid' && new Date(p.paid_date) >= currentMonth)
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    const pendingPayments = ownerPayments.filter(p => p.status === 'pending').length;
    const overduePayments = ownerPayments.filter(p => {
      const dueDate = new Date(p.due_date);
      return p.status === 'pending' && dueDate < today;
    }).length;

    res.json({
      totalCollected,
      pendingPayments,
      overduePayments,
      totalExpected: ownerProperties
        .filter(p => p.tenant_id && p.price) // Assuming price is monthly rent
        .reduce((sum, p) => sum + (p.price || 0), 0)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching payment summary' });
  }
};

exports.createPayment = async (req, res) => {
  try {
    const user = getUser(req);
    const { propertyId, tenantId, amount, dueDate, paidDate, paymentMethod } = req.body;

    if (!propertyId || !tenantId || !amount || !dueDate) {
      return res.status(400).json({ error: 'Property ID, tenant ID, amount, and due date are required' });
    }

    const property = await Property.findById(propertyId);
    if (!property || property.owner_id !== user.id) {
      return res.status(403).json({ error: 'Access denied to this property' });
    }

    const [result] = await sql.query(
      `INSERT INTO payments (property_id, tenant_id, amount, due_date, paid_date, status, payment_method, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [parseInt(propertyId), parseInt(tenantId), parseFloat(amount), dueDate, paidDate || null, paidDate ? 'paid' : 'pending', paymentMethod || 'manual']
    );

    const newPaymentId = result.insertId;
    const [newPaymentRows] = await sql.query('SELECT * FROM payments WHERE id = ?', [newPaymentId]);
    const newPayment = newPaymentRows[0];

    createAuditLog(user.id, 'create_payment', 'payment', newPaymentId, { propertyId, tenantId, amount }, getIpAddress(req));

    res.status(201).json(newPayment);
  } catch (error) {
    console.error(error);
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
exports.getAvailableManagers = async (req, res) => {
  try {
    const user = getUser(req);
    const { rating, priceRange, search } = req.query;

    // Get all active property managers
    const [managers] = await sql.query("SELECT * FROM users WHERE role = 'property_manager' AND status = 'active'");

    // Enrich with profile data
    let enrichedManagers = managers.map(manager => {
      // Mocked related data until tables are confirmed
      const profile = null;
      const reviews = [];
      const activeSubscriptions = [];

      // Calculate average rating
      const avgRating = 0;

      return {
        id: manager.id,
        name: manager.name,
        email: manager.email,
        profile: profile || null,
        averageRating: Math.round(avgRating * 10) / 10,
        totalReviews: reviews.length,
        activeSubscriptions: activeSubscriptions.length,
        availablePlans: [], // Mocked
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
exports.getManagerById = async (req, res) => {
  try {
    const managerId = parseInt(req.params.id);
    if (isNaN(managerId)) {
      return res.status(400).json({ error: 'Invalid manager ID' });
    }
    const [rows] = await sql.query("SELECT * FROM users WHERE id = ? AND role = 'property_manager'", [managerId]);
    const manager = rows[0];

    if (!manager) {
      return res.status(404).json({ error: 'Manager not found' });
    }

    const profile = null;
    const reviews = [];
    const activeSubscriptions = [];

    const avgRating = 0;

    res.json({
      id: manager.id,
      name: manager.name,
      email: manager.email,
      profile: profile || null,
      averageRating: Math.round(avgRating * 10) / 10,
      totalReviews: reviews.length,
      reviews: reviews.slice(0, 10), // Latest 10 reviews
      activeSubscriptions: activeSubscriptions.length,
      availablePlans: [],
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
// Get Owner's Subscriptions
exports.getMySubscriptions = async (req, res) => {
  try {
    const user = getUser(req);
    // Fetch subscriptions from DB
    const [subscriptions] = await sql.query("SELECT * FROM manager_subscriptions WHERE owner_id = ?", [user.id]);

    const enrichedSubscriptions = await Promise.all(subscriptions.map(async (sub) => {
      // Fetch related data safely
      const [managerRows] = await sql.query("SELECT id, name, email FROM users WHERE id = ?", [sub.manager_id]);
      const manager = managerRows[0];

      const property = await Property.findById(sub.property_id);

      // Mocked plan/agreement/payment data
      const plan = null;
      const agreement = null;
      const payments = [];
      const nextPayment = null;

      return {
        id: sub.id,
        ownerId: sub.owner_id,
        managerId: sub.manager_id,
        propertyId: sub.property_id,
        planId: sub.plan_id,
        status: sub.status,
        startDate: sub.start_date,
        endDate: sub.end_date,
        nextBillingDate: sub.next_billing_date,
        monthlyFee: parseFloat(sub.monthly_fee || 0),
        autoRenew: !!sub.auto_renew,
        cancelledAt: sub.cancelled_at,

        manager: manager ? { id: manager.id, name: manager.name, email: manager.email } : null,
        property: property ? { id: property.id, title: property.title, address: property.address } : null,
        plan: plan || null,
        agreement: agreement || null,
        paymentHistory: payments,
        nextPayment: nextPayment || null
      };
    }));

    res.json(enrichedSubscriptions);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({ error: 'Server error fetching subscriptions' });
  }
};

const SUBSCRIPTION_PLANS = [
  { id: 1, name: 'Basic Management', price: 100, features: ['Tenant Screening', 'Rent Collection'], isActive: true },
  { id: 2, name: 'Premium Management', price: 200, features: ['Tenant Screening', 'Rent Collection', 'Maintenance Coordination', 'Eviction Protection'], isActive: true }
];

// Subscribe to Manager
exports.subscribeToManager = async (req, res) => {
  try {
    const user = getUser(req);
    const { managerId, propertyId, planId, paymentMethod } = req.body;

    if (!managerId || !propertyId || !planId) {
      return res.status(400).json({ error: 'Manager ID, Property ID, and Plan ID are required' });
    }

    // Validate manager
    const [managerRows] = await sql.query("SELECT * FROM users WHERE id = ? AND role = 'property_manager' AND status = 'active'", [managerId]);
    const manager = managerRows[0];
    if (!manager) {
      return res.status(404).json({ error: 'Manager not found or not available' });
    }

    // Validate property belongs to owner
    const property = await Property.findById(propertyId);
    if (!property || property.owner_id !== user.id) {
      return res.status(404).json({ error: 'Property not found or access denied' });
    }

    // Validate plan
    const plan = SUBSCRIPTION_PLANS.find(p => p.id === parseInt(planId) && p.isActive);
    if (!plan) {
      return res.status(404).json({ error: 'Subscription plan not found' });
    }

    // Check if property already has active subscription
    const [existingSubs] = await sql.query("SELECT * FROM manager_subscriptions WHERE property_id = ? AND status = 'active'", [propertyId]);
    if (existingSubs.length > 0) {
      return res.status(400).json({ error: 'Property already has an active subscription' });
    }

    // Create subscription in DB
    const startDate = new Date();
    const nextBilling = new Date(startDate);
    nextBilling.setDate(startDate.getDate() + 30);

    const [result] = await sql.query(`
        INSERT INTO manager_subscriptions 
        (owner_id, manager_id, property_id, plan_id, status, start_date, next_billing_date, monthly_fee, auto_renew)
        VALUES (?, ?, ?, ?, 'active', ?, ?, ?, true)
    `, [user.id, managerId, propertyId, planId, startDate, nextBilling, plan.price]);

    const newSubscriptionId = result.insertId;

    // Stub Payment/Agreement creation for now (or implement logic if tables exist)
    // For now we return success to the UI

    // Assign manager to property
    await sql.query('UPDATE properties SET assigned_manager_id = ? WHERE id = ?', [managerId, propertyId]);

    createAuditLog(user.id, 'subscribe_to_manager', 'subscription', newSubscriptionId, { managerId, propertyId, planId }, getIpAddress(req));

    res.status(201).json({
      subscription: { id: newSubscriptionId, status: 'active', startDate },
      message: 'Subscription created successfully'
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

exports.updatePropertyStatus = async (req, res) => {
  try {
    const user = getUser(req);
    const propertyId = parseInt(req.params.id);
    const property = await Property.findById(propertyId);

    if (!property) return res.status(404).json({ error: 'Property not found' });
    if (property.owner_id !== user.id) return res.status(403).json({ error: 'Access denied' });

    const { status } = req.body;
    const validStatuses = ['active', 'rented', 'maintenance', 'inactive', 'archived'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    await sql.query('UPDATE properties SET status = ?, updated_at = NOW() WHERE id = ?', [status, propertyId]);
    createAuditLog(user.id, 'update_property_status', 'property', propertyId, { oldStatus: property.status, newStatus: status }, getIpAddress(req));

    const updatedProperty = await Property.findById(propertyId);
    res.json(updatedProperty);
  } catch (error) {
    console.error("Error updating property status:", error);
    res.status(500).json({ error: 'Server error updating property status' });
  }
};

