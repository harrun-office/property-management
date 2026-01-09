const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'property_management_db'
};

async function dumpUsers() {
    try {
        console.log('Connecting to DB:', dbConfig.database);
        const connection = await mysql.createConnection(dbConfig);

        console.log('Querying users table...');
        const [rows] = await connection.execute('SELECT id, email, role, status FROM users');

        console.log('--- USERS IN DB ---');
        console.table(rows);
        console.log('-------------------');

        const [prof] = await connection.execute('SELECT * FROM users WHERE email = ?', ['professor@gmail.com']);
        console.log('Direct Query for professor@gmail.com:', prof);

        await connection.end();
    } catch (error) {
        console.error('Debug Error:', error);
    }
}

dumpUsers();
