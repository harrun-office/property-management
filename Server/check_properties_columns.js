const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'property_management_db'
};

async function checkColumns() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Connected to database.');

        const [rows] = await connection.execute(`
            SELECT COLUMN_NAME, DATA_TYPE, COLUMN_TYPE 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'properties'
        `, [dbConfig.database]);

        console.log('Columns in properties table:');
        rows.forEach(row => {
            console.log(`- ${row.COLUMN_NAME} (${row.COLUMN_TYPE})`);
        });

        await connection.end();
    } catch (error) {
        console.error('Error checking columns:', error);
    }
}

checkColumns();
