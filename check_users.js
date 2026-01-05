
const mysql = require('mysql2/promise');
require('dotenv').config();

async function listUsers() {
    let connection;
    try {
        console.log('Connecting to database...');
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'root', // fallback to 'root' as seen in verify script
            database: process.env.DB_NAME || 'property_management_db'
        });

        console.log('Connected. Querying users...');
        const [users] = await connection.query('SELECT id, email, password, role, name, status FROM users');

        console.log('--- USER CREDENTIALS FOUND IN DB ---');
        console.log(JSON.stringify(users, null, 2));

    } catch (error) {
        console.error('Error listing users:', error);
    } finally {
        if (connection) await connection.end();
    }
}

listUsers();
