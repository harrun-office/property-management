const sql = require('../config/db');

const EmergencyRequest = function (request) {
    this.requester_id = request.requesterId;
    this.incident_ticket = request.incidentTicket;
    this.justification = request.justification;
    this.status = request.status || 'pending';
    this.approved_by = request.approvedBy;
    this.activated_at = request.activatedAt;
    this.expires_at = request.expiresAt;
};

EmergencyRequest.create = async (newRequest) => {
    try {
        const query = `INSERT INTO emergency_requests 
      (requester_id, incident_ticket, justification, status, created_at) 
      VALUES (?, ?, ?, 'pending', NOW())`;

        const [res] = await sql.query(query, [
            newRequest.requester_id,
            newRequest.incident_ticket,
            newRequest.justification
        ]);

        return { id: res.insertId, ...newRequest };
    } catch (err) {
        throw err;
    }
};

EmergencyRequest.activate = async (id, approvedBy, durationHours = 2) => {
    try {
        const expiresAt = new Date(Date.now() + durationHours * 60 * 60 * 1000);
        const query = `UPDATE emergency_requests 
                       SET status = 'active', 
                           approved_by = ?, 
                           activated_at = NOW(), 
                           expires_at = ? 
                       WHERE id = ?`;
        const [res] = await sql.query(query, [approvedBy, expiresAt, id]);
        return res.affectedRows > 0;
    } catch (err) {
        throw err;
    }
};

EmergencyRequest.findActiveByUserId = async (userId) => {
    try {
        const query = `SELECT * FROM emergency_requests 
                       WHERE requester_id = ? 
                       AND status = 'active' 
                       AND expires_at > NOW()`;
        const [rows] = await sql.query(query, [userId]);
        return rows[0] || null;
    } catch (err) {
        throw err;
    }
}

module.exports = EmergencyRequest;
