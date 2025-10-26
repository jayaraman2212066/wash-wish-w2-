export const generateInvoice = (order) => {
  const invoiceHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Invoice - ${order.orderNumber}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .company-name { font-size: 24px; font-weight: bold; color: #3b82f6; }
        .invoice-details { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .customer-details, .order-details { width: 45%; }
        .table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .table th, .table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        .table th { background-color: #f8f9fa; }
        .total-section { text-align: right; margin-top: 20px; }
        .total-row { font-weight: bold; font-size: 18px; }
        .footer { margin-top: 40px; text-align: center; color: #666; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company-name">🧺 WashWish</div>
        <p>Professional Laundry Service</p>
      </div>
      
      <div class="invoice-details">
        <div class="customer-details">
          <h3>Bill To:</h3>
          <p><strong>Customer ID:</strong> ${order.customerId}</p>
          <p><strong>Pickup Address:</strong><br>${order.pickupAddress}</p>
          <p><strong>Delivery Address:</strong><br>${order.deliveryAddress}</p>
        </div>
        
        <div class="order-details">
          <h3>Invoice Details:</h3>
          <p><strong>Invoice #:</strong> INV-${order.orderNumber}</p>
          <p><strong>Order #:</strong> ${order.orderNumber}</p>
          <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
          <p><strong>Pickup Date:</strong> ${order.pickupDate}</p>
          <p><strong>Delivery Date:</strong> ${order.deliveryDate}</p>
        </div>
      </div>
      
      <table class="table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Price per Unit</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${order.items.map(item => `
            <tr>
              <td>${item.type.charAt(0).toUpperCase() + item.type.slice(1)}</td>
              <td>${item.quantity}</td>
              <td>₹${item.pricePerUnit}</td>
              <td>₹${item.total}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="total-section">
        <p>Subtotal: ₹${order.items.reduce((sum, item) => sum + item.total, 0)}</p>
        ${order.deliveryCharges ? `<p>Delivery Charges: ₹${order.deliveryCharges}</p>` : ''}
        ${order.treatmentCharges ? `<p>Special Treatment: ₹${order.treatmentCharges}</p>` : ''}
        <p class="total-row">Total Amount: ₹${order.totalAmount}</p>
        <p><strong>Payment Method:</strong> ${order.paymentMethod.toUpperCase()}</p>
        <p><strong>Payment Status:</strong> ${order.paymentStatus.toUpperCase()}</p>
      </div>
      
      ${order.specialInstructions ? `
        <div style="margin-top: 30px;">
          <h3>Special Instructions:</h3>
          <p>${order.specialInstructions}</p>
        </div>
      ` : ''}
      
      <div class="footer">
        <p>Thank you for choosing WashWish!</p>
        <p>For any queries, contact us at support@washwish.com</p>
      </div>
    </body>
    </html>
  `;
  
  // Create and download the invoice
  const blob = new Blob([invoiceHTML], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Invoice-${order.orderNumber}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const generateReceipt = (payment, order) => {
  const receiptHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Payment Receipt - ${payment._id}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; max-width: 600px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; }
        .company-name { font-size: 24px; font-weight: bold; color: #3b82f6; }
        .receipt-details { margin-bottom: 30px; }
        .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
        .amount-section { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .total-amount { font-size: 24px; font-weight: bold; color: #059669; text-align: center; }
        .footer { margin-top: 40px; text-align: center; color: #666; border-top: 1px solid #ddd; padding-top: 20px; }
        .status-paid { color: #059669; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company-name">🧺 WashWish</div>
        <p>Payment Receipt</p>
      </div>
      
      <div class="receipt-details">
        <div class="detail-row">
          <span><strong>Receipt #:</strong></span>
          <span>RCP-${payment._id.slice(-8).toUpperCase()}</span>
        </div>
        <div class="detail-row">
          <span><strong>Payment ID:</strong></span>
          <span>${payment._id}</span>
        </div>
        <div class="detail-row">
          <span><strong>Order #:</strong></span>
          <span>${order?.orderNumber || payment.orderId}</span>
        </div>
        <div class="detail-row">
          <span><strong>Transaction ID:</strong></span>
          <span>${payment.razorpayPaymentId || 'N/A'}</span>
        </div>
        <div class="detail-row">
          <span><strong>Payment Date:</strong></span>
          <span>${new Date(payment.paidAt || payment.createdAt).toLocaleString()}</span>
        </div>
        <div class="detail-row">
          <span><strong>Payment Method:</strong></span>
          <span>${payment.paymentMethod.toUpperCase()}</span>
        </div>
        <div class="detail-row">
          <span><strong>Status:</strong></span>
          <span class="status-paid">${payment.paymentStatus.toUpperCase()}</span>
        </div>
      </div>
      
      <div class="amount-section">
        <div class="total-amount">₹${payment.amount}</div>
        <p style="text-align: center; margin: 10px 0 0 0;">Amount Paid</p>
      </div>
      
      <div class="footer">
        <p>Thank you for your payment!</p>
        <p>This is a computer generated receipt.</p>
        <p>For any queries, contact us at support@washwish.com</p>
      </div>
    </body>
    </html>
  `;
  
  // Create and download the receipt
  const blob = new Blob([receiptHTML], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Receipt-${payment._id.slice(-8).toUpperCase()}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};