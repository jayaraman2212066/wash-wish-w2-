import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { 
  Plus, Filter, Download, Eye, 
  Search, Calendar, Package 
} from 'lucide-react'
import { ORDER_STATUS, STATUS_COLORS, USER_ROLES } from '../utils/constants'
import { setOrders, updateOrder } from '../context/orderSlice'
import { toast } from 'react-toastify'
import api from '../utils/api'
import InvoiceModal from '../components/InvoiceModal'

const Orders = () => {
  const [filteredOrders, setFilteredOrders] = useState([])
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [filters, setFilters] = useState({
    status: '',
    dateFrom: '',
    dateTo: '',
    search: '',
  })
  const { orders } = useSelector((state) => state.orders)
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [orders, filters])

  const fetchOrders = async () => {
    try {
      const endpoint = user?.role === USER_ROLES.CUSTOMER ? '/orders/my' : '/orders'
      const response = await api.get(endpoint)
      dispatch(setOrders(response.data.data?.orders || []))
    } catch (error) {
      console.error('Error fetching orders:', error)
      dispatch(setOrders([]))
    }
  }

  const applyFilters = () => {
    let filtered = [...orders]

    if (filters.status) {
      filtered = filtered.filter(order => (order.orderStatus || order.status) === filters.status)
    }

    if (filters.search) {
      filtered = filtered.filter(order =>
        (order.orderNumber || order.orderId || order.id).toLowerCase().includes(filters.search.toLowerCase()) ||
        (order.customerName || '').toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    setFilteredOrders(filtered)
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await api.put(`/orders/${orderId}/status`, { status: newStatus })
      dispatch(updateOrder(response.data.data))
      toast.success('Order status updated successfully')
    } catch (error) {
      toast.error('Failed to update order status')
    }
  }

  const viewInvoice = (orderId) => {
    const order = orders.find(o => (o._id || o.id) === orderId)
    if (order) {
      setSelectedOrder(order)
      setShowInvoiceModal(true)
    } else {
      toast.error('Order not found')
    }
  }

  const getStatusButtons = (order) => {
    if (user?.role !== USER_ROLES.STAFF && user?.role !== USER_ROLES.ADMIN) {
      return null
    }

    const statusFlow = [
      ORDER_STATUS.PENDING,
      ORDER_STATUS.PICKED_UP,
      ORDER_STATUS.IN_PROCESS,
      ORDER_STATUS.WASHED,
      ORDER_STATUS.IRONED,
      ORDER_STATUS.READY_FOR_DELIVERY,
      ORDER_STATUS.DELIVERED,
    ]

    const currentIndex = statusFlow.indexOf(order.orderStatus || order.status)
    const nextStatus = statusFlow[currentIndex + 1]

    if (!nextStatus) return null

    return (
      <button
        onClick={() => updateOrderStatus(order._id || order.id, nextStatus)}
        className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full hover:bg-blue-700"
      >
        Mark as {nextStatus.replace('_', ' ')}
      </button>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Orders</h1>
            {user?.role === USER_ROLES.CUSTOMER && (
              <Link
                to="/orders/create"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Order
              </Link>
            )}
          </div>
        </div>

        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
              />
            </div>
            
            <select
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
            >
              <option value="">All Status</option>
              {Object.values(ORDER_STATUS).map(status => (
                <option key={status} value={status}>
                  {status.replace('_', ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
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
              {filteredOrders.map((order) => (
                <tr key={order._id || order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {order.orderNumber || order.orderId || order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {order.customerName || user?.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {order.items.map(item => `${item.quantity}x ${item.type || item.name}`).join(', ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    ₹{order.totalAmount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${STATUS_COLORS[order.orderStatus || order.status]}`}>
                      {(order.orderStatus || order.status).replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => viewInvoice(order._id || order.id)}
                      className="text-blue-600 hover:text-blue-900"
                      title="View Invoice"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    {getStatusButtons(order)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <div className="relative mb-6">
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop&crop=center"
                alt="No orders"
                className="mx-auto w-48 h-32 object-cover rounded-lg opacity-30"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Package className="h-16 w-16 text-gray-400" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No orders found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
              {user?.role === USER_ROLES.CUSTOMER ? 'Get started by creating your first laundry order.' : 'No orders match your current filters.'}
            </p>
            {user?.role === USER_ROLES.CUSTOMER && (
              <Link
                to="/orders/create"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Order
              </Link>
            )}
          </div>
        )}
      </div>
      
      <InvoiceModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        order={selectedOrder}
      />
    </div>
  )
}

export default Orders