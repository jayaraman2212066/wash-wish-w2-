import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Package, CreditCard, Calendar, Pause, Play, X } from 'lucide-react'
import { toast } from 'react-toastify'
import PaymentModal from '../components/PaymentModal'
import { getStoredSubscriptions, addSubscription, updateSubscription, removeSubscription } from '../utils/subscriptionStorage'

const Subscriptions = () => {
  const { user } = useSelector((state) => state.auth)
  const [subscriptions, setSubscriptions] = useState([])
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)

  const subscriptionPlans = [
    {
      id: 'basic',
      name: 'Basic Care',
      price: 999,
      duration: 'monthly',
      features: ['10 kg laundry/month', 'Basic detergent', 'Standard delivery', 'Email support'],
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium Care',
      price: 1999,
      duration: 'monthly',
      features: ['25 kg laundry/month', 'Premium detergent', 'Express delivery', 'Phone support', 'Stain protection'],
      popular: true
    },
    {
      id: 'family',
      name: 'Ultimate Family Plan',
      price: 2999,
      duration: 'monthly',
      features: ['Unlimited laundry', 'Premium care package', 'Same-day delivery', '24/7 support', 'Free alterations'],
      popular: false
    }
  ]

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  const fetchSubscriptions = async () => {
    try {
      const storedSubscriptions = getStoredSubscriptions()
      setSubscriptions(storedSubscriptions)
    } catch (error) {
      setSubscriptions([])
    } finally {
      setLoading(false)
    }
  }

  const subscribeToPlan = (planId) => {
    const plan = subscriptionPlans.find(p => p.id === planId)
    if (plan) {
      setSelectedPlan(plan)
      setShowPaymentModal(true)
    }
  }

  const handlePaymentSuccess = async (paymentData) => {
    try {
      const newSubscription = {
        _id: `sub_${Date.now()}`,
        planName: selectedPlan.name,
        amount: selectedPlan.price,
        status: 'active',
        nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        paymentMethod: paymentData.method,
        transactionId: paymentData.transactionId
      }
      
      const updatedSubscriptions = addSubscription(newSubscription)
      setSubscriptions(updatedSubscriptions)
      
      toast.success('Subscription activated successfully!')
      setShowPaymentModal(false)
      setSelectedPlan(null)
    } catch (error) {
      toast.error('Payment verification failed')
    }
  }

  const pauseSubscription = async (subscriptionId) => {
    try {
      const updatedSubscriptions = updateSubscription(subscriptionId, { status: 'paused' })
      setSubscriptions(updatedSubscriptions)
      toast.success('Subscription paused')
    } catch (error) {
      toast.error('Failed to pause subscription')
    }
  }

  const resumeSubscription = async (subscriptionId) => {
    try {
      const updatedSubscriptions = updateSubscription(subscriptionId, { status: 'active' })
      setSubscriptions(updatedSubscriptions)
      toast.success('Subscription resumed')
    } catch (error) {
      toast.error('Failed to resume subscription')
    }
  }

  const cancelSubscription = async (subscriptionId) => {
    if (window.confirm('Are you sure you want to cancel this subscription?')) {
      try {
        const updatedSubscriptions = removeSubscription(subscriptionId)
        setSubscriptions(updatedSubscriptions)
        toast.success('Subscription cancelled')
      } catch (error) {
        toast.error('Failed to cancel subscription')
      }
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Active Subscriptions */}
      {subscriptions.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Subscriptions</h2>
          </div>
          <div className="p-6 space-y-4">
            {subscriptions.map((subscription) => (
              <div key={subscription._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{subscription.planName}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      ₹{subscription.amount}/month • Next billing: {new Date(subscription.nextBilling).toLocaleDateString()}
                    </p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-2 ${
                      subscription.status === 'active' ? 'bg-green-100 text-green-800' :
                      subscription.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {subscription.status}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    {subscription.status === 'active' && (
                      <button
                        onClick={() => pauseSubscription(subscription._id)}
                        className="p-2 text-yellow-600 hover:text-yellow-800"
                      >
                        <Pause className="h-4 w-4" />
                      </button>
                    )}
                    {subscription.status === 'paused' && (
                      <button
                        onClick={() => resumeSubscription(subscription._id)}
                        className="p-2 text-green-600 hover:text-green-800"
                      >
                        <Play className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => cancelSubscription(subscription._id)}
                      className="p-2 text-red-600 hover:text-red-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Plans */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Subscription Plans</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subscriptionPlans.map((plan) => (
              <div key={plan.id} className={`relative border rounded-lg p-6 ${
                plan.popular ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 dark:border-gray-700'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-3 py-1 text-sm font-medium rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center">
                  <Package className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                  <div className="mt-4">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">₹{plan.price}</span>
                    <span className="text-gray-600 dark:text-gray-400">/{plan.duration}</span>
                  </div>
                </div>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <svg className="h-4 w-4 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => subscribeToPlan(plan.id)}
                  className={`w-full mt-6 px-4 py-2 rounded-md font-medium ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
                  }`}
                >
                  Subscribe Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={selectedPlan?.price || 0}
        onPaymentSuccess={handlePaymentSuccess}
        title={`Subscribe to ${selectedPlan?.name || ''}`}
      />
    </div>
  )
}

export default Subscriptions