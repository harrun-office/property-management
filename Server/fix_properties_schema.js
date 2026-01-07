const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'property_management_db'
};

const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, 'schema_fix_result.txt');

function log(message) {
    console.log(message);
    try { fs.appendFileSync(logFile, message + '\n'); } catch (e) { }
}

async function fixSchema() {
    try {
        try { fs.writeFileSync(logFile, 'Starting schema fix...\n'); } catch (e) { }
        const connection = await mysql.createConnection(dbConfig);
        log('Connected to database.');

        // Add missing columns
        // images
        try {
            await connection.query(`ALTER TABLE properties ADD COLUMN images JSON`);
            console.log('Added images column.');
        } catch (e) {
            if (e.code !== 'ER_DUP_FIELDNAME') console.error('Error adding images:', e.message);
            else console.log('images column already exists.');
        }

        // utilities
        try {
            await connection.query(`ALTER TABLE properties ADD COLUMN utilities JSON`);
            console.log('Added utilities column.');
        } catch (e) {
            if (e.code !== 'ER_DUP_FIELDNAME') console.error('Error adding utilities:', e.message);
            else console.log('utilities column already exists.');
        }

        // pet_policy
        try {
            await connection.query(`ALTER TABLE properties ADD COLUMN pet_policy ENUM('allowed', 'not_allowed', 'case_by_case') DEFAULT 'not_allowed'`);
            console.log('Added pet_policy column.');
        } catch (e) {
            if (e.code !== 'ER_DUP_FIELDNAME') console.error('Error adding pet_policy:', e.message);
            else console.log('pet_policy column already exists.');
        }

        // parking_spaces
        try {
            await connection.query(`ALTER TABLE properties ADD COLUMN parking_spaces INT DEFAULT 0`);
            console.log('Added parking_spaces column.');
        } catch (e) {
            if (e.code !== 'ER_DUP_FIELDNAME') console.error('Error adding parking_spaces:', e.message);
            else console.log('parking_spaces column already exists.');
        }

        // lease_terms
        try {
            await connection.query(`ALTER TABLE properties ADD COLUMN lease_terms VARCHAR(255) DEFAULT '12 months'`);
            console.log('Added lease_terms column.');
        } catch (e) {
            if (e.code !== 'ER_DUP_FIELDNAME') console.error('Error adding lease_terms:', e.message);
            else console.log('lease_terms column already exists.');
        }

        // monthly_rent
        try {
            await connection.query(`ALTER TABLE properties ADD COLUMN monthly_rent DECIMAL(10,2)`);
            console.log('Added monthly_rent column.');
        } catch (e) {
            if (e.code !== 'ER_DUP_FIELDNAME') console.error('Error adding monthly_rent:', e.message);
            else console.log('monthly_rent column already exists.');
        }

        // security_deposit
        try {
            await connection.query(`ALTER TABLE properties ADD COLUMN security_deposit DECIMAL(10,2)`);
            console.log('Added security_deposit column.');
        } catch (e) {
            if (e.code !== 'ER_DUP_FIELDNAME') console.error('Error adding security_deposit:', e.message);
            else console.log('security_deposit column already exists.');
        }

        // available_date
        try {
            await connection.query(`ALTER TABLE properties ADD COLUMN available_date DATE`);
            console.log('Added available_date column.');
        } catch (e) {
            if (e.code !== 'ER_DUP_FIELDNAME') console.error('Error adding available_date:', e.message);
            else console.log('available_date column already exists.');
        }

        // Verify columns
        const [rows] = await connection.execute(`
            SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'properties'
        `, [dbConfig.database]);

        console.log('Final columns in properties table:', rows.map(r => r.COLUMN_NAME).join(', '));

        console.log('Schema fix completed.');
        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('Fatal error fixing schema:', error);
        process.exit(1);
    }
}

fixSchema();
