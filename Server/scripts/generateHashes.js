// Script to generate password hashes for mock users
// Run: node scripts/generateHashes.js

const bcrypt = require('bcryptjs');

async function generateHashes() {
  const password = 'password123';
  const hash = await bcrypt.hash(password, 10);
  console.log('Password:', password);
  console.log('Hash:', hash);
  console.log('\nCopy this hash to mockData.js for default users');
}

generateHashes();

