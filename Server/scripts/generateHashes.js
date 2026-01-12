// Script to generate password hashes for default database users
// Run: node scripts/generateHashes.js

const bcrypt = require('bcryptjs');

async function generateHashes() {
  const password = 'admin123';
  const hash = await bcrypt.hash(password, 12);
  console.log('Password:', password);
  console.log('Hash:', hash);
  console.log('\nThis hash is used in database initialization scripts for default admin user');
}

generateHashes();

