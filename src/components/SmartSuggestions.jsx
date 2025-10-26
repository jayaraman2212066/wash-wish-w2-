import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Sparkles, Clock, Gift, TrendingUp } from 'lucide-react'
import { aiService } from '../utils/aiService'
import { toast } from 'react-toastify'

const SmartSuggestions = () => {
  const [recommendations, setRecommendations] = useState([])
  const [reminders, setReminders] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    loadAIData()
  }, [user])

  const loadAIData = async () => {
    try {
      const [recs, rems] = await Promise.all([
        aiService.getRecommendations(user?.id),
        aiService.getReminders(user?.id)
      ])
      setRecommendations(recs)
      setReminders(rems)
    } catch (error) {
      console.error('Failed to load AI data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRecommendationClick = (recommendation) => {
    aiService.trackUserAction('recommendation_clicked', recommendation)
    
    switch (recommendation.action) {
      case 'create_order':
        window.location.href = '/orders/create'
        break
      case 'winter_special':
      case 'spring_cleaning':
      case 'curtain_cleaning':
        toast.info(`${recommendation.title} - ${recommendation.description}`)
        window.location.href = '/orders/create'
        break
      case 'shirt_subscription':
        window.location.href = '/subscriptions'
        break
      default:
        toast.info(recommendation.description)
    }
  }

  const handleReminderAction = (reminder) => {
    aiService.trackUserAction('reminder_acted', reminder)
    
    switch (reminder.action) {
      case 'schedule_pickup':
        window.location.href = '/orders/create'
        break
      case 'winter_cleaning':
        toast.info('Winter cleaning services available!')
        window.location.href = '/orders/create'
        break
      default:
        toast.info(reminder.message)
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50 dark:bg-red-900/20'
      case 'medium': return 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20'
      default: return 'border-blue-200 bg-blue-50 dark:bg-blue-900/20'
    }
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <TrendingUp className="h-4 w-4 text-red-600" />
      case 'medium': return <Clock className="h-4 w-4 text-yellow-600" />
      default: return <Sparkles className="h-4 w-4 text-blue-600" />
    }
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (recommendations.length === 0 && reminders.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <Sparkles className="h-5 w-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Smart Suggestions</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-center py-8">
          No suggestions available right now. Use our services to get personalized recommendations!
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <Sparkles className="h-5 w-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Smart Suggestions</h3>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Reminders */}
        {reminders.map((reminder, index) => (
          <div
            key={`reminder-${index}`}
            className={`border rounded-lg p-4 ${getPriorityColor(reminder.urgency)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-orange-600 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{reminder.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{reminder.message}</p>
                </div>
              </div>
              <button
                onClick={() => handleReminderAction(reminder)}
                className="px-3 py-1 bg-orange-600 text-white text-sm rounded hover:bg-orange-700"
              >
                Act Now
              </button>
            </div>
          </div>
        ))}

        {/* Recommendations */}
        {recommendations.map((rec, index) => (
          <div
            key={`rec-${index}`}
            className={`border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow ${getPriorityColor(rec.priority)}`}
            onClick={() => handleRecommendationClick(rec)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                {getPriorityIcon(rec.priority)}
                <div className="ml-3">
                  <div className="flex items-center">
                    <h4 className="font-medium text-gray-900 dark:text-white">{rec.title}</h4>
                    {rec.discount && (
                      <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        {rec.discount} OFF
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{rec.description}</p>
                  <div className="flex items-center mt-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {rec.type} • {rec.priority} priority
                    </span>
                  </div>
                </div>
              </div>
              {rec.discount && (
                <Gift className="h-5 w-5 text-green-600" />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 rounded-b-lg">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          💡 Suggestions powered by AI based on your usage patterns and seasonal trends
        </p>
      </div>
    </div>
  )
}

export default SmartSuggestions