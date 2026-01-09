
const pool = require('./db');

// SQL to create users table and others if missing
// SQL to create all tables
const initSQL = `
-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('super_admin', 'property_manager', 'property_owner', 'vendor', 'tenant', 'user') NOT NULL,
    status ENUM('active', 'inactive', 'pending', 'pending_invitation', 'suspended') DEFAULT 'active',
    is_online BOOLEAN DEFAULT FALSE,
    last_seen TIMESTAMP NULL,
    current_session_id VARCHAR(255) NULL,
    region VARCHAR(50) DEFAULT 'US',
    mobile_number VARCHAR(20),
    avatar_url VARCHAR(500),
    timezone VARCHAR(50) DEFAULT 'UTC',
    invited_by INT,
    invitation_token VARCHAR(255),
    invitation_expires DATETIME,
    settings JSON,
    permissions JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT,
    FOREIGN KEY (invited_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_role_status (role, status),
    INDEX idx_user_email (email)
) ENGINE=InnoDB;

-- 2. USER SESSIONS
CREATE TABLE IF NOT EXISTS user_sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id INT NOT NULL,
    socket_id VARCHAR(255) NOT NULL UNIQUE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    device_info JSON,
    connected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_ping TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    disconnected_at TIMESTAMP NULL,
    connection_status ENUM('connected', 'disconnected', 'error') DEFAULT 'connected',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_session_user (user_id)
) ENGINE=InnoDB;

-- 3. PROPERTIES TABLE
CREATE TABLE IF NOT EXISTS properties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(12,2),
    address TEXT NOT NULL,
    coordinates POINT NULL,
    property_type ENUM('apartment', 'house', 'condo', 'townhouse', 'commercial', 'land') DEFAULT 'apartment',
    bedrooms INT,
    bathrooms DECIMAL(3,1),
    square_feet INT,
    year_built YEAR,
    amenities JSON,
    images JSON,
    utilities JSON,
    pet_policy ENUM('allowed', 'not_allowed', 'case_by_case') DEFAULT 'not_allowed',
    parking_spaces INT DEFAULT 0,
    lease_terms VARCHAR(255) DEFAULT '12 months',
    monthly_rent DECIMAL(10,2),
    security_deposit DECIMAL(10,2),
    available_date DATE,
    status VARCHAR(50) DEFAULT 'active',
    status_changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status_changed_by INT,
    assigned_manager_id INT,
    tenant_id INT,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activity_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_manager_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (tenant_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_property_owner (owner_id),
    INDEX idx_property_status (status)
) ENGINE=InnoDB;

-- 4. TENANTS TABLE
CREATE TABLE IF NOT EXISTS tenants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    property_id INT NOT NULL,
    lease_start_date DATE NOT NULL,
    lease_end_date DATE,
    monthly_rent DECIMAL(10,2) NOT NULL,
    security_deposit DECIMAL(10,2) DEFAULT 0,
    utilities_included BOOLEAN DEFAULT FALSE,
    status ENUM('active', 'inactive', 'terminated', 'pending_approval') DEFAULT 'active',
    status_changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status_changed_by INT,
    lease_terms JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    FOREIGN KEY (status_changed_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_tenant_property (property_id),
    INDEX idx_tenant_status (status)
) ENGINE=InnoDB;

-- 5. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('info', 'warning', 'error', 'success', 'task', 'property', 'payment', 'message') DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    delivered BOOLEAN DEFAULT FALSE,
    delivered_at TIMESTAMP NULL,
    entity_type VARCHAR(50),
    entity_id INT,
    actions JSON,
    priority ENUM('low', 'normal', 'high', 'urgent') DEFAULT 'normal',
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_notification_user (user_id),
    INDEX idx_notification_read (is_read)
) ENGINE=InnoDB;

-- 6. MESSAGES TABLE
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    recipient_id INT,
    conversation_id VARCHAR(255),
    conversation_type ENUM('direct', 'property', 'group') DEFAULT 'direct',
    property_id INT,
    subject VARCHAR(255),
    message_text TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    delivered BOOLEAN DEFAULT FALSE,
    delivered_at TIMESTAMP NULL,
    message_type ENUM('text', 'image', 'file', 'system') DEFAULT 'text',
    attachments JSON,
    parent_message_id INT,
    thread_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_message_id) REFERENCES messages(id) ON DELETE CASCADE,
    INDEX idx_message_conversation (conversation_id)
) ENGINE=InnoDB;

-- 7. VENDOR TASKS TABLE
CREATE TABLE IF NOT EXISTS vendor_tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    assigned_vendor_id INT NOT NULL,
    assigned_by INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    status ENUM('OPEN', 'VENDOR_ASSIGNED', 'QUOTATION_SUBMITTED', 'AWAITING_APPROVAL', 'IN_PROGRESS', 'COMPLETED', 'CLOSED') DEFAULT 'OPEN',
    status_changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status_changed_by INT,
    due_date DATETIME,
    estimated_hours DECIMAL(5,2),
    actual_hours DECIMAL(5,2),
    quotation_amount DECIMAL(10,2),
    approved_amount DECIMAL(10,2),
    final_amount DECIMAL(10,2),
    watchers JSON,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activity_count INT DEFAULT 0,
    tags JSON,
    attachments JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_vendor_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_task_property (property_id),
    INDEX idx_task_vendor (assigned_vendor_id)
) ENGINE=InnoDB;

-- 8. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    tenant_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    due_date DATE NOT NULL,
    status ENUM('pending', 'processing', 'completed', 'failed', 'overdue', 'cancelled') DEFAULT 'pending',
    status_changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status_changed_by INT,
    paid_date DATE,
    payment_method ENUM('bank_transfer', 'credit_card', 'debit_card', 'check', 'cash', 'online') DEFAULT 'online',
    transaction_id VARCHAR(255),
    payment_gateway VARCHAR(100),
    late_fee DECIMAL(8,2) DEFAULT 0,
    adjustment_amount DECIMAL(8,2) DEFAULT 0,
    adjustment_reason TEXT,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurring_schedule JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    FOREIGN KEY (tenant_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_payment_property (property_id),
    INDEX idx_payment_tenant (tenant_id)
) ENGINE=InnoDB;

-- 8. BILLS TABLE (For payment receipts)
CREATE TABLE IF NOT EXISTS bills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bill_number VARCHAR(50) UNIQUE NOT NULL,
    payment_id INT NOT NULL,
    tenant_id INT NOT NULL,
    owner_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50),
    transaction_id VARCHAR(100),
    bill_data JSON, -- Store complete bill details
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE,
    FOREIGN KEY (tenant_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_bill_tenant (tenant_id),
    INDEX idx_bill_owner (owner_id),
    INDEX idx_bill_payment (payment_id)
) ENGINE=InnoDB;

-- 8.1 PAYMENT HISTORY TABLE (For tracking payment lifecycle)
CREATE TABLE IF NOT EXISTS payment_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT NOT NULL,
    payment_id INT NOT NULL,
    action VARCHAR(50) NOT NULL, -- 'payment_completed', 'payment_failed', etc.
    details JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE,
    INDEX idx_payment_history_tenant (tenant_id),
    INDEX idx_payment_history_payment (payment_id)
) ENGINE=InnoDB;

-- 9. AUDIT EVENTS TABLE
CREATE TABLE IF NOT EXISTS audit_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id VARCHAR(100),
    old_values JSON,
    new_values JSON,
    changes JSON,
    event_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    session_id VARCHAR(255),
    hash VARCHAR(64) NOT NULL,
    previous_hash VARCHAR(64),
    severity ENUM('low', 'medium', 'high', 'critical') DEFAULT 'low',
    source VARCHAR(100) DEFAULT 'api',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_audit_user (user_id),
    INDEX idx_audit_resource (resource_type, resource_id)
) ENGINE=InnoDB;

-- 10. REALTIME METRICS TABLE
CREATE TABLE IF NOT EXISTS realtime_metrics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15,4),
    metric_type ENUM('counter', 'gauge', 'histogram', 'summary') DEFAULT 'gauge',
    user_id INT,
    property_id INT,
    entity_type VARCHAR(50),
    entity_id VARCHAR(100),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    time_bucket ENUM('1m', '5m', '15m', '1h', '1d') DEFAULT '1m',
    tags JSON,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    INDEX idx_metrics_name (metric_name)
) ENGINE=InnoDB;

-- 11. MANAGER PROFILES TABLE
CREATE TABLE IF NOT EXISTS manager_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    manager_id INT NOT NULL UNIQUE,
    location VARCHAR(255),
    specialization JSON,
    capacity INT DEFAULT 10,
    current_load INT DEFAULT 0,
    rating DECIMAL(3,2),
    availability_status ENUM('available', 'busy', 'offline', 'at_capacity') DEFAULT 'available',
    last_status_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 12. PROPERTY VENDORS TABLE
CREATE TABLE IF NOT EXISTS property_vendors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    vendor_user_id INT NOT NULL,
    permission_scope JSON,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_by INT,
    last_access TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    FOREIGN KEY (vendor_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_property_vendor (property_id, vendor_user_id)
) ENGINE=InnoDB;

-- 13. PROPERTY MANAGERS TABLE
CREATE TABLE IF NOT EXISTS property_managers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    manager_id INT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_by INT,
    role ENUM('primary', 'secondary', 'backup') DEFAULT 'secondary',
    status ENUM('active', 'inactive') DEFAULT 'active',
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_property_manager (property_id, manager_id)
) ENGINE=InnoDB;

-- 14. MAINTENANCE REQUESTS TABLE
CREATE TABLE IF NOT EXISTS maintenance_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    requested_by INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority ENUM('low', 'medium', 'high', 'emergency') DEFAULT 'medium',
    category ENUM('plumbing', 'electrical', 'hvac', 'structural', 'cosmetic', 'security', 'other') DEFAULT 'other',
    status ENUM('open', 'assigned', 'in_progress', 'completed', 'closed') DEFAULT 'open',
    status_changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status_changed_by INT,
    assigned_to INT,
    estimated_completion DATE,
    actual_completion DATE,
    photos JSON,
    documents JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    FOREIGN KEY (requested_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_mr_property (property_id),
    INDEX idx_mr_status (status)
) ENGINE=InnoDB;

-- 15. FILE ATTACHMENTS TABLE
CREATE TABLE IF NOT EXISTS file_attachments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100),
    size_bytes INT,
    file_path VARCHAR(500) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INT NOT NULL,
    uploaded_by INT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_public BOOLEAN DEFAULT FALSE,
    access_permissions JSON,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_file_entity (entity_type, entity_id)
) ENGINE=InnoDB;
`;

const initDB = async () => {
    try {
        console.log('Verifying database schema...');
        // Split by semicolon and filter empty strings
        const statements = initSQL.split(';').filter(stmt => stmt.trim().length > 0);

        for (const statement of statements) {
            if (statement.trim()) {
                await pool.query(statement);
            }
        }
        console.log('SUCCESS: All tables verified/created.');
    } catch (error) {
        console.error('FATAL: Database initialization failed:', error);
        // Do not exit, just log, so server stays up for debugging
    }
};

module.exports = initDB;
