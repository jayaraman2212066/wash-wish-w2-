import { useState, useEffect } from 'react'
import { Calendar, Clock, MapPin, Truck, Star } from 'lucide-react'
import { aiService } from '../utils/aiService'

const SmartScheduler = ({ isOpen, onClose }) => {
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [address, setAddress] = useState('')
  const [suggestions, setSuggestions] = useState([])

  useEffect(() => {
    if (isOpen) {
      generateSmartSuggestions()
    }
  }, [isOpen])

  const generateSmartSuggestions = () => {
    const suggestions = aiService.getOptimalSchedule()
    setSuggestions(suggestions)
  }

  const handleSchedule = () => {
    if (!selectedDate || !selectedTime || !address) {
      alert('Please fill all fields')
      return
    }
    
    const scheduleData = {
      date: selectedDate,
      time: selectedTime,
      address,
      type: 'pickup',
      scheduledAt: new Date().toISOString()
    }
    
    // Save to localStorage
    const schedules = JSON.parse(localStorage.getItem('schedules') || '[]')
    schedules.push(scheduleData)
    localStorage.setItem('schedules', JSON.stringify(schedules))
    
    // Track user action for AI learning
    aiService.trackUserAction('schedule_pickup', {
      date: selectedDate,
      time: selectedTime,
      dayOfWeek: new Date(selectedDate).getDay()
    })
    
    alert('Pickup scheduled successfully!')
    onClose()
  }

  const selectSuggestion = (suggestion) => {
    setSelectedDate(suggestion.date)
    setSelectedTime(suggestion.time)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Smart Scheduler
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
        </div>

        <div className="space-y-4">
          {/* AI Suggestions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              🤖 AI Recommended Slots
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => selectSuggestion(suggestion)}
                  className={`p-2 border rounded-md text-left text-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 relative ${
                    selectedDate === suggestion.date && selectedTime === suggestion.time
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {suggestion.score > 80 && (
                    <Star className="h-3 w-3 text-yellow-500 absolute top-1 right-1" />
                  )}
                  <div className="font-medium">{suggestion.day}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {new Date(suggestion.date).toLocaleDateString()} {suggestion.time}
                  </div>
                  <div className="text-xs text-blue-600 mt-1">
                    {suggestion.reason}
                  </div>
                  {suggestion.discount > 0 && (
                    <div className="text-xs text-green-600 font-medium">
                      {suggestion.discount}% off
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Manual Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Time
              </label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              >
                <option value="">Select time</option>
                <option value="09:00">9:00 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="12:00">12:00 PM</option>
                <option value="13:00">1:00 PM</option>
                <option value="14:00">2:00 PM</option>
                <option value="15:00">3:00 PM</option>
                <option value="16:00">4:00 PM</option>
                <option value="17:00">5:00 PM</option>
                <option value="18:00">6:00 PM</option>
              </select>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <MapPin className="h-4 w-4 inline mr-1" />
              Pickup Address
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your complete address..."
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>

          {/* Schedule Button */}
          <button
            onClick={handleSchedule}
            disabled={!selectedDate || !selectedTime || !address}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Truck className="h-4 w-4 mr-2" />
            Schedule Pickup
          </button>

          {/* Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <div className="flex items-start">
              <Clock className="h-4 w-4 text-blue-600 mt-0.5 mr-2" />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-medium">Smart Scheduling Benefits:</p>
                <ul className="mt-1 space-y-1 text-xs">
                  <li>• AI optimizes routes for faster pickup</li>
                  <li>• Early bookings get priority slots</li>
                  <li>• Weekend slots available with discounts</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SmartScheduler