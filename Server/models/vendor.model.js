const sql = require('../config/db');

const Vendor = function (vendor) {
    this.user_id = vendor.userId;
    this.company_name = vendor.companyName;
    this.contact_name = vendor.contactName;
    this.phone = vendor.phone;
    this.email = vendor.email;
    this.service_types = vendor.serviceTypes;
    this.permission_scope = vendor.permissionScope;
    this.status = vendor.status;
};

Vendor.create = async (newVendor) => {
    try {
        const query = 'INSERT INTO vendor_profiles (user_id, company_name, contact_name, phone, email, service_types, permission_scope, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const [res] = await sql.query(query, [
            newVendor.user_id,
            newVendor.company_name,
            newVendor.contact_name,
            newVendor.phone,
            newVendor.email,
            JSON.stringify(newVendor.service_types || []),
            newVendor.permission_scope || 'task_based',
            newVendor.status || 'active'
        ]);
        return { id: res.insertId, ...newVendor };
    } catch (err) {
        throw err;
    }
};

Vendor.findByUserId = async (userId) => {
    try {
        const [rows] = await sql.query('SELECT * FROM vendor_profiles WHERE user_id = ?', [userId]);
        if (rows.length) {
            return rows[0];
        }
        return null;
    } catch (err) {
        throw err;
    }
};

Vendor.findAll = async () => {
    try {
        const [rows] = await sql.query('SELECT * FROM vendor_profiles');
        return rows;
    } catch (err) {
        throw err;
    }
};

Vendor.update = async (id, vendor) => {
    try {
        const query = 'UPDATE vendor_profiles SET company_name = ?, phone = ?, service_types = ?, permission_scope = ?, status = ? WHERE id = ?';
        const [res] = await sql.query(query, [
            vendor.companyName,
            vendor.phone,
            JSON.stringify(vendor.serviceTypes),
            vendor.permissionScope,
            vendor.status,
            id
        ]);
        return res.affectedRows > 0;
    } catch (err) {
        throw err;
    }
};

// Assign vendor to property
Vendor.assignToProperty = async (propertyId, vendorUserId, permissionScope) => {
    try {
        const query = 'INSERT INTO property_vendors (property_id, vendor_user_id, permission_scope) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE permission_scope = ?';
        const [res] = await sql.query(query, [propertyId, vendorUserId, permissionScope, permissionScope]);
        return res;
    } catch (err) {
        throw err;
    }
};

module.exports = Vendor;
