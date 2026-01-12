// Check application dates in database
const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkApplicationDates() {
  let connection;

  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'property_management_db'
    });

    console.log('=== APPLICATIONS TABLE CHECK ===');

    // Check table structure
    const [columns] = await connection.query('DESCRIBE applications');
    console.log('Applications table columns:');
    columns.forEach(col => {
      console.log(`- ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'}`);
    });

    // Check actual data
    const [apps] = await connection.query('SELECT id, created_at FROM applications LIMIT 5');
    console.log(`\nFound ${apps.length} applications:`);
    apps.forEach(app => {
      console.log(`- ID: ${app.id}, created_at: ${app.created_at}`);
    });

    // Check if created_at column exists in the query result
    if (apps.length > 0) {
      console.log('\nFirst application object keys:', Object.keys(apps[0]));
      console.log('created_at value:', apps[0].created_at);
      console.log('created_at type:', typeof apps[0].created_at);
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

checkApplicationDates();
