import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { CreditCard, CheckCircle, XCircle, Clock, Download } from 'lucide-react'
import { toast } from 'react-toastify'
import { PAYMENT_STATUS } from '../utils/constants'
import api from '../utils/api'
import { generateReceipt } from '../utils/invoiceGenerator'
import PaymentModal from '../components/PaymentModal'

const Payments = () => {
  const [payments, setPayments] = useState([])
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      const response = await api.get(`/payments/user/${user._id}`)
      setPayments(response.data.data.payments)
    } catch (error) {
      console.error('Error fetching payments:', error)
      setPayments([])
    }
  }

  const initiatePayment = (orderId) => {
    const payment = payments.find(p => p.orderId === orderId)
    if (payment) {
      setSelectedPayment(payment)
      setShowPaymentModal(true)
    }
  }

  const handlePaymentSuccess = async (paymentData) => {
    try {
      await api.post('/payments/verify', {
        orderId: selectedPayment.orderId,
        paymentMethod: paymentData.method,
        amount: paymentData.amount,
        transactionId: paymentData.transactionId
      })
      
      fetchPayments()
    } catch (error) {
      toast.error('Payment verification failed')
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case PAYMENT_STATUS.PAID:
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case PAYMENT_STATUS.FAILED:
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case PAYMENT_STATUS.PAID:
        return 'bg-green-100 text-green-800'
      case PAYMENT_STATUS.FAILED:
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  const downloadReceipt = async (paymentId) => {
    try {
      const payment = payments.find(p => p._id === paymentId)
      if (payment) {
        const orderResponse = await api.get(`/orders/${payment.orderId}`)
        generateReceipt(payment, orderResponse.data.data)
        toast.success('Receipt downloaded successfully')
      } else {
        toast.error('Payment not found')
      }
    } catch (error) {
      console.error('Receipt generation error:', error)
      const payment = payments.find(p => p._id === paymentId)
      if (payment) {
        generateReceipt(payment, null)
        toast.success('Receipt downloaded successfully')
      } else {
        toast.error('Failed to generate receipt')
      }
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payment History</h1>
        </div>

        {/* Summary Cards */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-green-600">Total Paid</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                    ₹{payments.filter(p => p.paymentStatus === 'paid').reduce((sum, p) => sum + p.amount, 0)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-yellow-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                    ₹{payments.filter(p => p.paymentStatus === 'created' || p.paymentStatus === 'pending').reduce((sum, p) => sum + p.amount, 0)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
              <div className="flex items-center">
                <XCircle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-red-600">Failed</p>
                  <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                    ₹{payments.filter(p => p.paymentStatus === 'failed').reduce((sum, p) => sum + p.amount, 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Payment ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {payments.map((payment) => (
                <tr key={payment._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {payment._id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {payment.orderId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    ₹{payment.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(payment.paymentStatus)}
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.paymentStatus)}`}>
                        {payment.paymentStatus}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white capitalize">
                    {payment.paymentMethod}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {(payment.paymentStatus === 'created' || payment.paymentStatus === 'pending') && (
                      <button
                        onClick={() => {
                          setSelectedPayment(payment)
                          setShowPaymentModal(true)
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Pay Now
                      </button>
                    )}
                    {payment.paymentStatus === 'paid' && (
                      <button
                        onClick={() => downloadReceipt(payment._id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {payments.length === 0 && (
          <div className="text-center py-12">
            <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No payments found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Your payment history will appear here.
            </p>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={selectedPayment?.amount || 0}
        onPaymentSuccess={handlePaymentSuccess}
        title={`Payment for Order ${selectedPayment?.orderId || ''}`}
      />
    </div>
  )
}

export default Payments