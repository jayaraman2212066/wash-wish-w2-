import { useState, useEffect } from 'react'
import { Sparkles, Clock, Upload } from 'lucide-react'
import { toast } from 'react-toastify'
import api from '../utils/api'

const SpecialServices = () => {
  const [selectedService, setSelectedService] = useState(null)
  const [orderData, setOrderData] = useState({
    items: [],
    instructions: '',
    photos: []
  })

  const specialServices = [
    {
      id: 'leather',
      name: 'Leather Cleaning',
      price: 500,
      duration: '3-5 days',
      description: 'Professional leather cleaning and conditioning',
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=200&fit=crop'
    },
    {
      id: 'shoes',
      name: 'Shoe Cleaning & Repair',
      price: 300,
      duration: '2-3 days',
      description: 'Deep cleaning, polishing, and minor repairs',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=200&fit=crop'
    },
    {
      id: 'bags',
      name: 'Bag Cleaning',
      price: 400,
      duration: '2-4 days',
      description: 'Specialized cleaning for handbags and backpacks',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=200&fit=crop'
    },
    {
      id: 'carpet',
      name: 'Carpet/Sofa Cleaning',
      price: 800,
      duration: '1-2 days',
      description: 'At-home deep cleaning service',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop'
    }
  ]

  const alterationServices = [
    { id: 'stitching', name: 'Stitching & Repairs', price: 150 },
    { id: 'hemming', name: 'Hemming', price: 100 },
    { id: 'buttons', name: 'Button Replacement', price: 50 },
    { id: 'zipper', name: 'Zipper Fixing', price: 120 }
  ]

  const addItem = (serviceId, quantity = 1) => {
    const service = specialServices.find(s => s.id === serviceId)
    const existingItem = orderData.items.find(item => item.serviceId === serviceId)
    
    if (existingItem) {
      setOrderData({
        ...orderData,
        items: orderData.items.map(item =>
          item.serviceId === serviceId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      })
    } else {
      setOrderData({
        ...orderData,
        items: [...orderData.items, {
          serviceId,
          name: service.name,
          price: service.price,
          quantity,
          duration: service.duration
        }]
      })
    }
  }

  const removeItem = (serviceId) => {
    setOrderData({
      ...orderData,
      items: orderData.items.filter(item => item.serviceId !== serviceId)
    })
  }

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files)
    setOrderData({
      ...orderData,
      photos: [...orderData.photos, ...files]
    })
  }

  const calculateTotal = () => {
    return orderData.items.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const submitOrder = async () => {
    if (orderData.items.length === 0) {
      toast.error('Please select at least one service')
      return
    }

    try {
      const formData = new FormData()
      formData.append('orderData', JSON.stringify({
        items: orderData.items,
        instructions: orderData.instructions,
        totalAmount: calculateTotal(),
        serviceType: 'special'
      }))
      
      orderData.photos.forEach((photo, index) => {
        formData.append(`photo_${index}`, photo)
      })

      const response = await api.post('/special-services/order', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      toast.success('Special service order created successfully!')
      setOrderData({ items: [], instructions: '', photos: [] })
    } catch (error) {
      toast.error('Failed to create order')
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Special Services */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Special Services</h1>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {specialServices.map((service) => (
              <div key={service.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{service.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{service.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-lg font-bold text-blue-600">₹{service.price}</span>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {service.duration}
                    </div>
                  </div>
                  <button
                    onClick={() => addItem(service.id)}
                    className="w-full mt-3 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                  >
                    Add to Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alteration Services */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Alteration & Repair Services</h2>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {alterationServices.map((service) => (
              <div key={service.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{service.name}</h3>
                    <span className="text-blue-600 font-semibold">₹{service.price}</span>
                  </div>
                  <button
                    onClick={() => addItem(service.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Summary */}
      {orderData.items.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Order Summary</h2>
          </div>
          
          <div className="p-6 space-y-4">
            {orderData.items.map((item) => (
              <div key={item.serviceId} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">{item.name}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">x{item.quantity}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-gray-900 dark:text-white">₹{item.price * item.quantity}</span>
                  <button
                    onClick={() => removeItem(item.serviceId)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            {/* Instructions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Special Instructions
              </label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                value={orderData.instructions}
                onChange={(e) => setOrderData({...orderData, instructions: e.target.value})}
                placeholder="Any specific instructions for the service..."
              />
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Upload Photos (Optional)
              </label>
              <div className="flex items-center space-x-4">
                <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600">
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Files
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </label>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {orderData.photos.length} files selected
                </span>
              </div>
            </div>

            {/* Total and Submit */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-gray-900 dark:text-white">Total Amount:</span>
                <span className="text-xl font-bold text-blue-600">₹{calculateTotal()}</span>
              </div>
              <button
                onClick={submitOrder}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 font-medium"
              >
                <Sparkles className="h-5 w-5 inline mr-2" />
                Place Special Service Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SpecialServices