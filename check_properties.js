const sql = require('./Server/config/db');

async function checkProperties() {
  try {
    const [rows] = await sql.query('SELECT id, title, owner_id, status FROM properties');
    console.log('All properties:', rows);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

checkProperties();
