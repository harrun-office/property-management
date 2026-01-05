
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function checkDirect() {
    try {
        console.log('🔌 Connecting directly...');
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'property_management_db'
        });

        console.log('✅ Connected.');
        const [rows] = await connection.execute('SELECT email, password FROM users WHERE email = ?', ['tenant@example.com']);

        if (rows.length > 0) {
            console.log('👤 Tenant Found:', rows[0].email);
            console.log('🔑 Stored Hash:', rows[0].password);

            console.log('Comparisons:');
            const match1 = await bcrypt.compare('password123', rows[0].password);
            console.log(`Input 'password123': ${match1}`);
        } else {
            console.log('❌ Tenant NOT found.');
        }

        await connection.end();
        process.exit(0);
    } catch (e) {
        console.error('❌ Error:', e.message);
        process.exit(1);
    }
}

checkDirect();
