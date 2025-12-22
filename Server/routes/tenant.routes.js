const express = require('express');
const router = express.Router();
const tenantController = require('../controllers/tenant.controller');
const { authenticate } = require('../middleware/auth');

// Dashboard
router.get('/dashboard', authenticate, tenantController.getDashboard);

// Payments
router.get('/payments', authenticate, tenantController.getPayments);
router.get('/payments/upcoming', authenticate, tenantController.getUpcomingPayments);
router.get('/payments/:id', authenticate, tenantController.getPaymentById);

// Messages
router.get('/messages', authenticate, tenantController.getMessages);
router.get('/messages/:id', authenticate, tenantController.getMessageById);
router.post('/messages', authenticate, tenantController.sendMessage);
router.put('/messages/:id/read', authenticate, tenantController.markMessageRead);

// Maintenance
router.get('/maintenance', authenticate, tenantController.getMaintenance);
router.post('/maintenance', authenticate, tenantController.createMaintenance);
router.get('/maintenance/:id', authenticate, tenantController.getMaintenanceById);
router.put('/maintenance/:id', authenticate, tenantController.updateMaintenance);

// Current Property & Lease
router.get('/current-property', authenticate, tenantController.getCurrentProperty);
router.get('/lease', authenticate, tenantController.getLease);

// Documents
router.get('/documents', authenticate, tenantController.getDocuments);

// Profile
router.get('/profile', authenticate, tenantController.getProfile);
router.put('/profile', authenticate, tenantController.updateProfile);

module.exports = router;

