// Verify users in database
require('dotenv').config();
const mysql = require('mysql2/promise');

async function verifyUsers() {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        const [rows] = await connection.query('SELECT id, email, role, status FROM users ORDER BY id');

        console.log('📋 Users in database:');
        rows.forEach(user => {
            console.log(`  ${user.id}. ${user.email} (${user.role}) - ${user.status}`);
        });

        console.log(`\n✅ Total users: ${rows.length}`);

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        if (connection) await connection.end();
    }
}

verifyUsers();
