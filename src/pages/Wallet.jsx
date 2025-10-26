import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Wallet as WalletIcon, Plus, ArrowUpRight, ArrowDownLeft, CreditCard } from 'lucide-react'
import { toast } from 'react-toastify'
import PaymentModal from '../components/PaymentModal'
import { getWalletData, addTransaction } from '../utils/walletStorage'

const Wallet = () => {
  const { user } = useSelector((state) => state.auth)
  const [walletData, setWalletData] = useState({ balance: 0, transactions: [] })
  const [rechargeAmount, setRechargeAmount] = useState('')
  const [showRechargeModal, setShowRechargeModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState(0)
  const [loading, setLoading] = useState(true)

  const rechargeOptions = [500, 1000, 2000, 5000]

  useEffect(() => {
    fetchWalletData()
  }, [])

  const fetchWalletData = async () => {
    try {
      const storedWalletData = getWalletData()
      setWalletData(storedWalletData)
    } catch (error) {
      setWalletData({ balance: 1250, transactions: [] })
    } finally {
      setLoading(false)
    }
  }

  const rechargeWallet = (amount) => {
    setSelectedAmount(amount)
    setShowPaymentModal(true)
    setShowRechargeModal(false)
    setRechargeAmount('')
  }

  const handleRechargeSuccess = async (paymentData) => {
    try {
      const updatedWalletData = addTransaction(
        paymentData.amount, 
        'credit', 
        `Wallet Recharge via ${paymentData.method.toUpperCase()} - ${paymentData.transactionId}`
      )
      
      setWalletData(updatedWalletData)
      toast.success(`₹${paymentData.amount} added to wallet successfully!`)
      setShowPaymentModal(false)
    } catch (error) {
      toast.error('Recharge verification failed')
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </div>
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Wallet Balance Card */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center mb-2">
              <WalletIcon className="h-8 w-8 mr-3" />
              <h1 className="text-2xl font-bold">My Wallet</h1>
            </div>
            <p className="text-green-100 mb-4">Available Balance</p>
            <p className="text-4xl font-bold">₹{walletData.balance.toLocaleString()}</p>
          </div>
          <button
            onClick={() => setShowRechargeModal(true)}
            className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Money
          </button>
        </div>
      </div>

      {/* Quick Recharge Options */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Recharge</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {rechargeOptions.map((amount) => (
            <button
              key={amount}
              onClick={() => rechargeWallet(amount)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-center hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
            >
              <span className="font-semibold text-gray-900 dark:text-white">₹{amount}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Transaction History</h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {walletData.transactions.map((transaction) => (
            <div key={transaction._id} className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className={`p-2 rounded-full mr-4 ${
                  transaction.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  {transaction.type === 'credit' ? 
                    <ArrowDownLeft className="h-5 w-5" /> : 
                    <ArrowUpRight className="h-5 w-5" />
                  }
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{transaction.description}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(transaction.createdAt).toLocaleDateString()} • {new Date(transaction.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <div className={`font-semibold ${
                transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
              </div>
            </div>
          ))}
        </div>
        
        {walletData.transactions.length === 0 && (
          <div className="text-center py-12">
            <WalletIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No transactions yet</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Your wallet transactions will appear here.
            </p>
          </div>
        )}
      </div>

      {/* Custom Recharge Modal */}
      {showRechargeModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Add Money to Wallet</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Enter Amount
                </label>
                <input
                  type="number"
                  min="100"
                  max="50000"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                  value={rechargeAmount}
                  onChange={(e) => setRechargeAmount(e.target.value)}
                  placeholder="Minimum ₹100"
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowRechargeModal(false)
                    setRechargeAmount('')
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => rechargeWallet(parseInt(rechargeAmount))}
                  disabled={!rechargeAmount || parseInt(rechargeAmount) < 100}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Add ₹{rechargeAmount || 0}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={selectedAmount}
        onPaymentSuccess={handleRechargeSuccess}
        title="Wallet Recharge"
      />
    </div>
  )
}

export default Wallet