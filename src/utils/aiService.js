import { CLOTH_TYPES } from './constants'

// AI-Powered Recommendations Service
class AIService {
  constructor() {
    this.userBehavior = this.getUserBehavior()
    this.seasonalTrends = this.getSeasonalTrends()
  }

  getUserBehavior() {
    return JSON.parse(localStorage.getItem('userBehavior') || '{}')
  }

  saveUserBehavior(behavior) {
    localStorage.setItem('userBehavior', JSON.stringify(behavior))
  }

  getSeasonalTrends() {
    const month = new Date().getMonth()
    const seasons = {
      winter: [11, 0, 1], // Dec, Jan, Feb
      spring: [2, 3, 4],  // Mar, Apr, May
      summer: [5, 6, 7],  // Jun, Jul, Aug
      autumn: [8, 9, 10]  // Sep, Oct, Nov
    }
    
    for (const [season, months] of Object.entries(seasons)) {
      if (months.includes(month)) return season
    }
    return 'spring'
  }

  async getRecommendations(userId) {
    const orders = JSON.parse(localStorage.getItem('userOrders') || '[]')
    const behavior = this.getUserBehavior()
    const season = this.getSeasonalTrends()
    
    const recommendations = []
    
    // Frequency-based recommendations
    if (orders.length > 0) {
      const lastOrder = orders[orders.length - 1]
      const daysSinceLastOrder = Math.floor((Date.now() - new Date(lastOrder.createdAt).getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysSinceLastOrder > 14) {
        recommendations.push({
          type: 'service',
          title: 'Time for Regular Cleaning',
          description: 'It\'s been 2 weeks since your last order. Keep your clothes fresh!',
          action: 'create_order',
          priority: 'high'
        })
      }
    }

    // Seasonal recommendations
    const seasonalRecs = this.getSeasonalRecommendations(season)
    recommendations.push(...seasonalRecs)

    // Behavior-based recommendations
    const behaviorRecs = this.getBehaviorRecommendations(behavior, orders)
    recommendations.push(...behaviorRecs)

    return recommendations
  }

  getSeasonalRecommendations(season) {
    const recommendations = {
      winter: [
        {
          type: 'service',
          title: 'Winter Blanket Cleaning',
          description: 'Special winter care for blankets and comforters',
          discount: '20%',
          action: 'winter_special',
          priority: 'medium'
        }
      ],
      summer: [
        {
          type: 'service',
          title: 'Curtain Refresh',
          description: 'Summer cleaning for curtains and drapes',
          discount: '15%',
          action: 'curtain_cleaning',
          priority: 'medium'
        }
      ],
      spring: [
        {
          type: 'service',
          title: 'Spring Deep Clean',
          description: 'Complete wardrobe refresh for the new season',
          discount: '25%',
          action: 'spring_cleaning',
          priority: 'high'
        }
      ],
      autumn: [
        {
          type: 'service',
          title: 'Prepare for Winter',
          description: 'Get your winter clothes ready',
          action: 'winter_prep',
          priority: 'medium'
        }
      ]
    }
    
    return recommendations[season] || []
  }

  getBehaviorRecommendations(behavior, orders) {
    const recommendations = []
    
    // Frequent shirt users
    const shirtOrders = orders.filter(order => 
      order.items?.some(item => item.type === 'shirt')
    )
    
    if (shirtOrders.length >= 3) {
      recommendations.push({
        type: 'subscription',
        title: 'Shirt Care Subscription',
        description: 'Save 30% with our monthly shirt cleaning plan',
        discount: '30%',
        action: 'shirt_subscription',
        priority: 'high'
      })
    }

    return recommendations
  }

  async getReminders(userId) {
    const orders = JSON.parse(localStorage.getItem('userOrders') || '[]')
    const reminders = []
    
    if (orders.length > 0) {
      const lastOrder = orders[orders.length - 1]
      const daysSinceLastOrder = Math.floor((Date.now() - new Date(lastOrder.createdAt).getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysSinceLastOrder >= 30) {
        reminders.push({
          type: 'cleaning_reminder',
          title: 'Monthly Cleaning Due',
          message: 'It\'s been 30 days since your last laundry service!',
          action: 'schedule_pickup',
          urgency: 'medium'
        })
      }
    }
    
    return reminders
  }

  trackUserAction(action, data) {
    const behavior = this.getUserBehavior()
    const timestamp = new Date().toISOString()
    
    if (!behavior.actions) behavior.actions = []
    behavior.actions.push({ action, data, timestamp })
    
    // Keep only last 100 actions
    if (behavior.actions.length > 100) {
      behavior.actions = behavior.actions.slice(-100)
    }
    
    this.saveUserBehavior(behavior)
  }

  // AI Cost Estimation with dynamic pricing
  calculateSmartCost(items) {
    let baseCost = 0
    let timeEstimate = 0
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
    
    items.forEach(item => {
      const clothType = CLOTH_TYPES[item.type.toUpperCase()]
      if (clothType) {
        baseCost += clothType.price * item.quantity
        // Time estimation based on item complexity
        const complexity = clothType.category === 'specialty' ? 2 : clothType.category === 'premium' ? 1.5 : 1
        timeEstimate += item.quantity * 0.5 * complexity
      }
    })

    // AI-based dynamic adjustments
    const adjustments = {
      rush: timeEstimate > 10 ? baseCost * 0.2 : 0, // Rush charge for large orders
      bulk: totalItems > 10 ? baseCost * -0.1 : 0, // Bulk discount
      seasonal: this.getSeasonalDiscount(), // Seasonal promotions
      loyalty: this.getLoyaltyDiscount() // Customer loyalty discount
    }

    const finalCost = baseCost + adjustments.rush + adjustments.bulk + adjustments.seasonal + adjustments.loyalty
    
    return {
      baseCost,
      adjustments,
      finalCost: Math.max(0, finalCost),
      timeEstimate: Math.max(2, Math.ceil(timeEstimate)),
      savings: Math.abs(adjustments.bulk + adjustments.seasonal + adjustments.loyalty)
    }
  }

  getSeasonalDiscount() {
    const season = this.getSeasonalTrends()
    const discounts = {
      spring: -50, // Spring cleaning discount
      summer: -30, // Summer refresh
      autumn: -20, // Prepare for winter
      winter: -40  // Winter special
    }
    return discounts[season] || 0
  }

  getLoyaltyDiscount() {
    const orders = JSON.parse(localStorage.getItem('userOrders') || '[]')
    if (orders.length >= 10) return -100 // Loyal customer discount
    if (orders.length >= 5) return -50   // Regular customer discount
    return 0
  }

  // Smart Scheduling with AI optimization
  getOptimalSchedule(preferences = {}) {
    const now = new Date()
    const suggestions = []
    
    // AI analysis of optimal delivery times
    const optimalHours = {
      weekday: [9, 11, 15, 17], // Business hours
      weekend: [10, 14, 16]     // Relaxed weekend hours
    }
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date(now)
      date.setDate(date.getDate() + i)
      
      const isWeekend = date.getDay() === 0 || date.getDay() === 6
      const hours = isWeekend ? optimalHours.weekend : optimalHours.weekday
      
      hours.forEach(hour => {
        const score = this.calculateTimeSlotScore(date, hour, isWeekend)
        suggestions.push({
          date: date.toISOString().split('T')[0],
          time: `${hour.toString().padStart(2, '0')}:00`,
          day: date.toLocaleDateString('en-US', { weekday: 'short' }),
          score,
          discount: score > 80 ? 15 : score > 60 ? 10 : 0,
          reason: this.getScheduleReason(score, isWeekend)
        })
      })
    }
    
    // Sort by score and return top suggestions
    return suggestions.sort((a, b) => b.score - a.score).slice(0, 8)
  }

  calculateTimeSlotScore(date, hour, isWeekend) {
    let score = 50 // Base score
    
    // Prefer earlier bookings
    const daysAhead = Math.floor((date - new Date()) / (1000 * 60 * 60 * 24))
    score += Math.max(0, 30 - daysAhead * 3)
    
    // Weekend availability bonus
    if (isWeekend) score += 20
    
    // Optimal time slots
    if ([10, 11, 15, 16].includes(hour)) score += 15
    
    // Avoid rush hours
    if ([8, 9, 17, 18].includes(hour)) score -= 10
    
    return Math.min(100, Math.max(0, score))
  }

  getScheduleReason(score, isWeekend) {
    if (score > 80) return 'Optimal time slot with discount'
    if (score > 60) return isWeekend ? 'Weekend availability' : 'Good weekday slot'
    return 'Available slot'
  }
}

export const aiService = new AIService()