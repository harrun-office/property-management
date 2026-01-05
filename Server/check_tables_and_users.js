
const pool = require('./config/db');

async function checkTables() {
    try {
        console.log('Checking tables...');
        const [rows] = await pool.query("SHOW TABLES");
        console.log('Tables in DB:', rows);

        console.log('\nChecking Users...');
        const [users] = await pool.query("SELECT email FROM users");
        console.log('Users found:', users.map(u => u.email));

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

checkTables();
