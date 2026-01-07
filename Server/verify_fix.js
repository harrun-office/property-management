
require('dotenv').config();
const pool = require('./config/db');
const fs = require('fs');

async function verify() {
    try {
        const [users] = await pool.query("SELECT * FROM users WHERE email = ?", ['professor@gmail.com']);
        if (users.length === 0) {
            fs.writeFileSync('verification_result.txt', 'User professor@gmail.com not found.');
            process.exit(0);
        }
        const user = users[0];

        const [properties] = await pool.query("SELECT * FROM properties WHERE owner_id = ?", [user.id]);

        let output = `User Found: ${user.email} (ID: ${user.id})\n`;
        output += `Properties Found: ${properties.length}\n`;

        properties.forEach(p => {
            output += `Property ID: ${p.id}, Title: ${p.title}, Status: '${p.status}'\n`;
        });

        // Check if the status 'active' is what we expect
        if (properties.some(p => p.status === 'active')) {
            output += "SUCCESS: Found at least one property with status 'active'. The fix in public.controller.js (expecting 'active') should work.\n";
        } else {
            output += "WARNING: No property with status 'active' found. The fix might not match the data.\n";
        }

        fs.writeFileSync('verification_result.txt', output);
        process.exit(0);

    } catch (e) {
        fs.writeFileSync('verification_result.txt', 'Error: ' + e.message);
        process.exit(1);
    }
}

verify();
