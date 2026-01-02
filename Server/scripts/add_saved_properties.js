
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mysql = require('mysql2/promise');

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'property_management_db'
};

const createTableSQL = `
CREATE TABLE IF NOT EXISTS saved_properties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    property_id INT NOT NULL,
    saved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    UNIQUE KEY unique_save (user_id, property_id)
) ENGINE=InnoDB;
`;

async function init() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Connected to database.');
        await connection.query(createTableSQL);
        console.log('SUCCESS: saved_properties table created/verified.');
        await connection.end();
    } catch (error) {
        console.error('ERROR:', error);
        process.exit(1);
    }
}

init();
