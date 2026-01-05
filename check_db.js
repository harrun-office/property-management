const pool = require('./server/config/db');

async function checkProperties() {
    try {
        const [rows] = await pool.query('SELECT count(*) as count FROM properties');
        console.log('Property count:', rows[0].count);

        if (rows[0].count > 0) {
            const [sample] = await pool.query('SELECT * FROM properties LIMIT 1');
            console.log('Sample property status:', sample[0].status);
        }
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkProperties();
