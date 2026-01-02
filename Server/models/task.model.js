const sql = require('../config/db');

const Task = function (task) {
    this.property_id = task.propertyId;
    this.assigned_vendor_id = task.assignedVendorId;
    this.assigned_by = task.assignedBy;
    this.title = task.title;
    this.description = task.description;
    this.priority = task.priority;
    this.status = task.status;
    this.due_date = task.dueDate;
};

Task.create = async (newTask) => {
    try {
        const query = 'INSERT INTO vendor_tasks (property_id, assigned_vendor_id, assigned_by, title, description, priority, status, due_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const [res] = await sql.query(query, [
            newTask.property_id,
            newTask.assigned_vendor_id,
            newTask.assigned_by,
            newTask.title,
            newTask.description,
            newTask.priority || 'medium',
            newTask.status || 'pending',
            newTask.due_date
        ]);
        return { id: res.insertId, ...newTask };
    } catch (err) {
        throw err;
    }
};

Task.findById = async (id) => {
    try {
        const [rows] = await sql.query('SELECT * FROM vendor_tasks WHERE id = ?', [id]);
        if (rows.length) {
            return rows[0];
        }
        return null;
    } catch (err) {
        throw err;
    }
};

Task.findAllByProperty = async (propertyId) => {
    try {
        const [rows] = await sql.query('SELECT * FROM vendor_tasks WHERE property_id = ?', [propertyId]);
        return rows;
    } catch (err) {
        throw err;
    }
};

Task.findAllByVendor = async (vendorId) => {
    try {
        const [rows] = await sql.query('SELECT * FROM vendor_tasks WHERE assigned_vendor_id = ?', [vendorId]);
        return rows;
    } catch (err) {
        throw err;
    }
};

Task.findAll = async () => {
    try {
        const [rows] = await sql.query('SELECT * FROM vendor_tasks');
        return rows;
    } catch (err) {
        throw err;
    }
}

Task.update = async (id, task) => {
    try {
        // Dynamic update builder could be better, but explicit for now
        let query = 'UPDATE vendor_tasks SET updated_at = NOW()';
        const params = [];

        if (task.title) { query += ', title = ?'; params.push(task.title); }
        if (task.description) { query += ', description = ?'; params.push(task.description); }
        if (task.priority) { query += ', priority = ?'; params.push(task.priority); }
        if (task.status) { query += ', status = ?'; params.push(task.status); }
        if (task.dueDate) { query += ', due_date = ?'; params.push(task.dueDate); }
        if (task.quotationAmount) { query += ', quotation_amount = ?'; params.push(task.quotationAmount); }

        query += ' WHERE id = ?';
        params.push(id);

        const [res] = await sql.query(query, params);
        return res.affectedRows > 0;
    } catch (err) {
        throw err;
    }
};

module.exports = Task;
