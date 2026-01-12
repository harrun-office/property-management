// Migrate existing property statuses to new simplified system
const mysql = require('mysql2/promise');
require('dotenv').config();

async function migratePropertyStatuses() {
  let connection;

  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'property_management_db'
    });

    console.log('🔄 Starting property status migration...');

    // Map old statuses to new ones
    const statusMappings = {
      'UNASSIGNED': 'inactive',
      'ONBOARDING': 'inactive',
      'LISTED': 'active',
      'OCCUPIED': 'active', // Occupied properties stay active but show tenant info
      'MAINTENANCE_ACTIVE': 'maintenance',
      'INACTIVE': 'inactive'
    };

    for (const [oldStatus, newStatus] of Object.entries(statusMappings)) {
      const [result] = await connection.query(
        'UPDATE properties SET status = ? WHERE status = ?',
        [newStatus, oldStatus]
      );
      console.log(`✅ Updated ${result.affectedRows} properties from '${oldStatus}' to '${newStatus}'`);
    }

    console.log('🎉 Property status migration completed!');

  } catch (error) {
    console.error('❌ Migration error:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

migratePropertyStatuses();
