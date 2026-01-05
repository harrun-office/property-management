
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const logFile = path.join(__dirname, 'users_list.txt');
function log(msg) {
    fs.appendFileSync(logFile, msg + '\r\n'); // Use \r\n for windows readability
    console.log(msg);
}

async function listUsers() {
    let connection;
    try {
        log('Connecting...');
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'property_management_db'
        });

        const [users] = await connection.query('SELECT id, email, password, role, name, status FROM users');

        log('--- USER DATA ---');
        log(JSON.stringify(users, null, 2));

    } catch (error) {
        log('Error: ' + error.message);
    } finally {
        if (connection) await connection.end();
        process.exit(0);
    }
}

// Clear log file
try { fs.unlinkSync(logFile); } catch (e) { }
listUsers();
