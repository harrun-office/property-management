// Check what properties exist in the database
const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkProperties() {
  let connection;

  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'property_management_db'
    });

    console.log('🔍 Checking properties in database...\n');

    // Get all properties
    const [properties] = await connection.query('SELECT id, title, address, status, owner_id FROM properties ORDER BY id');
    console.log(`📊 Total Properties: ${properties.length}\n`);

    if (properties.length === 0) {
      console.log('❌ No properties found in database!');
      console.log('💡 You need to create some properties first.');
      return;
    }

    // Group by status
    const statusCounts = {};
    const ownerCounts = {};

    properties.forEach(prop => {
      statusCounts[prop.status] = (statusCounts[prop.status] || 0) + 1;
      ownerCounts[prop.owner_id] = (ownerCounts[prop.owner_id] || 0) + 1;
    });

    console.log('📈 Properties by Status:');
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`  ${status}: ${count} properties`);
    });

    console.log('\n👤 Properties by Owner:');
    Object.entries(ownerCounts).forEach(([ownerId, count]) => {
      console.log(`  Owner ${ownerId}: ${count} properties`);
    });

    // Show first few properties as examples
    console.log('\n🏠 Sample Properties:');
    properties.slice(0, 3).forEach(prop => {
      console.log(`  ID ${prop.id}: "${prop.title}" - ${prop.address} [${prop.status}] (Owner: ${prop.owner_id})`);
    });

    if (properties.length > 3) {
      console.log(`  ... and ${properties.length - 3} more properties`);
    }

  } catch (error) {
    console.error('❌ Error checking properties:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

checkProperties();
