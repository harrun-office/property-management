const sql = require('../config/db');

const Payment = function (payment) {
    this.property_id = payment.propertyId;
    this.tenant_id = payment.tenantId;
    this.amount = payment.amount;
    this.due_date = payment.dueDate;
    this.status = payment.status;
    this.paid_date = payment.paidDate;
    this.payment_method = payment.paymentMethod;
};

Payment.create = async (newPayment) => {
    try {
        const query = 'INSERT INTO payments (property_id, tenant_id, amount, due_date, status, paid_date, payment_method) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const [res] = await sql.query(query, [
            newPayment.property_id,
            newPayment.tenant_id,
            newPayment.amount,
            newPayment.due_date,
            newPayment.status || 'pending',
            newPayment.paid_date || null,
            newPayment.payment_method || 'manual'
        ]);
        return { id: res.insertId, ...newPayment };
    } catch (err) {
        throw err;
    }
};

Payment.findById = async (id) => {
    try {
        const [rows] = await sql.query('SELECT * FROM payments WHERE id = ?', [id]);
        if (rows.length) {
            return rows[0];
        }
        return null;
    } catch (err) {
        throw err;
    }
};

Payment.findAllByProperty = async (propertyId) => {
    try {
        const [rows] = await sql.query('SELECT * FROM payments WHERE property_id = ?', [propertyId]);
        return rows;
    } catch (err) {
        throw err;
    }
};

Payment.findAllByTenant = async (tenantId) => {
    try {
        const [rows] = await sql.query('SELECT * FROM payments WHERE tenant_id = ?', [tenantId]);
        return rows;
    } catch (err) {
        throw err;
    }
};

Payment.findAll = async () => {
    try {
        const [rows] = await sql.query('SELECT * FROM payments');
        return rows;
    } catch (err) {
        throw err;
    }
};

module.exports = Payment;
