
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') }); // Explicitly resolve to Server/.env given script is in Server/scripts/

const schemaPath = path.join(__dirname, 'schema_dump.sql');

async function initDb() {
    let connection;
    try {
        console.log('Reading schema file from:', schemaPath);
        const schema = fs.readFileSync(schemaPath, 'utf8');

        console.log('Connecting to database server...');
        // Connect to server without DB selected first to create it
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            multipleStatements: true
        });

        const logFile = path.join(__dirname, 'debug_schema.log');
        fs.writeFileSync(logFile, 'Starting schema execution...\n');
        const log = (msg) => {
            console.log(msg);
            fs.appendFileSync(logFile, msg + '\n');
        };

        log('Executing schema statements...');
        // Split by semicolon but ignore semicolons inside comments or strings (simplified)
        // A better approach for this debug:
        const statements = schema
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            try {
                // Skip empty lines or pure comments if any remain
                if (!statement || statement.startsWith('--')) continue;

                await connection.query(statement);
                log(`Statement ${i + 1} SUCCESS`);
            } catch (stmtErr) {
                log(`Statement ${i + 1} FAILED: ${stmtErr.message}`);
                log(`SQL: ${statement.substring(0, 50)}...`);
                // Continue despite error to see what else fails
            }
        }

        log('Verifying tables...');

        // Check tables in the target DB
        await connection.changeUser({ database: process.env.DB_NAME });
        const [rows] = await connection.query('SHOW TABLES');
        log('Current Tables: ' + JSON.stringify(rows));
        log('Done.');

        console.log('Database initialized successfully.');

    } catch (err) {
        console.error('Failed to initialize database:', err);
    } finally {
        if (connection) await connection.end();
    }
}

initDb();
