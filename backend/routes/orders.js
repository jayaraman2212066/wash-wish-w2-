const express = require('express');
const { body } = require('express-validator');
const {
  createOrder,
  getOrders,
  getMyOrders,
  getOrder,
  updateOrderStatus,
  assignStaff,
  deleteOrder
} = require('../controllers/orderController');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const createOrderValidation = [
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.type').isIn(['shirt', 'pants', 'saree', 'bedsheet', 'towel', 'jacket']).withMessage('Invalid item type'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('pickupAddress').trim().isLength({ min: 5 }).withMessage('Pickup address is required'),
  body('deliveryAddress').trim().isLength({ min: 5 }).withMessage('Delivery address is required'),
  body('pickupDate').isISO8601().withMessage('Valid pickup date is required'),
  body('deliveryDate').isISO8601().withMessage('Valid delivery date is required'),
  body('paymentMethod').isIn(['online', 'cod']).withMessage('Invalid payment method')
];

const updateStatusValidation = [
  body('status').isIn(['pending', 'picked_up', 'in_process', 'washed', 'ironed', 'ready_for_delivery', 'delivered', 'cancelled']).withMessage('Invalid status')
];

const assignStaffValidation = [
  body('staffId').isMongoId().withMessage('Valid staff ID is required')
];

// Routes
router.post('/', verifyToken, createOrderValidation, createOrder);
router.get('/', verifyToken, authorizeRoles('admin', 'staff'), getOrders);
router.get('/my', verifyToken, authorizeRoles('customer'), getMyOrders);
router.get('/:id', verifyToken, getOrder);
router.put('/:id/status', verifyToken, authorizeRoles('staff', 'admin'), updateStatusValidation, updateOrderStatus);
router.put('/:id/assign', verifyToken, authorizeRoles('admin'), assignStaffValidation, assignStaff);
router.delete('/:id', verifyToken, authorizeRoles('admin'), deleteOrder);

module.exports = router;