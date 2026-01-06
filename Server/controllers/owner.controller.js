const sql = require('../config/db');
const { createAuditLog, getUser } = require('../middleware/auth');
const { getIpAddress } = require('../utils/helpers');

// Helper to get user from request
// const getUser = (req) => req.user; // Already imported from auth

// Get Dashboard Stats
exports.getDashboard = async (req, res) => {
  try {
    const user = getUser(req);

    // 1. Property Stats
    const [propStats] = await sql.query(`
        SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
            SUM(CASE WHEN status = 'active' AND tenant_id IS NULL THEN 1 ELSE 0 END) as vacant,
            SUM(CASE WHEN status = 'maintenance' THEN 1 ELSE 0 END) as maintenance,
            SUM(CASE WHEN tenant_id IS NOT NULL THEN 1 ELSE 0 END) as occupied
        FROM properties 
        WHERE owner_id = ?
    `, [user.id]);

    const { total, active, vacant, maintenance, occupied } = propStats[0];
    const occupancyRate = total > 0 ? Math.round((occupied / total) * 100) : 0;

    // 2. Monthly Income (Sum of rents from rented properties)
    // Assuming 'price' in properties table is the listed rent, or query tenants table for actual lease rent
    // Better to query 'tenants' table for active leases? 
    // Let's stick to properties.price for now if rented, or use a JOIN if possible.
    // Simple approach: active tenants in properties
    const [incomeResult] = await sql.query(`
        SELECT SUM(price) as total_income 
        FROM properties 
        WHERE owner_id = ? AND tenant_id IS NOT NULL
    `, [user.id]);
    const monthlyIncome = incomeResult[0].total_income || 0;

    // 3. Pending Applications
    const [appStats] = await sql.query(`
        SELECT COUNT(*) as count 
        FROM applications a
        JOIN properties p ON a.property_id = p.id
        WHERE p.owner_id = ? AND a.status = 'pending'
    `, [user.id]);
    const pendingApplications = appStats[0].count;

    // 4. Upcoming Rent Due (Next 30 days, pending)
    const [rentStats] = await sql.query(`
        SELECT COUNT(*) as count 
        FROM payments pay
        JOIN properties p ON pay.property_id = p.id
        WHERE p.owner_id = ? 
        AND pay.status = 'pending' 
        AND pay.due_date BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 1 MONTH)
    `, [user.id]);
    const upcomingRentDue = rentStats[0].count;

    // 5. Open Maintenance
    const [maintStats] = await sql.query(`
        SELECT COUNT(*) as count 
        FROM maintenance_requests mr
        JOIN properties p ON mr.property_id = p.id
        WHERE p.owner_id = ? 
        AND (mr.status = 'open' OR mr.status = 'in_progress')
    `, [user.id]);
    const openMaintenanceRequests = maintStats[0].count;

    // 6. Recent Activity (Applications + Maintenance)
    // Union to get combined list
    const [recentActivity] = await sql.query(`
        (SELECT 'application' as type, a.id, CONCAT('New application for ', p.title) as message, a.created_at as timestamp
         FROM applications a JOIN properties p ON a.property_id = p.id WHERE p.owner_id = ?)
        UNION
        (SELECT 'maintenance' as type, mr.id, CONCAT('Maintenance request for ', p.title) as message, mr.created_at as timestamp
         FROM maintenance_requests mr JOIN properties p ON mr.property_id = p.id WHERE p.owner_id = ?)
        ORDER BY timestamp DESC
        LIMIT 10
    `, [user.id, user.id]);

    // 7. Top Properties (by views or income?)
    // Using views if column exists, else random/latest. Assuming 'views' exists in schema or mock.
    // If not, just list first few.
    const [topProps] = await sql.query(`
        SELECT id, title, address, status, price as monthlyRent
        FROM properties 
        WHERE owner_id = ?
        LIMIT 5
    `, [user.id]);

    res.json({
      metrics: {
        totalProperties: total,
        activeProperties: active,
        vacantProperties: vacant,
        maintenanceProperties: maintenance,
        monthlyIncome,
        occupancyRate,
        pendingApplications,
        upcomingRentDue,
        openMaintenanceRequests
      },
      recentActivity,
      topProperties: topProps
    });

  } catch (error) {
    console.error('Dashboard Error:', error);
    res.status(500).json({ error: 'Server error fetching dashboard data' });
  }
};

// Get Properties
exports.getProperties = async (req, res) => {
  try {
    const user = getUser(req);
    const { status, propertyType, search } = req.query;

    let query = `
        SELECT p.*,
            (SELECT COUNT(*) FROM applications a WHERE a.property_id = p.id) as inquiries,
            (SELECT COUNT(*) FROM applications a WHERE a.property_id = p.id AND a.status = 'pending') as pendingApplications
        FROM properties p
        WHERE p.owner_id = ?
    `;
    const params = [user.id];

    if (status) { query += " AND p.status = ?"; params.push(status); }
    if (propertyType) { query += " AND p.property_type = ?"; params.push(propertyType); }
    if (search) {
      query += " AND (p.title LIKE ? OR p.address LIKE ?)";
      const like = `%${search}%`;
      params.push(like, like);
    }

    query += " ORDER BY p.created_at DESC";

    const [rows] = await sql.query(query, params);

    // Parse JSON fields
    const properties = rows.map(p => ({
      ...p,
      images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images,
      amenities: typeof p.amenities === 'string' ? JSON.parse(p.amenities) : p.amenities,
      utilities: typeof p.utilities === 'string' ? JSON.parse(p.utilities) : p.utilities,
      monthlyRent: p.price // Alias for frontend
    }));

    res.json(properties);
  } catch (error) {
    console.error('Get Properties Error:', error);
    res.status(500).json({ error: 'Server error fetching properties' });
  }
};

// Create Property
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

    const query = `INSERT INTO properties (
        owner_id, title, description, price, address, property_type, status, 
        bedrooms, bathrooms, area_sqft, images, amenities, pet_policy, utilities, year_built,
        parking_spaces, lease_terms, monthly_rent, security_deposit, available_date, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;

    const [result] = await sql.query(query, [
      user.id, title, description, price, address, propertyType || 'apartment', 'active',
      bedrooms || 0, bathrooms || 0, area || 0,
      JSON.stringify(images || []), JSON.stringify(amenities || []),
      petPolicy || 'not_allowed', JSON.stringify(utilities || []), yearBuilt || null,
      parking || 0, leaseTerms || '12 months', monthlyRent ? parseFloat(monthlyRent) : null,
      securityDeposit ? parseFloat(securityDeposit) : null, availableDate || null
    ]);

    const newPropertyId = result.insertId;
    createAuditLog(user.id, 'create_property', 'property', newPropertyId, { title, address }, getIpAddress(req));

    // Fetch created property
    const [rows] = await sql.query("SELECT * FROM properties WHERE id = ?", [newPropertyId]);
    res.status(201).json(rows[0]);

  } catch (error) {
    console.error("Error creating property:", error);
    res.status(500).json({ error: 'Server error creating property' });
  }
};

// Update Property
exports.updateProperty = async (req, res) => {
  try {
    const user = getUser(req);
    const propertyId = parseInt(req.params.id);

    // Verify ownership
    const [props] = await sql.query("SELECT * FROM properties WHERE id = ?", [propertyId]);
    if (props.length === 0) return res.status(404).json({ error: 'Property not found' });
    if (props[0].owner_id !== user.id) return res.status(403).json({ error: 'Access denied' });

    const allowedFields = [
      'title', 'description', 'price', 'address', 'bedrooms', 'bathrooms', 'area',
      'propertyType', 'images', 'amenities', 'petPolicy', 'utilities', 'yearBuilt',
      'parking', 'leaseTerms', 'monthlyRent', 'securityDeposit', 'availableDate'
    ];

    const updateFields = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
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
          // bathrooms can be float
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

    createAuditLog(user.id, 'update_property', 'property', propertyId, req.body, getIpAddress(req));

    const [updated] = await sql.query("SELECT * FROM properties WHERE id = ?", [propertyId]);
    res.json(updated[0]);
  } catch (error) {
    console.error('Update Property Error:', error);
    res.status(500).json({ error: 'Server error updating property' });
  }
};

// Delete Property
exports.deleteProperty = async (req, res) => {
  try {
    const user = getUser(req);
    const propertyId = parseInt(req.params.id);

    const [props] = await sql.query("SELECT * FROM properties WHERE id = ?", [propertyId]);
    if (props.length === 0) return res.status(404).json({ error: 'Property not found' });
    if (props[0].owner_id !== user.id) return res.status(403).json({ error: 'Access denied' });
    if (props[0].tenant_id) return res.status(400).json({ error: 'Cannot delete property with active tenant' });

    await sql.query('DELETE FROM properties WHERE id = ?', [propertyId]);

    createAuditLog(user.id, 'delete_property', 'property', propertyId, {}, getIpAddress(req));
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Delete Property Error:', error);
    res.status(500).json({ error: 'Server error deleting property' });
  }
};


// Get Applications
exports.getApplications = async (req, res) => {
  try {
    const user = getUser(req);
    // Get apps for properties owned by user
    const [apps] = await sql.query(`
        SELECT a.*, 
               p.title as property_title, p.address as property_address,
               u.name as applicant_name, u.email as applicant_email
        FROM applications a
        JOIN properties p ON a.property_id = p.id
        LEFT JOIN users u ON a.applicant_id = u.id
        WHERE p.owner_id = ?
        ORDER BY a.created_at DESC
    `, [user.id]);

    const applicationsWithDetails = apps.map(app => ({
      ...app,
      property: { id: app.property_id, title: app.property_title, address: app.property_address },
      applicant: app.applicant_id ? { id: app.applicant_id, name: app.applicant_name, email: app.applicant_email } : null,
      notes: typeof app.notes === 'string' ? JSON.parse(app.notes || '[]') : app.notes
    }));

    res.json(applicationsWithDetails);
  } catch (error) {
    console.error('Get Applications Error:', error);
    res.status(500).json({ error: 'Server error fetching applications' });
  }
};

// Get Application By ID
exports.getApplicationById = async (req, res) => {
  try {
    const user = getUser(req);
    const applicationId = parseInt(req.params.id);

    const [apps] = await sql.query(`
        SELECT a.*, 
               p.owner_id, p.title as property_title, p.address as property_address, p.price,
               u.name as applicant_name, u.email as applicant_email, u.mobile_number as applicant_phone
        FROM applications a
        JOIN properties p ON a.property_id = p.id
        LEFT JOIN users u ON a.applicant_id = u.id
        WHERE a.id = ?
    `, [applicationId]);

    if (apps.length === 0) return res.status(404).json({ error: 'Application not found' });

    const app = apps[0];
    if (app.owner_id !== user.id) return res.status(403).json({ error: 'Access denied' });

    res.json({
      ...app,
      property: { id: app.property_id, title: app.property_title, address: app.property_address, price: app.price },
      applicant: app.applicant_id ? {
        id: app.applicant_id,
        name: app.applicant_name,
        email: app.applicant_email,
        phone: app.applicant_phone
      } : null,
      notes: typeof app.notes === 'string' ? JSON.parse(app.notes || '[]') : app.notes
    });
  } catch (error) {
    console.error('Get Application Error:', error);
    res.status(500).json({ error: 'Server error fetching application' });
  }
};

// Update Application
exports.updateApplication = async (req, res) => {
  try {
    const user = getUser(req);
    const applicationId = parseInt(req.params.id);
    const { status, notes } = req.body;

    // Verify ownership
    const [apps] = await sql.query(`
        SELECT a.*, p.owner_id, p.price
        FROM applications a 
        JOIN properties p ON a.property_id = p.id 
        WHERE a.id = ?
    `, [applicationId]);

    if (apps.length === 0) return res.status(404).json({ error: 'Application not found' });
    const app = apps[0];
    if (app.owner_id !== user.id) return res.status(403).json({ error: 'Access denied' });

    if (status && !['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    if (status) {
      if (status === 'approved') {
        // Transaction-like logic
        // 1. Update application
        await sql.query("UPDATE applications SET status = 'approved', updated_at = NOW() WHERE id = ?", [applicationId]);

        // 2. Update property status and tenant_id (Wait, schema stores tenant_id? Or tenants table?)
        // We moved to 'tenants' table. Property 'tenant_id' might be older design, but let's keep consistency.
        // Actually, best practice is to insert into 'tenants' table which stores the lease.

        // Check if property is already rented?
        // Assuming simplified flow: Approving application creates lease.

        // Create Tenant Record
        await sql.query(`
                INSERT INTO tenants (user_id, property_id, lease_start_date, lease_end_date, monthly_rent, status, created_at)
                VALUES (?, ?, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 YEAR), ?, 'active', NOW())
            `, [app.applicant_id, app.property_id, app.price]);

        // Update property status
        await sql.query("UPDATE properties SET status = 'rented', tenant_id = ? WHERE id = ?", [app.applicant_id, app.property_id]);

        // Reject other pending applications for this property? Optional.
      } else {
        await sql.query("UPDATE applications SET status = ?, updated_at = NOW() WHERE id = ?", [status, applicationId]);
      }
    }

    // Handle Notes
    if (notes) {
      let currentNotes = typeof app.notes === 'string' ? JSON.parse(app.notes || '[]') : app.notes;
      currentNotes.push({
        note: notes,
        addedBy: user.id,
        addedAt: new Date().toISOString()
      });
      await sql.query("UPDATE applications SET notes = ? WHERE id = ?", [JSON.stringify(currentNotes), applicationId]);
    }

    // Return updated
    const [updated] = await sql.query("SELECT * FROM applications WHERE id = ?", [applicationId]);
    createAuditLog(user.id, 'update_application', 'application', applicationId, { status, notes }, getIpAddress(req));

    // Parse notes for response
    updated[0].notes = typeof updated[0].notes === 'string' ? JSON.parse(updated[0].notes) : updated[0].notes;
    res.json(updated[0]);

  } catch (error) {
    console.error('Update Application Error:', error);
    res.status(500).json({ error: 'Server error updating application' });
  }
};

// Add Application Note
exports.addApplicationNote = async (req, res) => {
  // Reusing update logic or separate? Separate is fine.
  try {
    const user = getUser(req);
    const applicationId = parseInt(req.params.id);
    const { note } = req.body;

    if (!note) return res.status(400).json({ error: 'Note is required' });

    const [apps] = await sql.query(`SELECT a.*, p.owner_id FROM applications a JOIN properties p ON a.property_id = p.id WHERE a.id = ?`, [applicationId]);
    if (apps.length === 0) return res.status(404).json({ error: 'Not found' });
    if (apps[0].owner_id !== user.id) return res.status(403).json({ error: 'Access denied' });

    let currentNotes = typeof apps[0].notes === 'string' ? JSON.parse(apps[0].notes || '[]') : apps[0].notes;
    currentNotes.push({
      note,
      addedBy: user.id,
      addedAt: new Date().toISOString()
    });

    await sql.query("UPDATE applications SET notes = ?, updated_at = NOW() WHERE id = ?", [JSON.stringify(currentNotes), applicationId]);

    apps[0].notes = currentNotes; // Manual update for response
    res.json(apps[0]);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get Tenants
exports.getTenants = async (req, res) => {
  try {
    const user = getUser(req);
    // Get tenants for properties owned by user
    const [tenants] = await sql.query(`
        SELECT t.*, 
               p.title as property_title, p.address as property_address,
               u.name as tenant_name, u.email as tenant_email, u.mobile_number as tenant_phone
        FROM tenants t
        JOIN properties p ON t.property_id = p.id
        JOIN users u ON t.user_id = u.id
        WHERE p.owner_id = ?
    `, [user.id]);

    const tenantsWithDetails = tenants.map(t => ({
      ...t,
      property: { id: t.property_id, title: t.property_title, address: t.property_address },
      tenant: { id: t.user_id, name: t.tenant_name, email: t.tenant_email, phone: t.tenant_phone }
    }));

    res.json(tenantsWithDetails);
  } catch (error) {
    console.error('Get Tenants Error:', error);
    res.status(500).json({ error: 'Server error fetching tenants' });
  }
};

// Get Tenant By ID
exports.getTenantById = async (req, res) => {
  try {
    const user = getUser(req);
    const tenantId = parseInt(req.params.id); // This is likely the 'tenants.id' primary key, NOT user_id. Warning: route param usually IDs the resource.

    // Query by primary key of tenants table
    const [tenants] = await sql.query(`
        SELECT t.*, 
               p.owner_id, p.title as property_title, p.address as property_address,
               u.name as tenant_name, u.email as tenant_email, u.mobile_number as tenant_phone
        FROM tenants t
        JOIN properties p ON t.property_id = p.id
        JOIN users u ON t.user_id = u.id
        WHERE t.id = ?
    `, [tenantId]);

    if (tenants.length === 0) return res.status(404).json({ error: 'Tenant not found' });
    const tenant = tenants[0];
    if (tenant.owner_id !== user.id) return res.status(403).json({ error: 'Access denied' });

    // Fetch payments and maintenance
    const [payments] = await sql.query("SELECT * FROM payments WHERE tenant_id = ? AND property_id = ?", [tenant.user_id, tenant.property_id]);
    const [requests] = await sql.query("SELECT * FROM maintenance_requests WHERE tenant_id = ? AND property_id = ?", [tenant.user_id, tenant.property_id]);

    res.json({
      ...tenant,
      property: { id: tenant.property_id, title: tenant.property_title, address: tenant.property_address },
      tenant: { id: tenant.user_id, name: tenant.tenant_name, email: tenant.tenant_email, phone: tenant.tenant_phone },
      payments,
      maintenanceRequests: requests
    });
  } catch (error) {
    console.error('Get Tenant Error:', error);
    res.status(500).json({ error: 'Server error fetching tenant' });
  }
};

// Get Messages
exports.getMessages = async (req, res) => {
  try {
    const user = getUser(req);
    // Get messages for properties owned by user
    const [messages] = await sql.query(`
        SELECT m.*, 
               p.title as property_title,
               s.name as sender_name, s.email as sender_email
        FROM messages m
        JOIN properties p ON m.property_id = p.id
        LEFT JOIN users s ON m.sender_id = s.id
        WHERE p.owner_id = ?
        ORDER BY m.created_at DESC
    `, [user.id]);

    const messagesWithDetails = messages.map(m => ({
      ...m,
      property: { id: m.property_id, title: m.property_title },
      sender: m.sender_id ? { id: m.sender_id, name: m.sender_name, email: m.sender_email } : null
    }));

    res.json(messagesWithDetails);
  } catch (error) {
    console.error('Get Messages Error:', error);
    res.status(500).json({ error: 'Server error fetching messages' });
  }
};

// Get Message By ID (and Thread)
exports.getMessageById = async (req, res) => {
  try {
    const user = getUser(req);
    const messageId = parseInt(req.params.id);

    const [msgs] = await sql.query(`
        SELECT m.*, p.owner_id
        FROM messages m
        JOIN properties p ON m.property_id = p.id
        WHERE m.id = ?
    `, [messageId]);

    if (msgs.length === 0) return res.status(404).json({ error: 'Message not found' });
    const message = msgs[0];
    if (message.owner_id !== user.id) return res.status(403).json({ error: 'Access denied' });

    // Fetch Thread: Messages between these two users on this property
    // Logic: (Sender = A AND Recipient = B) OR (Sender = B AND Recipient = A)
    // AND property_id matches.

    // Identifiy the other party. If I am the owner, the other party is either the sender (if not me) or recipient (if not me).
    // The message.sender_id might be the tenant.

    const otherPartyId = message.sender_id === user.id ? message.recipient_id : message.sender_id;

    const [thread] = await sql.query(`
        SELECT m.*, 
               s.name as sender_name, s.email as sender_email
        FROM messages m
        LEFT JOIN users s ON m.sender_id = s.id
        WHERE m.property_id = ? 
        AND (
            (m.sender_id = ? AND m.recipient_id = ?) OR 
            (m.sender_id = ? AND m.recipient_id = ?)
        )
        ORDER BY m.created_at ASC
    `, [message.property_id, user.id, otherPartyId, otherPartyId, user.id]);

    const threadWithDetails = thread.map(m => ({
      ...m,
      sender: m.sender_id ? { id: m.sender_id, name: m.sender_name, email: m.sender_email } : null
    }));

    res.json(threadWithDetails);
  } catch (error) {
    console.error('Get Message Thread Error:', error);
    res.status(500).json({ error: 'Server error fetching message thread' });
  }
};

// Send Message
exports.sendMessage = async (req, res) => {
  try {
    const user = getUser(req);
    const { propertyId, recipientId, message } = req.body;

    if (!propertyId || !recipientId || !message) {
      return res.status(400).json({ error: 'Property ID, recipient ID, and message are required' });
    }

    // Verify property ownership
    const [props] = await sql.query("SELECT * FROM properties WHERE id = ?", [propertyId]);
    if (props.length === 0) return res.status(404).json({ error: 'Property not found' });
    if (props[0].owner_id !== user.id) return res.status(403).json({ error: 'Access denied' });

    const [result] = await sql.query(
      `INSERT INTO messages (property_id, sender_id, recipient_id, message_text, created_at, updated_at)
       VALUES (?, ?, ?, ?, NOW(), NOW())`,
      [parseInt(propertyId), user.id, parseInt(recipientId), message]
    );

    const [newMsg] = await sql.query("SELECT * FROM messages WHERE id = ?", [result.insertId]);
    createAuditLog(user.id, 'send_message', 'message', result.insertId, { propertyId, recipientId }, getIpAddress(req));

    res.status(201).json(newMsg[0]);
  } catch (error) {
    console.error('Send Message Error:', error);
    res.status(500).json({ error: 'Server error sending message' });
  }
};

// Mark Message Read
exports.markMessageRead = async (req, res) => {
  try {
    const user = getUser(req);
    const messageId = parseInt(req.params.id);

    const [msgs] = await sql.query(`
        SELECT m.*, p.owner_id 
        FROM messages m 
        JOIN properties p ON m.property_id = p.id 
        WHERE m.id = ?
    `, [messageId]);

    if (msgs.length === 0) return res.status(404).json({ error: 'Message not found' });
    if (msgs[0].owner_id !== user.id) return res.status(403).json({ error: 'Access denied' });

    await sql.query("UPDATE messages SET is_read = TRUE, updated_at = NOW() WHERE id = ?", [messageId]);

    const [updated] = await sql.query("SELECT * FROM messages WHERE id = ?", [messageId]);
    res.json(updated[0]);
  } catch (error) {
    console.error('Mark Read Error:', error);
    res.status(500).json({ error: 'Server error updating message' });
  }
};

// Get Viewings
exports.getViewings = async (req, res) => {
  try {
    const user = getUser(req);
    // Get viewings for properties owned by user
    // Assuming 'viewing_requests' table exists from schema
    const [viewings] = await sql.query(`
        SELECT vr.*, 
               p.title as property_title, p.address as property_address,
               u.name as applicant_name, u.email as applicant_email
        FROM viewing_requests vr
        JOIN properties p ON vr.property_id = p.id
        LEFT JOIN users u ON vr.applicant_id = u.id
        WHERE p.owner_id = ?
        ORDER BY vr.requested_date DESC
    `, [user.id]);

    const viewingsWithDetails = viewings.map(vr => ({
      ...vr,
      property: { id: vr.property_id, title: vr.property_title, address: vr.property_address },
      applicant: vr.applicant_id ? { id: vr.applicant_id, name: vr.applicant_name, email: vr.applicant_email } : null
    }));

    res.json(viewingsWithDetails);
  } catch (error) {
    console.error('Get Viewings Error:', error);
    res.status(500).json({ error: 'Server error fetching viewing requests' });
  }
};

// Update Viewing
exports.updateViewing = async (req, res) => {
  try {
    const user = getUser(req);
    const viewingId = parseInt(req.params.id);
    const { status, rescheduledDate } = req.body;

    const [viewings] = await sql.query(`
        SELECT vr.*, p.owner_id 
        FROM viewing_requests vr 
        JOIN properties p ON vr.property_id = p.id 
        WHERE vr.id = ?
    `, [viewingId]);

    if (viewings.length === 0) return res.status(404).json({ error: 'Viewing not found' });
    if (viewings[0].owner_id !== user.id) return res.status(403).json({ error: 'Access denied' });

    if (status && !['pending', 'approved', 'declined', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updates = [];
    const params = [];

    if (status) { updates.push("status = ?"); params.push(status); }
    if (rescheduledDate) { updates.push("requested_date = ?"); params.push(rescheduledDate); } // Verify column name

    if (updates.length > 0) {
      updates.push("updated_at = NOW()");
      params.push(viewingId);
      await sql.query(`UPDATE viewing_requests SET ${updates.join(', ')} WHERE id = ?`, params);
    }

    const [updated] = await sql.query("SELECT * FROM viewing_requests WHERE id = ?", [viewingId]);
    createAuditLog(user.id, 'update_viewing', 'viewing', viewingId, { status, rescheduledDate }, getIpAddress(req));

    res.json(updated[0]);
  } catch (error) {
    console.error('Update Viewing Error:', error);
    res.status(500).json({ error: 'Server error updating viewing request' });
  }
};

// Get Payments
exports.getPayments = async (req, res) => {
  try {
    const user = getUser(req);
    const [payments] = await sql.query(`
        SELECT pay.*, 
               p.title as property_title, p.address as property_address,
               u.name as tenant_name, u.email as tenant_email
        FROM payments pay
        JOIN properties p ON pay.property_id = p.id
        LEFT JOIN users u ON pay.tenant_id = u.id
        WHERE p.owner_id = ?
        ORDER BY pay.due_date DESC
    `, [user.id]);

    const paymentsWithDetails = payments.map(p => ({
      ...p,
      property: { id: p.property_id, title: p.property_title, address: p.property_address },
      tenant: p.tenant_id ? { id: p.tenant_id, name: p.tenant_name, email: p.tenant_email } : null
    }));

    res.json(paymentsWithDetails);
  } catch (error) {
    console.error('Get Payments Error:', error);
    res.status(500).json({ error: 'Server error fetching payments' });
  }
};

// Get Payment Summary
exports.getPaymentSummary = async (req, res) => {
  try {
    const user = getUser(req);

    // Aggregation Query
    const [summary] = await sql.query(`
        SELECT 
            SUM(CASE WHEN pay.status = 'paid' AND MONTH(pay.paid_date) = MONTH(CURRENT_DATE()) AND YEAR(pay.paid_date) = YEAR(CURRENT_DATE()) THEN pay.amount ELSE 0 END) as totalCollected,
            COUNT(CASE WHEN pay.status = 'pending' THEN 1 END) as pendingPayments,
            COUNT(CASE WHEN pay.status = 'pending' AND pay.due_date < CURRENT_DATE() THEN 1 END) as overduePayments
        FROM payments pay
        JOIN properties p ON pay.property_id = p.id
        WHERE p.owner_id = ?
    `, [user.id]);

    // Total Expected: Sum of monthly rents of active tenancies
    // Query tenants table
    const [expected] = await sql.query(`
        SELECT SUM(monthly_rent) as total 
        FROM tenants t
        JOIN properties p ON t.property_id = p.id
        WHERE p.owner_id = ? AND t.status = 'active'
    `, [user.id]);

    res.json({
      totalCollected: summary[0].totalCollected || 0,
      pendingPayments: summary[0].pendingPayments || 0,
      overduePayments: summary[0].overduePayments || 0,
      totalExpected: expected[0].total || 0
    });
  } catch (error) {
    console.error('Payment Summary Error:', error);
    res.status(500).json({ error: 'Server error fetching payment summary' });
  }
};

// Create Payment
exports.createPayment = async (req, res) => {
  try {
    const user = getUser(req);
    const { propertyId, tenantId, amount, dueDate, paidDate, paymentMethod } = req.body;

    if (!propertyId || !tenantId || !amount || !dueDate) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    // Verify ownership
    const [props] = await sql.query("SELECT * FROM properties WHERE id = ?", [propertyId]);
    if (props.length === 0 || props[0].owner_id !== user.id) return res.status(403).json({ error: 'Access denied' });

    const [result] = await sql.query(
      `INSERT INTO payments (property_id, tenant_id, amount, due_date, paid_date, status, payment_method, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [parseInt(propertyId), parseInt(tenantId), parseFloat(amount), dueDate, paidDate || null, paidDate ? 'paid' : 'pending', paymentMethod || 'manual']
    );

    const [newPayment] = await sql.query("SELECT * FROM payments WHERE id = ?", [result.insertId]);
    createAuditLog(user.id, 'create_payment', 'payment', result.insertId, { propertyId, tenantId, amount }, getIpAddress(req));

    res.status(201).json(newPayment[0]);
  } catch (error) {
    console.error('Create Payment Error:', error);
    res.status(500).json({ error: 'Server error creating payment' });
  }
};

// Update Payment
exports.updatePayment = async (req, res) => {
  try {
    const user = getUser(req);
    const paymentId = parseInt(req.params.id);

    const [pays] = await sql.query(`
        SELECT pay.*, p.owner_id 
        FROM payments pay 
        JOIN properties p ON pay.property_id = p.id 
        WHERE pay.id = ?
    `, [paymentId]);

    if (pays.length === 0) return res.status(404).json({ error: 'Payment not found' });
    if (pays[0].owner_id !== user.id) return res.status(403).json({ error: 'Access denied' });

    const { status, paidDate, paymentMethod } = req.body;
    const updates = [];
    const params = [];

    if (status) { updates.push("status = ?"); params.push(status); }
    if (paidDate) { updates.push("paid_date = ?"); params.push(paidDate); }
    if (paymentMethod) { updates.push("payment_method = ?"); params.push(paymentMethod); }

    if (updates.length > 0) {
      updates.push("updated_at = NOW()");
      params.push(paymentId);
      await sql.query(`UPDATE payments SET ${updates.join(', ')} WHERE id = ?`, params);
    }

    const [updated] = await sql.query("SELECT * FROM payments WHERE id = ?", [paymentId]);
    createAuditLog(user.id, 'update_payment', 'payment', paymentId, { status, paidDate }, getIpAddress(req));

    res.json(updated[0]);
  } catch (error) {
    console.error('Update Payment Error:', error);
    res.status(500).json({ error: 'Server error updating payment' });
  }
};

// Get Income Report (Monthly)
exports.getIncomeReport = async (req, res) => {
  try {
    const user = getUser(req);
    // Aggregate payments by Month-Year for owner's properties
    const [rows] = await sql.query(`
        SELECT 
            DATE_FORMAT(pay.paid_date, '%Y-%m') as month,
            SUM(pay.amount) as total
        FROM payments pay
        JOIN properties p ON pay.property_id = p.id
        WHERE p.owner_id = ? AND pay.status = 'paid'
        GROUP BY month
        ORDER BY month
    `, [user.id]);

    const monthlyIncome = {};
    rows.forEach(row => {
      monthlyIncome[row.month] = row.total;
    });

    res.json({ monthlyIncome });
  } catch (error) {
    console.error('Income Report Error:', error);
    res.status(500).json({ error: 'Server error fetching income report' });
  }
};

// Get Monthly Report (Specific Month)
exports.getMonthlyReport = async (req, res) => {
  try {
    const user = getUser(req);
    const { month, year } = req.query;

    if (!month || !year) return res.status(400).json({ error: 'Month and Year required' });

    const [rows] = await sql.query(`
        SELECT 
            SUM(pay.amount) as totalIncome,
            COUNT(*) as paymentsCount
        FROM payments pay
        JOIN properties p ON pay.property_id = p.id
        WHERE p.owner_id = ? 
        AND pay.status = 'paid'
        AND MONTH(pay.paid_date) = ? AND YEAR(pay.paid_date) = ?
    `, [user.id, month, year]);

    // Count owner properties
    const [propCount] = await sql.query("SELECT COUNT(*) as count FROM properties WHERE owner_id = ?", [user.id]);

    res.json({
      month: parseInt(month),
      year: parseInt(year),
      totalIncome: rows[0].totalIncome || 0,
      payments: rows[0].paymentsCount || 0,
      properties: propCount[0].count
    });
  } catch (error) {
    console.error('Monthly Report Error:', error);
    res.status(500).json({ error: 'Server error fetching monthly report' });
  }
};

// Get Yearly Report
exports.getYearlyReport = async (req, res) => {
  try {
    const user = getUser(req);
    const { year } = req.query;

    if (!year) return res.status(400).json({ error: 'Year required' });

    const [rows] = await sql.query(`
        SELECT 
            SUM(pay.amount) as totalIncome,
            COUNT(*) as paymentsCount
        FROM payments pay
        JOIN properties p ON pay.property_id = p.id
        WHERE p.owner_id = ? 
        AND pay.status = 'paid'
        AND YEAR(pay.paid_date) = ?
    `, [user.id, year]);

    const [propCount] = await sql.query("SELECT COUNT(*) as count FROM properties WHERE owner_id = ?", [user.id]);
    const totalIncome = rows[0].totalIncome || 0;

    res.json({
      year: parseInt(year),
      totalIncome,
      payments: rows[0].paymentsCount || 0,
      properties: propCount[0].count,
      averageMonthlyIncome: totalIncome / 12
    });
  } catch (error) {
    console.error('Yearly Report Error:', error);
    res.status(500).json({ error: 'Server error fetching yearly report' });
  }
};

// Get Property Performance
exports.getPropertyPerformance = async (req, res) => {
  try {
    const user = getUser(req);
    // Complex query to aggregate stats per property
    const [rows] = await sql.query(`
        SELECT 
            p.id, p.title, p.views, p.created_at,
            (SELECT COUNT(*) FROM applications a WHERE a.property_id = p.id) as inquiries,
            (SELECT COUNT(*) FROM applications a WHERE a.property_id = p.id AND a.status = 'pending') as pendingApps,
            (SELECT COUNT(*) FROM applications a WHERE a.property_id = p.id AND a.status = 'approved') as approvedApps,
            (SELECT COALESCE(SUM(pay.amount), 0) FROM payments pay WHERE pay.property_id = p.id AND pay.status = 'paid') as totalRevenue
        FROM properties p
        WHERE p.owner_id = ?
    `, [user.id]);

    const performance = rows.map(p => {
      const conversionRate = p.inquiries > 0 ? Math.round((p.approvedApps / p.inquiries) * 100) : 0;
      const daysOnMarket = p.created_at
        ? Math.floor((Date.now() - new Date(p.created_at).getTime()) / (1000 * 60 * 60 * 24))
        : 0;

      return {
        propertyId: p.id,
        title: p.title,
        views: p.views || 0,
        inquiries: p.inquiries,
        applications: p.pendingApps,
        approvedApplications: p.approvedApps,
        conversionRate,
        totalRevenue: p.totalRevenue,
        daysOnMarket
      };
    });

    res.json(performance);
  } catch (error) {
    console.error('Property Performance Error:', error);
    res.status(500).json({ error: 'Server error fetching property performance' });
  }
};

// Get Financial Analytics
exports.getFinancialAnalytics = async (req, res) => {
  try {
    const user = getUser(req);

    // Monthly Income
    const [monthlyRows] = await sql.query(`
        SELECT 
            DATE_FORMAT(pay.paid_date, '%Y-%m') as month,
            SUM(pay.amount) as total
        FROM payments pay
        JOIN properties p ON pay.property_id = p.id
        WHERE p.owner_id = ? AND pay.status = 'paid'
        GROUP BY month
    `, [user.id]);

    const monthlyIncome = {};
    let totalRevenue = 0;
    monthlyRows.forEach(r => {
      monthlyIncome[r.month] = r.total;
      totalRevenue += Number(r.total);
    });

    // Revenue By Property
    const [propRows] = await sql.query(`
        SELECT p.id, SUM(pay.amount) as total
        FROM payments pay
        JOIN properties p ON pay.property_id = p.id
        WHERE p.owner_id = ? AND pay.status = 'paid'
        GROUP BY p.id
    `, [user.id]);

    const revenueByProperty = {};
    propRows.forEach(r => {
      revenueByProperty[r.id] = r.total;
    });

    // Avg Calculation
    const monthsCount = Object.keys(monthlyIncome).length;

    res.json({
      monthlyIncome,
      revenueByProperty,
      totalRevenue,
      averageMonthlyIncome: monthsCount > 0 ? totalRevenue / monthsCount : 0
    });
  } catch (error) {
    console.error('Financial Analytics Error:', error);
    res.status(500).json({ error: 'Server error fetching financial analytics' });
  }
};

// Get Tenant Analytics
exports.getTenantAnalytics = async (req, res) => {
  try {
    const user = getUser(req);

    const [tenantStats] = await sql.query(`
        SELECT 
            COUNT(DISTINCT t.id) as totalTenants,
            COUNT(DISTINCT CASE WHEN t.status = 'active' THEN t.id END) as activeTenants
        FROM tenants t
        JOIN properties p ON t.property_id = p.id
        WHERE p.owner_id = ?
    `, [user.id]);

    const [appStats] = await sql.query(`
        SELECT 
            COUNT(*) as totalApps,
            COUNT(CASE WHEN a.status = 'approved' THEN 1 END) as approvedApps,
            COUNT(CASE WHEN a.status = 'pending' THEN 1 END) as pendingApps
        FROM applications a
        JOIN properties p ON a.property_id = p.id
        WHERE p.owner_id = ?
    `, [user.id]);

    const { totalTenants, activeTenants } = tenantStats[0];
    const { totalApps, approvedApps, pendingApps } = appStats[0];

    const approvalRate = totalApps > 0 ? Math.round((approvedApps / totalApps) * 100) : 0;

    res.json({
      totalTenants,
      activeTenants,
      applicationApprovalRate: approvalRate,
      totalApplications: totalApps,
      pendingApplications: pendingApps
    });
  } catch (error) {
    console.error('Tenant Analytics Error:', error);
    res.status(500).json({ error: 'Server error fetching tenant analytics' });
  }
};

// Get Maintenance Requests
exports.getMaintenance = async (req, res) => {
  try {
    const user = getUser(req);
    // Get requests for properties owned by user
    const [requests] = await sql.query(`
        SELECT mr.*, 
               p.title as property_title, p.address as property_address,
               u.name as tenant_name, u.email as tenant_email, u.mobile_number as tenant_phone
        FROM maintenance_requests mr
        JOIN properties p ON mr.property_id = p.id
        LEFT JOIN users u ON mr.tenant_id = u.id
        WHERE p.owner_id = ?
        ORDER BY mr.created_at DESC
    `, [user.id]);

    const maintenanceWithDetails = requests.map(mr => ({
      ...mr,
      property: { id: mr.property_id, title: mr.property_title, address: mr.property_address },
      tenant: mr.tenant_id ? { id: mr.tenant_id, name: mr.tenant_name, email: mr.tenant_email, phone: mr.tenant_phone } : null,
      images: typeof mr.images === 'string' ? JSON.parse(mr.images || '[]') : mr.images,
      notes: typeof mr.notes === 'string' ? JSON.parse(mr.notes || '[]') : mr.notes
    }));

    res.json(maintenanceWithDetails);
  } catch (error) {
    console.error('Get Maintenance Error:', error);
    res.status(500).json({ error: 'Server error fetching maintenance requests' });
  }
};

// Get Maintenance By ID
exports.getMaintenanceById = async (req, res) => {
  try {
    const user = getUser(req);
    const maintenanceId = parseInt(req.params.id);

    const [requests] = await sql.query(`
        SELECT mr.*, p.owner_id, 
               p.title as property_title, p.address as property_address,
               u.name as tenant_name, u.email as tenant_email, u.mobile_number as tenant_phone
        FROM maintenance_requests mr
        JOIN properties p ON mr.property_id = p.id
        LEFT JOIN users u ON mr.tenant_id = u.id
        WHERE mr.id = ?
    `, [maintenanceId]);

    if (requests.length === 0) return res.status(404).json({ error: 'Request not found' });
    const mr = requests[0];
    if (mr.owner_id !== user.id) return res.status(403).json({ error: 'Access denied' });

    res.json({
      ...mr,
      property: { id: mr.property_id, title: mr.property_title, address: mr.property_address },
      tenant: mr.tenant_id ? { id: mr.tenant_id, name: mr.tenant_name, email: mr.tenant_email, phone: mr.tenant_phone } : null,
      images: typeof mr.images === 'string' ? JSON.parse(mr.images || '[]') : mr.images,
      notes: typeof mr.notes === 'string' ? JSON.parse(mr.notes || '[]') : mr.notes
    });
  } catch (error) {
    console.error('Get Maintenance ID Error:', error);
    res.status(500).json({ error: 'Server error fetching maintenance request' });
  }
};

// Update Maintenance
exports.updateMaintenance = async (req, res) => {
  try {
    const user = getUser(req);
    const maintenanceId = parseInt(req.params.id);
    const { status } = req.body;

    const [requests] = await sql.query(`
        SELECT mr.*, p.owner_id 
        FROM maintenance_requests mr 
        JOIN properties p ON mr.property_id = p.id 
        WHERE mr.id = ?
    `, [maintenanceId]);

    if (requests.length === 0) return res.status(404).json({ error: 'Request not found' });
    if (requests[0].owner_id !== user.id) return res.status(403).json({ error: 'Access denied' });

    if (status && !['open', 'in_progress', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updates = [];
    const params = [];
    if (status) {
      updates.push("status = ?");
      params.push(status);
      if (status === 'completed') {
        updates.push("completed_date = NOW()");
      }
    }

    if (updates.length > 0) {
      updates.push("updated_at = NOW()");
      params.push(maintenanceId);
      await sql.query(`UPDATE maintenance_requests SET ${updates.join(', ')} WHERE id = ?`, params);
    }

    const [updated] = await sql.query("SELECT * FROM maintenance_requests WHERE id = ?", [maintenanceId]);
    createAuditLog(user.id, 'update_maintenance', 'maintenance', maintenanceId, { status }, getIpAddress(req));

    res.json(updated[0]);
  } catch (error) {
    console.error('Update Maintenance Error:', error);
    res.status(500).json({ error: 'Server error updating maintenance request' });
  }
};

// Add Maintenance Note
exports.addMaintenanceNote = async (req, res) => {
  try {
    const user = getUser(req);
    const maintenanceId = parseInt(req.params.id);
    const { note } = req.body;

    if (!note) return res.status(400).json({ error: 'Note is required' });

    const [requests] = await sql.query(`
        SELECT mr.*, p.owner_id 
        FROM maintenance_requests mr 
        JOIN properties p ON mr.property_id = p.id 
        WHERE mr.id = ?
    `, [maintenanceId]);

    if (requests.length === 0) return res.status(404).json({ error: 'Request not found' });
    if (requests[0].owner_id !== user.id) return res.status(403).json({ error: 'Access denied' });

    let currentNotes = typeof requests[0].notes === 'string' ? JSON.parse(requests[0].notes || '[]') : requests[0].notes;
    currentNotes.push({
      note,
      addedBy: user.id,
      addedAt: new Date().toISOString()
    });

    await sql.query("UPDATE maintenance_requests SET notes = ?, updated_at = NOW() WHERE id = ?", [JSON.stringify(currentNotes), maintenanceId]);

    requests[0].notes = currentNotes;
    createAuditLog(user.id, 'add_maintenance_note', 'maintenance', maintenanceId, { note }, getIpAddress(req));

    res.json(requests[0]);
  } catch (error) {
    console.error('Add Note Error:', error);
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
// Update Subscription
exports.updateSubscription = async (req, res) => {
  try {
    const user = getUser(req);
    const subscriptionId = parseInt(req.params.id);
    const { planId, autoRenew } = req.body;

    const [subs] = await sql.query("SELECT * FROM manager_subscriptions WHERE id = ? AND owner_id = ?", [subscriptionId, user.id]);
    if (subs.length === 0) return res.status(404).json({ error: 'Subscription not found' });

    const updates = [];
    const params = [];

    // Simple stub for updating plan (assuming we just update ID and Fee)
    if (planId) {
      // Logic to find plan price would be here
      updates.push("plan_id = ?");
      params.push(planId);
    }
    if (autoRenew !== undefined) {
      updates.push("auto_renew = ?");
      params.push(autoRenew);
    }

    if (updates.length > 0) {
      await sql.query(`UPDATE manager_subscriptions SET ${updates.join(', ')} WHERE id = ?`, [...params, subscriptionId]);
    }

    createAuditLog(user.id, 'update_subscription', 'subscription', subscriptionId, { planId, autoRenew }, getIpAddress(req));
    res.json({ message: 'Subscription updated' });
  } catch (error) {
    console.error('Update Subscription Error:', error);
    res.status(500).json({ error: 'Server error updating subscription' });
  }
};

// Cancel Subscription
exports.cancelSubscription = async (req, res) => {
  try {
    const user = getUser(req);
    const subscriptionId = parseInt(req.params.id);

    const [subs] = await sql.query("SELECT * FROM manager_subscriptions WHERE id = ? AND owner_id = ?", [subscriptionId, user.id]);
    if (subs.length === 0) return res.status(404).json({ error: 'Subscription not found' });

    // Set end date to 30 days from now
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);

    await sql.query("UPDATE manager_subscriptions SET status = 'cancelled', cancelled_at = NOW(), end_date = ? WHERE id = ?", [endDate, subscriptionId]);

    createAuditLog(user.id, 'cancel_subscription', 'subscription', subscriptionId, {}, getIpAddress(req));
    res.json({ message: 'Subscription cancelled successfully' });
  } catch (error) {
    console.error('Cancel Subscription Error:', error);
    res.status(500).json({ error: 'Server error cancelling subscription' });
  }
};

// Get Subscription Payments (Stub)
exports.getSubscriptionPayments = async (req, res) => {
  // Return empty list as table likely doesn't exist yet
  res.json([]);
};

// Pay Subscription (Stub)
exports.paySubscription = async (req, res) => {
  res.status(501).json({ error: 'Payment feature coming soon' });
};

// Get Service Agreement (Stub)
exports.getServiceAgreement = async (req, res) => {
  res.status(501).json({ error: 'Agreements feature coming soon' });
};

// Submit Manager Review (Stub/SQL)
exports.submitManagerReview = async (req, res) => {
  try {
    const user = getUser(req);
    const subscriptionId = parseInt(req.params.id);
    const { rating, review } = req.body;

    const [subs] = await sql.query("SELECT * FROM manager_subscriptions WHERE id = ? AND owner_id = ?", [subscriptionId, user.id]);
    if (subs.length === 0) return res.status(404).json({ error: 'Subscription not found' });

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Insert Review
    // Assuming 'manager_reviews' table might NOT exist, wrapping in try/catch specific
    try {
      await sql.query(`
            INSERT INTO manager_reviews (manager_id, owner_id, subscription_id, rating, review, created_at)
            VALUES (?, ?, ?, ?, ?, NOW())
        `, [subs[0].manager_id, user.id, subscriptionId, rating, review]);

      createAuditLog(user.id, 'submit_review', 'manager_review', subscriptionId, { rating }, getIpAddress(req));
      res.status(201).json({ message: 'Review submitted' });
    } catch (e) {
      if (e.code === 'ER_NO_SUCH_TABLE') {
        return res.json({ message: 'Review submitted (Mocked)' });
      }
      throw e;
    }
  } catch (error) {
    console.error('Submit Review Error:', error);
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

