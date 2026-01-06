
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

        // 7. audit_logs
        await pool.query(`
            CREATE TABLE IF NOT EXISTS audit_logs (
                id INT PRIMARY KEY AUTO_INCREMENT,
                user_id INT,
                action VARCHAR(255),
                resource_type VARCHAR(100),
                resource_id VARCHAR(255),
                details JSON,
                ip_address VARCHAR(45),
                user_agent VARCHAR(255),
                hash VARCHAR(255),
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ audit_logs table verified/created.');

        // 8. vendor_tasks
        await pool.query(`
             CREATE TABLE IF NOT EXISTS vendor_tasks (
                id INT PRIMARY KEY AUTO_INCREMENT,
                assigned_vendor_id INT,
                created_by INT,
                status ENUM('OPEN', 'IN_PROGRESS', 'COMPLETED', 'CLOSED', 'QUOTATION_SUBMITTED', 'AWAITING_APPROVAL') DEFAULT 'OPEN',
                title VARCHAR(255),
                description TEXT,
                attachments JSON,
                quotation_amount DECIMAL(10, 2),
                auto_approved BOOLEAN DEFAULT FALSE,
                completed_date TIMESTAMP NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (assigned_vendor_id) REFERENCES vendor_profiles(id) ON DELETE SET NULL
             )
        `);
        console.log('✅ vendor_tasks table verified/created.');

        // Patch vendor_tasks if missing columns (for existing tables)
        try {
            const [vtCols] = await pool.query("SHOW COLUMNS FROM vendor_tasks LIKE 'attachments'");
            if (vtCols.length === 0) {
                console.log('⚠️ attachments column missing in vendor_tasks. Adding it...');
                await pool.query("ALTER TABLE vendor_tasks ADD COLUMN attachments JSON");
            }
            const [qaCols] = await pool.query("SHOW COLUMNS FROM vendor_tasks LIKE 'quotation_amount'");
            if (qaCols.length === 0) {
                console.log('⚠️ quotation_amount column missing in vendor_tasks. Adding it...');
                await pool.query("ALTER TABLE vendor_tasks ADD COLUMN quotation_amount DECIMAL(10, 2)");
            }
            const [aaCols] = await pool.query("SHOW COLUMNS FROM vendor_tasks LIKE 'auto_approved'");
            if (aaCols.length === 0) {
                console.log('⚠️ auto_approved column missing in vendor_tasks. Adding it...');
                await pool.query("ALTER TABLE vendor_tasks ADD COLUMN auto_approved BOOLEAN DEFAULT FALSE");
            }
            // Update ENUM if needed - (Complex in MySQL, skipping for now unless strictly needed, assuming new install or accepting error on strict enum)
        } catch (e) {
            console.log('⚠️ Error patching vendor_tasks:', e.message);
        }

        // 9. tenants (Lease Info)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS tenants (
                id INT PRIMARY KEY AUTO_INCREMENT,
                user_id INT NOT NULL,
                property_id INT NOT NULL,
                lease_start_date DATE,
                lease_end_date DATE,
                monthly_rent DECIMAL(10, 2),
                security_deposit DECIMAL(10, 2),
                status ENUM('active', 'inactive', 'pending') DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
            )
        `);
        console.log('✅ tenants table verified/created.');


    } catch (error) {
        console.error('❌ Schema Fix Failed:', error);
        // Don't kill the server, just log
    }
}

module.exports = fixSchema;
