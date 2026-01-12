// Test application date display
const http = require('http');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function testApplicationDate() {
  try {
    // First check if there are any applications in the database
    console.log('=== DATABASE CHECK ===');
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'property_management_db'
    });

    const [apps] = await conn.query('SELECT COUNT(*) as count FROM applications');
    console.log(`Total applications in database: ${apps[0].count}`);

    if (apps[0].count > 0) {
      const [details] = await conn.query('SELECT id, applicant_id, property_id, status, created_at FROM applications LIMIT 1');
      console.log('Sample application:', details[0]);
    }

    await conn.end();

    // Now test the API endpoint
    console.log('\n=== API TEST ===');

    const options = {
      hostname: 'localhost',
      port: 5005,
      path: '/api/owner/applications',
      method: 'GET',
      headers: {'Content-Type': 'application/json'}
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const apps = JSON.parse(data);
          if (apps.length > 0) {
            console.log('✅ API Response successful!');
            console.log('First application:');
            console.log('- ID:', apps[0].id);
            console.log('- Applicant:', apps[0].applicant?.name);
            console.log('- Application Date:', apps[0].applicationDate);
            console.log('- Formatted Date:', new Date(apps[0].applicationDate).toLocaleString());
          } else {
            console.log('No applications found in API response');
          }
        } catch (e) {
          console.log('❌ Error parsing API response:', e.message);
          console.log('Raw response:', data.substring(0, 200));
        }
      });
    });

    req.on('error', (e) => {
      console.log('❌ Request error:', e.message);
    });

    req.end();

  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

testApplicationDate();

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    try {
      const apps = JSON.parse(data);
      if (apps.length > 0) {
        console.log('First application:');
        console.log('- ID:', apps[0].id);
        console.log('- Applicant:', apps[0].applicant?.name);
        console.log('- Application Date:', apps[0].applicationDate);
        console.log('- Formatted Date:', new Date(apps[0].applicationDate).toLocaleString());
      } else {
        console.log('No applications found');
      }
    } catch (e) {
      console.log('Error parsing response:', e.message);
      console.log('Raw response:', data.substring(0, 200));
    }
  });
});

req.on('error', (e) => {
  console.log('Request error:', e.message);
});

req.end();
