// Debug applications API response
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5005,
  path: '/api/owner/applications',
  method: 'GET',
  headers: {'Content-Type': 'application/json'}
};

console.log('Testing applications API...');

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    try {
      const apps = JSON.parse(data);
      if (apps.length > 0) {
        console.log('First application keys:', Object.keys(apps[0]));
        console.log('Application data:', JSON.stringify(apps[0], null, 2));
        console.log('Application date field:', apps[0].applicationDate);
        console.log('Created at field:', apps[0].createdAt);
      } else {
        console.log('No applications found');
      }
    } catch (e) {
      console.log('Parse error:', e.message);
      console.log('Raw response (first 500 chars):', data.substring(0, 500));
    }
  });
});

req.on('error', (e) => {
  console.log('Request error:', e.message);
});

req.end();
