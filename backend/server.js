require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../dist')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'WashWish API is running' });
});

// Mock auth for demo
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    res.json({ 
      success: true, 
      data: { 
        user: { id: '1', email, role: 'customer', name: 'Demo User' }, 
        token: 'demo-token' 
      } 
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

app.post('/api/auth/register', (req, res) => {
  res.json({ success: true, message: 'User registered successfully' });
});

// Mock orders
app.get('/api/orders/my', (req, res) => {
  res.json({ success: true, data: { orders: [] } });
});

app.post('/api/orders', (req, res) => {
  res.json({ success: true, message: 'Order created successfully', data: { id: '1' } });
});

// Mock payments
app.get('/api/payments/user/:id', (req, res) => {
  res.json({ success: true, data: { payments: [], pagination: { page: 1, limit: 10, total: 0, pages: 1 } } });
});

// SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 WashWish App running on port ${PORT}`);
});

module.exports = app;