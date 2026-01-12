// ===========================================
// MIGRATE MOCK DATA TO MYSQL DATABASE
// One-time migration script to move all mock data into MySQL
// Run: node scripts/migrate_mock_data.js
// ===========================================

const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '../.env' });

// Mock data structure (embedded for migration)
const mockData = {
  users: [
    // Super Admin
    {
      id: 1,
      email: 'admin@propmanage.com',
      password: '$2b$10$yNz8d8u9YNc273PQtqVlRu/krH69c7t3Cy1d3aMW.JZH12nB.o/rK', // hashed "password123"
      name: 'Super Admin',
      role: 'super_admin',
      status: 'active',
      invitedBy: null,
      invitationToken: null,
      invitationExpires: null,
      assignedProperties: [],
      permissions: {
        createPropertyManager: true,
        assignProperties: true,
        viewAllProperties: true,
        viewAllUsers: true,
        manageSettings: true,
        viewAuditLogs: true
      },
      twoFactorEnabled: false,
      createdAt: new Date('2024-01-01').toISOString(),
      updatedAt: new Date('2024-01-01').toISOString()
    },
    // Property Managers
    {
      id: 2,
      email: 'manager1@propmanage.com',
      password: '$2b$10$yNz8d8u9YNc273PQtqVlRu/krH69c7t3Cy1d3aMW.JZH12nB.o/rK', // hashed "password123"
      name: 'Sarah Property Manager',
      role: 'property_manager',
      status: 'active',
      invitedBy: 1,
      invitationToken: null,
      invitationExpires: null,
      assignedProperties: [1, 2, 3],
      permissions: {
        createVendor: true,
        assignVendors: true,
        createTasks: true,
        viewReports: true,
        manageAssignedProperties: true
      },
      twoFactorEnabled: false,
      createdAt: new Date('2024-01-10').toISOString(),
      updatedAt: new Date('2024-01-10').toISOString()
    },
    {
      id: 3,
      email: 'manager2@propmanage.com',
      password: '$2b$10$yNz8d8u9YNc273PQtqVlRu/krH69c7t3Cy1d3aMW.JZH12nB.o/rK', // hashed "password123"
      name: 'Mike Property Manager',
      role: 'property_manager',
      status: 'active',
      invitedBy: 1,
      invitationToken: null,
      invitationExpires: null,
      assignedProperties: [4, 5],
      permissions: {
        createVendor: true,
        assignVendors: true,
        createTasks: true,
        viewReports: true,
        manageAssignedProperties: true
      },
      twoFactorEnabled: false,
      createdAt: new Date('2024-01-15').toISOString(),
      updatedAt: new Date('2024-01-15').toISOString()
    },
    // Vendors
    {
      id: 4,
      email: 'plumber@vendor.com',
      password: '$2b$10$yNz8d8u9YNc273PQtqVlRu/krH69c7t3Cy1d3aMW.JZH12nB.o/rK', // hashed "password123"
      name: 'John Plumber',
      role: 'vendor',
      status: 'active',
      invitedBy: 2,
      invitationToken: null,
      invitationExpires: null,
      assignedProperties: [1, 2],
      permissions: {
        viewAssignedProperties: true,
        viewAssignedTasks: true,
        updateTaskStatus: true,
        uploadFiles: true
      },
      twoFactorEnabled: false,
      createdAt: new Date('2024-01-20').toISOString(),
      updatedAt: new Date('2024-01-20').toISOString()
    },
    {
      id: 5,
      email: 'electrician@vendor.com',
      password: '$2b$10$yNz8d8u9YNc273PQtqVlRu/krH69c7t3Cy1d3aMW.JZH12nB.o/rK', // hashed "password123"
      name: 'Jane Electrician',
      role: 'vendor',
      status: 'active',
      invitedBy: 2,
      invitationToken: null,
      invitationExpires: null,
      assignedProperties: [1, 3],
      permissions: {
        viewAssignedProperties: true,
        viewAssignedTasks: true,
        updateTaskStatus: true,
        uploadFiles: true
      },
      twoFactorEnabled: false,
      createdAt: new Date('2024-01-22').toISOString(),
      updatedAt: new Date('2024-01-22').toISOString()
    },
    // Tenant
    {
      id: 6,
      email: 'tenant@example.com',
      password: '$2b$10$yNz8d8u9YNc273PQtqVlRu/krH69c7t3Cy1d3aMW.JZH12nB.o/rK', // hashed "password123"
      name: 'John Tenant',
      role: 'tenant',
      status: 'active',
      invitedBy: null,
      invitationToken: null,
      invitationExpires: null,
      assignedProperties: [],
      permissions: {
        viewProperties: true,
        applyForProperties: true,
        viewApplications: true
      },
      twoFactorEnabled: false,
      createdAt: new Date('2024-02-01').toISOString(),
      updatedAt: new Date('2024-02-01').toISOString()
    },
    // Property Owner
    {
      id: 7,
      email: 'owner@example.com',
      password: '$2b$10$yNz8d8u9YNc273PQtqVlRu/krH69c7t3Cy1d3aMW.JZH12nB.o/rK', // hashed "password123"
      name: 'Jane Property Owner',
      role: 'property_owner',
      status: 'active',
      invitedBy: null,
      invitationToken: null,
      invitationExpires: null,
      assignedProperties: [],
      permissions: {
        createProperties: true,
        manageOwnProperties: true,
        viewOwnProperties: true
      },
      twoFactorEnabled: false,
      createdAt: new Date('2024-02-01').toISOString(),
      updatedAt: new Date('2024-02-01').toISOString()
    }
  ],

  properties: [
    {
      id: 1,
      title: 'Modern 3 Bedroom Apartment',
      description: 'Beautiful modern apartment in the heart of the city.',
      price: 250000,
      address: '123 Main Street, City Center',
      images: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
        'https://images.unsplash.com/photo-1507089947368-19c1da9775ae',
        'https://images.unsplash.com/photo-1523217582562-09d0def993a6'
      ],
      bedrooms: 3,
      bathrooms: 2,
      area: 1200,
      propertyType: 'apartment',
      ownerId: 7,
      assignedManagerId: 2,
      assignedVendors: [
        { vendorId: 4, permissionScope: 'task-based' },
        { vendorId: 5, permissionScope: 'task-based' }
      ],
      status: 'rented',
      views: 0,
      tenantId: 6,
      monthlyRent: 1200,
      createdAt: new Date('2024-01-15').toISOString(),
      updatedAt: new Date('2024-01-15').toISOString()
    },
    {
      id: 2,
      title: 'Luxury Villa with Pool',
      description: 'Stunning luxury villa with private pool and garden.',
      price: 750000,
      address: '456 Oak Avenue, Suburbia',
      images: [
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c'
      ],
      bedrooms: 4,
      bathrooms: 3,
      area: 2500,
      propertyType: 'house',
      ownerId: 7,
      assignedManagerId: 2,
      assignedVendors: [
        { vendorId: 4, permissionScope: 'task-based' }
      ],
      status: 'active',
      views: 0,
      tenantId: null,
      createdAt: new Date('2024-01-20').toISOString(),
      updatedAt: new Date('2024-01-20').toISOString()
    },
    {
      id: 3,
      title: 'Cozy Studio Apartment',
      description: 'Compact and well-designed studio apartment.',
      price: 120000,
      address: '789 Pine Street, Downtown',
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858'
      ],
      bedrooms: 1,
      bathrooms: 1,
      area: 500,
      propertyType: 'apartment',
      ownerId: 7,
      assignedManagerId: 2,
      assignedVendors: [
        { vendorId: 5, permissionScope: 'task-based' }
      ],
      status: 'active',
      views: 0,
      tenantId: null,
      createdAt: new Date('2024-02-01').toISOString(),
      updatedAt: new Date('2024-02-01').toISOString()
    },
    {
      id: 4,
      title: 'Downtown Office Space',
      description: 'Modern office space in prime location.',
      price: 500000,
      address: '321 Business District',
      images: [
        'https://images.unsplash.com/photo-1497366216548-37526070297c',
        'https://images.unsplash.com/photo-1497366754035-f200968a6e72'
      ],
      bedrooms: 0,
      bathrooms: 2,
      area: 3000,
      propertyType: 'commercial',
      ownerId: 7,
      assignedManagerId: 3,
      assignedVendors: [],
      status: 'active',
      views: 0,
      tenantId: null,
      createdAt: new Date('2024-02-05').toISOString(),
      updatedAt: new Date('2024-02-05').toISOString()
    },
    {
      id: 5,
      title: 'Suburban Family Home',
      description: 'Spacious family home with large yard.',
      price: 450000,
      address: '789 Suburb Lane',
      images: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c'
      ],
      bedrooms: 5,
      bathrooms: 3,
      area: 3200,
      propertyType: 'house',
      ownerId: 7,
      assignedManagerId: 3,
      assignedVendors: [],
      status: 'active',
      views: 0,
      tenantId: null,
      createdAt: new Date('2024-02-10').toISOString(),
      updatedAt: new Date('2024-02-10').toISOString()
    }
  ],

  vendors: [
    {
      id: 1,
      userId: 4,
      companyName: 'QuickFix Plumbing',
      contactName: 'John Plumber',
      email: 'plumber@vendor.com',
      phone: '+1-555-0101',
      serviceTypes: ['plumbing', 'maintenance'],
      certifications: [
        'https://example.com/certs/plumbing-cert.pdf',
        'https://example.com/certs/license.pdf'
      ],
      availabilitySchedule: {
        monday: { start: '08:00', end: '17:00' },
        tuesday: { start: '08:00', end: '17:00' },
        wednesday: { start: '08:00', end: '17:00' },
        thursday: { start: '08:00', end: '17:00' },
        friday: { start: '08:00', end: '17:00' },
        saturday: { start: '09:00', end: '13:00' },
        sunday: 'closed'
      },
      performanceRating: 4.8,
      contractInfo: {
        startDate: '2024-01-20',
        endDate: '2024-12-31',
        hourlyRate: 75,
        contractType: 'hourly'
      },
      assignedProperties: [1, 2],
      permissionScope: 'task-based',
      status: 'active',
      createdAt: new Date('2024-01-20').toISOString(),
      updatedAt: new Date('2024-01-20').toISOString()
    },
    {
      id: 2,
      userId: 5,
      companyName: 'Spark Electric',
      contactName: 'Jane Electrician',
      email: 'electrician@vendor.com',
      phone: '+1-555-0102',
      serviceTypes: ['electrical', 'maintenance'],
      certifications: [
        'https://example.com/certs/electrical-cert.pdf',
        'https://example.com/certs/master-electrician.pdf'
      ],
      availabilitySchedule: {
        monday: { start: '07:00', end: '16:00' },
        tuesday: { start: '07:00', end: '16:00' },
        wednesday: { start: '07:00', end: '16:00' },
        thursday: { start: '07:00', end: '16:00' },
        friday: { start: '07:00', end: '16:00' },
        saturday: 'closed',
        sunday: 'closed'
      },
      performanceRating: 4.9,
      contractInfo: {
        startDate: '2024-01-22',
        endDate: '2024-12-31',
        hourlyRate: 85,
        contractType: 'hourly'
      },
      assignedProperties: [1, 3],
      permissionScope: 'task-based',
      status: 'active',
      createdAt: new Date('2024-01-22').toISOString(),
      updatedAt: new Date('2024-01-22').toISOString()
    }
  ],

  tasks: [
    {
      id: 1,
      propertyId: 1,
      assignedVendorId: 4,
      assignedBy: 2,
      title: 'Fix Leaky Faucet in Kitchen',
      description: 'Kitchen faucet has been leaking for the past week. Needs immediate attention.',
      priority: 'high',
      status: 'completed',
      dueDate: new Date('2024-02-15').toISOString(),
      completedDate: new Date('2024-02-14').toISOString(),
      attachments: [
        { type: 'photo', url: 'https://example.com/photos/faucet-before.jpg', uploadedBy: 4 },
        { type: 'photo', url: 'https://example.com/photos/faucet-after.jpg', uploadedBy: 4 },
        { type: 'invoice', url: 'https://example.com/invoices/inv-001.pdf', uploadedBy: 4 }
      ],
      createdAt: new Date('2024-02-10').toISOString(),
      updatedAt: new Date('2024-02-14').toISOString()
    },
    {
      id: 2,
      propertyId: 1,
      assignedVendorId: 5,
      assignedBy: 2,
      title: 'Install New Light Fixtures',
      description: 'Replace old light fixtures in living room and bedrooms with modern LED fixtures.',
      priority: 'medium',
      status: 'in_progress',
      dueDate: new Date('2024-02-20').toISOString(),
      completedDate: null,
      attachments: [
        { type: 'photo', url: 'https://example.com/photos/fixtures-selected.jpg', uploadedBy: 2 }
      ],
      createdAt: new Date('2024-02-12').toISOString(),
      updatedAt: new Date('2024-02-12').toISOString()
    }
  ]
};

async function migrateMockData() {
  let connection;

  try {
    console.log('🔄 Connecting to MySQL database...');

    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'property_management_db'
    });

    console.log('✅ Connected to database');

    // Migrate users
    console.log('👥 Migrating users...');
    for (const user of mockData.users) {
      await connection.query(`
        INSERT IGNORE INTO users (
          id, email, password, name, role, status, invited_by, permissions,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        user.id,
        user.email,
        user.password,
        user.name,
        user.role,
        user.status,
        user.invitedBy,
        JSON.stringify(user.permissions),
        user.createdAt,
        user.updatedAt
      ]);
    }
    console.log(`✅ Migrated ${mockData.users.length} users`);

    // Migrate properties
    console.log('🏠 Migrating properties...');
    for (const property of mockData.properties) {
      await connection.query(`
        INSERT IGNORE INTO properties (
          id, owner_id, title, description, price, address, property_type,
          bedrooms, bathrooms, square_feet, status, tenant_id, assigned_manager_id,
          images, monthly_rent, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        property.id,
        property.ownerId,
        property.title,
        property.description,
        property.price,
        property.address,
        property.propertyType,
        property.bedrooms,
        property.bathrooms,
        property.area,
        property.status,
        property.tenantId,
        property.assignedManagerId,
        JSON.stringify(property.images),
        property.monthlyRent,
        property.createdAt,
        property.updatedAt
      ]);

      // Migrate property-vendor assignments
      for (const vendorAssignment of property.assignedVendors || []) {
        await connection.query(`
          INSERT IGNORE INTO property_vendors (
            property_id, vendor_user_id, permission_scope
          ) VALUES (?, ?, ?)
        `, [
          property.id,
          vendorAssignment.vendorId,
          JSON.stringify({ scope: vendorAssignment.permissionScope })
        ]);
      }
    }
    console.log(`✅ Migrated ${mockData.properties.length} properties`);

    // Migrate vendors
    console.log('🔧 Migrating vendors...');
    for (const vendor of mockData.vendors) {
      await connection.query(`
        INSERT IGNORE INTO vendor_profiles (
          id, user_id, company_name, contact_name, email, phone,
          service_types, certifications, availability_schedule,
          performance_rating, contract_info, status, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        vendor.id,
        vendor.userId,
        vendor.companyName,
        vendor.contactName,
        vendor.email,
        vendor.phone,
        JSON.stringify(vendor.serviceTypes),
        JSON.stringify(vendor.certifications),
        JSON.stringify(vendor.availabilitySchedule),
        vendor.performanceRating,
        JSON.stringify(vendor.contractInfo),
        vendor.status,
        vendor.createdAt,
        vendor.updatedAt
      ]);
    }
    console.log(`✅ Migrated ${mockData.vendors.length} vendors`);

    // Migrate tasks
    console.log('📋 Migrating tasks...');
    for (const task of mockData.tasks) {
      await connection.query(`
        INSERT IGNORE INTO vendor_tasks (
          id, property_id, assigned_vendor_id, assigned_by, title, description,
          priority, status, due_date, completed_date, attachments, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        task.id,
        task.propertyId,
        task.assignedVendorId,
        task.assignedBy,
        task.title,
        task.description,
        task.priority,
        task.status === 'completed' ? 'COMPLETED' : task.status === 'in_progress' ? 'IN_PROGRESS' : 'OPEN',
        task.dueDate,
        task.completedDate,
        JSON.stringify(task.attachments),
        task.createdAt,
        task.updatedAt
      ]);
    }
    console.log(`✅ Migrated ${mockData.tasks.length} tasks`);

    // Create tenants for property 1 (John Tenant)
    console.log('👤 Creating tenant relationship...');
    await connection.query(`
      INSERT IGNORE INTO tenants (
        user_id, property_id, lease_start_date, monthly_rent, status
      ) VALUES (?, ?, ?, ?, ?)
    `, [
      6, // John Tenant user ID
      1, // Property ID
      '2024-01-15',
      1200,
      'active'
    ]);
    console.log('✅ Created tenant relationship');

    // Create sample payments
    console.log('💰 Creating sample payments...');
    const payments = [
      { propertyId: 1, tenantId: 6, amount: 1200, dueDate: '2024-02-01', status: 'paid', paidDate: '2024-01-30' },
      { propertyId: 1, tenantId: 6, amount: 1200, dueDate: '2024-03-01', status: 'pending', paidDate: null }
    ];

    for (const payment of payments) {
      await connection.query(`
        INSERT IGNORE INTO payments (
          property_id, tenant_id, amount, due_date, status, paid_date, type
        ) VALUES (?, ?, ?, ?, ?, ?, 'rent')
      `, [
        payment.propertyId,
        payment.tenantId,
        payment.amount,
        payment.dueDate,
        payment.status,
        payment.paidDate
      ]);
    }
    console.log(`✅ Created ${payments.length} sample payments`);

    // Create sample maintenance requests
    console.log('🔧 Creating sample maintenance requests...');
    await connection.query(`
      INSERT IGNORE INTO maintenance_requests (
        property_id, requested_by, title, description, priority, status
      ) VALUES (?, ?, ?, ?, ?, ?)
    `, [
      1, // Property ID
      6, // John Tenant user ID
      'Kitchen faucet leaking',
      'The kitchen faucet has been leaking for the past few days.',
      'medium',
      'open'
    ]);
    console.log('✅ Created sample maintenance request');

    console.log('🎉 Migration completed successfully!');
    console.log('');
    console.log('📊 Summary:');
    console.log(`   - Users: ${mockData.users.length}`);
    console.log(`   - Properties: ${mockData.properties.length}`);
    console.log(`   - Vendors: ${mockData.vendors.length}`);
    console.log(`   - Tasks: ${mockData.tasks.length}`);
    console.log(`   - Plus additional relationships and sample data`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    if (connection) await connection.end();
  }
}

// Run migration if called directly
if (require.main === module) {
  migrateMockData()
    .then(() => {
      console.log('✅ Mock data migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Mock data migration failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateMockData };
