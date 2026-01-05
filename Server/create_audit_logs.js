
const pool = require('./config/db');

async function createAuditTable() {
    try {
        console.log('Creating audit_logs table...');
        const query = `
            CREATE TABLE IF NOT EXISTS audit_logs (
                id INT PRIMARY KEY AUTO_INCREMENT,
                user_id INT NOT NULL,
                action VARCHAR(50) NOT NULL,
                target_type VARCHAR(50),
                target_id INT,
                details JSON,
                ip_address VARCHAR(45),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `;
        await pool.query(query);
        console.log('✅ audit_logs table created (or already exists).');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

createAuditTable();
