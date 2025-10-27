require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const db = require('./database');
const authService = require('./services/authService');
const orderService = require('./services/orderService');
const paymentService = require('./services/paymentService');
const { authenticate, authorize } = require('./middleware/auth');

const app = express();

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());
app.use(express.json());

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../dist')));

// Serve all static assets
app.use('/assets', express.static(path.join(__dirname, '../dist/assets')));
app.use('/assets', express.static(path.join(__dirname, '../public/assets')));
app.use('/images', express.static(path.join(__dirname, '../public/images')));
app.use('/public', express.static(path.join(__dirname, '../public')));
app.use('/api/images', express.static(path.join(__dirname, '../public/images')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'WashWish API is running', timestamp: new Date().toISOString() });
});

// Test endpoint for orders
app.get('/api/test/orders', (req, res) => {
  try {
    const orders = orderService.getAllOrders();
    res.json({ success: true, message: 'Orders endpoint working', count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Test endpoint for user orders
app.get('/api/test/orders/:userId', (req, res) => {
  try {
    const orders = orderService.getOrdersByCustomer(req.params.userId);
    res.json({ success: true, message: 'User orders endpoint working', count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Debug endpoint to check orders
app.get('/api/debug/orders', (req, res) => {
  try {
    const allOrders = orderService.getAllOrders();
    res.json({ success: true, data: { orders: allOrders, count: allOrders.length } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const result = await authService.register(req.body);
    res.json({ success: true, message: 'User registered successfully', data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json({ success: true, message: 'Login successful', data: result });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
});

app.get('/api/auth/profile', authenticate, (req, res) => {
  try {
    const user = authService.getUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/auth/verify-email', async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ success: false, message: 'Verification token is required' });
    }
    
    await authService.verifyEmail(token);
    res.json({ success: true, message: 'Email verified successfully! You can now login.' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.put('/api/users/profile', authenticate, (req, res) => {
  try {
    const updatedUser = authService.updateProfile(req.user.userId, req.body);
    res.json({ success: true, message: 'Profile updated successfully', data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Order routes
app.post('/api/orders', authenticate, (req, res) => {
  try {
    console.log('Creating order for user:', req.user.userId);
    console.log('Order data received:', req.body);
    
    const orderData = { ...req.body, customerId: req.user.userId };
    const order = orderService.createOrder(orderData);
    
    console.log('Order created successfully:', order.id);
    res.json({ success: true, message: 'Order created successfully', data: order });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/orders/my', authenticate, (req, res) => {
  try {
    console.log('Fetching orders for user:', req.user.userId);
    const orders = orderService.getOrdersByCustomer(req.user.userId);
    console.log('Found orders:', orders.length);
    res.json({ success: true, data: { orders } });
  } catch (error) {
    console.error('Error in /api/orders/my:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/orders/:id/status', authenticate, authorize('admin', 'staff'), (req, res) => {
  try {
    const { status } = req.body;
    const updatedOrder = orderService.updateOrderStatus(req.params.id, status);
    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, message: 'Order status updated', data: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/orders', authenticate, authorize('admin', 'staff'), (req, res) => {
  try {
    const { search } = req.query;
    let orders;
    
    if (search) {
      orders = orderService.searchOrders(search);
    } else {
      orders = orderService.getAllOrders();
    }
    
    res.json({ success: true, data: { orders } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Payment routes
app.get('/api/payments/user/:id', authenticate, (req, res) => {
  try {
    if (req.user.userId !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    const payments = paymentService.getPaymentsByCustomer(req.params.id);
    res.json({ success: true, data: { payments, pagination: { page: 1, limit: 10, total: payments.length, pages: 1 } } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/payments', authenticate, authorize('admin'), (req, res) => {
  try {
    const payments = paymentService.getAllPayments();
    const stats = paymentService.getPaymentStats();
    
    const summary = [
      { _id: 'paid', count: stats.paid, totalAmount: stats.totalRevenue },
      { _id: 'pending', count: stats.pending, totalAmount: 0 },
      { _id: 'failed', count: stats.failed, totalAmount: 0 }
    ];
    
    res.json({ 
      success: true, 
      data: { 
        payments, 
        summary,
        pagination: { page: 1, limit: 10, total: payments.length, pages: 1 }
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Reports routes
app.get('/api/reports/daily', authenticate, authorize('admin'), (req, res) => {
  try {
    const orderStats = orderService.getOrderStats();
    const paymentStats = paymentService.getPaymentStats();
    
    res.json({
      success: true,
      data: {
        date: new Date().toISOString().split('T')[0],
        orders: [{ _id: 'total', count: orderStats.todayOrders, totalAmount: orderStats.totalRevenue }],
        payments: [{ _id: 'paid', count: paymentStats.paid, totalAmount: paymentStats.todayRevenue }],
        totalRevenue: paymentStats.todayRevenue
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/reports/monthly', authenticate, authorize('admin'), (req, res) => {
  try {
    const orderStats = orderService.getOrderStats();
    const paymentStats = paymentService.getPaymentStats();
    
    res.json({
      success: true,
      data: {
        period: new Date().toISOString().substring(0, 7),
        dailyRevenue: [{ _id: new Date().getDate(), revenue: paymentStats.totalRevenue, count: paymentStats.paid }],
        ordersByStatus: [
          { _id: 'pending', count: orderStats.pending },
          { _id: 'completed', count: orderStats.completed }
        ],
        topServices: [{ _id: 'shirt', count: 10, revenue: 1000 }],
        summary: { totalRevenue: paymentStats.totalRevenue, totalOrders: orderStats.total }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// AI endpoints
app.post('/api/ai/estimate-cost', authenticate, (req, res) => {
  try {
    const { items } = req.body;
    const prices = {
      shirt: 100, tshirt: 80, pants: 120, jeans: 100, shorts: 70,
      suit: 400, blazer: 250, coat: 300,
      saree: 200, salwar: 150, lehenga: 500, kurta: 120, sherwani: 400,
      dress: 180, skirt: 100,
      bedsheet: 150, pillowcover: 50, blanket: 200, comforter: 250, curtain: 180, towel: 80, bathrobe: 150,
      wedding: 800, leather: 600,
      tie: 60, scarf: 80, dupatta: 100, jacket: 250
    };
    
    let totalCost = 0;
    const estimatedItems = items.map(item => {
      const pricePerUnit = prices[item.type] || 100;
      const itemTotal = pricePerUnit * item.quantity;
      totalCost += itemTotal;
      
      return {
        type: item.type,
        quantity: item.quantity,
        pricePerUnit,
        total: itemTotal
      };
    });
    
    const bulkDiscount = totalCost > 1000 ? totalCost * 0.1 : 0;
    const finalCost = totalCost - bulkDiscount;
    
    res.json({
      success: true,
      data: {
        items: estimatedItems,
        baseCost: totalCost,
        adjustments: { bulkDiscount, seasonalDiscount: 0, loyaltyDiscount: 0, urgentCharges: 0 },
        finalCost: Math.round(finalCost),
        estimatedTime: '24-48 hours',
        confidence: 0.95
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Handle all non-API routes for SPA
app.get('*', (req, res) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ success: false, message: 'API endpoint not found' });
  }
  
  // Serve React app for all other routes
  const indexPath = path.join(__dirname, '../dist/index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('App not found - please build the frontend first');
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 WashWish Full-Stack App running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;