const sql = require('../config/db');

const Tenant = function (tenant) {
    this.user_id = tenant.userId;
    this.property_id = tenant.propertyId;
    this.lease_start_date = tenant.leaseStartDate;
    this.lease_end_date = tenant.leaseEndDate;
    this.monthly_rent = tenant.monthlyRent;
    this.security_deposit = tenant.securityDeposit;
    this.status = tenant.status;
};

Tenant.create = async (newTenant) => {
    try {
        const query = 'INSERT INTO tenants (user_id, property_id, lease_start_date, lease_end_date, monthly_rent, security_deposit, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())';
        const [res] = await sql.query(query, [
            newTenant.user_id,
            newTenant.property_id,
            newTenant.lease_start_date,
            newTenant.lease_end_date,
            newTenant.monthly_rent,
            newTenant.security_deposit || 0,
            newTenant.status || 'active'
        ]);
        return { id: res.insertId, ...newTenant };
    } catch (err) {
        throw err;
    }
};

Tenant.findById = async (id) => {
    try {
        const [rows] = await sql.query('SELECT * FROM tenants WHERE id = ?', [id]);
        return rows[0] || null;
    } catch (err) {
        throw err;
    }
};

Tenant.findActiveTenancy = async (userId) => {
    try {
        const [rows] = await sql.query("SELECT * FROM tenants WHERE user_id = ? AND status = 'active'", [userId]);
        return rows[0] || null;
    } catch (err) {
        throw err;
    }
};

Tenant.findByUserId = async (userId) => {
    try {
        const [rows] = await sql.query('SELECT * FROM tenants WHERE user_id = ?', [userId]);
        return rows[0] || null; // Assuming one active lease per user for now, or returns latest
    } catch (err) {
        throw err;
    }
};

Tenant.findAllByPropertyId = async (propertyId) => {
    try {
        const [rows] = await sql.query('SELECT * FROM tenants WHERE property_id = ?', [propertyId]);
        return rows;
    } catch (err) {
        throw err;
    }
};

module.exports = Tenant;
