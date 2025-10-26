const express = require('express');
const { body } = require('express-validator');
const {
  getUsers,
  updateProfile,
  changePassword,
  deleteUser,
  createStaff
} = require('../controllers/userController');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const updateProfileValidation = [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('phone').optional().matches(/^[0-9]{10}$/).withMessage('Please enter a valid 10-digit phone number'),
  body('address').optional().trim().isLength({ min: 5 }).withMessage('Address must be at least 5 characters')
];

const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
];

const createStaffValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').matches(/^[0-9]{10}$/).withMessage('Please enter a valid 10-digit phone number'),
  body('address').trim().isLength({ min: 5 }).withMessage('Address must be at least 5 characters')
];

// Routes
router.get('/', verifyToken, authorizeRoles('admin'), getUsers);
router.put('/profile', verifyToken, updateProfileValidation, updateProfile);
router.put('/password', verifyToken, changePasswordValidation, changePassword);
router.post('/staff', verifyToken, authorizeRoles('admin'), createStaffValidation, createStaff);
router.delete('/:id', verifyToken, authorizeRoles('admin'), deleteUser);

module.exports = router;