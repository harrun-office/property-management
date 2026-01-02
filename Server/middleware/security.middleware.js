const Delegation = require('../models/delegation.model');
const EmergencyRequest = require('../models/emergencyRequest.model');
const RegionalPolicy = require('../models/regionalPolicy.model');
const { createAuditLog } = require('./auth');
const Property = require('../models/property.model'); // For region lookup

// Helper to determine resource region
const getResourceRegion = async (req) => {
    // Logic: Look for propertyId in multiple places
    const propertyId = req.body.propertyId || req.params.propertyId || req.query.propertyId;
    if (propertyId) {
        try {
            const p = await Property.findById(propertyId);
            return p ? p.region : 'US'; // Default to US if not found properties have default region usually
        } catch (e) {
            // If DB error, default to restrictive or default? Default US for now.
            return 'US';
        }
    }
    return 'US'; // Default if no resource context (Global/US)
};

const checkDelegatedPermission = (requiredPermission) => {
    return async (req, res, next) => {
        try {
            const user = req.user;
            if (!user) return res.status(401).send({ message: "Unauthorized" });

            // 0. Check Emergency Access First (Break-Glass)
            const emergencySession = await EmergencyRequest.findActiveByUserId(user.id);
            if (emergencySession) {
                req.isEmergencyMode = true;
                req.emergencyRequestId = emergencySession.id;
                return next();
            }

            // 1. Check Delegation
            const activeDelegations = await Delegation.findActiveByGrantee(user.id);

            const hasDelegation = activeDelegations.some(d => {
                const perms = (typeof d.permissions === 'string') ? JSON.parse(d.permissions) : d.permissions;
                if (!perms.includes(requiredPermission)) return false;

                const scope = (typeof d.scope === 'string') ? JSON.parse(d.scope) : d.scope;
                if (scope.propertyId) {
                    const targetPropId = req.params.propertyId || req.body.propertyId || req.query.propertyId;
                    if (!targetPropId) return false;

                    if (Array.isArray(scope.propertyId)) {
                        if (!scope.propertyId.includes(parseInt(targetPropId))) return false;
                    } else {
                        if (scope.propertyId !== parseInt(targetPropId)) return false;
                    }
                }
                return true;
            });

            if (hasDelegation) {
                req.delegationUsed = true;
                next();
            } else {
                return res.status(403).send({ message: "Access Denied: No valid permission or delegation found." });
            }

        } catch (error) {
            console.error("Delegation Middleware Error:", error);
            res.status(500).send({ message: "Internal Server Error" });
        }
    };
};

const requireEmergencyMode = async (req, res, next) => {
    const user = req.user;
    if (!user) return res.status(401).send({ message: "Unauthorized" });

    const emergencySession = await EmergencyRequest.findActiveByUserId(user.id);
    if (!emergencySession) {
        return res.status(403).json({ error: 'This action requires active Emergency Break-Glass status.' });
    }
    req.isEmergencyMode = true;
    next();
};

const enforceRegionalPolicy = (resourceType, action) => {
    return async (req, res, next) => {
        try {
            const user = req.user;
            if (!user) return res.status(401).send({ message: "Unauthorized" });

            // 0. Emergency Bypass
            // Check implicit emergency mode from previous middleware or check DB again if this is first guard?
            // Better to re-check if not set to be safe, or assume auth middleware runs before.
            // Let's check req.isEmergencyMode (set by checkDelegatedPermission or auth if updated there? No, standalone).
            // We should duplicate the check or use a shared context middleware.
            const emergencySession = await EmergencyRequest.findActiveByUserId(user.id);
            if (emergencySession) return next();

            // 1. Identify Regions
            const userRegion = user.region || 'US';
            const resourceRegion = await getResourceRegion(req);

            // 2. Cross-Region Block
            if (userRegion !== resourceRegion && user.role !== 'super_admin') {
                return res.status(403).json({
                    error: `Cross-Region Access Blocked: User(${userRegion}) cannot access Resource(${resourceRegion})`
                });
            }

            // 3. Regional Policy Overlay
            const policy = await RegionalPolicy.checkRestriction(resourceRegion, resourceType, action);

            if (policy) {
                if (policy.effect === 'deny') {
                    return res.status(403).json({
                        error: `Regional Policy Violation: ${action} denied in ${resourceRegion}. Reason: ${policy.reason}`
                    });
                }
            }

            next();
        } catch (error) {
            console.error("Regional Policy Middleware Error:", error);
            res.status(500).send({ message: "Internal Server Error" });
        }
    };
};

module.exports = {
    checkDelegatedPermission,
    requireEmergencyMode,
    enforceRegionalPolicy
};
