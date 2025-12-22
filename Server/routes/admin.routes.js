const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticate, requireSuperAdmin } = require('../middleware/auth');

// Property Manager Management
router.post('/property-managers', authenticate, requireSuperAdmin, adminController.createPropertyManager);
router.get('/property-managers', authenticate, requireSuperAdmin, adminController.getPropertyManagers);
router.put('/property-managers/:id', authenticate, requireSuperAdmin, adminController.updatePropertyManager);
router.delete('/property-managers/:id', authenticate, requireSuperAdmin, adminController.suspendPropertyManager);
router.post('/property-managers/:id/activate', authenticate, requireSuperAdmin, adminController.activatePropertyManager);
router.post('/property-managers/:id/assign-properties', authenticate, requireSuperAdmin, adminController.assignProperties);

// Vendor Management
router.post('/vendors', authenticate, requireSuperAdmin, adminController.createVendor);
router.get('/vendors', authenticate, requireSuperAdmin, adminController.getVendors);
router.get('/vendors/:id', authenticate, requireSuperAdmin, adminController.getVendorById);
router.put('/vendors/:id', authenticate, requireSuperAdmin, adminController.updateVendor);
router.delete('/vendors/:id', authenticate, requireSuperAdmin, adminController.suspendVendor);
router.post('/vendors/:id/activate', authenticate, requireSuperAdmin, adminController.activateVendor);

// Password Reset (works for both managers and vendors)
router.post('/users/:id/reset-password', authenticate, requireSuperAdmin, adminController.resetPassword);

// Performance Endpoints
router.get('/performance/managers', authenticate, requireSuperAdmin, adminController.getManagersPerformance);
router.get('/performance/vendors', authenticate, requireSuperAdmin, adminController.getVendorsPerformance);

// Activity & System Overview
router.get('/audit-logs', authenticate, requireSuperAdmin, adminController.getAuditLogs);
router.get('/system-overview', authenticate, requireSuperAdmin, adminController.getSystemOverview);

// Property Activity
router.get('/property-activity', authenticate, requireSuperAdmin, adminController.getPropertyActivity);
router.get('/property-activity/stats', authenticate, requireSuperAdmin, adminController.getPropertyActivityStats);

// Subscription Management (Admin)
router.get('/subscription-plans', authenticate, requireSuperAdmin, adminController.getSubscriptionPlans);
router.post('/subscription-plans', authenticate, requireSuperAdmin, adminController.createSubscriptionPlan);
router.put('/subscription-plans/:id', authenticate, requireSuperAdmin, adminController.updateSubscriptionPlan);
router.get('/subscriptions', authenticate, requireSuperAdmin, adminController.getAllSubscriptions);
router.get('/subscriptions/analytics', authenticate, requireSuperAdmin, adminController.getSubscriptionAnalytics);

module.exports = router;
