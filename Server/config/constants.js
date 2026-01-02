/**
 * Property Management System Constants
 * Centralized definition of all domain states, thresholds, and roles.
 */

const PROPERTY_STATES = {
    UNASSIGNED: 'UNASSIGNED',
    ONBOARDING: 'ONBOARDING',
    LISTED: 'LISTED',
    OCCUPIED: 'OCCUPIED',
    MAINTENANCE_ACTIVE: 'MAINTENANCE_ACTIVE',
    INACTIVE: 'INACTIVE'
};

const TICKET_STATES = {
    OPEN: 'OPEN',
    VENDOR_ASSIGNED: 'VENDOR_ASSIGNED',
    QUOTATION_SUBMITTED: 'QUOTATION_SUBMITTED',
    AWAITING_APPROVAL: 'AWAITING_APPROVAL',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
    CLOSED: 'CLOSED'
};

const APPROVAL_THRESHOLDS = {
    MAINTENANCE_AUTO_APPROVE_LIMIT: 500 // Tickets <= $500 can be auto-approved by Manager
};

const USER_ROLES = {
    SUPER_ADMIN: 'super_admin',
    PROPERTY_MANAGER: 'property_manager',
    PROPERTY_OWNER: 'property_owner',
    VENDOR: 'vendor',
    TENANT: 'tenant'
};

const MANAGER_STATUS = {
    AVAILABLE: 'AVAILABLE',
    UNAVAILABLE: 'UNAVAILABLE',
    AT_CAPACITY: 'AT_CAPACITY'
};

module.exports = {
    PROPERTY_STATES,
    TICKET_STATES,
    APPROVAL_THRESHOLDS,
    USER_ROLES,
    MANAGER_STATUS
};
