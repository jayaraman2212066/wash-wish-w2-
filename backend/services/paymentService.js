const crypto = require('crypto');
const db = require('../database');

class PaymentService {
  createPaymentOrder(orderId, amount) {
    const order = db.findById('orders', orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    const razorpayOrderId = `order_${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
    
    const payment = db.insert('payments', {
      orderId,
      customerId: order.customerId,
      amount,
      currency: 'INR',
      razorpayOrderId,
      paymentStatus: 'created',
      paymentMethod: 'online'
    });

    return {
      razorpayOrderId: payment.razorpayOrderId,
      amount: payment.amount,
      currency: payment.currency,
      paymentId: payment._id
    };
  }

  verifyPayment(paymentData) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentData;
    
    // In real implementation, verify signature with Razorpay
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'test_secret')
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const payment = db.find('payments', { razorpayOrderId: razorpay_order_id })[0];
    if (!payment) {
      throw new Error('Payment not found');
    }

    // Update payment status
    const updatedPayment = db.updateById('payments', payment._id, {
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      paymentStatus: 'paid',
      paidAt: new Date().toISOString()
    });

    // Update order payment status
    db.updateById('orders', payment.orderId, {
      paymentStatus: 'paid'
    });

    return updatedPayment;
  }

  getPaymentsByCustomer(customerId) {
    return db.find('payments', { customerId });
  }

  getAllPayments() {
    return db.read('payments');
  }

  getPaymentStats() {
    const payments = db.read('payments');
    const today = new Date().toISOString().split('T')[0];
    
    return {
      total: payments.length,
      paid: payments.filter(p => p.paymentStatus === 'paid').length,
      pending: payments.filter(p => p.paymentStatus === 'created').length,
      failed: payments.filter(p => p.paymentStatus === 'failed').length,
      todayRevenue: payments.filter(p => p.paymentStatus === 'paid' && p.paidAt && p.paidAt.startsWith(today)).reduce((sum, p) => sum + p.amount, 0),
      totalRevenue: payments.filter(p => p.paymentStatus === 'paid').reduce((sum, p) => sum + p.amount, 0)
    };
  }

  processRefund(paymentId, amount, reason) {
    const payment = db.findById('payments', paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }

    const refund = db.insert('refunds', {
      paymentId,
      orderId: payment.orderId,
      customerId: payment.customerId,
      amount,
      reason,
      status: 'processed',
      refundId: `rfnd_${Date.now()}${Math.random().toString(36).substr(2, 9)}`
    });

    // Update payment status
    db.updateById('payments', paymentId, {
      refundStatus: 'refunded',
      refundAmount: amount,
      refundId: refund.refundId
    });

    return refund;
  }
}

module.exports = new PaymentService();