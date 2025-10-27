const db = require('../database');

class PaymentService {
  createPaymentOrder(orderId, amount) {
    const paymentOrder = db.insert('payments', {
      orderId,
      amount,
      paymentStatus: 'created',
      paymentMethod: 'razorpay',
      customerId: null,
      razorpayOrderId: `order_${Date.now()}`,
      razorpayPaymentId: null,
      razorpaySignature: null
    });
    return paymentOrder;
  }

  verifyPayment(paymentData) {
    const { orderId, paymentMethod, amount, transactionId } = paymentData;
    
    const payment = db.insert('payments', {
      orderId,
      amount,
      paymentStatus: 'paid',
      paymentMethod,
      transactionId,
      customerId: null
    });
    
    return payment;
  }

  getPaymentsByCustomer(customerId) {
    return db.find('payments', { customerId }) || [];
  }

  getAllPayments() {
    return db.read('payments') || [];
  }

  createPayment(paymentData) {
    return db.insert('payments', {
      ...paymentData,
      paymentStatus: paymentData.status || 'pending'
    });
  }

  updatePaymentStatus(orderId, status) {
    const payments = db.read('payments');
    const payment = payments.find(p => p.orderId === orderId);
    if (payment) {
      return db.updateById('payments', payment._id, { paymentStatus: status });
    }
    return null;
  }

  getPaymentStats() {
    const payments = db.read('payments') || [];
    const paid = payments.filter(p => p.paymentStatus === 'paid');
    const pending = payments.filter(p => p.paymentStatus === 'created' || p.paymentStatus === 'pending');
    const failed = payments.filter(p => p.paymentStatus === 'failed');
    
    return {
      paid: paid.length,
      pending: pending.length,
      failed: failed.length,
      totalRevenue: paid.reduce((sum, p) => sum + (p.amount || 0), 0),
      todayRevenue: paid.filter(p => p.createdAt && p.createdAt.startsWith(new Date().toISOString().split('T')[0]))
        .reduce((sum, p) => sum + (p.amount || 0), 0)
    };
  }
}

module.exports = new PaymentService();