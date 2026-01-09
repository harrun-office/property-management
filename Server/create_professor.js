const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'property_management_db'
};

async function createProfessor() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Connected to database.');

        const email = 'professor@gmail.com';
        const password = 'password123';
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if exists first
        const [existing] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);

        if (existing.length > 0) {
            console.log('User already exists. Updating password...');
            await connection.execute('UPDATE users SET password = ?, role = "tenant" WHERE email = ?', [hashedPassword, email]);
            console.log('User updated.');
        } else {
            console.log('Creating new user...');
            const [result] = await connection.execute(
                'INSERT INTO users (name, email, password, role, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
                ['The Professor', email, hashedPassword, 'tenant']
            );
            console.log(`User created with ID: ${result.insertId}`);
        }

        await connection.end();
        console.log('Done.');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

createProfessor();
