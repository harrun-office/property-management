// Mock data structure for hierarchical RBAC system
// This will be replaced with database later

const data = {
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
      ownerId: 7, // Property Owner
      assignedManagerId: 2,
      assignedVendors: [
        { vendorId: 4, permissionScope: 'task-based' },
        { vendorId: 5, permissionScope: 'task-based' }
      ],
      status: 'rented',
      views: 0,
      tenantId: 6, // John Tenant
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
      ownerId: 7, // Property Owner
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
      ownerId: 7, // Property Owner
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
      ownerId: 7, // Property Owner
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
      ownerId: 7, // Property Owner
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
    },
    {
      id: 3,
      propertyId: 2,
      assignedVendorId: 4,
      assignedBy: 2,
      title: 'Pool Maintenance Check',
      description: 'Monthly pool maintenance including cleaning, chemical balance, and equipment check.',
      priority: 'medium',
      status: 'pending',
      dueDate: new Date('2024-02-25').toISOString(),
      completedDate: null,
      attachments: [],
      createdAt: new Date('2024-02-15').toISOString(),
      updatedAt: new Date('2024-02-15').toISOString()
    },
    {
      id: 4,
      propertyId: 3,
      assignedVendorId: 5,
      assignedBy: 2,
      title: 'Electrical Safety Inspection',
      description: 'Annual electrical safety inspection for the studio apartment.',
      priority: 'high',
      status: 'pending',
      dueDate: new Date('2024-02-18').toISOString(),
      completedDate: null,
      attachments: [],
      createdAt: new Date('2024-02-16').toISOString(),
      updatedAt: new Date('2024-02-16').toISOString()
    }
  ],

  auditLogs: [
    {
      id: 1,
      userId: 1,
      action: 'create_property_manager',
      resourceType: 'user',
      resourceId: 2,
      details: { email: 'manager1@propmanage.com', name: 'Sarah Property Manager' },
      timestamp: new Date('2024-01-10').toISOString(),
      ipAddress: '192.168.1.100'
    },
    {
      id: 2,
      userId: 1,
      action: 'assign_properties',
      resourceType: 'property',
      resourceId: 1,
      details: { propertyManagerId: 2, propertyIds: [1, 2, 3] },
      timestamp: new Date('2024-01-10').toISOString(),
      ipAddress: '192.168.1.100'
    },
    {
      id: 3,
      userId: 2,
      action: 'create_vendor',
      resourceType: 'vendor',
      resourceId: 1,
      details: { email: 'plumber@vendor.com', companyName: 'QuickFix Plumbing' },
      timestamp: new Date('2024-01-20').toISOString(),
      ipAddress: '192.168.1.101'
    },
    {
      id: 4,
      userId: 2,
      action: 'assign_vendor_to_property',
      resourceType: 'property',
      resourceId: 1,
      details: { vendorId: 4, propertyId: 1, permissionScope: 'task-based' },
      timestamp: new Date('2024-01-20').toISOString(),
      ipAddress: '192.168.1.101'
    },
    {
      id: 5,
      userId: 2,
      action: 'create_task',
      resourceType: 'task',
      resourceId: 1,
      details: { propertyId: 1, vendorId: 4, title: 'Fix Leaky Faucet in Kitchen' },
      timestamp: new Date('2024-02-10').toISOString(),
      ipAddress: '192.168.1.101'
    },
    {
      id: 6,
      userId: 4,
      action: 'update_task_status',
      resourceType: 'task',
      resourceId: 1,
      details: { oldStatus: 'in_progress', newStatus: 'completed' },
      timestamp: new Date('2024-02-14').toISOString(),
      ipAddress: '192.168.1.102'
    },
    {
      id: 7,
      userId: 4,
      action: 'upload_file',
      resourceType: 'task',
      resourceId: 1,
      details: { fileType: 'invoice', fileName: 'inv-001.pdf' },
      timestamp: new Date('2024-02-14').toISOString(),
      ipAddress: '192.168.1.102'
    }
  ],

  // Owner-specific data models
  applications: [],
  tenants: [],
  messages: [
    {
      id: 1,
      propertyId: 1,
      tenantId: 6,
      senderId: 6,
      recipientId: 5,
      subject: 'Question about property',
      message: 'Hi, I have a question about the property. When can I schedule a viewing?',
      read: false,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 2,
      propertyId: 1,
      tenantId: 6,
      senderId: 5,
      recipientId: 6,
      subject: 'Re: Question about property',
      message: 'You can schedule a viewing anytime this week. Let me know your preferred time.',
      read: false,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    }
  ],
  viewingRequests: [],
  payments: [
    {
      id: 1,
      propertyId: 1,
      tenantId: 6,
      amount: 1200,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'pending',
      type: 'rent',
      createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 2,
      propertyId: 1,
      tenantId: 6,
      amount: 1200,
      dueDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      paidDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'paid',
      type: 'rent',
      createdAt: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 3,
      propertyId: 1,
      tenantId: 6,
      amount: 1200,
      dueDate: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString(),
      paidDate: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'paid',
      type: 'rent',
      createdAt: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000).toISOString()
    }
  ],
  maintenanceRequests: [
    {
      id: 1,
      propertyId: 1,
      tenantId: 6,
      title: 'Kitchen faucet leaking',
      description: 'The kitchen faucet has been leaking for the past few days. Water is dripping continuously.',
      priority: 'medium',
      status: 'open',
      photos: [],
      notes: [],
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 2,
      propertyId: 1,
      tenantId: 6,
      title: 'AC not working',
      description: 'The air conditioning unit stopped working yesterday. No cool air coming out.',
      priority: 'high',
      status: 'in_progress',
      photos: [],
      notes: [
        {
          note: 'Technician scheduled for tomorrow',
          addedBy: 5,
          addedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        }
      ],
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    }
  ],
  ownerSettings: [],

  // ID counters
  nextUserId: 8,
  nextPropertyId: 6,
  nextVendorId: 3,
  nextTaskId: 5,
  nextAuditLogId: 8,
  nextApplicationId: 1,
  nextTenantId: 1,
  nextMessageId: 3,
  nextViewingRequestId: 1,
  nextPaymentId: 4,
  nextMaintenanceRequestId: 3,

  // Subscription Service Data Models
  subscriptionPlans: [
    {
      id: 1,
      name: 'Basic Management',
      description: 'Essential property management services',
      price: 50, // per property per month
      features: ['rent_collection', 'maintenance_coordination', 'documentation', 'tenant_communication'],
      maxProperties: 5,
      isActive: true,
      createdAt: new Date('2024-01-01').toISOString()
    },
    {
      id: 2,
      name: 'Professional Management',
      description: 'Comprehensive property management with advanced features',
      price: 100,
      features: ['all_basic', 'marketing', 'legal_docs', 'financial_reports', 'property_inspections', 'emergency_response'],
      maxProperties: 20,
      isActive: true,
      createdAt: new Date('2024-01-01').toISOString()
    },
    {
      id: 3,
      name: 'Enterprise Management',
      description: 'Full-service management for large portfolios',
      price: 150,
      features: ['all_professional', 'dedicated_manager', 'priority_support', 'custom_reporting', 'tax_preparation'],
      maxProperties: -1, // unlimited
      isActive: true,
      createdAt: new Date('2024-01-01').toISOString()
    }
  ],

  managerProfiles: [
    {
      id: 1,
      managerId: 2, // Sarah Property Manager
      bio: 'Experienced property manager with 10+ years in real estate management. Specializing in residential and commercial properties.',
      experience: 10,
      specialties: ['residential', 'commercial', 'luxury'],
      responseTime: '2 hours',
      propertiesManaged: 45,
      averageRating: 4.8,
      totalReviews: 24,
      location: 'New York, NY',
      languages: ['English', 'Spanish'],
      certifications: ['CPM', 'Real Estate License'],
      createdAt: new Date('2024-01-10').toISOString()
    },
    {
      id: 2,
      managerId: 3, // Mike Property Manager
      bio: 'Dedicated property management professional focused on tenant satisfaction and property maintenance.',
      experience: 7,
      specialties: ['residential', 'apartments'],
      responseTime: '4 hours',
      propertiesManaged: 28,
      averageRating: 4.6,
      totalReviews: 18,
      location: 'Los Angeles, CA',
      languages: ['English'],
      certifications: ['Real Estate License'],
      createdAt: new Date('2024-01-15').toISOString()
    }
  ],

  managerSubscriptions: [
    {
      id: 1,
      ownerId: 7, // Property Owner
      managerId: 2, // Sarah Property Manager
      propertyId: 1,
      planId: 2, // Professional Management
      status: 'active', // active, suspended, cancelled, pending
      startDate: new Date('2024-01-15').toISOString(),
      endDate: null, // null for ongoing subscriptions
      nextBillingDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
      monthlyFee: 100,
      setupFee: 0,
      autoRenew: true,
      cancelledAt: null,
      createdAt: new Date('2024-01-15').toISOString(),
      updatedAt: new Date('2024-01-15').toISOString()
    }
  ],

  subscriptionPayments: [
    {
      id: 1,
      subscriptionId: 1,
      amount: 100,
      status: 'paid', // paid, pending, failed, refunded
      dueDate: new Date('2024-01-15').toISOString(),
      paidDate: new Date('2024-01-14').toISOString(),
      paymentMethod: 'credit_card',
      transactionId: 'txn_123456789',
      receiptUrl: '/receipts/subscription_1_payment_1.pdf',
      createdAt: new Date('2024-01-14').toISOString()
    },
    {
      id: 2,
      subscriptionId: 1,
      amount: 100,
      status: 'pending',
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      paidDate: null,
      paymentMethod: 'credit_card',
      transactionId: null,
      receiptUrl: null,
      createdAt: new Date('2024-01-15').toISOString()
    }
  ],

  serviceAgreements: [
    {
      id: 1,
      subscriptionId: 1,
      ownerId: 7,
      managerId: 2,
      propertyId: 1,
      services: ['rent_collection', 'maintenance_coordination', 'documentation', 'marketing', 'legal_docs', 'financial_reports'],
      commissionRate: 0, // 0% if subscription-based
      terms: 'This agreement covers professional property management services including rent collection, maintenance coordination, tenant communication, documentation management, marketing, legal documentation, and financial reporting. The subscription fee is $100/month per property. Either party may cancel with 30 days notice.',
      status: 'active', // active, cancelled, expired
      signedDate: new Date('2024-01-15').toISOString(),
      signedByOwner: true,
      signedByManager: true,
      agreementUrl: '/agreements/subscription_1_agreement.pdf',
      createdAt: new Date('2024-01-15').toISOString(),
      updatedAt: new Date('2024-01-15').toISOString()
    }
  ],

  managerReviews: [
    {
      id: 1,
      managerId: 2,
      ownerId: 7,
      subscriptionId: 1,
      rating: 5,
      review: 'Excellent service! Sarah is very responsive and handles everything professionally.',
      createdAt: new Date('2024-01-20').toISOString()
    },
    {
      id: 2,
      managerId: 2,
      ownerId: null, // Anonymous review
      subscriptionId: null,
      rating: 4,
      review: 'Great property manager, very knowledgeable.',
      createdAt: new Date('2024-01-18').toISOString()
    }
  ],

  // ID counters for subscription models
  nextSubscriptionPlanId: 4,
  nextManagerProfileId: 3,
  nextManagerSubscriptionId: 2,
  nextSubscriptionPaymentId: 3,
  nextServiceAgreementId: 2,
  nextManagerReviewId: 3
};

module.exports = data;
