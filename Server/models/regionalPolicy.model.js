const sql = require('../config/db');

const RegionalPolicy = function (policy) {
    this.region = policy.region;
    this.resource_type = policy.resourceType;
    this.action = policy.action;
    this.effect = policy.effect; // 'allow', 'deny', 'require_consent'
    this.condition_logic = policy.conditionLogic;
    this.reason = policy.reason;
};

RegionalPolicy.create = async (newPolicy) => {
    try {
        const query = `INSERT INTO regional_policies 
      (region, resource_type, action, effect, condition_logic, reason, is_active, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, TRUE, NOW())`;

        const [res] = await sql.query(query, [
            newPolicy.region,
            newPolicy.resource_type,
            newPolicy.action,
            newPolicy.effect || 'deny',
            JSON.stringify(newPolicy.condition_logic || {}),
            newPolicy.reason
        ]);

        return { id: res.insertId, ...newPolicy };
    } catch (err) {
        throw err;
    }
};

RegionalPolicy.findByRegion = async (region) => {
    try {
        const [rows] = await sql.query('SELECT * FROM regional_policies WHERE region = ? AND is_active = TRUE', [region]);
        return rows;
    } catch (err) {
        throw err;
    }
};

RegionalPolicy.checkRestriction = async (region, resourceType, action) => {
    try {
        // Find specific match or wildcard? detailed match for now.
        const query = `SELECT * FROM regional_policies 
                       WHERE region = ? 
                       AND resource_type = ? 
                       AND action = ? 
                       AND is_active = TRUE`;
        const [rows] = await sql.query(query, [region, resourceType, action]);
        return rows[0] || null; // Returns policy if exists
    } catch (err) {
        throw err;
    }
}

module.exports = RegionalPolicy;
