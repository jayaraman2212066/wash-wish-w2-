import { X, Download, Printer } from 'lucide-react'

const InvoiceModal = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null

  const calculateSubtotal = () => {
    return order.items?.reduce((sum, item) => sum + (item.quantity * item.price), 0) || 0
  }

  const subtotal = calculateSubtotal()
  const deliveryCharges = order.deliveryCharges || 50
  const serviceCharges = Math.round(subtotal * 0.05) // 5% service charge
  const gstRate = 18
  const gstAmount = Math.round((subtotal + deliveryCharges + serviceCharges) * gstRate / 100)
  const totalAmount = subtotal + deliveryCharges + serviceCharges + gstAmount

  const downloadInvoice = () => {
    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Invoice - ${order.orderNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; }
          .company-name { font-size: 28px; font-weight: bold; color: #3b82f6; margin-bottom: 5px; }
          .tagline { color: #666; margin-bottom: 20px; }
          .invoice-info { display: flex; justify-content: space-between; margin-bottom: 30px; }
          .invoice-details, .customer-details { width: 48%; }
          .invoice-details h3, .customer-details h3 { color: #3b82f6; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
          .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .table th, .table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          .table th { background-color: #f8f9fa; font-weight: bold; }
          .table .text-right { text-align: right; }
          .calculations { margin-top: 20px; }
          .calc-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
          .calc-row.total { font-weight: bold; font-size: 18px; border-top: 2px solid #3b82f6; border-bottom: 2px solid #3b82f6; }
          .footer { margin-top: 40px; text-align: center; color: #666; border-top: 1px solid #ddd; padding-top: 20px; }
          .status { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
          .status.paid { background-color: #d1fae5; color: #065f46; }
          .status.pending { background-color: #fef3c7; color: #92400e; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-name">🧺 WashWish</div>
          <div class="tagline">Professional Laundry & Dry Cleaning Service</div>
          <div style="font-size: 18px; font-weight: bold; color: #059669;">TAX INVOICE</div>
        </div>
        
        <div class="invoice-info">
          <div class="customer-details">
            <h3>Bill To:</h3>
            <p><strong>Customer:</strong> ${order.customerName || 'Customer'}</p>
            <p><strong>Phone:</strong> ${order.customerPhone || 'N/A'}</p>
            <p><strong>Pickup Address:</strong><br>${order.pickupAddress || 'N/A'}</p>
            <p><strong>Delivery Address:</strong><br>${order.deliveryAddress || 'Same as pickup'}</p>
          </div>
          
          <div class="invoice-details">
            <h3>Invoice Details:</h3>
            <p><strong>Invoice #:</strong> INV-${order.orderNumber}</p>
            <p><strong>Order #:</strong> ${order.orderNumber}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Pickup Date:</strong> ${order.pickupDate || 'TBD'}</p>
            <p><strong>Delivery Date:</strong> ${order.deliveryDate || 'TBD'}</p>
            <p><strong>Status:</strong> <span class="status ${order.paymentStatus}">${order.paymentStatus?.toUpperCase() || 'PENDING'}</span></p>
          </div>
        </div>
        
        <table class="table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Item Description</th>
              <th class="text-right">Qty</th>
              <th class="text-right">Rate (₹)</th>
              <th class="text-right">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${order.items?.map((item, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${item.type?.charAt(0).toUpperCase() + item.type?.slice(1) || item.name}</td>
                <td class="text-right">${item.quantity}</td>
                <td class="text-right">${item.price}</td>
                <td class="text-right">${item.quantity * item.price}</td>
              </tr>
            `).join('') || '<tr><td colspan="5">No items found</td></tr>'}
          </tbody>
        </table>
        
        <div class="calculations">
          <div class="calc-row">
            <span>Subtotal:</span>
            <span>₹${subtotal}</span>
          </div>
          <div class="calc-row">
            <span>Delivery Charges:</span>
            <span>₹${deliveryCharges}</span>
          </div>
          <div class="calc-row">
            <span>Service Charges (5%):</span>
            <span>₹${serviceCharges}</span>
          </div>
          <div class="calc-row">
            <span>GST (${gstRate}%):</span>
            <span>₹${gstAmount}</span>
          </div>
          <div class="calc-row total">
            <span>Total Amount:</span>
            <span>₹${totalAmount}</span>
          </div>
        </div>
        
        ${order.specialInstructions ? `
          <div style="margin-top: 30px;">
            <h3 style="color: #3b82f6;">Special Instructions:</h3>
            <p style="background-color: #f8f9fa; padding: 15px; border-radius: 5px;">${order.specialInstructions}</p>
          </div>
        ` : ''}
        
        <div class="footer">
          <p><strong>Payment Method:</strong> ${order.paymentMethod?.toUpperCase() || 'N/A'}</p>
          <p>Thank you for choosing WashWish!</p>
          <p>For any queries, contact us at support@washwish.com | +91-9876543210</p>
          <p style="font-size: 12px; margin-top: 20px;">
            This is a computer generated invoice. No signature required.
          </p>
        </div>
      </body>
      </html>
    `

    const blob = new Blob([invoiceHTML], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Invoice-${order.orderNumber}.html`
    link.click()
    URL.revokeObjectURL(url)
  }

  const printInvoice = () => {
    window.print()
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-4 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white dark:bg-gray-800 mb-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Invoice</h3>
          <div className="flex space-x-2">
            <button onClick={downloadInvoice} className="p-2 text-blue-600 hover:text-blue-800">
              <Download className="h-5 w-5" />
            </button>
            <button onClick={printInvoice} className="p-2 text-green-600 hover:text-green-800">
              <Printer className="h-5 w-5" />
            </button>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-blue-600 mb-2">🧺 WashWish</h1>
            <p className="text-gray-600 dark:text-gray-400">Professional Laundry & Dry Cleaning Service</p>
            <p className="text-lg font-semibold text-green-600 mt-2">TAX INVOICE</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 border-b border-gray-200 pb-2">Bill To:</h3>
            <p><strong>Customer:</strong> {order.customerName || 'Customer'}</p>
            <p><strong>Phone:</strong> {order.customerPhone || 'N/A'}</p>
            <p><strong>Pickup Address:</strong><br/>{order.pickupAddress || 'N/A'}</p>
            <p><strong>Delivery Address:</strong><br/>{order.deliveryAddress || 'Same as pickup'}</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 border-b border-gray-200 pb-2">Invoice Details:</h3>
            <p><strong>Invoice #:</strong> INV-{order.orderNumber}</p>
            <p><strong>Order #:</strong> {order.orderNumber}</p>
            <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
            <p><strong>Pickup Date:</strong> {order.pickupDate || 'TBD'}</p>
            <p><strong>Delivery Date:</strong> {order.deliveryDate || 'TBD'}</p>
            <p><strong>Status:</strong> 
              <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {order.paymentStatus?.toUpperCase() || 'PENDING'}
              </span>
            </p>
          </div>
        </div>

        <div className="overflow-x-auto mb-6">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">S.No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Item Description</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Qty</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Rate (₹)</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {order.items?.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {item.type?.charAt(0).toUpperCase() + item.type?.slice(1) || item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-right">{item.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-right">₹{item.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-right">₹{item.quantity * item.price}</td>
                </tr>
              )) || (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No items found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charges:</span>
              <span>₹{deliveryCharges}</span>
            </div>
            <div className="flex justify-between">
              <span>Service Charges (5%):</span>
              <span>₹{serviceCharges}</span>
            </div>
            <div className="flex justify-between">
              <span>GST ({gstRate}%):</span>
              <span>₹{gstAmount}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t-2 border-blue-500 pt-2">
              <span>Total Amount:</span>
              <span>₹{totalAmount}</span>
            </div>
          </div>
        </div>

        {order.specialInstructions && (
          <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Special Instructions:</h4>
            <p className="text-gray-700 dark:text-gray-300">{order.specialInstructions}</p>
          </div>
        )}

        <div className="mt-6 text-center text-gray-600 dark:text-gray-400 border-t border-gray-200 pt-4">
          <p><strong>Payment Method:</strong> {order.paymentMethod?.toUpperCase() || 'N/A'}</p>
          <p className="mt-2">Thank you for choosing WashWish!</p>
          <p>For any queries, contact us at support@washwish.com | +91-9876543210</p>
        </div>
      </div>
    </div>
  )
}

export default InvoiceModal