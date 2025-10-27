import { useState } from 'react'
import { X, CreditCard, Wallet, DollarSign } from 'lucide-react'
import { toast } from 'react-toastify'
import api from '../utils/api'

const PaymentModal = ({ isOpen, onClose, order, onPaymentSuccess }) => {
  const [processing, setProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('online')

  if (!isOpen || !order) return null

  const handlePayment = async () => {
    setProcessing(true)
    try {
      const response = await api.post('/payments/simulate', {
        orderId: order._id,
        amount: order.totalAmount,
        method: paymentMethod
      })

      if (response.data.success) {
        toast.success('Payment successful!')
        onPaymentSuccess(response.data.data)
        onClose()
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment failed')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Complete Payment
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Order ID:</span>
              <span className="font-medium text-gray-900 dark:text-white">{order.orderNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Amount:</span>
              <span className="text-xl font-bold text-blue-600">₹{order.totalAmount}</span>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Payment Method
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="online"
                  checked={paymentMethod === 'online'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-2"
                />
                <CreditCard className="h-4 w-4 mr-2" />
                Online Payment
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="wallet"
                  checked={paymentMethod === 'wallet'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-2"
                />
                <Wallet className="h-4 w-4 mr-2" />
                Digital Wallet
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-2"
                />
                <DollarSign className="h-4 w-4 mr-2" />
                Cash on Delivery
              </label>
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handlePayment}
            disabled={processing}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
          >
            {processing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              `Pay ₹${order.totalAmount}`
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaymentModal