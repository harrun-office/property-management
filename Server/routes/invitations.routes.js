const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.get('/validate/:token', authController.validateInvitation);
router.post('/accept', authController.acceptInvitation);

module.exports = router;

