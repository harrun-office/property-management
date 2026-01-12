// Add missing columns to tenants table
const mysql = require('mysql2/promise');
require('dotenv').config();

async function addTenantColumns() {
  let connection;

  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'property_management_db'
    });

    console.log('🔄 Adding missing columns to tenants table...');

    // Add terminated_at column
    try {
      await connection.query(`
        ALTER TABLE tenants
        ADD COLUMN terminated_at TIMESTAMP NULL AFTER status_changed_by
      `);
      console.log('✅ Added terminated_at column');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('⚠️ terminated_at column already exists');
      } else {
        throw error;
      }
    }

    // Add termination_reason column
    try {
      await connection.query(`
        ALTER TABLE tenants
        ADD COLUMN termination_reason VARCHAR(255) AFTER terminated_at
      `);
      console.log('✅ Added termination_reason column');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('⚠️ termination_reason column already exists');
      } else {
        throw error;
      }
    }

    // Add notes column
    try {
      await connection.query(`
        ALTER TABLE tenants
        ADD COLUMN notes TEXT AFTER termination_reason
      `);
      console.log('✅ Added notes column');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('⚠️ notes column already exists');
      } else {
        throw error;
      }
    }

    console.log('🎉 Tenant table columns added successfully!');

  } catch (error) {
    console.error('❌ Migration error:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

addTenantColumns();
