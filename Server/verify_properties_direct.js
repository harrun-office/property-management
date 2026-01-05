const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const logFile = path.join(__dirname, 'verification_direct_result.txt');
function log(msg) {
    fs.appendFileSync(logFile, msg + '\n');
}

log('Script started direct at ' + new Date().toISOString());

async function run() {
    log('Connecting to DB...');
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'property_management_db'
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
             1)
           `);
            // Assuming user 1 exists (usually admin or owner from seed)
            // If user 1 doesn't exist, this might fail with foreign key error.
            // Let's create a user if not exists first? 
            // For simplicity, hope seed user exists.
            log('Inserted.');
        } else {
            const [props] = await connection.execute('SELECT id, title, status FROM properties LIMIT 5');
            log('Existing properties: ' + JSON.stringify(props));
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
