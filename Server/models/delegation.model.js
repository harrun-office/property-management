const sql = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const Delegation = function (delegation) {
    this.delegation_uuid = delegation.uuid || uuidv4();
    this.grantor_id = delegation.grantorId;
    this.grantee_id = delegation.granteeId;
    this.role = delegation.role || null;
    this.scope = delegation.scope || {};
    this.permissions = delegation.permissions || [];
    this.valid_from = delegation.validFrom;
    this.valid_until = delegation.validUntil;
    this.status = delegation.status || 'active';
    this.reason = delegation.reason;
};

Delegation.create = async (newDelegation) => {
    try {
        const query = `INSERT INTO delegations 
      (delegation_uuid, grantor_id, grantee_id, role, scope, permissions, valid_from, valid_until, status, reason, created_at, updated_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;

        const [res] = await sql.query(query, [
            newDelegation.delegation_uuid,
            newDelegation.grantor_id,
            newDelegation.grantee_id,
            newDelegation.role,
            JSON.stringify(newDelegation.scope),
            JSON.stringify(newDelegation.permissions),
            newDelegation.valid_from,
            newDelegation.valid_until,
            newDelegation.status,
            newDelegation.reason
        ]);

        return { id: res.insertId, ...newDelegation };
    } catch (err) {
        throw err;
    }
};

Delegation.findActiveByGrantee = async (granteeId) => {
    try {
        const query = `SELECT * FROM delegations 
                   WHERE grantee_id = ? 
                   AND status = 'active' 
                   AND valid_from <= NOW() 
                   AND valid_until >= NOW()`;
        const [rows] = await sql.query(query, [granteeId]);
        return rows;
    } catch (err) {
        throw err;
    }
};

Delegation.revoke = async (id, status = 'revoked') => {
    try {
        const [res] = await sql.query('UPDATE delegations SET status = ?, updated_at = NOW() WHERE id = ?', [status, id]);
        return res.affectedRows > 0;
    } catch (err) {
        throw err;
    }
};

module.exports = Delegation;
