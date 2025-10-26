const db = require('../database');

const CLOTH_PRICES = {
  shirt: 100, tshirt: 80, pants: 120, jeans: 100, shorts: 70,
  suit: 400, blazer: 250, coat: 300,
  saree: 200, salwar: 150, lehenga: 500, kurta: 120, sherwani: 400,
  dress: 180, skirt: 100,
  bedsheet: 150, pillowcover: 50, blanket: 200, comforter: 250, curtain: 180, towel: 80, bathrobe: 150,
  wedding: 800, leather: 600,
  tie: 60, scarf: 80, dupatta: 100, jacket: 250
};

class OrderService {
  createOrder(orderData) {
    const { customerId, items, pickupAddress, deliveryAddress, pickupDate, deliveryDate, paymentMethod, specialInstructions, deliveryOption, specialTreatments } = orderData;
    
    let totalAmount = 0;
    const processedItems = items.map(item => {
      const pricePerUnit = CLOTH_PRICES[item.type] || 100;
      const itemTotal = pricePerUnit * item.quantity;
      totalAmount += itemTotal;
      
      return {
        type: item.type,
        quantity: item.quantity,
        pricePerUnit,
        total: itemTotal,
        services: item.services || []
      };
    });

    // Add delivery charges
    const deliveryCharges = deliveryOption === 'express' ? 100 : deliveryOption === 'same_day' ? 200 : 0;
    totalAmount += deliveryCharges;

    // Add special treatment charges
    let treatmentCharges = 0;
    if (specialTreatments && specialTreatments.length > 0) {
      const treatmentPrices = { stain_removal: 50, odor_removal: 40, antibacterial: 30, sanitization: 60, waterproofing: 80, wrinkle_free: 40 };
      treatmentCharges = specialTreatments.reduce((sum, treatment) => sum + (treatmentPrices[treatment] || 0), 0);
      totalAmount += treatmentCharges;
    }

    const orderNumber = `WW${Date.now().toString().slice(-6)}`;
    
    const order = db.insert('orders', {
      orderNumber,
      customerId,
      items: processedItems,
      totalAmount,
      deliveryCharges,
      treatmentCharges,
      pickupAddress,
      deliveryAddress,
      pickupDate,
      deliveryDate,
      paymentMethod,
      paymentStatus: 'pending',
      orderStatus: 'pending',
      specialInstructions: specialInstructions || '',
      deliveryOption: deliveryOption || 'regular',
      specialTreatments: specialTreatments || [],
      statusHistory: [{
        status: 'pending',
        timestamp: new Date().toISOString(),
        note: 'Order created'
      }]
    });

    return order;
  }

  getOrdersByCustomer(customerId) {
    return db.find('orders', { customerId });
  }

  getAllOrders() {
    return db.read('orders');
  }

  getOrderById(orderId) {
    return db.findById('orders', orderId);
  }

  updateOrderStatus(orderId, status, note = '') {
    const order = db.findById('orders', orderId);
    if (!order) return null;

    const statusHistory = order.statusHistory || [];
    statusHistory.push({
      status,
      timestamp: new Date().toISOString(),
      note
    });

    return db.updateById('orders', orderId, {
      orderStatus: status,
      statusHistory
    });
  }

  getOrderStats() {
    const orders = db.read('orders');
    const today = new Date().toISOString().split('T')[0];
    
    return {
      total: orders.length,
      pending: orders.filter(o => o.orderStatus === 'pending').length,
      inProcess: orders.filter(o => ['picked_up', 'in_process', 'washed', 'ironed'].includes(o.orderStatus)).length,
      completed: orders.filter(o => o.orderStatus === 'delivered').length,
      todayOrders: orders.filter(o => o.createdAt.startsWith(today)).length,
      totalRevenue: orders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + o.totalAmount, 0)
    };
  }

  searchOrders(query) {
    const orders = db.read('orders');
    return orders.filter(order => 
      order.orderNumber.toLowerCase().includes(query.toLowerCase()) ||
      order.customerId.toLowerCase().includes(query.toLowerCase()) ||
      order.orderStatus.toLowerCase().includes(query.toLowerCase())
    );
  }
}

module.exports = new OrderService();