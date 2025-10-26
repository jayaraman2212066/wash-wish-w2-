// Chatbot Service for 24/7 Support
class ChatbotService {
  constructor() {
    this.responses = this.initializeResponses()
    this.chatHistory = this.getChatHistory()
  }

  getChatHistory() {
    return JSON.parse(localStorage.getItem('chatHistory') || '[]')
  }

  saveChatHistory(history) {
    localStorage.setItem('chatHistory', JSON.stringify(history))
  }

  initializeResponses() {
    return {
      greetings: [
        "Hello! I'm your WashWish assistant. How can I help you today?",
        "Hi there! Welcome to WashWish. What can I do for you?",
        "Hey! I'm here to help with your laundry needs. What's up?"
      ],
      orderStatus: [
        "Let me check your order status for you.",
        "I'll look up your recent orders right away.",
        "Checking your order details now..."
      ],
      pricing: [
        "Here are our current pricing details:",
        "Let me share our service rates with you:",
        "Our pricing is very competitive:"
      ],
      services: [
        "We offer a wide range of laundry services:",
        "Here's what we can do for you:",
        "Our services include:"
      ],
      hours: [
        "We're available 24/7 for pickup and delivery!",
        "Our service hours are: 6 AM - 10 PM daily",
        "We operate round the clock for your convenience"
      ],
      contact: [
        "You can reach us at support@washwish.com or +91-9876543210",
        "Contact us: support@washwish.com | Phone: +91-9876543210",
        "Get in touch: Email support@washwish.com or call +91-9876543210"
      ]
    }
  }

  async processQuery(userMessage, userId) {
    const message = userMessage.toLowerCase().trim()
    let response = { text: '', type: 'text', actions: [] }

    // Save user message to history
    this.addToHistory(userId, userMessage, 'user')

    // Intent detection
    if (this.matchesIntent(message, ['hello', 'hi', 'hey', 'start'])) {
      response.text = this.getRandomResponse('greetings')
      response.actions = [
        { text: 'Check Order Status', action: 'order_status' },
        { text: 'View Pricing', action: 'pricing' },
        { text: 'Our Services', action: 'services' }
      ]
    }
    else if (this.matchesIntent(message, ['order', 'status', 'track', 'where'])) {
      response = await this.handleOrderStatus(userId)
    }
    else if (this.matchesIntent(message, ['price', 'cost', 'rate', 'charge'])) {
      response = this.handlePricing()
    }
    else if (this.matchesIntent(message, ['service', 'what', 'offer', 'do'])) {
      response = this.handleServices()
    }
    else if (this.matchesIntent(message, ['hour', 'time', 'when', 'open'])) {
      response.text = this.getRandomResponse('hours')
    }
    else if (this.matchesIntent(message, ['contact', 'phone', 'email', 'support'])) {
      response.text = this.getRandomResponse('contact')
    }
    else if (this.matchesIntent(message, ['invoice', 'bill', 'receipt'])) {
      response = await this.handleInvoice(userId)
    }
    else if (this.matchesIntent(message, ['wallet', 'balance', 'recharge'])) {
      response = await this.handleWallet(userId)
    }
    else {
      response.text = "I'm not sure I understand. Can you please rephrase your question? You can ask about orders, pricing, services, or contact information."
      response.actions = [
        { text: 'Order Status', action: 'order_status' },
        { text: 'Pricing Info', action: 'pricing' },
        { text: 'Contact Support', action: 'contact' }
      ]
    }

    // Save bot response to history
    this.addToHistory(userId, response.text, 'bot')
    
    return response
  }

  matchesIntent(message, keywords) {
    return keywords.some(keyword => message.includes(keyword))
  }

  getRandomResponse(category) {
    const responses = this.responses[category]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  async handleOrderStatus(userId) {
    const orders = JSON.parse(localStorage.getItem('userOrders') || '[]')
    
    if (orders.length === 0) {
      return {
        text: "You don't have any orders yet. Would you like to create your first order?",
        type: 'text',
        actions: [{ text: 'Create Order', action: 'create_order' }]
      }
    }

    const recentOrder = orders[orders.length - 1]
    return {
      text: `Your recent order ${recentOrder.orderNumber} is currently ${recentOrder.status}. ${this.getStatusMessage(recentOrder.status)}`,
      type: 'order_status',
      data: recentOrder,
      actions: [
        { text: 'View Details', action: 'view_order' },
        { text: 'Track Order', action: 'track_order' }
      ]
    }
  }

  getStatusMessage(status) {
    const messages = {
      'pending': 'We\'ll pick it up soon!',
      'picked_up': 'Your items are on their way to our facility.',
      'in_process': 'We\'re taking great care of your items.',
      'washed': 'Cleaning complete! Now moving to finishing.',
      'ironed': 'Almost ready! Final quality check in progress.',
      'ready_for_delivery': 'All set! We\'ll deliver soon.',
      'delivered': 'Delivered! Hope you\'re satisfied with our service.'
    }
    return messages[status] || 'Status updated.'
  }

  handlePricing() {
    return {
      text: "Here are our competitive rates:\n• Shirt: ₹100\n• T-Shirt: ₹80\n• Pants: ₹120\n• Jeans: ₹100\n• Suit: ₹400\n• Saree: ₹200\n\nWe also offer subscription plans with up to 30% savings!",
      type: 'pricing',
      actions: [
        { text: 'View All Prices', action: 'full_pricing' },
        { text: 'Subscription Plans', action: 'subscriptions' }
      ]
    }
  }

  handleServices() {
    return {
      text: "We offer comprehensive laundry services:\n• Regular Wash & Iron\n• Dry Cleaning\n• Premium Care\n• Stain Removal\n• Express Service (24-hour)\n• Subscription Plans\n• Pickup & Delivery",
      type: 'services',
      actions: [
        { text: 'Book Service', action: 'create_order' },
        { text: 'Learn More', action: 'service_details' }
      ]
    }
  }

  async handleInvoice(userId) {
    const orders = JSON.parse(localStorage.getItem('userOrders') || '[]')
    
    if (orders.length === 0) {
      return {
        text: "You don't have any orders yet, so no invoices to show.",
        type: 'text'
      }
    }

    return {
      text: "I can help you with invoices. Would you like to download your latest invoice or view all invoices?",
      type: 'invoice',
      actions: [
        { text: 'Latest Invoice', action: 'latest_invoice' },
        { text: 'All Invoices', action: 'all_invoices' }
      ]
    }
  }

  async handleWallet(userId) {
    const walletData = JSON.parse(localStorage.getItem('washwish_wallet') || '{"balance": 0}')
    
    return {
      text: `Your current wallet balance is ₹${walletData.balance}. Would you like to recharge your wallet?`,
      type: 'wallet',
      data: walletData,
      actions: [
        { text: 'Recharge Wallet', action: 'recharge_wallet' },
        { text: 'Transaction History', action: 'wallet_history' }
      ]
    }
  }

  addToHistory(userId, message, sender) {
    const history = this.getChatHistory()
    history.push({
      userId,
      message,
      sender,
      timestamp: new Date().toISOString()
    })
    
    // Keep only last 50 messages
    if (history.length > 50) {
      history.splice(0, history.length - 50)
    }
    
    this.saveChatHistory(history)
  }

  getChatHistoryForUser(userId) {
    return this.chatHistory.filter(chat => chat.userId === userId)
  }
}

export const chatbotService = new ChatbotService()