const sql = require('../config/db');

const Property = function (property) {
    this.owner_id = property.ownerId;
    this.title = property.title;
    this.description = property.description;
    this.price = property.price;
    this.address = property.address;
    this.property_type = property.propertyType;
    this.status = property.status;
    this.tenant_id = property.tenantId;
    this.assigned_manager_id = property.assignedManagerId;
};

Property.findById = async (id) => {
    try {
        const query = `
      SELECT p.*, 
             u.name as owner_name, 
             u.email as owner_email
      FROM properties p
      LEFT JOIN users u ON p.owner_id = u.id
      WHERE p.id = ?
    `;
        const [rows] = await sql.query(query, [id]);

        if (rows.length) {
            const property = rows[0];
            // Fetch assigned vendors (M:N)
            const [vendors] = await sql.query(`
        SELECT pv.vendor_user_id as vendorId, pv.permission_scope as permissionScope
        FROM property_vendors pv
        WHERE pv.property_id = ?
      `, [id]);

            // Fetch assigned managers (M:N - currently schema supports this, though mock used assigned_manager_id column)
            // We will check both for backward compatibility or future features
            // Fetch assigned managers (M:N - currently schema supports this, though mock used assigned_manager_id column)
            // We will check both for backward compatibility or future features
            /* 
            const [managers] = await sql.query(`
        SELECT pm.manager_id
        FROM property_managers pm
        WHERE pm.property_id = ?
      `, [id]);
            */
            const managers = []; // Default to empty array if table not present

            property.assignedVendors = vendors;
            property.assignedManagers = managers.map(m => m.manager_id);
            if (property.assigned_manager_id) {
                property.assignedManagers.push(property.assigned_manager_id);
            }

            // Map DB columns to API camelCase expectation if needed, or keeping snake_case for internal
            // For now, let's normalize to camelCase to match legacy mock structure for easier controller compat
            return {
                id: property.id,
                ownerId: property.owner_id,
                ownerName: property.owner_name,
                ownerEmail: property.owner_email,
                title: property.title,
                description: property.description,
                address: property.address,
                price: property.price,
                propertyType: property.property_type,
                bedrooms: property.bedrooms,
                bathrooms: property.bathrooms,
                squareFeet: property.square_feet,
                yearBuilt: property.year_built,
                amenities: (typeof property.amenities === 'string') ? JSON.parse(property.amenities) : (property.amenities || []),
                status: property.status,
                tenantId: property.tenant_id,
                assignedManagerId: property.assigned_manager_id,
                assignedVendors: property.assignedVendors,
                assignedManagers: property.assignedManagers,
                images: (typeof property.images === 'string') ? JSON.parse(property.images) : (property.images || []),
                createdAt: property.created_at,
                updatedAt: property.updated_at
            };
        }
        return null;
    } catch (err) {
        throw err;
    }
};

Property.findAll = async () => {
    // Simple findAll
    const [rows] = await sql.query('SELECT * FROM properties');
    return rows.map(row => ({
        ...row,
        images: (typeof row.images === 'string') ? JSON.parse(row.images) : (row.images || [])
    }));
};

Property.findAllWithFilters = async (filters = {}, limit = 20, offset = 0) => {
    try {
        let query = `
            SELECT p.*,
                   u.name as owner_name,
                   u.email as owner_email,
                   (SELECT COUNT(*) FROM tenants t WHERE t.property_id = p.id AND t.status = 'active') as active_tenants
            FROM properties p
            LEFT JOIN users u ON p.owner_id = u.id
            WHERE 1=1
        `;

        const params = [];

        // Apply filters
        if (filters.status) {
            query += ' AND p.status = ?';
            params.push(filters.status);
        }

        if (filters.property_type) {
            query += ' AND p.property_type = ?';
            params.push(filters.property_type);
        }

        if (filters.min_price) {
            query += ' AND p.price >= ?';
            params.push(filters.min_price);
        }

        if (filters.max_price) {
            query += ' AND p.price <= ?';
            params.push(filters.max_price);
        }

        if (filters.min_bedrooms) {
            query += ' AND p.bedrooms >= ?';
            params.push(filters.min_bedrooms);
        }

        if (filters.location) {
            query += ' AND p.address LIKE ?';
            params.push(`%${filters.location}%`);
        }

        query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);

        const [rows] = await sql.query(query, params);

        // Transform to match expected format
        return rows.map(row => ({
            id: row.id,
            title: row.title,
            description: row.description,
            price: row.price,
            address: row.address,
            propertyType: row.property_type,
            bedrooms: row.bedrooms,
            bathrooms: row.bathrooms,
            squareFeet: row.square_feet,
            yearBuilt: row.year_built,
            amenities: (typeof row.amenities === 'string') ? JSON.parse(row.amenities) : (row.amenities || []),
            status: row.status,
            ownerId: row.owner_id,
            ownerName: row.owner_name,
            ownerEmail: row.owner_email,
            tenantId: row.tenant_id,
            monthlyRent: row.price, // Assuming price is monthly rent
            images: (typeof row.images === 'string') ? JSON.parse(row.images) : (row.images || []),
            createdAt: row.created_at,
            updatedAt: row.updated_at
        }));
    } catch (err) {
        throw err;
    }
};

Property.getCountWithFilters = async (filters = {}) => {
    try {
        let query = 'SELECT COUNT(*) as count FROM properties p WHERE 1=1';
        const params = [];

        // Apply filters
        if (filters.status) {
            query += ' AND p.status = ?';
            params.push(filters.status);
        }

        if (filters.property_type) {
            query += ' AND p.property_type = ?';
            params.push(filters.property_type);
        }

        if (filters.min_price) {
            query += ' AND p.price >= ?';
            params.push(filters.min_price);
        }

        if (filters.max_price) {
            query += ' AND p.price <= ?';
            params.push(filters.max_price);
        }

        if (filters.min_bedrooms) {
            query += ' AND p.bedrooms >= ?';
            params.push(filters.min_bedrooms);
        }

        if (filters.location) {
            query += ' AND p.address LIKE ?';
            params.push(`%${filters.location}%`);
        }

        const [rows] = await sql.query(query, params);
        return rows[0].count;
    } catch (err) {
        throw err;
    }
};

Property.findByOwner = async (ownerId) => {
    try {
        const [rows] = await sql.query(`
            SELECT p.*,
                   COUNT(t.id) as active_tenants
            FROM properties p
            LEFT JOIN tenants t ON p.id = t.property_id AND t.status = 'active'
            WHERE p.owner_id = ?
            GROUP BY p.id
            ORDER BY p.created_at DESC
        `, [ownerId]);

        return rows.map(row => ({
            ...row,
            activeTenants: row.active_tenants,
            images: (typeof row.images === 'string') ? JSON.parse(row.images) : (row.images || [])
        }));
    } catch (err) {
        throw err;
    }
};

module.exports = Property;
