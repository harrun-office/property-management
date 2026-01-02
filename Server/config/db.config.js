const result = require('dotenv').config();
if (result.error) {
    console.error('Error loading .env file:', result.error);
} else {
    console.log('Dotenv loaded parsed:', result.parsed);
}

console.log('DB Config Debug:', {
    HOST: process.env.DB_HOST,
    USER: process.env.DB_USER,
    HasPassword: !!process.env.DB_PASSWORD,
    DB: process.env.DB_NAME
});

module.exports = {
    HOST: process.env.DB_HOST || 'localhost',
    USER: process.env.DB_USER || 'root',
    PASSWORD: process.env.DB_PASSWORD || '',
    DB: process.env.DB_NAME || 'property_management_db',
    dialect: 'mysql',
    pool: {
        max: 20, // Increased for real-time app
        min: 5,
        acquire: 60000, // 60 seconds
        idle: 20000 // 20 seconds
    },
    // Real-time optimizations
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    timezone: '+00:00',
    charset: 'utf8mb4',
    supportBigNumbers: true,
    bigNumberStrings: true,
    // Connection timeout settings
    connectTimeout: 60000,
    acquireTimeout: 60000,
    timeout: 60000,
    // Reconnection settings
    reconnect: true,
    reconnectTimeout: 2000,
    reconnectTries: 10
};
