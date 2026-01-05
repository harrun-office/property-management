
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const fs = require('fs');

const logFile = './seed_log.txt';
function log(msg) {
    fs.appendFileSync(logFile, msg + '\n');
}

const dbConfig = {
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'property_management_db'
};

async function forceFix() {
    let connection;
    try {
        log('🔌 Connecting to DB (127.0.0.1)...');
        connection = await mysql.createConnection(dbConfig);
        log('✅ Connected.');

        // 1. Create Audit Logs Table
        log('🛠️ Checking/Creating audit_logs table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS audit_logs (
                id INT PRIMARY KEY AUTO_INCREMENT,
                user_id INT NOT NULL,
                action VARCHAR(50) NOT NULL,
                target_type VARCHAR(50),
                target_id INT,
                details JSON,
                ip_address VARCHAR(45),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        log('✅ audit_logs table ready.');

        // 2. Prepare Users
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash('password123', salt);
        const adminHash = await bcrypt.hash('admin123', salt);
        const tenantHash = await bcrypt.hash('tenant123', salt);

        const usersToSeed = [
            { email: 'admin@property.com', password: adminHash, name: 'Super Admin', role: 'super_admin' },
            { email: 'manager1@propmanage.com', password: hash, name: 'Manager One', role: 'property_manager' },
            { email: 'manager2@propmanage.com', password: hash, name: 'Manager Two', role: 'property_manager' },
            { email: 'plumber@vendor.com', password: hash, name: 'Mario Plumber', role: 'vendor' },
            { email: 'electrician@vendor.com', password: hash, name: 'Luigi Electrician', role: 'vendor' },
            { email: 'owner@example.com', password: hash, name: 'Jane Owner', role: 'property_owner' },
            { email: 'tenant@example.com', password: tenantHash, name: 'John Tenant', role: 'tenant' }
        ];

        log('🌱 Seeding users...');
        for (const u of usersToSeed) {
            const [rows] = await connection.query('SELECT id FROM users WHERE email = ?', [u.email]);
            if (rows.length === 0) {
                await connection.query(
                    'INSERT INTO users (email, password, name, role, status) VALUES (?, ?, ?, ?, ?)',
                    [u.email, u.password, u.name, u.role, 'active']
                );
                log(`✅ INSERTED: ${u.email}`);
            } else {
                log(`ℹ️ EXISTS: ${u.email}`);
            }
        }
        log('DONE');

    } catch (e) {
        log('❌ FATAL ERROR: ' + e.message);
    } finally {
        if (connection) await connection.end();
        process.exit(0);
    }
}

// Clear log file first
fs.writeFileSync(logFile, 'STARTING...\n');
forceFix();
