const express = require('express');
const router = express.Router();
const tenantController = require('../controllers/tenant.controller');
const { authenticate, requireTenant } = require('../middleware/auth');

// Dashboard
router.get('/dashboard', authenticate, requireTenant, tenantController.getDashboard);

// Payments
router.get('/payments', authenticate, requireTenant, tenantController.getPayments);
router.get('/payments/upcoming', authenticate, requireTenant, tenantController.getUpcomingPayments);
router.get('/payments/:id', authenticate, requireTenant, tenantController.getPaymentById);
router.post('/payments/:id/process', authenticate, requireTenant, tenantController.processPayment);
router.get('/payments/:paymentId/bill', authenticate, requireTenant, tenantController.getBill);
router.get('/payment-history', authenticate, requireTenant, tenantController.getPaymentHistory);

// Messages
router.get('/messages', authenticate, requireTenant, tenantController.getMessages);
router.get('/messages/:id', authenticate, requireTenant, tenantController.getMessageById);
router.post('/messages', authenticate, requireTenant, tenantController.sendMessage);
router.put('/messages/:id/read', authenticate, requireTenant, tenantController.markMessageRead);

// Maintenance
router.get('/maintenance', authenticate, requireTenant, tenantController.getMaintenance);
router.post('/maintenance', authenticate, requireTenant, tenantController.createMaintenance);
router.get('/maintenance/:id', authenticate, requireTenant, tenantController.getMaintenanceById);
router.put('/maintenance/:id', authenticate, requireTenant, tenantController.updateMaintenance);

// Current Property & Lease
router.get('/current-property', authenticate, requireTenant, tenantController.getCurrentProperty);
router.get('/lease', authenticate, requireTenant, tenantController.getLease);

// Documents
router.get('/documents', authenticate, requireTenant, tenantController.getDocuments);

// Profile
router.get('/profile', authenticate, requireTenant, tenantController.getProfile);
router.put('/profile', authenticate, requireTenant, tenantController.updateProfile);

// Saved Properties
router.get('/saved-properties', authenticate, requireTenant, tenantController.getSavedProperties);
router.post('/saved-properties', authenticate, requireTenant, tenantController.saveProperty);
router.delete('/saved-properties/:id', authenticate, requireTenant, tenantController.unsaveProperty);

// Applications
router.get('/applications', authenticate, requireTenant, tenantController.getMyApplications);
router.post('/applications', authenticate, requireTenant, tenantController.createApplication);

module.exports = router;

