const sql = require('../config/db');

const User = function (user) {
    this.email = user.email;
    this.password = user.password;
    this.name = user.name;
    this.role = user.role;
    this.status = user.status;
    this.mobileNumber = user.mobileNumber;
    this.permissions = user.permissions;
};

User.create = async (newUser) => {
    try {
        const query = 'INSERT INTO users (email, password, name, role, status, mobile_number, permissions) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const [res] = await sql.query(query, [
            newUser.email,
            newUser.password,
            newUser.name,
            newUser.role,
            newUser.status || 'active',
            newUser.mobileNumber,
            JSON.stringify(newUser.permissions || {})
        ]);
        return { id: res.insertId, ...newUser };
    } catch (err) {
        throw err;
    }
};

User.findByEmail = async (email) => {
    try {
        const [rows] = await sql.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length) {
            return rows[0];
        }
        return null;
    } catch (err) {
        throw err;
    }
};

User.findById = async (id) => {
    try {
        const [rows] = await sql.query('SELECT * FROM users WHERE id = ?', [id]);
        if (rows.length) {
            return rows[0];
        }
        return null;
    } catch (err) {
        throw err;
    }
};

User.updateStatus = async (id, status) => {
    try {
        const [res] = await sql.query('UPDATE users SET status = ? WHERE id = ?', [status, id]);
        return res.affectedRows > 0;
    } catch (err) {
        throw err;
    }
};

module.exports = User;
