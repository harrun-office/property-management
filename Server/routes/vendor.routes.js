const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendor.controller');
const { authenticate, requireVendor } = require('../middleware/auth');

router.get('/properties', authenticate, requireVendor, vendorController.getProperties);
router.get('/tasks', authenticate, requireVendor, vendorController.getTasks);
router.put('/tasks/:id', authenticate, requireVendor, vendorController.updateTaskStatus);
router.post('/tasks/:id/upload', authenticate, requireVendor, vendorController.uploadFile);
router.get('/profile', authenticate, requireVendor, vendorController.getProfile);

module.exports = router;

