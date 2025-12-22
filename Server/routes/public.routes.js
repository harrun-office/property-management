const express = require('express');
const router = express.Router();
const publicController = require('../controllers/public.controller');

router.get('/properties', publicController.getAllProperties);
router.get('/properties/:id', publicController.getPropertyById);

module.exports = router;

