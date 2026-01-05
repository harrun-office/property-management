
const pool = require('./config/db');

async function fixSchema() {
    console.log('🔧 Running Schema Fixer (Vendor Tables)...');
    try {
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
        console.log('✅ vendor_profiles table verified/created.');

        // 2. property_vendors
        await pool.query(`
            CREATE TABLE IF NOT EXISTS property_vendors (
                property_id INT NOT NULL,
                vendor_user_id INT NOT NULL,
                permission_scope VARCHAR(50),
                assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (property_id, vendor_user_id),
                FOREIGN KEY (vendor_user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('✅ property_vendors table verified/created.');

        // 3. applications
        await pool.query(`
            CREATE TABLE IF NOT EXISTS applications (
                id INT PRIMARY KEY AUTO_INCREMENT,
                property_id INT NOT NULL,
                applicant_id INT NOT NULL,
                status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
                notes JSON,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
                FOREIGN KEY (applicant_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('✅ applications table verified/created.');

        // 4. manager_subscriptions
        await pool.query(`
            CREATE TABLE IF NOT EXISTS manager_subscriptions (
                id INT PRIMARY KEY AUTO_INCREMENT,
                owner_id INT NOT NULL,
                manager_id INT NOT NULL,
                property_id INT NOT NULL,
                plan_id INT NOT NULL,
                status ENUM('active', 'cancelled', 'expired') DEFAULT 'active',
                start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                end_date TIMESTAMP NULL,
                next_billing_date TIMESTAMP NULL,
                monthly_fee DECIMAL(10, 2) DEFAULT 0,
                auto_renew BOOLEAN DEFAULT TRUE,
                cancelled_at TIMESTAMP NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
            )
        `);
        console.log('✅ manager_subscriptions table verified/created.');

        // 5. saved_properties
        await pool.query(`
            CREATE TABLE IF NOT EXISTS saved_properties (
                id INT PRIMARY KEY AUTO_INCREMENT,
                user_id INT NOT NULL,
                property_id INT NOT NULL,
                saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
                UNIQUE KEY unique_save (user_id, property_id)
            )
        `);
        console.log('✅ saved_properties table verified/created.');

        // 6. Patch maintenance_requests if missing tenant_id
        try {
            const [columns] = await pool.query("SHOW COLUMNS FROM maintenance_requests LIKE 'tenant_id'");
            if (columns.length === 0) {
                console.log('⚠️ tenant_id column missing in maintenance_requests. Adding it...');
                await pool.query("ALTER TABLE maintenance_requests ADD COLUMN tenant_id INT");
                // Optional: Attempt to link constraint if users table exists, but can be risky if data exists without valid IDs
                // await pool.query("ALTER TABLE maintenance_requests ADD FOREIGN KEY (tenant_id) REFERENCES users(id)"); 
                console.log('✅ tenant_id column added to maintenance_requests.');
            }
        } catch (err) {
            // Table might not exist yet? If so, create it.
            console.log('⚠️ maintenance_requests table missing or error checking columns. Creating/Verifying default schema...');
            await pool.query(`
            CREATE TABLE IF NOT EXISTS maintenance_requests (
                id INT PRIMARY KEY AUTO_INCREMENT,
                property_id INT NOT NULL,
                tenant_id INT,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                priority ENUM('low', 'medium', 'high', 'emergency') DEFAULT 'medium',
                status ENUM('open', 'in_progress', 'resolved', 'closed') DEFAULT 'open',
                photos JSON,
                notes JSON,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
            )
        `);
            console.log('✅ maintenance_requests table verified/created.');
        }

    } catch (error) {
        console.error('❌ Schema Fix Failed:', error);
        // Don't kill the server, just log
    }
}

module.exports = fixSchema;
