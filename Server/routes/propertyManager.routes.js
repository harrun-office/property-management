const express = require('express');
const router = express.Router();
const propertyManagerController = require('../controllers/propertyManager.controller');
const { authenticate, requirePropertyManager } = require('../middleware/auth');

router.get('/properties', authenticate, requirePropertyManager, propertyManagerController.getProperties);
router.post('/vendors', authenticate, requirePropertyManager, propertyManagerController.createVendor);
router.get('/vendors', authenticate, requirePropertyManager, propertyManagerController.getVendors);
router.put('/vendors/:id', authenticate, requirePropertyManager, propertyManagerController.updateVendor);
router.post('/vendors/:id/assign-property', authenticate, requirePropertyManager, propertyManagerController.assignVendorToProperty);
router.post('/tasks', authenticate, requirePropertyManager, propertyManagerController.createTask);
router.get('/tasks', authenticate, requirePropertyManager, propertyManagerController.getTasks);
router.put('/tasks/:id', authenticate, requirePropertyManager, propertyManagerController.updateTask);
router.get('/reports', authenticate, requirePropertyManager, propertyManagerController.getReports);

// Manager Subscriptions
router.get('/subscriptions', authenticate, requirePropertyManager, propertyManagerController.getMySubscriptions);
router.get('/subscriptions/:id', authenticate, requirePropertyManager, propertyManagerController.getSubscriptionDetails);
router.post('/subscriptions/:id/contact', authenticate, requirePropertyManager, propertyManagerController.initiateContact);
router.post('/subscriptions/:id/upload-property', authenticate, requirePropertyManager, propertyManagerController.uploadPropertyDetails);
router.get('/subscriptions/revenue', authenticate, requirePropertyManager, propertyManagerController.getSubscriptionRevenue);
router.get('/subscriptions/reviews', authenticate, requirePropertyManager, propertyManagerController.getOwnerReviews);

module.exports = router;

