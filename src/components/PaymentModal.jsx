import { useState } from 'react'
import { CreditCard, Smartphone, Wallet, DollarSign, X } from 'lucide-react'
import { toast } from 'react-toastify'

const PaymentModal = ({ isOpen, onClose, amount, onPaymentSuccess, title = "Payment" }) => {
  const [selectedMethod, setSelectedMethod] = useState('upi')
  const [processing, setProcessing] = useState(false)
  const [splitPayment, setSplitPayment] = useState(false)
  const [splitAmount, setSplitAmount] = useState(amount / 2)

  const paymentMethods = [
    { id: 'upi', name: 'UPI', icon: Smartphone, description: 'GPay, PhonePe, Paytm' },
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, description: 'Visa, Mastercard, RuPay' },
    { id: 'wallet', name: 'Wallet', icon: Wallet, description: 'Use wallet balance' },
    { id: 'cod', name: 'Cash on Delivery', icon: DollarSign, description: 'Pay when delivered' }
  ]

  const processPayment = async () => {
    setProcessing(true)
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const paymentData = {
      method: selectedMethod,
      amount: splitPayment ? splitAmount : amount,
      remainingAmount: splitPayment ? amount - splitAmount : 0,
      transactionId: `TXN${Date.now()}`,
      status: 'success'
    }
    
    toast.success(`Payment of ₹${paymentData.amount} successful via ${selectedMethod.toUpperCase()}!`)
    onPaymentSuccess(paymentData)
    setProcessing(false)
    onClose()
  }

  const simulateUPIPayment = () => {
    toast.info('Opening UPI app...')
    setTimeout(() => {
      toast.success('UPI payment completed!')
      processPayment()
    }, 1500)
  }

  const simulateCardPayment = () => {
    toast.info('Redirecting to bank...')
    setTimeout(() => {
      toast.success('Card payment successful!')
      processPayment()
    }, 2000)
  }

  const simulateWalletPayment = () => {
    toast.info('Processing wallet payment...')
    setTimeout(() => {
      toast.success('Wallet payment completed!')
      processPayment()
    }, 1000)
  }

  const handlePayment = () => {
    switch (selectedMethod) {
      case 'upi':
        simulateUPIPayment()
        break
      case 'card':
        simulateCardPayment()
        break
      case 'wallet':
        simulateWalletPayment()
        break
      case 'cod':
        processPayment()
        break
      default:
        processPayment()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Amount Display */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
            <p className="text-2xl font-bold text-blue-600">₹{amount}</p>
          </div>
        </div>

        {/* Split Payment Option */}
        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={splitPayment}
              onChange={(e) => setSplitPayment(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Split Payment</span>
          </label>
          
          {splitPayment && (
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pay Now
              </label>
              <input
                type="number"
                min="100"
                max={amount - 100}
                value={splitAmount}
                onChange={(e) => setSplitAmount(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <p className="text-xs text-gray-500 mt-1">
                Remaining ₹{amount - splitAmount} will be collected on delivery
              </p>
            </div>
          )}
        </div>

        {/* Payment Methods */}
        <div className="space-y-3 mb-6">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Select Payment Method</p>
          {paymentMethods.map((method) => {
            const Icon = method.icon
            return (
              <label
                key={method.id}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedMethod === method.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={selectedMethod === method.id}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="sr-only"
                />
                <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-3" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{method.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{method.description}</p>
                </div>
                {selectedMethod === method.id && (
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </label>
            )
          })}
        </div>

        {/* EMI Option for large amounts */}
        {amount > 5000 && (
          <div className="mb-6 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">EMI Available</p>
            <p className="text-xs text-yellow-600 dark:text-yellow-300">
              Convert to EMI starting from ₹{Math.ceil(amount / 12)}/month
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
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
              `Pay ₹${splitPayment ? splitAmount : amount}`
            )}
          </button>
        </div>

        {/* Security Note */}
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
          🔒 Your payment information is secure and encrypted
        </p>
      </div>
    </div>
  )
}

export default PaymentModal