
const Property = require('./models/property.model');
const sql = require('./config/db');

// Mock database response for testing parsing logic
async function test() {
    try {
        const amenitiesObj = ["Gym", "Pool"];
        const amenitiesString = JSON.stringify(amenitiesObj);

        // Simulate what mysql2 might return (it depends on configuration)
        // Scenario 1: Returns string
        console.log('--- Testing Scenario 1 (String) ---');
        try {
            const row = { amenities: amenitiesString };
            const parsed = row.amenities ? JSON.parse(row.amenities) : [];
            console.log('Scenario 1 Success:', parsed);
        } catch (e) {
            console.error('Scenario 1 Failed:', e.message);
        }

        // Scenario 2: Returns object (if driver parses it)
        console.log('--- Testing Scenario 2 (Object) ---');
        try {
            const row = { amenities: amenitiesObj };
            const parsed = row.amenities ? JSON.parse(row.amenities) : [];
            console.log('Scenario 2 Success:', parsed);
        } catch (e) {
            console.error('Scenario 2 Failed:', e.message);
        }

    } catch (err) {
        console.error('FAILED:', err);
    } finally {
        process.exit();
    }
}

test();
