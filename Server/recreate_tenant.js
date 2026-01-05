
const pool = require('./config/db');
const bcrypt = require('bcryptjs');

async function recreateTenant() {
    try {
        console.log('☢️ NUKE OPTION: Recreating Tenant...');

        // 1. Delete existing
        await pool.query('DELETE FROM users WHERE email = ?', ['tenant@example.com']);
        console.log('🗑️ Deleted existing tenant (if any).');

        // 2. Generate Hash
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash('tenant123', salt); // NEW PASSWORD: tenant123

        // 3. Insert Clean
        const [res] = await pool.query(
            'INSERT INTO users (email, password, name, role, status, permissions) VALUES (?, ?, ?, ?, ?, ?)',
            ['tenant@example.com', hash, 'John Tenant', 'tenant', 'active', JSON.stringify({ viewProperties: true })]
        );

        console.log(`✅ Created new tenant with ID: ${res.insertId}`);
        console.log('🔑 New Password: tenant123');

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

recreateTenant();
