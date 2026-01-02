
const pool = require('./config/db');
const bcrypt = require('bcryptjs');

async function seed() {
    try {
        console.log('🌱 Seeding properties...');

        // 1. Create Owner
        const ownerEmail = 'owner@example.com';
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash('password123', salt);

        // Check if owner exists
        const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [ownerEmail]);
        let ownerId;

        if (existing.length === 0) {
            const [res] = await pool.query(`
                INSERT INTO users (email, password, name, role, status)
                VALUES (?, ?, 'John Owner', 'property_owner', 'active')
            `, [ownerEmail, hash]);
            ownerId = res.insertId;
            console.log('User created:', ownerId);
        } else {
            ownerId = existing[0].id;
            console.log('User exists:', ownerId);
        }

        // 2. Insert Properties
        const properties = [
            {
                title: 'Sunset Apartments',
                description: 'Beautiful luxury apartment with sea view',
                price: 2500.00,
                address: '123 Ocean Drive, Miami, FL',
                property_type: 'apartment',
                bedrooms: 2,
                bathrooms: 2,
                square_feet: 1200,
                year_built: 2020,
                amenities: JSON.stringify(['Pool', 'Gym', 'Parking', 'WiFi']),
                status: 'LISTED'
            },
            {
                title: 'Downtown Loft',
                description: 'Modern loft in the heart of the city',
                price: 1800.00,
                address: '456 Main St, New York, NY',
                property_type: 'condo',
                bedrooms: 1,
                bathrooms: 1,
                square_feet: 850,
                year_built: 2015,
                amenities: JSON.stringify(['Doorman', 'Elevator', 'Roof Deck']),
                status: 'LISTED'
            },
            {
                title: 'Suburban Family Home',
                description: 'Spacious home perfect for families',
                price: 3200.00,
                address: '789 Maple Ave, Austin, TX',
                property_type: 'house',
                bedrooms: 4,
                bathrooms: 3,
                square_feet: 2400,
                year_built: 2010,
                amenities: JSON.stringify(['Garage', 'Garden', 'Fireplace']),
                status: 'LISTED'
            }
        ];

        for (const p of properties) {
            await pool.query(`
                INSERT INTO properties 
                (owner_id, title, description, price, address, property_type, bedrooms, bathrooms, square_feet, year_built, amenities, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [ownerId, p.title, p.description, p.price, p.address, p.property_type, p.bedrooms, p.bathrooms, p.square_feet, p.year_built, p.amenities, p.status]);
        }

        console.log('✅ Successfully seeded 3 properties');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding failed:', err);
        process.exit(1);
    }
}

seed();
