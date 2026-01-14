const sql = require('./config/db');

async function debugSecurityDeposit() {
  try {
    console.log('=== DEBUGGING SECURITY DEPOSIT PAYMENT ===\n');

    // Check database connection
    console.log('1. Checking database connection...');
    const [test] = await sql.query('SELECT 1 as test');
    console.log('✓ Database connected\n');

    // Check tenants table
    console.log('2. Checking tenants table...');
    const [tenants] = await sql.query('SELECT COUNT(*) as count FROM tenants');
    console.log(`✓ Tenants count: ${tenants[0].count}`);

    // Check properties table
    console.log('3. Checking properties table...');
    const [props] = await sql.query('SELECT COUNT(*) as count FROM properties');
    console.log(`✓ Properties count: ${props[0].count}`);

    // Check applications with approved_pending_payment status
    console.log('4. Checking pending payment applications...');
    const [apps] = await sql.query('SELECT COUNT(*) as count FROM applications WHERE status = "approved_pending_payment"');
    console.log(`✓ Pending payment applications: ${apps[0].count}`);

    if (apps[0].count > 0) {
      const [pendingApps] = await sql.query('SELECT id, applicant_id, property_id FROM applications WHERE status = "approved_pending_payment" LIMIT 5');
      console.log('Sample pending applications:');
      pendingApps.forEach(app => {
        console.log(`  - ID: ${app.id}, Applicant: ${app.applicant_id}, Property: ${app.property_id}`);
      });
    }

    // Check for potential conflicts
    console.log('\n5. Checking for potential conflicts...');

    // Check if any properties are already occupied
    const [occupiedProps] = await sql.query('SELECT COUNT(*) as count FROM properties WHERE tenant_id IS NOT NULL');
    console.log(`✓ Occupied properties: ${occupiedProps[0].count}`);

    // Check if any users are already tenants
    const [existingTenants] = await sql.query('SELECT COUNT(*) as count FROM tenants WHERE status = "active"');
    console.log(`✓ Active tenants: ${existingTenants[0].count}`);

    // Check security deposit values
    console.log('\n6. Checking security deposit values...');
    const [securityDeposits] = await sql.query('SELECT id, title, security_deposit FROM properties WHERE security_deposit > 0 LIMIT 5');
    console.log('Properties with security deposit:');
    securityDeposits.forEach(prop => {
      console.log(`  - ID: ${prop.id}, Title: ${prop.title}, Deposit: ${prop.security_deposit}`);
    });

    // Test a sample application if exists
    if (apps[0].count > 0) {
      console.log('\n7. Testing sample application processing...');
      const [sampleApp] = await sql.query(`
        SELECT a.*, p.security_deposit, p.price as monthly_rent, p.title as property_title
        FROM applications a
        JOIN properties p ON a.property_id = p.id
        WHERE a.status = 'approved_pending_payment'
        LIMIT 1
      `);

      if (sampleApp.length > 0) {
        const app = sampleApp[0];
        console.log(`Testing with application ID: ${app.id}`);
        console.log(`Applicant ID: ${app.applicant_id}`);
        console.log(`Property ID: ${app.property_id}`);
        console.log(`Security deposit: ${app.security_deposit}`);
        console.log(`Monthly rent: ${app.monthly_rent}`);

        // Check if user exists
        const [userCheck] = await sql.query('SELECT id, name FROM users WHERE id = ?', [app.applicant_id]);
        if (userCheck.length === 0) {
          console.log('❌ ERROR: Applicant user does not exist!');
        } else {
          console.log(`✓ Applicant exists: ${userCheck[0].name}`);
        }

        // Check if property exists
        const [propCheck] = await sql.query('SELECT id, title, tenant_id FROM properties WHERE id = ?', [app.property_id]);
        if (propCheck.length === 0) {
          console.log('❌ ERROR: Property does not exist!');
        } else {
          console.log(`✓ Property exists: ${propCheck[0].title}`);
          if (propCheck[0].tenant_id) {
            console.log(`⚠️  WARNING: Property already has tenant_id: ${propCheck[0].tenant_id}`);
          }
        }

        // Check if tenant record already exists
        const [tenantCheck] = await sql.query('SELECT id FROM tenants WHERE user_id = ? AND property_id = ?', [app.applicant_id, app.property_id]);
        if (tenantCheck.length > 0) {
          console.log('⚠️  WARNING: Tenant record already exists!');
        } else {
          console.log('✓ No existing tenant record');
        }
      }
    }

    console.log('\n=== DEBUG COMPLETE ===');

  } catch (error) {
    console.error('❌ ERROR during debugging:', error);
  } finally {
    process.exit(0);
  }
}

debugSecurityDeposit();
