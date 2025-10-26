const express = require('express');
const {
  getDailyReports,
  getMonthlyReports,
  getTopCustomers,
  getRevenueAnalytics
} = require('../controllers/reportController');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// All report routes are admin only
router.use(verifyToken, authorizeRoles('admin'));

// Routes
router.get('/daily', getDailyReports);
router.get('/monthly', getMonthlyReports);
router.get('/top-customers', getTopCustomers);
router.get('/revenue', getRevenueAnalytics);

module.exports = router;