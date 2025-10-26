const express = require('express');
const router = express.Router();

// Simple test route
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'API is working',
    timestamp: new Date().toISOString()
  });
});

// Test registration without validation
router.post('/register-simple', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    res.json({
      success: true,
      message: 'Registration would work',
      data: { name, email }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;