import { useState } from 'react'
import { Calculator, Shirt, Package, Clock, TrendingDown } from 'lucide-react'
import { CLOTH_TYPES } from '../utils/constants'
import { aiService } from '../utils/aiService'

const AICostEstimator = ({ isOpen, onClose }) => {
  const [items, setItems] = useState([])
  const [estimate, setEstimate] = useState(null)

  const addItem = (type) => {
    setItems([...items, { type, quantity: 1 }])
  }

  const updateQuantity = (index, quantity) => {
    const updated = [...items]
    updated[index].quantity = Math.max(1, quantity)
    setItems(updated)
  }

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const calculateEstimate = () => {
    const result = aiService.calculateSmartCost(items)
    setEstimate(result)
    
    // Track user action for AI learning
    aiService.trackUserAction('cost_estimation', {
      items: items.length,
      totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
      estimatedCost: result.finalCost
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Calculator className="h-5 w-5 mr-2" />
            AI Cost Estimator
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Add Items
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(CLOTH_TYPES).map(([key, cloth]) => (
                <button
                  key={key}
                  onClick={() => addItem(key)}
                  className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 text-sm"
                >
                  {cloth.name} - ₹{cloth.price}
                </button>
              ))}
            </div>
          </div>

          {items.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Items
              </label>
              <div className="space-y-2">
                {items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <span className="text-sm">{CLOTH_TYPES[item.type.toUpperCase()]?.name}</span>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(index, parseInt(e.target.value))}
                        className="w-16 px-2 py-1 border rounded text-sm"
                        min="1"
                      />
                      <button
                        onClick={() => removeItem(index)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {items.length > 0 && (
            <button
              onClick={calculateEstimate}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Calculate Estimate
            </button>
          )}

          {estimate && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">🤖 AI Smart Estimate</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Base cost:</span>
                  <span>₹{estimate.baseCost}</span>
                </div>
                {estimate.adjustments.rush > 0 && (
                  <div className="flex justify-between text-orange-600">
                    <span>Rush charge:</span>
                    <span>+₹{estimate.adjustments.rush.toFixed(0)}</span>
                  </div>
                )}
                {estimate.adjustments.bulk < 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Bulk discount:</span>
                    <span>₹{estimate.adjustments.bulk.toFixed(0)}</span>
                  </div>
                )}
                {estimate.adjustments.seasonal < 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Seasonal offer:</span>
                    <span>₹{estimate.adjustments.seasonal.toFixed(0)}</span>
                  </div>
                )}
                {estimate.adjustments.loyalty < 0 && (
                  <div className="flex justify-between text-purple-600">
                    <span>Loyalty discount:</span>
                    <span>₹{estimate.adjustments.loyalty.toFixed(0)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold border-t pt-1">
                  <span>Final total:</span>
                  <span>₹{estimate.finalCost.toFixed(0)}</span>
                </div>
                {estimate.savings > 0 && (
                  <div className="flex items-center text-green-600 text-xs">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    <span>You save ₹{estimate.savings.toFixed(0)}!</span>
                  </div>
                )}
                <div className="flex items-center text-gray-600 dark:text-gray-400 mt-2">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Estimated time: {estimate.timeEstimate} hours</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AICostEstimator