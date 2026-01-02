const sql = require('../config/db');

const Message = function (message) {
    this.property_id = message.propertyId;
    this.sender_id = message.senderId;
    this.recipient_id = message.recipientId;
    this.subject = message.subject;
    this.message_text = message.message;
    this.is_read = message.read;
};

Message.create = async (newMessage) => {
    try {
        const query = 'INSERT INTO messages (property_id, sender_id, recipient_id, subject, message_text, is_read, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())';
        const [res] = await sql.query(query, [
            newMessage.property_id,
            newMessage.sender_id,
            newMessage.recipient_id,
            newMessage.subject || 'No Subject',
            newMessage.message_text,
            newMessage.is_read || false
        ]);
        return { id: res.insertId, ...newMessage };
    } catch (err) {
        throw err;
    }
};

Message.findById = async (id) => {
    try {
        const [rows] = await sql.query('SELECT * FROM messages WHERE id = ?', [id]);
        return rows[0] || null;
    } catch (err) {
        throw err;
    }
};

Message.findByUser = async (userId) => {
    try {
        // Messages where user is sender OR recipient
        const query = 'SELECT * FROM messages WHERE sender_id = ? OR recipient_id = ? ORDER BY created_at DESC';
        const [rows] = await sql.query(query, [userId, userId]);
        return rows;
    } catch (err) {
        throw err;
    }
};

Message.getItemsByProperty = async (propertyId) => {
    try {
        const [rows] = await sql.query('SELECT * FROM messages WHERE property_id = ? ORDER BY created_at DESC', [propertyId]);
        return rows;
    } catch (err) {
        throw err;
    }
}

Message.markAsRead = async (id) => {
    try {
        const [res] = await sql.query('UPDATE messages SET is_read = TRUE, read_at = NOW(), updated_at = NOW() WHERE id = ?', [id]);
        return res.affectedRows > 0;
    } catch (err) {
        throw err;
    }
};

module.exports = Message;
