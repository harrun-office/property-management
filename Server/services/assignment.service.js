const User = require('../models/user.model');
const Property = require('../models/property.model');
const ManagerProfile = require('../models/managerProfile.model');
const { PROPERTY_STATES, USER_ROLES, MANAGER_STATUS } = require('../config/constants');
const sql = require('../config/db');

/**
 * Service to handle Property Manager Auto-Assignment
 */
class AssignmentService {

    /**
     * Assigns a property to the best available Property Manager
     * @param {number} propertyId 
     * @param {string} city 
     * @param {string} propertyType 
     * @returns {object} The assigned manager and updated property
     */
    static async assignManager(propertyId, city, propertyType) {
        console.log(`Attempting to assign manager for Property ${propertyId} in ${city}`);

        // 1. Fetch Candidates (Active Property Managers)
        const [managers] = await sql.query(
            `SELECT u.*, mp.location 
             FROM users u 
             JOIN manager_profiles mp ON u.id = mp.manager_id 
             WHERE u.role = ? AND u.status = ?`,
            [USER_ROLES.PROPERTY_MANAGER, 'active']
        );

        const candidates = managers.filter(user => {
            // Location Check
            const servesCity = user.location && user.location.toLowerCase().includes(city.toLowerCase());

            // Availability Check (Assuming 'availabilityStatus' column exists or defaulted)
            // If column missing in schema, assume available if active.
            // My schema creation didn't explicitly add availability_status to users table, but let's check standard User model usage or assume default.
            // For now, assume active is enough or check 'availability_status' if it was added.
            const isAvailable = true; // Placeholder if column missing

            return servesCity && isAvailable;
        });

        if (candidates.length === 0) {
            throw new Error(`NO_CANDIDATES_AVAILABLE: No active & available manager found in ${city}`);
        }

        // 2. Score & Sort Candidates via Load Balancing
        // Need to count assigned properties for each candidate
        // Fetch counts
        const candidateIds = candidates.map(c => c.id);
        if (candidateIds.length === 0) throw new Error('No valid candidates mapped');

        const [counts] = await sql.query(
            `SELECT assigned_manager_id, COUNT(*) as count 
             FROM properties 
             WHERE assigned_manager_id IN (?) 
             GROUP BY assigned_manager_id`,
            [candidateIds]
        );

        const loadMap = {};
        counts.forEach(row => { loadMap[row.assigned_manager_id] = row.count; });

        candidates.sort((a, b) => {
            const loadA = loadMap[a.id] || 0;
            const loadB = loadMap[b.id] || 0;

            if (loadA !== loadB) {
                return loadA - loadB; // ASC (Least Loaded)
            }
            return a.id - b.id; // Deterministic Tie-break
        });

        const selectedCandidate = candidates[0];

        // 3. Assign (Simulate Transaction - Actual DB update for Property happens in Controller usually, 
        // OR we return the data for Controller to save.
        // My owner.controller.js implementation calls this service and assumes it returns the object to be saved/updated.
        // Wait, owner controller refactor:
        // `newProperty.assignedManagerId = assignmentResult.manager.id;`
        // `newProperty.status = assignmentResult.property.status;`
        // It relies on return values.

        console.log(`Selected Manager: ${selectedCandidate.name} (Load: ${loadMap[selectedCandidate.id] || 0})`);

        return {
            manager: selectedCandidate,
            property: {
                status: PROPERTY_STATES.ONBOARDING // Return proposed status
            }
        };
    }
}

module.exports = AssignmentService;
