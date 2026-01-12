// Check user data and applications
const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkUser() {
    let connection;

    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'root',
            database: process.env.DB_NAME || 'property_management_db'
        });

        console.log('=== USER CHECK ===');
        const [users] = await connection.query(
            'SELECT id, name, email, mobile_number, created_at FROM users WHERE email = ?',
            ['t.professor@gmail.com']
        );

        if (users.length > 0) {
            console.log('User found:', {
                id: users[0].id,
                name: users[0].name,
                email: users[0].email,
                mobile_number: users[0].mobile_number || 'NULL',
                created_at: users[0].created_at
            });
        } else {
            console.log('User not found in database');
            return;
        }

        console.log('\n=== APPLICATIONS CHECK ===');
        const [applications] = await connection.query(`
            SELECT a.id, a.status, a.created_at, p.title as property_title
            FROM applications a
            JOIN properties p ON a.property_id = p.id
            WHERE a.applicant_id = ?
        `, [users[0].id]);

        if (applications.length > 0) {
            console.log(`Found ${applications.length} applications:`);
            applications.forEach(app => {
                console.log(`- ID: ${app.id}, Property: ${app.property_title}, Status: ${app.status}, Created: ${app.created_at}`);
            });
        } else {
            console.log('No applications found for this user');
        }

        console.log('\n=== SOLUTION ===');
        if (!users[0].mobile_number) {
            console.log('❌ Mobile number is missing - need to update user profile or re-register');
            console.log('✅ Adding a mobile number to this user...');

            await connection.query(
                'UPDATE users SET mobile_number = ? WHERE id = ?',
                ['+1-555-0123', users[0].id]
            );

            console.log('✅ Mobile number added: +1-555-0123');
        }

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        if (connection) await connection.end();
    }
}

checkUser();
