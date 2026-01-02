-- ===========================================
-- DATABASE TRIGGERS AND FUNCTIONS
-- ===========================================

DELIMITER //

-- Function to calculate hash for audit events
CREATE FUNCTION calculate_event_hash(
    prev_hash VARCHAR(64),
    user_id INT,
    action VARCHAR(100),
    resource_type VARCHAR(50),
    resource_id VARCHAR(100),
    event_data JSON,
    timestamp_val TIMESTAMP
) RETURNS VARCHAR(64)
DETERMINISTIC
BEGIN
    DECLARE data_string TEXT;
    SET data_string = CONCAT_WS('|',
        COALESCE(prev_hash, 'GENESIS_HASH'),
        COALESCE(user_id, ''),
        action,
        resource_type,
        COALESCE(resource_id, ''),
        JSON_UNQUOTE(COALESCE(event_data, '{}')),
        timestamp_val
    );
    RETURN SHA2(data_string, 256);
END //

-- Trigger for audit events hash chain
CREATE TRIGGER audit_events_hash_trigger BEFORE INSERT ON audit_events
FOR EACH ROW
BEGIN
    DECLARE prev_hash VARCHAR(64);

    SELECT hash INTO prev_hash
    FROM audit_events
    ORDER BY id DESC LIMIT 1;

    SET NEW.hash = calculate_event_hash(
        prev_hash,
        NEW.user_id,
        NEW.action,
        NEW.resource_type,
        NEW.resource_id,
        JSON_OBJECT('old_values', NEW.old_values, 'new_values', NEW.new_values),
        NEW.event_timestamp
    );

    SET NEW.previous_hash = prev_hash;
END //

-- User session triggers
CREATE TRIGGER user_session_connect_trigger AFTER INSERT ON user_sessions
FOR EACH ROW
BEGIN
    UPDATE users
    SET is_online = TRUE,
        last_seen = NOW(),
        current_session_id = NEW.id
    WHERE id = NEW.user_id;
END //

CREATE TRIGGER user_session_disconnect_trigger AFTER UPDATE ON user_sessions
FOR EACH ROW
BEGIN
    IF NEW.connection_status = 'disconnected' AND OLD.connection_status = 'connected' THEN
        UPDATE users
        SET is_online = FALSE,
            last_seen = NOW(),
            current_session_id = NULL
        WHERE id = NEW.user_id;
    END IF;
END //

-- Property activity tracking
CREATE TRIGGER property_activity_trigger AFTER UPDATE ON properties
FOR EACH ROW
BEGIN
    IF OLD.status != NEW.status OR OLD.updated_at != NEW.updated_at THEN
        UPDATE properties
        SET last_activity = NOW(),
            activity_count = activity_count + 1
        WHERE id = NEW.id;

        INSERT INTO realtime_metrics (metric_name, metric_value, property_id, entity_type, tags)
        VALUES ('property_status_change', 1, NEW.id, 'property',
                JSON_OBJECT('old_status', OLD.status, 'new_status', NEW.status));
    END IF;
END //

-- Task activity and notification trigger
CREATE TRIGGER task_activity_trigger AFTER UPDATE ON vendor_tasks
FOR EACH ROW
BEGIN
    IF OLD.status != NEW.status THEN
        UPDATE vendor_tasks
        SET last_activity = NOW(),
            activity_count = activity_count + 1,
            status_changed_at = NOW()
        WHERE id = NEW.id;

        INSERT INTO notifications (user_id, title, message, type, entity_type, entity_id, priority)
        VALUES (
            NEW.assigned_vendor_id,
            CONCAT('Task Status Updated: ', NEW.title),
            CONCAT('Your task status has changed from ', OLD.status, ' to ', NEW.status),
            'task',
            'task',
            NEW.id,
            CASE WHEN NEW.priority = 'urgent' THEN 'urgent' ELSE 'normal' END
        );
    END IF;
END //

-- Manager workload calculation
CREATE FUNCTION calculate_manager_workload(manager_id INT) RETURNS INT
READS SQL DATA
BEGIN
    DECLARE total_properties INT DEFAULT 0;

    SELECT COUNT(*) INTO total_properties
    FROM property_managers
    WHERE manager_id = manager_id AND status = 'active';

    RETURN total_properties;
END //

-- Manager workload triggers
CREATE TRIGGER manager_workload_insert_trigger AFTER INSERT ON property_managers
FOR EACH ROW
BEGIN
    UPDATE manager_profiles
    SET current_load = calculate_manager_workload(NEW.manager_id)
    WHERE manager_id = NEW.manager_id;
END //

CREATE TRIGGER manager_workload_delete_trigger AFTER DELETE ON property_managers
FOR EACH ROW
BEGIN
    UPDATE manager_profiles
    SET current_load = calculate_manager_workload(OLD.manager_id)
    WHERE manager_id = OLD.manager_id;
END //

-- Payment overdue trigger
CREATE TRIGGER payment_overdue_trigger BEFORE UPDATE ON payments
FOR EACH ROW
BEGIN
    IF NEW.status = 'pending' AND NEW.due_date < CURDATE() THEN
        SET NEW.status = 'overdue';

        INSERT INTO notifications (user_id, title, message, type, entity_type, entity_id, priority)
        SELECT
            t.user_id,
            'Payment Overdue',
            CONCAT('Your payment of $', NEW.amount, ' for property is overdue'),
            'payment',
            'payment',
            NEW.id,
            'high'
        FROM tenants t
        WHERE t.property_id = NEW.property_id AND t.user_id = NEW.tenant_id AND t.status = 'active';
    END IF;
END //

-- User status change trigger for audit
CREATE TRIGGER user_status_change_trigger AFTER UPDATE ON users
FOR EACH ROW
BEGIN
    IF OLD.status != NEW.status THEN
        INSERT INTO audit_events (
            user_id, action, resource_type, resource_id,
            old_values, new_values, changes, severity, source
        ) VALUES (
            NEW.id,
            'status_change',
            'user',
            NEW.id,
            JSON_OBJECT('status', OLD.status),
            JSON_OBJECT('status', NEW.status),
            JSON_OBJECT('status_changed', JSON_OBJECT('from', OLD.status, 'to', NEW.status)),
            'medium',
            'system'
        );
    END IF;
END //

-- Property status change trigger for notifications
CREATE TRIGGER property_status_notification_trigger AFTER UPDATE ON properties
FOR EACH ROW
BEGIN
    IF OLD.status != NEW.status THEN
        -- Notify property owner
        INSERT INTO notifications (user_id, title, message, type, entity_type, entity_id, priority)
        VALUES (
            NEW.owner_id,
            CONCAT('Property Status Changed: ', NEW.title),
            CONCAT('Your property status has changed from ', OLD.status, ' to ', NEW.status),
            'property',
            'property',
            NEW.id,
            CASE WHEN NEW.status IN ('MAINTENANCE_ACTIVE', 'INACTIVE') THEN 'high' ELSE 'normal' END
        );

        -- Notify assigned manager
        IF NEW.assigned_manager_id IS NOT NULL THEN
            INSERT INTO notifications (user_id, title, message, type, entity_type, entity_id, priority)
            VALUES (
                NEW.assigned_manager_id,
                CONCAT('Managed Property Status Changed: ', NEW.title),
                CONCAT('Property status changed from ', OLD.status, ' to ', NEW.status),
                'property',
                'property',
                NEW.id,
                CASE WHEN NEW.status IN ('MAINTENANCE_ACTIVE', 'INACTIVE') THEN 'high' ELSE 'normal' END
            );
        END IF;
    END IF;
END //

-- Tenant lease expiration warning trigger
CREATE TRIGGER tenant_lease_expiration_trigger BEFORE UPDATE ON tenants
FOR EACH ROW
BEGIN
    IF NEW.status = 'active' AND NEW.lease_end_date IS NOT NULL THEN
        IF NEW.lease_end_date <= DATE_ADD(CURDATE(), INTERVAL 30 DAY) AND OLD.lease_end_date > DATE_ADD(CURDATE(), INTERVAL 30 DAY) THEN
            INSERT INTO notifications (user_id, title, message, type, entity_type, entity_id, priority)
            VALUES (
                NEW.user_id,
                'Lease Expiration Notice',
                CONCAT('Your lease for property ends on ', DATE_FORMAT(NEW.lease_end_date, '%M %d, %Y'), '. Please contact your property manager.'),
                'property',
                'tenant',
                NEW.id,
                'high'
            );
        END IF;
    END IF;
END //

-- Function to get user permissions
CREATE FUNCTION get_user_permissions(user_id INT) RETURNS JSON
READS SQL DATA
BEGIN
    DECLARE user_role VARCHAR(50);
    DECLARE user_perms JSON;

    SELECT role, permissions INTO user_role, user_perms
    FROM users
    WHERE id = user_id;

    RETURN JSON_MERGE_PATCH(
        CASE user_role
            WHEN 'super_admin' THEN JSON_OBJECT(
                'all_access', true,
                'manage_users', true,
                'manage_properties', true,
                'manage_tasks', true,
                'view_reports', true
            )
            WHEN 'property_manager' THEN JSON_OBJECT(
                'manage_assigned_properties', true,
                'assign_vendors', true,
                'approve_quotations', true,
                'view_reports', true
            )
            WHEN 'property_owner' THEN JSON_OBJECT(
                'manage_own_properties', true,
                'view_own_properties', true,
                'hire_vendors', true
            )
            WHEN 'vendor' THEN JSON_OBJECT(
                'view_assigned_tasks', true,
                'submit_quotations', true,
                'update_task_status', true
            )
            WHEN 'tenant' THEN JSON_OBJECT(
                'view_property_info', true,
                'submit_maintenance_requests', true,
                'make_payments', true
            )
            ELSE JSON_OBJECT('basic_access', true)
        END,
        COALESCE(user_perms, JSON_OBJECT())
    );
END //

-- Function to check property access
CREATE FUNCTION check_property_access(user_id INT, property_id INT, required_permission VARCHAR(100)) RETURNS BOOLEAN
READS SQL DATA
BEGIN
    DECLARE user_role VARCHAR(50);
    DECLARE user_perms JSON;
    DECLARE property_owner_id INT;

    -- Get user info
    SELECT role, permissions INTO user_role, user_perms
    FROM users
    WHERE id = user_id;

    -- Super admin has all access
    IF user_role = 'super_admin' THEN
        RETURN TRUE;
    END IF;

    -- Get property owner
    SELECT owner_id INTO property_owner_id
    FROM properties
    WHERE id = property_id;

    -- Property owner can access their own properties
    IF user_role = 'property_owner' AND property_owner_id = user_id THEN
        RETURN TRUE;
    END IF;

    -- Property manager can access assigned properties
    IF user_role = 'property_manager' THEN
        IF EXISTS (
            SELECT 1 FROM property_managers
            WHERE property_id = property_id AND manager_id = user_id AND status = 'active'
        ) THEN
            RETURN TRUE;
        END IF;
    END IF;

    -- Vendor can access assigned properties
    IF user_role = 'vendor' THEN
        IF EXISTS (
            SELECT 1 FROM property_vendors
            WHERE property_id = property_id AND vendor_user_id = user_id AND status = 'active'
        ) THEN
            RETURN TRUE;
        END IF;
    END IF;

    -- Tenant can access their leased properties
    IF user_role = 'tenant' THEN
        IF EXISTS (
            SELECT 1 FROM tenants
            WHERE property_id = property_id AND user_id = user_id AND status = 'active'
        ) THEN
            RETURN TRUE;
        END IF;
    END IF;

    RETURN FALSE;
END //

-- Function to calculate property occupancy rate
CREATE FUNCTION get_property_occupancy_rate(property_id INT) RETURNS DECIMAL(5,2)
READS SQL DATA
BEGIN
    DECLARE total_units INT DEFAULT 1;
    DECLARE occupied_units INT DEFAULT 0;

    -- For now, simple occupancy (has tenant or not)
    SELECT COUNT(*) INTO occupied_units
    FROM tenants
    WHERE property_id = property_id AND status = 'active';

    RETURN (occupied_units / total_units) * 100;
END //

-- Function to get user activity score
CREATE FUNCTION get_user_activity_score(user_id INT) RETURNS DECIMAL(5,2)
READS SQL DATA
BEGIN
    DECLARE login_count INT DEFAULT 0;
    DECLARE task_completion_rate DECIMAL(5,2) DEFAULT 0;
    DECLARE response_time_avg INT DEFAULT 0;

    -- Count recent logins (simplified)
    SELECT COUNT(*) INTO login_count
    FROM audit_events
    WHERE user_id = user_id AND action = 'login'
    AND event_timestamp >= DATE_SUB(NOW(), INTERVAL 30 DAY);

    -- Task completion rate for vendors/managers
    SELECT AVG(CASE WHEN status = 'COMPLETED' THEN 100 ELSE 0 END) INTO task_completion_rate
    FROM vendor_tasks
    WHERE (assigned_vendor_id = user_id OR assigned_by = user_id)
    AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY);

    RETURN (login_count * 0.3) + (COALESCE(task_completion_rate, 0) * 0.7);
END //

DELIMITER ;
