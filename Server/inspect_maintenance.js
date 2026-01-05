const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

async function inspectTable() {
    try {
        const [columns] = await pool.query("SHOW COLUMNS FROM maintenance_requests");
        console.log('Columns in maintenance_requests:', columns.map(c => c.Field));
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

inspectTable();
