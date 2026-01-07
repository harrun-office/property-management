const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'property_management_db'
};

const logFile = path.join(__dirname, 'status_fix_result.txt');

function log(message) {
    console.log(message);
    try { fs.appendFileSync(logFile, message + '\n'); } catch (e) { }
}

async function fixStatus() {
    try {
        try { fs.writeFileSync(logFile, 'Starting status fix...\n'); } catch (e) { }
        const connection = await mysql.createConnection(dbConfig);
        log('Connected to database.');

        // Modify status column to VARCHAR to allow 'active', 'rented', etc.
        try {
            await connection.query(`ALTER TABLE properties MODIFY COLUMN status VARCHAR(50) DEFAULT 'active'`);
            log('Modified status column to VARCHAR(50).');
        } catch (e) {
            log('Error modifying status: ' + e.message);
        }

        log('Status fix completed.');
        await connection.end();
        process.exit(0);
    } catch (error) {
        log('Fatal error fixing status: ' + error.message);
        process.exit(1);
    }
}

fixStatus();
