const fs = require('fs');
const path = require('path');
const logFile = path.join(__dirname, 'verification_result.txt');

function log(msg) {
    fs.appendFileSync(logFile, msg + '\n');
}

log('Script started at ' + new Date().toISOString());
require('dotenv').config();
const mysql = require('mysql2/promise');
const dbConfig = require('./config/db.config');

log('Config loaded. DB: ' + dbConfig.DB);

async function run() {
    log('Connecting...');
    try {
        const connection = await mysql.createConnection({
            host: dbConfig.HOST,
            user: dbConfig.USER,
            password: dbConfig.PASSWORD,
            database: dbConfig.DB
        });
        log('Connected!');

        const [rows] = await connection.execute('SELECT COUNT(*) as count FROM properties');
        log('Property Count: ' + rows[0].count);

        if (rows[0].count === 0) {
            log('Inserting seed property...');
            // Insert minimal property
            await connection.execute(`
             INSERT INTO properties 
             (title, description, price, address, property_type, bedrooms, bathrooms, square_feet, year_built, amenities, status, owner_id)
             VALUES 
             ('Emergency Property', 'Test desc', 1000, '123 Test St', 'apartment', 2, 1, 1000, 2020, '[]', 'LISTED', 
             (SELECT id FROM users LIMIT 1))
           `);
            log('Inserted.');
        }

        await connection.end();
        log('Done.');
        process.exit(0);
    } catch (err) {
        log('Error: ' + err.message);
        process.exit(1);
    }
}

run();
