
const pool = require('./config/db');
const bcrypt = require('bcryptjs');

async function seedAllUsers() {
    try {
        console.log('🌱 Seeding all role-based users...');

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash('password123', salt);
        const adminHash = await bcrypt.hash('admin123', salt);

        const users = [
            // Super Admin
            { email: 'admin@property.com', password: adminHash, name: 'Super Admin', role: 'super_admin', status: 'active' },

            // Property Managers
            { email: 'manager1@propmanage.com', password: hash, name: 'Manager One', role: 'property_manager', status: 'active' },
            { email: 'manager2@propmanage.com', password: hash, name: 'Manager Two', role: 'property_manager', status: 'active' },

            // Vendors
            { email: 'plumber@vendor.com', password: hash, name: 'Mario Plumber', role: 'vendor', status: 'active' },
            { email: 'electrician@vendor.com', password: hash, name: 'Luigi Electrician', role: 'vendor', status: 'active' },

            // Tenant
            { email: 'tenant@example.com', password: hash, name: 'John Tenant', role: 'tenant', status: 'active' },

            // Owner
            { email: 'owner@example.com', password: hash, name: 'Jane Owner', role: 'property_owner', status: 'active' }
        ];

        for (const user of users) {
            // Check if user exists
            const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [user.email]);

            if (existing.length === 0) {
                await pool.query(`
                    INSERT INTO users (email, password, name, role, status)
                    VALUES (?, ?, ?, ?, ?)
                `, [user.email, user.password, user.name, user.role, user.status]);
                console.log(`✅ Created user: ${user.email} (${user.role})`);
            } else {
                console.log(`ℹ️ User already exists: ${user.email}`);
            }
        }

        console.log('✨ All users seeded successfully!');
        process.exit(0);

    } catch (err) {
        console.error('❌ Seeding failed:', err);
        process.exit(1);
    }
}

seedAllUsers();
