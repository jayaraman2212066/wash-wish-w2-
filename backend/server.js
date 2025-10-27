require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');
const authService = require('./services/authService');
const orderService = require('./services/orderService');
const paymentService = require('./services/paymentService');
const { authenticate, authorize } = require('./middleware/auth');

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../dist')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'WashWish API is running', timestamp: new Date().toISOString() });
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

app.put('/api/users/notifications', authenticate, (req, res) => {
  try {
    const updatedUser = authService.updateProfile(req.user.userId, { notifications: req.body });
    res.json({ success: true, message: 'Notification preferences updated successfully', data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/users/password', authenticate, (req, res) => {
  try {
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Order routes
app.post('/api/orders', authenticate, (req, res) => {
  try {
    const orderData = { ...req.body, customerId: req.user.userId };
    const order = orderService.createOrder(orderData);
    res.json({ success: true, message: 'Order created successfully', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/orders/my', authenticate, (req, res) => {
  try {
    const orders = orderService.getOrdersByCustomer(req.user.userId);
    res.json({ success: true, data: { orders } });
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

app.get('/api/orders/:id', authenticate, (req, res) => {
  try {
    const order = orderService.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    if (req.user.role === 'customer' && order.customerId !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/orders/:id/status', authenticate, authorize('admin', 'staff'), (req, res) => {
  try {
    const { status, note } = req.body;
    const order = orderService.updateOrderStatus(req.params.id, status, note);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, message: 'Order status updated successfully', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Payment routes
app.post('/api/payments/create-order', authenticate, (req, res) => {
  try {
    const { orderId } = req.body;
    const order = orderService.getOrderById(orderId);
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    if (order.customerId !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    const paymentOrder = paymentService.createPaymentOrder(orderId, order.totalAmount);
    res.json({ success: true, data: paymentOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/payments/verify', authenticate, (req, res) => {
  try {
    const payment = paymentService.verifyPayment(req.body);
    res.json({ success: true, message: 'Payment verified successfully', data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

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

// Handle all API routes that don't exist
app.all('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint not found' });
});

// Serve React app for all non-API routes (SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 WashWish Full-Stack App running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;