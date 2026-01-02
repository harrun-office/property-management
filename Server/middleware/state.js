const { PROPERTY_STATES, TICKET_STATES } = require('../config/constants');
const Property = require('../models/property.model');
const Task = require('../models/task.model');
const sql = require('../config/db');

// Allowed State Transitions Map
const PROPERTY_TRANSITIONS = {
    [PROPERTY_STATES.UNASSIGNED]: [PROPERTY_STATES.ONBOARDING],
    [PROPERTY_STATES.ONBOARDING]: [PROPERTY_STATES.LISTED],
    [PROPERTY_STATES.LISTED]: [PROPERTY_STATES.OCCUPIED, PROPERTY_STATES.MAINTENANCE_ACTIVE, PROPERTY_STATES.INACTIVE],
    [PROPERTY_STATES.OCCUPIED]: [PROPERTY_STATES.MAINTENANCE_ACTIVE, PROPERTY_STATES.LISTED], // Back to listed if tenant leaves
    [PROPERTY_STATES.MAINTENANCE_ACTIVE]: [PROPERTY_STATES.LISTED, PROPERTY_STATES.OCCUPIED], // Back to occupied if minor repair, listed if major
    [PROPERTY_STATES.INACTIVE]: [PROPERTY_STATES.LISTED] // Reactivation
};

// Ticket Transitions can be complex, simplifying for middleware check
const TICKET_TRANSITIONS = {
    [TICKET_STATES.OPEN]: [TICKET_STATES.VENDOR_ASSIGNED, TICKET_STATES.CLOSED],
    [TICKET_STATES.VENDOR_ASSIGNED]: [TICKET_STATES.QUOTATION_SUBMITTED, TICKET_STATES.OPEN], // Open if vendor rejected
    [TICKET_STATES.QUOTATION_SUBMITTED]: [TICKET_STATES.AWAITING_APPROVAL, TICKET_STATES.IN_PROGRESS],
    [TICKET_STATES.AWAITING_APPROVAL]: [TICKET_STATES.IN_PROGRESS, TICKET_STATES.CLOSED, TICKET_STATES.VENDOR_ASSIGNED], // Closed if rejected, Vendor Assigned if Re-quote
    [TICKET_STATES.IN_PROGRESS]: [TICKET_STATES.COMPLETED],
    [TICKET_STATES.COMPLETED]: [TICKET_STATES.CLOSED]
};

/**
 * Middleware to validate State Transitions
 * @param {string} entityType - 'property' or 'ticket'
 */
const checkStateTransition = (entityType) => {
    return (req, res, next) => {
        const { status: newStatus } = req.body; // Assuming 'status' field contains the target state

        // If no status change requested, skip
        if (!newStatus) return next();

        let currentStatus;
        let allowedTransitions;

        if (entityType === 'property') {
            const propertyId = parseInt(req.params.id || req.body.id);
            const property = await Property.findById(propertyId);

            if (!property) return res.status(404).json({ error: 'Property not found' });

            currentStatus = property.status;
            allowedTransitions = PROPERTY_TRANSITIONS;

        } else if (entityType === 'ticket') {
            const ticketId = parseInt(req.params.id || req.body.id);
            const ticket = await Task.findById(ticketId);

            if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

            currentStatus = ticket.status;
            allowedTransitions = TICKET_TRANSITIONS;
        } else {
            return next();
        }

        // Normalize newStatus
        const targetStatus = newStatus.toUpperCase();

        // Check if transition is valid
        if (allowedTransitions[currentStatus] && allowedTransitions[currentStatus].includes(targetStatus)) {
            return next();
        }

        // Allow same state (idempotent)
        if (currentStatus === targetStatus) return next();

        return res.status(400).json({
            error: `Invalid State Transition: Cannot move from ${currentStatus} to ${targetStatus}`
        });
    };
};

module.exports = {
    checkStateTransition,
    PROPERTY_TRANSITIONS,
    TICKET_TRANSITIONS
};
