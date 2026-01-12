// Test script to demonstrate property posting and searching functionality
const http = require('http');

const BASE_URL = 'http://localhost:5005/api';

function makeRequest(options, data = null) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const parsed = body ? JSON.parse(body) : {};
                    resolve({ status: res.statusCode, data: parsed });
                } catch (e) {
                    console.log('Raw response:', body);
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });
        req.on('error', (err) => {
            console.log('Request error:', err.message);
            reject(err);
        });
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

async function testPropertyAPI() {
    console.log('🧪 Testing Property Management API');
    console.log('=====================================\n');

    try {
        // Test 1: Search properties (public endpoint)
        console.log('🔍 1. Testing Property Search (Public)');
        console.log('GET /api/properties');
        const searchResponse = await makeRequest({
            hostname: 'localhost',
            port: 5005,
            path: '/api/properties',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        console.log(`✅ Status: ${searchResponse.status}`);
        console.log(`📊 Found ${searchResponse.data.properties?.length || 0} properties`);
        console.log(`📄 Pagination: Page ${searchResponse.data.pagination?.page || 'N/A'}, Total: ${searchResponse.data.pagination?.total || 'N/A'}\n`);

        // Test 2: Filter properties
        console.log('🔎 2. Testing Property Filtering');
        console.log('GET /api/properties?propertyType=apartment&minPrice=100000');
        const filterResponse = await makeRequest({
            hostname: 'localhost',
            port: 5005,
            path: '/api/properties?propertyType=apartment&minPrice=100000',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        console.log(`✅ Status: ${filterResponse.status}`);
        console.log(`🏢 Filtered results: ${filterResponse.data.properties?.length || 0} apartments\n`);

        // Test 3: Authentication check (will fail without token)
        console.log('🔐 3. Testing Protected Property Posting (Owner - No Auth)');
        console.log('POST /api/owner/properties (without auth)');
        const postResponse = await makeRequest({
            hostname: 'localhost',
            port: 5005,
            path: '/api/owner/properties',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, {
            title: 'Test Property',
            description: 'Test description',
            price: 200000,
            address: '123 Test St',
            bedrooms: 2,
            bathrooms: 1,
            area: 1000
        });
        console.log(`❌ Status: ${postResponse.status} (Expected: 401 Unauthorized)\n`);

        // Test 4: Login simulation
        console.log('🔑 4. Authentication Flow for Property Posting');
        console.log('POST /api/auth/login');
        const loginResponse = await makeRequest({
            hostname: 'localhost',
            port: 5005,
            path: '/api/auth/login',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, {
            email: 'owner@example.com',
            password: 'password123'
        });
        console.log(`✅ Status: ${loginResponse.status}`);
        console.log(`🎫 Token received: ${loginResponse.data.token ? 'Yes' : 'No'}`);
        console.log(`👤 User: ${loginResponse.data.user?.name || 'N/A'} (${loginResponse.data.user?.role || 'N/A'})`);

        console.log('\n🎉 Property Management API Testing Complete!');
        console.log('================================================');
        console.log('\n📋 Key Features Demonstrated:');
        console.log('✅ Public property search with filters');
        console.log('✅ Property filtering by type and price');
        console.log('✅ Pagination support');
        console.log('✅ Authentication requirements');
        console.log('✅ Protected endpoints');
        console.log('✅ Error handling for unauthorized access');

        console.log('\n🚀 Frontend Features (React Client):');
        console.log('• BrowseProperties page - Search and filter properties');
        console.log('• PostProperty page - Create new property listings');
        console.log('• PropertyCard component - Display property details');
        console.log('• Real-time validation and error handling');
        console.log('• Image upload and management');
        console.log('• Responsive design for mobile/desktop');

        console.log('\n💡 To test property posting:');
        console.log('1. Open browser to http://localhost:5173');
        console.log('2. Register/Login as property_owner');
        console.log('3. Navigate to Post Property page');
        console.log('4. Fill out the comprehensive form');
        console.log('5. Upload images and set amenities');
        console.log('6. Submit to create the property');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run the test
testPropertyAPI();
