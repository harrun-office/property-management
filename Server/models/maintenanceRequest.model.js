const sql = require('../config/db');

const MaintenanceRequest = function (request) {
    this.property_id = request.propertyId;
    this.tenant_id = request.tenantId;
    this.title = request.title;
    this.description = request.description;
    this.priority = request.priority;
    this.status = request.status;
    this.photos = request.photos;
    this.notes = request.notes;
};

MaintenanceRequest.create = async (newRequest) => {
    try {
        const query = 'INSERT INTO maintenance_requests (property_id, tenant_id, title, description, priority, status, photos, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const [res] = await sql.query(query, [
            newRequest.property_id,
            newRequest.tenant_id,
            newRequest.title,
            newRequest.description,
            newRequest.priority || 'medium',
            newRequest.status || 'open',
            JSON.stringify(newRequest.photos || []),
            JSON.stringify(newRequest.notes || [])
        ]);
        return { id: res.insertId, ...newRequest };
    } catch (err) {
        throw err;
    }
};

MaintenanceRequest.findById = async (id) => {
    try {
        const [rows] = await sql.query('SELECT * FROM maintenance_requests WHERE id = ?', [id]);
        if (rows.length) {
            return rows[0];
        }
        return null;
    } catch (err) {
        throw err;
    }
};

MaintenanceRequest.findAllByProperty = async (propertyId) => {
    try {
        const [rows] = await sql.query('SELECT * FROM maintenance_requests WHERE property_id = ?', [propertyId]);
        return rows;
    } catch (err) {
        throw err;
    }
};

MaintenanceRequest.findAllByTenant = async (tenantId) => {
    try {
        const [rows] = await sql.query('SELECT * FROM maintenance_requests WHERE tenant_id = ?', [tenantId]);
        return rows;
    } catch (err) {
        throw err;
    }
};

MaintenanceRequest.findAll = async () => {
    try {
        const [rows] = await sql.query('SELECT * FROM maintenance_requests');
        return rows;
    } catch (err) {
        throw err;
    }
};

MaintenanceRequest.update = async (id, request) => {
    try {
        let query = 'UPDATE maintenance_requests SET updated_at = NOW()';
        const params = [];

        if (request.status) { query += ', status = ?'; params.push(request.status); }
        if (request.priority) { query += ', priority = ?'; params.push(request.priority); }
        if (request.notes) { query += ', notes = ?'; params.push(JSON.stringify(request.notes)); }
        if (request.photos) { query += ', photos = ?'; params.push(JSON.stringify(request.photos)); }

        query += ' WHERE id = ?';
        params.push(id);

        const [res] = await sql.query(query, params);
        return res.affectedRows > 0;
    } catch (err) {
        throw err;
    }
};

module.exports = MaintenanceRequest;
