const http = require('http');

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/properties',
    method: 'GET'
};

const fs = require('fs');
const path = require('path');
const logFile = path.resolve('d:/Fresher-Tasks/Property-Management/api_response.txt');
console.log('Logging to:', logFile);
const log = (msg) => {
    try {
        fs.appendFileSync(logFile, msg + '\n');
    } catch (e) {
        console.error('File write error:', e);
    }
};

const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const parsed = JSON.parse(data);
            log('Response Type: ' + (Array.isArray(parsed) ? 'Array' : typeof parsed));
            if (parsed.properties) {
                log('Properties count: ' + parsed.properties.length);
                if (parsed.properties.length > 0) {
                    const p = parsed.properties[0];
                    log('First Property Keys: ' + Object.keys(p).join(', '));
                    log('Images field: ' + JSON.stringify(p.images));
                    log('Images Type: ' + (Array.isArray(p.images) ? 'Array' : typeof p.images));
                }
            } else {
                log('No properties field found. Keys: ' + Object.keys(parsed).join(', '));
            }
        } catch (e) {
            log('Error parsing JSON: ' + e.message);
            log('Raw data: ' + data);
        }
    });
});

req.on('error', (e) => {
    console.error('Problem with request:', e.message);
});

req.end();
