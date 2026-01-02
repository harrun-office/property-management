
const sql = require('./config/db');

console.log('Trying DB connection...');
sql.query('SELECT 1').then(() => {
    console.log('DB Connection OK');
    process.exit();
}).catch(err => {
    console.error('DB Connection FAIL', err);
    process.exit();
});
