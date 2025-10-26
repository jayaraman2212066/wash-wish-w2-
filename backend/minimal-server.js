const express = require('express');
const cors = require('cors');

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is working' });
});

// Simple auth
let users = [
  { id: 1, email: 'admin@washwish.com', password: 'admin123', name: 'Admin', role: 'admin' }
];

app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    
    const newUser = {
      id: users.length + 1,
      name,
      email,
      password,
      phone: phone || '0000000000',
      address: address || 'Default Address',
      role: 'customer'
    };
    
    users.push(newUser);
    
    res.json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: { 
          _id: newUser.id, 
          name, 
          email, 
          phone: newUser.phone, 
          address: newUser.address, 
          role: 'customer' 
        },
        token: 'fake-token-' + newUser.id
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: { 
            _id: user.id, 
            name: user.name, 
            email: user.email, 
            phone: user.phone, 
            address: user.address, 
            role: user.role 
          },
          token: 'fake-token-' + user.id
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Orders storage
let orders = [];

// Orders endpoints
app.post('/api/orders', (req, res) => {
  try {
    const { items, pickupAddress, deliveryAddress, pickupDate, deliveryDate, paymentMethod, specialInstructions } = req.body;
    
    const prices = {
      shirt: 100, tshirt: 80, pants: 120, jeans: 100, shorts: 70,
      suit: 400, blazer: 250, coat: 300,
      saree: 200, salwar: 150, lehenga: 500, kurta: 120, sherwani: 400,
      dress: 180, skirt: 100,
      bedsheet: 150, pillowcover: 50, blanket: 200, comforter: 250, curtain: 180, towel: 80, bathrobe: 150,
      wedding: 800, leather: 600,
      tie: 60, scarf: 80, dupatta: 100, jacket: 250
    };
    
    const totalAmount = items.reduce((sum, item) => {
      return sum + (prices[item.type] || 100) * item.quantity;
    }, 0);
    
    const newOrder = {
      _id: String(orders.length + 1),
      orderId: `WW${String(orders.length + 1).padStart(4, '0')}`,
      customerId: '1',
      customerName: 'Test User',
      items: items.map(item => ({
        type: item.type,
        quantity: item.quantity,
        pricePerUnit: prices[item.type] || 100,
        total: (prices[item.type] || 100) * item.quantity
      })),
      totalAmount,
      pickupAddress,
      deliveryAddress,
      pickupDate,
      deliveryDate,
      paymentMethod,
      paymentStatus: 'pending',
      orderStatus: 'pending',
      specialInstructions,
      createdAt: new Date().toISOString()
    };
    
    orders.push(newOrder);
    
    res.json({
      success: true,
      message: 'Order created successfully',
      data: newOrder
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/orders', (req, res) => {
  res.json({
    success: true,
    data: { orders }
  });
});

app.get('/api/orders/my', (req, res) => {
  res.json({
    success: true,
    data: { orders }
  });
});

// Update order status
app.put('/api/orders/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    const order = orders.find(o => o._id === req.params.id);
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    order.orderStatus = status;
    
    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single order
app.get('/api/orders/:id', (req, res) => {
  try {
    const order = orders.find(o => o._id === req.params.id);
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Payments storage
let payments = [];

// Create payment
app.post('/api/payments/create-order', (req, res) => {
  try {
    const { orderId } = req.body;
    const order = orders.find(o => o._id === orderId);
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    const payment = {
      _id: String(payments.length + 1),
      paymentId: `PAY${String(payments.length + 1).padStart(6, '0')}`,
      orderId: order._id,
      userId: order.customerId,
      amount: order.totalAmount,
      currency: 'INR',
      paymentMethod: 'online',
      paymentStatus: 'pending',
      razorpayOrderId: 'rzp_test_' + Date.now(),
      createdAt: new Date().toISOString()
    };
    
    payments.push(payment);
    
    res.json({
      success: true,
      data: {
        razorpayOrderId: payment.razorpayOrderId,
        amount: payment.amount,
        currency: 'INR',
        paymentId: payment.paymentId
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Verify payment
app.post('/api/payments/verify', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    const payment = payments.find(p => p.razorpayOrderId === razorpay_order_id);
    
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }
    
    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    payment.paymentStatus = 'paid';
    payment.paidAt = new Date().toISOString();
    
    // Update order payment status
    const order = orders.find(o => o._id === payment.orderId);
    if (order) {
      order.paymentStatus = 'paid';
    }
    
    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: payment
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get user payments
app.get('/api/payments/user/:id', (req, res) => {
  try {
    const userPayments = payments.filter(p => p.userId === req.params.id);
    
    res.json({
      success: true,
      data: {
        payments: userPayments,
        pagination: { page: 1, limit: 10, total: userPayments.length, pages: 1 }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all payments (admin)
app.get('/api/payments', (req, res) => {
  try {
    const summary = [
      { _id: 'paid', count: payments.filter(p => p.paymentStatus === 'paid').length, totalAmount: payments.filter(p => p.paymentStatus === 'paid').reduce((sum, p) => sum + p.amount, 0) },
      { _id: 'pending', count: payments.filter(p => p.paymentStatus === 'pending').length, totalAmount: payments.filter(p => p.paymentStatus === 'pending').reduce((sum, p) => sum + p.amount, 0) }
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

// User profile
app.get('/api/auth/profile', (req, res) => {
  try {
    // Mock user from token
    const user = users[0]; // Default to first user
    
    res.json({
      success: true,
      data: {
        _id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '0000000000',
        address: user.address || 'Default Address',
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update profile
app.put('/api/users/profile', (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const user = users[0]; // Mock update first user
    
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        _id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Reports endpoints
app.get('/api/reports/daily', (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const todayOrders = orders.filter(o => o.createdAt.startsWith(today));
    const todayPayments = payments.filter(p => p.createdAt.startsWith(today));
    
    res.json({
      success: true,
      data: {
        date: today,
        orders: [{ _id: 'pending', count: todayOrders.length, totalAmount: todayOrders.reduce((sum, o) => sum + o.totalAmount, 0) }],
        payments: [{ _id: 'paid', count: todayPayments.length, totalAmount: todayPayments.reduce((sum, p) => sum + p.amount, 0) }],
        totalRevenue: todayPayments.filter(p => p.paymentStatus === 'paid').reduce((sum, p) => sum + p.amount, 0)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/reports/monthly', (req, res) => {
  try {
    const currentMonth = new Date().toISOString().substring(0, 7);
    const monthlyOrders = orders.filter(o => o.createdAt.startsWith(currentMonth));
    const monthlyPayments = payments.filter(p => p.createdAt.startsWith(currentMonth));
    
    res.json({
      success: true,
      data: {
        period: currentMonth,
        dailyRevenue: [{ _id: new Date().getDate(), revenue: monthlyPayments.reduce((sum, p) => sum + p.amount, 0), count: monthlyPayments.length }],
        ordersByStatus: [{ _id: 'pending', count: monthlyOrders.length }],
        topServices: [{ _id: 'shirt', count: 10, revenue: 1000 }],
        summary: { totalRevenue: monthlyPayments.reduce((sum, p) => sum + p.amount, 0), totalOrders: monthlyOrders.length }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/reports/top-customers', (req, res) => {
  try {
    const customerStats = users.map(user => ({
      _id: user.id,
      customerName: user.name,
      totalOrders: orders.filter(o => o.customerId === String(user.id)).length,
      totalSpent: orders.filter(o => o.customerId === String(user.id)).reduce((sum, o) => sum + o.totalAmount, 0),
      lastOrderDate: new Date().toISOString()
    }));
    
    res.json({
      success: true,
      data: {
        period: 'Last 30 days',
        customers: customerStats.sort((a, b) => b.totalSpent - a.totalSpent)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// AI endpoints
app.post('/api/ai/estimate-cost', (req, res) => {
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

app.get('/api/ai/smart-schedule', (req, res) => {
  try {
    const timeSlots = [
      { time: '09:00-11:00', availability: 'high', cost: 0, recommended: true, estimatedPickupTime: '30-45 minutes' },
      { time: '11:00-13:00', availability: 'medium', cost: 20, recommended: false, estimatedPickupTime: '45-60 minutes' },
      { time: '13:00-15:00', availability: 'low', cost: 50, recommended: false, estimatedPickupTime: '60-90 minutes' },
      { time: '15:00-17:00', availability: 'medium', cost: 20, recommended: false, estimatedPickupTime: '45-60 minutes' },
      { time: '17:00-19:00', availability: 'high', cost: 0, recommended: true, estimatedPickupTime: '30-45 minutes' }
    ];
    
    res.json({
      success: true,
      data: {
        date: req.query.date || new Date().toISOString().split('T')[0],
        area: req.query.area || 'Default Area',
        suggestedSlots: timeSlots,
        aiRecommendation: {
          bestSlot: '09:00-11:00',
          reason: 'Low traffic and high availability',
          confidence: 0.87
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`🚀 Minimal server running on port ${PORT}`);
});

module.exports = app;