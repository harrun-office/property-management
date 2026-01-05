
const pool = require('./config/db');

async function debugUserRow() {
    try {
        const [rows] = await pool.query("SELECT id, email, password, role FROM users WHERE email LIKE '%tenant%'");

        console.log('--- DB Content Debug ---');
        rows.forEach(row => {
            console.log(`ID: ${row.id}`);
            console.log(`Email: '${row.email}' (Length: ${row.email.length})`);
            console.log(`Role: '${row.role}'`);
            console.log(`Password Hash Prefix: ${row.password.substring(0, 10)}... (Length: ${row.password.length})`);
            console.log('------------------------');
        });
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

debugUserRow();
