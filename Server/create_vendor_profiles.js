
const pool = require('./config/db');

async function createVendorTables() {
    try {
        console.log('Creating vendor tables...');

        // 1. vendor_profiles
        await pool.query(`
            CREATE TABLE IF NOT EXISTS vendor_profiles (
                id INT PRIMARY KEY AUTO_INCREMENT,
                user_id INT NOT NULL,
                company_name VARCHAR(100),
                contact_name VARCHAR(100),
                phone VARCHAR(20),
                email VARCHAR(100),
                service_types JSON,
                permission_scope VARCHAR(50) DEFAULT 'task_based',
                status VARCHAR(20) DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('✅ vendor_profiles table created.');

        // 2. property_vendors
        await pool.query(`
            CREATE TABLE IF NOT EXISTS property_vendors (
                property_id INT NOT NULL,
                vendor_user_id INT NOT NULL,
                permission_scope VARCHAR(50),
                assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (property_id, vendor_user_id),
                FOREIGN KEY (vendor_user_id) REFERENCES users(id) ON DELETE CASCADE
                -- Keeping property_id loose for now or assuming properties table exists
            )
        `);
        console.log('✅ property_vendors table created.');

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

createVendorTables();
