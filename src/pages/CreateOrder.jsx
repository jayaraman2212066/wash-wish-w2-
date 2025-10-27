import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Plus, Minus, Calculator } from 'lucide-react'
import { toast } from 'react-toastify'
import { CLOTH_TYPES } from '../utils/constants'
import { addOrder } from '../context/orderSlice'
// import ClothCard from '../components/ClothCard'
import api from '../utils/api'

const CreateOrder = () => {
  const [orderItems, setOrderItems] = useState([])
  const [formData, setFormData] = useState({
    pickupAddress: '',
    deliveryAddress: '',
    pickupDate: '',
    deliveryDate: '',
    paymentMethod: 'online',
    specialInstructions: '',
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const addItem = (clothType) => {
    const existingItem = orderItems.find(item => item.type === clothType)
    if (existingItem) {
      setOrderItems(orderItems.map(item =>
        item.type === clothType
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setOrderItems([...orderItems, {
        type: clothType,
        name: CLOTH_TYPES[clothType].name,
        price: CLOTH_TYPES[clothType].price,
        quantity: 1,
      }])
    }
  }

  const updateQuantity = (clothType, quantity) => {
    if (quantity <= 0) {
      setOrderItems(orderItems.filter(item => item.type !== clothType))
    } else {
      setOrderItems(orderItems.map(item =>
        item.type === clothType
          ? { ...item, quantity }
          : item
      ))
    }
  }

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (orderItems.length === 0) {
      toast.error('Please add at least one item to your order')
      return
    }

    setLoading(true)
    try {
      const orderData = {
        ...formData,
        items: orderItems.map(item => ({
          type: item.type,
          quantity: item.quantity
        })),
      }
      
      const response = await api.post('/orders', orderData)
      dispatch(addOrder(response.data.data))
      toast.success('Order created successfully!')
      navigate('/orders')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/5 dark:bg-gray-800/5 backdrop-blur-sm rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Order</h1>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Cloth Selection */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Select Clothes
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(CLOTH_TYPES).map(([key, cloth]) => {
                // Map cloth types to actual image filenames
                const imageMap = {
                  shirt: 'shirt.avif',
                  tshirt: 't-shirt.jpg', 
                  pants: 'trousers.webp',
                  jeans: 'jeans.avif',
                  suit: 'suit.webp',
                  blazer: 'blazers.jpg',
                  saree: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=300&fit=crop',
                  salwar: 'salwar kameez.jpg',
                  lehenga: 'lehanga.jpg',
                  kurta: 'kurta.webp',
                  dress: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=300&fit=crop',
                  skirt: 'skirt.jpg',
                  bedsheet: 'bedsheet.jpg',
                  pillowcover: 'pillow cover.jpg',
                  blanket: 'blanket.jpg',
                  comforter: 'blanket.jpg',
                  towel: 'towel.jpg',
                  bathrobe: 'bathrope.jpg',
                  curtain: 'curtains.webp',
                  tie: 'tie.jpg',
                  scarf: 'scarf.jpg',
                  dupatta: 'dupatta.jpg',
                  jacket: 'jacket.jpg',
                  wedding: 'wedding dress.jpg',
                  leather: 'jacket.jpg',
                  sherwani: 'sherwani.jpg',
                  coat: 'wintor coat.jpg',
                  shorts: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=300&fit=crop'
                }
                const imageUrl = imageMap[key]?.startsWith('http') ? imageMap[key] : `/images/assets/${imageMap[key] || 'shirt.avif'}`
                
                return (
                  <div key={key} className="bg-white/5 dark:bg-gray-700/5 backdrop-blur-sm rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-w-16 aspect-h-12 bg-gray-200">
                      <img
                        src={imageUrl}
                        alt={cloth.name}
                        className="w-full h-32 object-cover"
                        onError={(e) => {
                          e.target.src = '/images/assets/shirt.avif'
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 dark:text-white">{cloth.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">₹{cloth.price}</p>
                      <button
                        type="button"
                        onClick={() => addItem(key)}
                        className="mt-2 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Add to Order
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Selected Items */}
          {orderItems.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Selected Items
              </h3>
              <div className="space-y-3">
                {orderItems.map((item) => (
                  <div key={item.type} className="flex items-center justify-between p-3 bg-gray-50/5 dark:bg-gray-700/5 backdrop-blur-sm rounded-lg">
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">{item.name}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">₹{item.price} each</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.type, item.quantity - 1)}
                        className="p-1 text-gray-500 hover:text-gray-700"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="font-medium text-gray-900 dark:text-white w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.type, item.quantity + 1)}
                        className="p-1 text-gray-500 hover:text-gray-700"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <span className="font-medium text-gray-900 dark:text-white ml-4">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-4 bg-blue-50/5 dark:bg-blue-900/5 backdrop-blur-sm rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium text-gray-900 dark:text-white">
                    Total Amount:
                  </span>
                  <span className="text-xl font-bold text-blue-600">
                    ₹{calculateTotal()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Address Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pickup Address
              </label>
              <textarea
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                value={formData.pickupAddress}
                onChange={(e) => setFormData({...formData, pickupAddress: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Delivery Address
              </label>
              <textarea
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                value={formData.deliveryAddress}
                onChange={(e) => setFormData({...formData, deliveryAddress: e.target.value})}
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pickup Date
              </label>
              <input
                type="date"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                value={formData.pickupDate}
                onChange={(e) => setFormData({...formData, pickupDate: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Delivery Date
              </label>
              <input
                type="date"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                value={formData.deliveryDate}
                onChange={(e) => setFormData({...formData, deliveryDate: e.target.value})}
              />
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Payment Method
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              value={formData.paymentMethod}
              onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
            >
              <option value="online">Online Payment</option>
              <option value="cod">Cash on Delivery</option>
            </select>
          </div>

          {/* Special Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Special Instructions (Optional)
            </label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              value={formData.specialInstructions}
              onChange={(e) => setFormData({...formData, specialInstructions: e.target.value})}
              placeholder="Any special care instructions for your clothes..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/orders')}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || orderItems.length === 0}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Calculator className="h-4 w-4 mr-2" />
                  Create Order (₹{calculateTotal()})
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateOrder