const express = require('express');
const { body } = require('express-validator');
const {
  estimateCost,
  smartSchedule,
  demandPrediction
} = require('../controllers/aiController');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const estimateCostValidation = [
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.type').isIn(['shirt', 'pants', 'saree', 'bedsheet', 'towel', 'jacket']).withMessage('Invalid item type'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
];

// Routes
router.post('/estimate-cost', verifyToken, estimateCostValidation, estimateCost);
router.get('/smart-schedule', verifyToken, smartSchedule);
router.get('/demand-prediction', verifyToken, authorizeRoles('admin'), demandPrediction);

module.exports = router;