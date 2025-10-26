import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { 
  Package, Plus, CreditCard, Users, 
  TrendingUp, Clock, CheckCircle 
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { USER_ROLES } from '../utils/constants'
import { setStats } from '../context/orderSlice'
import SmartSuggestions from '../components/SmartSuggestions'
import VoiceCommandPanel from '../components/VoiceCommandPanel'
import AICostEstimator from '../components/AICostEstimator'
import SmartScheduler from '../components/SmartScheduler'


const Dashboard = () => {
  const { user } = useSelector((state) => state.auth)
  const { stats } = useSelector((state) => state.orders)
  const dispatch = useDispatch()
  const [showCostEstimator, setShowCostEstimator] = useState(false)
  const [showScheduler, setShowScheduler] = useState(false)

  useEffect(() => {
    // Mock data - replace with API call
    dispatch(setStats({
      totalOrders: 156,
      totalRevenue: 45600,
      activeCustomers: 89,
      pendingDeliveries: 23,
    }))
  }, [dispatch])

  const mockChartData = [
    { name: 'Mon', revenue: 4000 },
    { name: 'Tue', revenue: 3000 },
    { name: 'Wed', revenue: 5000 },
    { name: 'Thu', revenue: 2780 },
    { name: 'Fri', revenue: 1890 },
    { name: 'Sat', revenue: 2390 },
    { name: 'Sun', revenue: 3490 },
  ]

  const CustomerDashboard = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome back, {user?.name}!
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          You have 3 active orders in progress
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/orders/create"
            className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200/30 rounded-full -mr-10 -mt-10"></div>
            <div className="relative">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Create New Order</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Start a new laundry order</p>
            </div>
          </Link>
          
          <Link
            to="/orders"
            className="group relative overflow-hidden bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-200/30 rounded-full -mr-10 -mt-10"></div>
            <div className="relative">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Package className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Track Orders</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Monitor your orders</p>
            </div>
          </Link>
          
          <Link
            to="/payments"
            className="group relative overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200/30 rounded-full -mr-10 -mt-10"></div>
            <div className="relative">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Payment History</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">View transactions</p>
            </div>
          </Link>
        </div>
      </div>

      {/* AI Smart Suggestions */}
      <SmartSuggestions />
      
      {/* Voice Commands & AI Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <VoiceCommandPanel />
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🤖 AI Assistant
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Get personalized recommendations and smart scheduling
          </p>
          <div className="space-y-2">
            <button 
              onClick={() => setShowCostEstimator(true)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 text-sm"
            >
              AI Cost Estimator
            </button>
            <button 
              onClick={() => setShowScheduler(true)}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 text-sm"
            >
              Smart Scheduler
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const AdminDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalOrders}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{stats.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Customers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeCustomers}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Deliveries</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pendingDeliveries}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Weekly Revenue (₹)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mockChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
            <Bar dataKey="revenue" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )

  const StaffDashboard = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Your Assigned Orders
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          You have 8 orders assigned to you today
        </p>
        
        <div className="space-y-4">
          {[1, 2, 3].map((order) => (
            <div key={order} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Order #WW00{order}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Customer: John Doe</p>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    Pick Up
                  </button>
                  <button className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    In Process
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <Link
          to="/orders"
          className="inline-flex items-center mt-4 text-blue-600 hover:text-blue-500"
        >
          View all orders
          <CheckCircle className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </div>
  )

  const renderDashboard = () => {
    switch (user?.role) {
      case USER_ROLES.ADMIN:
        return <AdminDashboard />
      case USER_ROLES.STAFF:
        return <StaffDashboard />
      default:
        return <CustomerDashboard />
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      {renderDashboard()}
      
      {/* AI Modals */}
      <AICostEstimator 
        isOpen={showCostEstimator} 
        onClose={() => setShowCostEstimator(false)} 
      />
      <SmartScheduler 
        isOpen={showScheduler} 
        onClose={() => setShowScheduler(false)} 
      />
    </div>
  )
}

export default Dashboard