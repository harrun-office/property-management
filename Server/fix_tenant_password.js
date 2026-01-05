
const pool = require('./config/db');
const bcrypt = require('bcryptjs');

async function fixTenant() {
    try {
        console.log('🔧 Fixing Tenant Password...');

        // Generate a fresh, valid hash for 'password123'
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash('password123', salt);

        console.log('generated hash:', hash);

        // Force update the user
        const [result] = await pool.query('UPDATE users SET password = ? WHERE email = ?', [hash, 'tenant@example.com']);

        console.log('Update result:', result);
        console.log('✅ Tenant password force-updated.');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

fixTenant();
