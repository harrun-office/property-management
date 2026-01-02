
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function createUsersTable() {
    try {
        console.log('Connecting to DB...');
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('Connected. Creating users table...');

        const createTableSQL = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            name VARCHAR(255) NOT NULL,
            role ENUM('super_admin', 'property_manager', 'property_owner', 'vendor', 'tenant', 'user') NOT NULL,
            status ENUM('active', 'inactive', 'pending', 'pending_invitation') DEFAULT 'active',
            region VARCHAR(50) DEFAULT 'US',
            mobile_number VARCHAR(20),
            invited_by INT,
            invitation_token VARCHAR(255),
            invitation_expires DATETIME,
            settings JSON,
            permissions JSON,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (invited_by) REFERENCES users(id) ON DELETE SET NULL,
            INDEX idx_user_role (role),
            INDEX idx_user_email (email)
        ) ENGINE=InnoDB;
        `;

        await connection.query(createTableSQL);
        console.log('Users table created successfully.');

        const [rows] = await connection.query('SHOW TABLES');
        console.log('Tables in DB:', rows);

        await connection.end();
    } catch (error) {
        console.error('Error creating table:', error);
    }
}

createUsersTable();
