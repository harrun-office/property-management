// Script to add mobile numbers to existing users
const mysql = require('mysql2/promise');
require('dotenv').config();

async function updateUserPhones() {
    let connection;

    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'root',
            database: process.env.DB_NAME || 'property_management_db'
        });

        console.log('Connected to database');

        // Update existing users with mobile numbers
        const updates = [
            { email: 'tenant@example.com', phone: '+1-555-0123' },
            { email: 'owner@example.com', phone: '+1-555-0456' },
            { email: 'manager1@propmanage.com', phone: '+1-555-0789' },
            { email: 'manager2@propmanage.com', phone: '+1-555-0321' },
            { email: 'plumber@vendor.com', phone: '+1-555-0654' },
            { email: 'electrician@vendor.com', phone: '+1-555-0987' }
        ];

        for (const update of updates) {
            await connection.query(
                'UPDATE users SET mobile_number = ? WHERE email = ?',
                [update.phone, update.email]
            );
            console.log(`Updated ${update.email} with phone ${update.phone}`);
        }

        console.log('✅ All user phone numbers updated successfully');

    } catch (error) {
        console.error('❌ Error updating user phones:', error);
    } finally {
        if (connection) await connection.end();
    }
}

updateUserPhones();
