const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/owner.controller');
const { authenticate, requirePropertyOwner } = require('../middleware/auth');

// Dashboard
router.get('/dashboard', authenticate, requirePropertyOwner, ownerController.getDashboard);

// Properties
router.get('/properties', authenticate, requirePropertyOwner, ownerController.getProperties);
router.post('/properties', authenticate, requirePropertyOwner, ownerController.createProperty);
router.put('/properties/:id', authenticate, requirePropertyOwner, ownerController.updateProperty);
router.delete('/properties/:id', authenticate, requirePropertyOwner, ownerController.deleteProperty);
router.patch('/properties/:id/status', authenticate, requirePropertyOwner, ownerController.updatePropertyStatus);

// Applications
router.get('/applications', authenticate, requirePropertyOwner, ownerController.getApplications);
router.get('/applications/:id', authenticate, requirePropertyOwner, ownerController.getApplicationById);
router.put('/applications/:id', authenticate, requirePropertyOwner, ownerController.updateApplication);
router.post('/applications/:id/notes', authenticate, requirePropertyOwner, ownerController.addApplicationNote);

// Tenants
router.get('/tenants', authenticate, requirePropertyOwner, ownerController.getTenants);
router.get('/tenants/:id', authenticate, requirePropertyOwner, ownerController.getTenantById);

// Messages
router.get('/messages', authenticate, requirePropertyOwner, ownerController.getMessages);
router.get('/messages/:id', authenticate, requirePropertyOwner, ownerController.getMessageById);
router.post('/messages', authenticate, requirePropertyOwner, ownerController.sendMessage);
router.put('/messages/:id/read', authenticate, requirePropertyOwner, ownerController.markMessageRead);

// Viewings
router.get('/viewings', authenticate, requirePropertyOwner, ownerController.getViewings);
router.put('/viewings/:id', authenticate, requirePropertyOwner, ownerController.updateViewing);

// Payments
router.get('/payments', authenticate, requirePropertyOwner, ownerController.getPayments);
router.get('/payments/summary', authenticate, requirePropertyOwner, ownerController.getPaymentSummary);
router.post('/payments', authenticate, requirePropertyOwner, ownerController.createPayment);
router.put('/payments/:id', authenticate, requirePropertyOwner, ownerController.updatePayment);

// Reports
router.get('/reports/income', authenticate, requirePropertyOwner, ownerController.getIncomeReport);
router.get('/reports/monthly', authenticate, requirePropertyOwner, ownerController.getMonthlyReport);
router.get('/reports/yearly', authenticate, requirePropertyOwner, ownerController.getYearlyReport);

// Analytics
router.get('/analytics/property-performance', authenticate, requirePropertyOwner, ownerController.getPropertyPerformance);
router.get('/analytics/financial', authenticate, requirePropertyOwner, ownerController.getFinancialAnalytics);
router.get('/analytics/tenant', authenticate, requirePropertyOwner, ownerController.getTenantAnalytics);

// Maintenance
router.get('/maintenance', authenticate, requirePropertyOwner, ownerController.getMaintenance);
router.get('/maintenance/:id', authenticate, requirePropertyOwner, ownerController.getMaintenanceById);
router.put('/maintenance/:id', authenticate, requirePropertyOwner, ownerController.updateMaintenance);
router.post('/maintenance/:id/notes', authenticate, requirePropertyOwner, ownerController.addMaintenanceNote);

// Manager Subscriptions
router.get('/managers/available', authenticate, requirePropertyOwner, ownerController.getAvailableManagers);
router.get('/managers/subscriptions', authenticate, requirePropertyOwner, ownerController.getMySubscriptions);
router.post('/managers/subscribe', authenticate, requirePropertyOwner, ownerController.subscribeToManager);
router.get('/managers/:id', authenticate, requirePropertyOwner, ownerController.getManagerById);
router.put('/managers/subscription/:id', authenticate, requirePropertyOwner, ownerController.updateSubscription);
router.delete('/managers/subscription/:id', authenticate, requirePropertyOwner, ownerController.cancelSubscription);
router.get('/managers/subscription/:id/payments', authenticate, requirePropertyOwner, ownerController.getSubscriptionPayments);
router.post('/managers/subscription/:id/pay', authenticate, requirePropertyOwner, ownerController.paySubscription);
router.get('/managers/subscription/:id/agreement', authenticate, requirePropertyOwner, ownerController.getServiceAgreement);
router.post('/managers/subscription/:id/review', authenticate, requirePropertyOwner, ownerController.submitManagerReview);

module.exports = router;

