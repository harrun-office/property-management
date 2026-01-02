// Create default admin user
require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function createAdminUser() {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        const hashedPassword = await bcrypt.hash('admin123', 10);

        await connection.query(`
            INSERT IGNORE INTO users (email, password, name, role, status, permissions)
            VALUES (?, ?, 'Super Admin', 'super_admin', 'active', ?)
        `, [
            'admin@property.com',
            hashedPassword,
            JSON.stringify({
                all_access: true,
                manage_users: true,
                manage_properties: true,
                manage_tasks: true,
                view_reports: true
            })
        ]);

        console.log('✅ Default admin user created successfully!');
        console.log('📧 Email: admin@property.com');
        console.log('🔑 Password: admin123');

    } catch (error) {
        console.error('❌ Error creating admin user:', error.message);
    } finally {
        if (connection) await connection.end();
    }
}

createAdminUser();
