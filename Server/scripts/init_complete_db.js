// ===========================================
// COMPLETE DATABASE INITIALIZATION SCRIPT
// Property Management System - Multi-User Real-Time
// ===========================================

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function initCompleteDatabase() {
    let connection;
    try {
        console.log('🔄 Connecting to MySQL server...');

        // Connect without database first
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            multipleStatements: true
        });

        console.log('✅ Connected to MySQL server');

        // Create database if it doesn't exist
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'property_management_db'} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
        await connection.query(`USE ${process.env.DB_NAME || 'property_management_db'}`);

        console.log('📝 Reading complete schema file...');
        const schemaPath = path.join(__dirname, 'complete_schema.sql');

        if (!fs.existsSync(schemaPath)) {
            throw new Error(`Schema file not found: ${schemaPath}`);
        }

        const schemaSQL = fs.readFileSync(schemaPath, 'utf8');

        console.log('🚀 Executing complete schema...');
        // Split and execute in chunks to avoid max_allowed_packet issues
        const statements = schemaSQL.split(';').filter(stmt => stmt.trim().length > 0);

        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i].trim();
            if (statement) {
                try {
                    await connection.query(statement);
                    console.log(`✅ Statement ${i + 1}/${statements.length} executed`);
                } catch (stmtErr) {
                    console.error(`❌ Statement ${i + 1} failed:`, stmtErr.message);
                    // Continue with other statements
                }
            }
        }

        console.log('🔧 Setting up triggers and functions...');
        const triggersPath = path.join(__dirname, 'triggers_and_functions.sql');
        if (fs.existsSync(triggersPath)) {
            const triggersSQL = fs.readFileSync(triggersPath, 'utf8');
            const triggerStatements = triggersSQL.split(';').filter(stmt => stmt.trim().length > 0);

            for (const statement of triggerStatements) {
                if (statement.trim()) {
                    try {
                        await connection.query(statement);
                    } catch (stmtErr) {
                        console.error('Trigger/Function setup error:', stmtErr.message);
                    }
                }
            }
        }

        // Verify tables were created
        const [tables] = await connection.query('SHOW TABLES');
        console.log(`📊 Created ${tables.length} tables:`, tables.map(t => Object.values(t)[0]).join(', '));

        // Insert default data
        console.log('🌱 Inserting default data...');
        await insertDefaultData(connection);

        console.log('🎉 Database initialization completed successfully!');

    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        throw error;
    } finally {
        if (connection) await connection.end();
    }
}

async function insertDefaultData(connection) {
    try {
        // Create super admin user
        const hashedPassword = await bcrypt.hash('admin123', 12);

        await connection.query(`
            INSERT IGNORE INTO users (email, password, name, role, status, permissions)
            VALUES ('admin@property.com', ?, 'Super Admin', 'super_admin', 'active', ?)
        `, [
            hashedPassword,
            JSON.stringify({
                all_access: true,
                manage_users: true,
                manage_properties: true,
                manage_tasks: true,
                view_reports: true
            })
        ]);

        console.log('👤 Default admin user created (admin@property.com / admin123)');

        // Create sample manager profile
        const [adminUser] = await connection.query('SELECT id FROM users WHERE email = ?', ['admin@property.com']);
        if (adminUser.length > 0) {
            await connection.query(`
                INSERT IGNORE INTO manager_profiles (manager_id, location, capacity, specialization)
                VALUES (?, 'Global', 50, ?)
            `, [
                adminUser[0].id,
                JSON.stringify(['property_management', 'vendor_coordination', 'tenant_relations'])
            ]);
        }

        // Create sample property statuses in realtime_metrics
        await connection.query(`
            INSERT INTO realtime_metrics (metric_name, metric_value, metric_type, tags)
            VALUES
            ('total_users', 1, 'gauge', '{"type": "system"}'),
            ('total_properties', 0, 'gauge', '{"type": "system"}'),
            ('active_sessions', 0, 'gauge', '{"type": "realtime"}'),
            ('total_tasks', 0, 'counter', '{"type": "system"}'),
            ('completed_tasks', 0, 'counter', '{"type": "system"}')
        `);

        console.log('📈 Default metrics initialized');

        // Create sample regional policies
        await connection.query(`
            INSERT IGNORE INTO regional_policies (region, policy_type, policy_data, effective_date)
            VALUES
            ('US', 'maintenance_approval_threshold', '{"threshold": 500}', NOW()),
            ('US', 'lease_terms', '{"min_lease_months": 6, "max_lease_months": 24}', NOW()),
            ('US', 'payment_grace_period', '{"days": 5}', NOW())
        `);

        console.log('📋 Default policies initialized');

    } catch (error) {
        console.warn('⚠️  Default data insertion failed:', error.message);
    }
}

// Function to reset database (for development)
async function resetDatabase() {
    let connection;
    try {
        console.log('🔄 Resetting database...');

        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
        });

        const dbName = process.env.DB_NAME || 'property_management_db';

        // Drop and recreate database
        await connection.query(`DROP DATABASE IF EXISTS ${dbName}`);
        console.log('🗑️  Database dropped');

        await connection.query(`CREATE DATABASE ${dbName} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
        console.log('🆕 Database recreated');

    } catch (error) {
        console.error('❌ Database reset failed:', error);
        throw error;
    } finally {
        if (connection) await connection.end();
    }
}

// Run initialization
if (require.main === module) {
    const command = process.argv[2];

    if (command === 'reset') {
        resetDatabase()
            .then(() => initCompleteDatabase())
            .then(() => {
                console.log('✅ Complete database reset and initialization finished successfully');
                process.exit(0);
            })
            .catch((error) => {
                console.error('❌ Complete database reset failed:', error);
                process.exit(1);
            });
    } else {
        initCompleteDatabase()
            .then(() => {
                console.log('✅ Complete database initialization finished successfully');
                console.log('');
                console.log('🚀 Next steps:');
                console.log('1. Copy .env.example to .env and configure your settings');
                console.log('2. Install dependencies: npm install');
                console.log('3. Start the server: npm start');
                console.log('');
                console.log('📧 Default admin login: admin@property.com / admin123');
                process.exit(0);
            })
            .catch((error) => {
                console.error('❌ Complete database initialization failed:', error);
                process.exit(1);
            });
    }
}

module.exports = { initCompleteDatabase, resetDatabase };
