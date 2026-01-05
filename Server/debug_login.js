
const pool = require('./config/db');
const bcrypt = require('bcryptjs');

async function debugLogin(email, password) {
    const fs = require('fs');
    const path = require('path');
    const log = (msg) => fs.appendFileSync(path.join(__dirname, 'debug_login_output.txt'), msg + '\n');

    try {
        log(`🔍 Debugging login for: ${email} `);

        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        if (users.length === 0) {
            log('❌ User NOT FOUND in database.');
            process.exit(0);
        }

        const user = users[0];
        log(`✅ User found: ID ${user.id}, Role: ${user.role} `);
        log(`🔐 Stored Hash: ${user.password} `);

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            log('✅ Password MATCHES! The credentials are correct in the DB.');
        } else {
            log('❌ Password DOES NOT MATCH. The hash in the DB is incorrect for "password123".');

            // Generate what the hash SHOULD be for comparison
            const salt = await bcrypt.genSalt(10);
            const newHash = await bcrypt.hash(password, salt);
            log(`ℹ️ A valid hash for "${password}" would look like: ${newHash} `);
        }

    } catch (err) {
        console.error('SERVER ERROR:', err);
    } finally {
        process.exit(0);
    }
}

// Test with the tenant account
debugLogin('tenant@example.com', 'password123');
