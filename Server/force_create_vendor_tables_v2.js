
const mysql = require('mysql2/promise');

const dbConfig = {
    host: '127.0.0.1', // Using IPv4 explicitly to avoid Node 17+ localhost issues
    user: 'root',
    password: 'root',
    database: 'property_management_db'
};

async function forceCreate() {
    let connection;
    try {
        console.log('🔌 Connecting to DB (127.0.0.1)...');
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Connected.');

        // 1. vendor_profiles
        console.log('🛠️ Creating vendor_profiles...');
        await connection.query(`
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
        console.log('🛠️ Creating property_vendors...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS property_vendors (
                property_id INT NOT NULL,
                vendor_user_id INT NOT NULL,
                permission_scope VARCHAR(50),
                assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (property_id, vendor_user_id),
                FOREIGN KEY (vendor_user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('✅ property_vendors table created.');

        console.log('DONE');
    } catch (e) {
        console.error('❌ FATAL ERROR:', e);
    } finally {
        if (connection) await connection.end();
        process.exit(0);
    }
}

forceCreate();
