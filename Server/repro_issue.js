
const Property = require('./models/property.model');
const sql = require('./config/db');

async function test() {
    try {
        console.log('Testing Property.findAllWithFilters...');
        const result = await Property.findAllWithFilters({});
        console.log('Success!', result.slice(0, 1));
    } catch (err) {
        console.error('FAILED:', err);
    } finally {
        process.exit();
    }
}

test();
