const sql = require('../config/db');

const Application = function (application) {
    this.property_id = application.propertyId;
    this.applicant_id = application.applicantId;
    this.status = application.status;
    this.notes = application.notes;
};

Application.create = async (newApp) => {
    try {
        const query = 'INSERT INTO applications (property_id, applicant_id, status, notes) VALUES (?, ?, ?, ?)';
        const [res] = await sql.query(query, [
            newApp.property_id,
            newApp.applicant_id,
            newApp.status || 'pending',
            JSON.stringify(newApp.notes || [])
        ]);
        return { id: res.insertId, ...newApp };
    } catch (err) {
        throw err;
    }
};

Application.findById = async (id) => {
    try {
        const [rows] = await sql.query('SELECT * FROM applications WHERE id = ?', [id]);
        if (rows.length) {
            return rows[0];
        }
        return null;
    } catch (err) {
        throw err;
    }
};

Application.findAllByProperty = async (propertyId) => {
    try {
        const [rows] = await sql.query('SELECT * FROM applications WHERE property_id = ?', [propertyId]);
        return rows;
    } catch (err) {
        throw err;
    }
};

Application.findAll = async () => {
    try {
        const [rows] = await sql.query('SELECT * FROM applications');
        return rows;
    } catch (err) {
        throw err;
    }
};

Application.update = async (id, app) => {
    try {
        let query = 'UPDATE applications SET updated_at = NOW()';
        const params = [];

        if (app.status) { query += ', status = ?'; params.push(app.status); }
        if (app.notes) { query += ', notes = ?'; params.push(JSON.stringify(app.notes)); }

        query += ' WHERE id = ?';
        params.push(id);

        const [res] = await sql.query(query, params);
        return res.affectedRows > 0;
    } catch (err) {
        throw err;
    }
};

module.exports = Application;
