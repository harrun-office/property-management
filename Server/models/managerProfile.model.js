const sql = require('../config/db');

const ManagerProfile = function (profile) {
    this.manager_id = profile.managerId;
    this.location = profile.location;
    // Add other fields as per schema if needed
};

ManagerProfile.create = async (newProfile) => {
    try {
        const query = 'INSERT INTO manager_profiles (manager_id, location, created_at, updated_at) VALUES (?, ?, NOW(), NOW())';
        const [res] = await sql.query(query, [
            newProfile.manager_id,
            newProfile.location
        ]);
        return { id: res.insertId, ...newProfile };
    } catch (err) {
        throw err;
    }
};

ManagerProfile.findByManagerId = async (managerId) => {
    try {
        const [rows] = await sql.query('SELECT * FROM manager_profiles WHERE manager_id = ?', [managerId]);
        return rows[0] || null;
    } catch (err) {
        throw err;
    }
};

ManagerProfile.findAll = async () => {
    try {
        const [rows] = await sql.query('SELECT * FROM manager_profiles');
        return rows;
    } catch (err) {
        throw err;
    }
};

module.exports = ManagerProfile;
