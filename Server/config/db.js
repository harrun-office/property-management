const mysql = require('mysql2/promise');
const dbConfig = require('./db.config');

const pool = mysql.createPool({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB,
    waitForConnections: true,
    connectionLimit: dbConfig.pool.max,
    queueLimit: 0
});

// Test connection
pool.getConnection()
    .then(connection => {
        console.log('Successfully connected to the database.');
        connection.release();
    })
    .catch(err => {
        console.error('Could not connect to the database:', err);
    });

module.exports = pool;
