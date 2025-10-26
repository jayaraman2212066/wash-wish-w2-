const express = require('express');
const { body } = require('express-validator');
const {
  createPaymentOrder,
  verifyPayment,
  getUserPayments,
  getAllPayments,
  refundPayment
} = require('../controllers/paymentController');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const createPaymentValidation = [
  body('orderId').isMongoId().withMessage('Valid order ID is required')
];

const verifyPaymentValidation = [
  body('razorpay_order_id').notEmpty().withMessage('Razorpay order ID is required'),
  body('razorpay_payment_id').notEmpty().withMessage('Razorpay payment ID is required'),
  body('razorpay_signature').notEmpty().withMessage('Razorpay signature is required')
];

// Routes
router.post('/create-order', verifyToken, createPaymentValidation, createPaymentOrder);
router.post('/verify', verifyToken, verifyPaymentValidation, verifyPayment);
router.get('/user/:id', verifyToken, getUserPayments);
router.get('/', verifyToken, authorizeRoles('admin'), getAllPayments);
router.post('/:id/refund', verifyToken, authorizeRoles('admin'), refundPayment);

module.exports = router;