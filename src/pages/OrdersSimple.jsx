import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import api from '../utils/api'

const OrdersSimple = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (user?.role) {
      fetchOrders()
    }
  }, [user])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const endpoint = user.role === 'customer' ? '/orders/my' : '/orders'
      console.log('Fetching from:', endpoint)
      const response = await api.get(endpoint)
      console.log('Response:', response.data)
      setOrders(response.data.data?.orders || [])
    } catch (error) {
      console.error('Error:', error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-6">Loading orders...</div>
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Orders ({orders.length})</h1>
      <button 
        onClick={fetchOrders}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Refresh
      </button>
      
      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="border p-4 rounded">
              <p><strong>Order:</strong> {order.orderNumber}</p>
              <p><strong>Amount:</strong> ₹{order.totalAmount}</p>
              <p><strong>Status:</strong> {order.orderStatus}</p>
              <p><strong>Items:</strong> {order.items?.length || 0} items</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default OrdersSimple