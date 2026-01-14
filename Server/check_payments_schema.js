const sql = require('./config/db');

async function checkPaymentsSchema() {
  try {
    const [rows] = await sql.query('DESCRIBE payments');
    console.log('Payments table schema:');
    rows.forEach(row => {
      console.log(`${row.Field}: ${row.Type} ${row.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${row.Default ? `DEFAULT ${row.Default}` : ''}`);
    });

    // Also check if there's a type column
    const typeColumn = rows.find(row => row.Field === 'type');
    if (!typeColumn) {
      console.log('\nWARNING: payments table is missing the "type" column that is referenced in paySecurityDeposit function!');
    } else {
      console.log('\nType column exists:', typeColumn);
    }
  } catch (error) {
    console.error('Error checking schema:', error);
  } finally {
    process.exit(0);
  }
}

checkPaymentsSchema();
