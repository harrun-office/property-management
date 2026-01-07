require('dotenv').config();
const pool = require('./config/db');

async function checkProfessor() {
    try {
        console.log('Checking user professor@gmail.com...');
        const [users] = await pool.query("SELECT * FROM users WHERE email = ?", ['professor@gmail.com']);
        if (users.length === 0) {
            console.log('User not found.');
            process.exit(0);
        }
        const user = users[0];
        console.log('User found:', user);

        console.log(`Checking properties for user_id ${user.id}...`);
        const [properties] = await pool.query("SELECT * FROM properties WHERE owner_id = ?", [user.id]);

        if (properties.length === 0) {
            console.log('No properties found for this user.');
        } else {
            console.log(`Found ${properties.length} properties:`);
            properties.forEach(p => {
                console.log({
                    id: p.id,
                    title: p.title,
                    status: p.status,
                    is_active: p.is_active, // assuming there might be an active flag
                    owner_id: p.owner_id
                });
            });
        }
        process.exit(0);

    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

checkProfessor();
