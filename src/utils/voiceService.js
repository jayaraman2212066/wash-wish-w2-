// Voice Command Service
class VoiceService {
  constructor() {
    this.isListening = false
    this.recognition = null
    this.synthesis = window.speechSynthesis
    this.initSpeechRecognition()
  }

  initSpeechRecognition() {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new webkitSpeechRecognition()
    } else if ('SpeechRecognition' in window) {
      this.recognition = new SpeechRecognition()
    }

    if (this.recognition) {
      this.recognition.continuous = false
      this.recognition.interimResults = false
      this.recognition.lang = 'en-US'
    }
  }

  async startListening() {
    if (!this.recognition) {
      throw new Error('Speech recognition not supported')
    }

    return new Promise((resolve, reject) => {
      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        resolve(transcript)
      }

      this.recognition.onerror = (event) => {
        reject(new Error(`Speech recognition error: ${event.error}`))
      }

      this.recognition.onend = () => {
        this.isListening = false
      }

      this.isListening = true
      this.recognition.start()
    })
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
      this.isListening = false
    }
  }

  speak(text) {
    if (this.synthesis) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 0.8
      this.synthesis.speak(utterance)
    }
  }

  async processVoiceCommand(transcript, userId) {
    const command = transcript.toLowerCase().trim()
    let response = { text: '', action: null, data: null }

    // Intent parsing
    if (this.matchesIntent(command, ['book', 'schedule', 'pickup', 'order'])) {
      response = await this.handleBookingCommand(command, userId)
    }
    else if (this.matchesIntent(command, ['status', 'track', 'where', 'order'])) {
      response = await this.handleStatusCommand(userId)
    }
    else if (this.matchesIntent(command, ['wallet', 'recharge', 'balance'])) {
      response = await this.handleWalletCommand(command, userId)
    }
    else if (this.matchesIntent(command, ['invoice', 'bill', 'receipt'])) {
      response = await this.handleInvoiceCommand(userId)
    }
    else if (this.matchesIntent(command, ['help', 'what', 'can', 'do'])) {
      response = this.handleHelpCommand()
    }
    else {
      response.text = "I didn't understand that command. You can say things like 'book pickup', 'check order status', or 'recharge wallet'."
    }

    // Save command to history
    this.saveCommandHistory(userId, transcript, response)

    return response
  }

  matchesIntent(command, keywords) {
    return keywords.some(keyword => command.includes(keyword))
  }

  async handleBookingCommand(command, userId) {
    // Extract time if mentioned
    const timeMatch = command.match(/(\d{1,2})\s*(am|pm|o'clock)/i)
    const dateMatch = command.match(/(today|tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i)
    
    let suggestedTime = '10:00 AM'
    let suggestedDate = 'tomorrow'
    
    if (timeMatch) {
      suggestedTime = `${timeMatch[1]} ${timeMatch[2].toUpperCase()}`
    }
    if (dateMatch) {
      suggestedDate = dateMatch[1].toLowerCase()
    }

    return {
      text: `I'll help you book a pickup for ${suggestedDate} at ${suggestedTime}. Opening the order form now.`,
      action: 'create_order',
      data: { suggestedTime, suggestedDate }
    }
  }

  async handleStatusCommand(userId) {
    const orders = JSON.parse(localStorage.getItem('userOrders') || '[]')
    
    if (orders.length === 0) {
      return {
        text: "You don't have any orders yet. Would you like to create your first order?",
        action: 'create_order'
      }
    }

    const recentOrder = orders[orders.length - 1]
    return {
      text: `Your recent order ${recentOrder.orderNumber} is currently ${recentOrder.status.replace('_', ' ')}.`,
      action: 'view_order',
      data: recentOrder
    }
  }

  async handleWalletCommand(command, userId) {
    const walletData = JSON.parse(localStorage.getItem('washwish_wallet') || '{"balance": 0}')
    
    if (command.includes('recharge')) {
      // Extract amount if mentioned
      const amountMatch = command.match(/(\d+)/);
      const amount = amountMatch ? amountMatch[1] : '500'
      
      return {
        text: `I'll help you recharge your wallet with ₹${amount}. Your current balance is ₹${walletData.balance}.`,
        action: 'recharge_wallet',
        data: { amount: parseInt(amount) }
      }
    } else {
      return {
        text: `Your current wallet balance is ₹${walletData.balance}.`,
        action: 'view_wallet',
        data: walletData
      }
    }
  }

  async handleInvoiceCommand(userId) {
    const orders = JSON.parse(localStorage.getItem('userOrders') || '[]')
    
    if (orders.length === 0) {
      return {
        text: "You don't have any orders yet, so no invoices to show.",
        action: null
      }
    }

    return {
      text: "I'll show you your latest invoice.",
      action: 'view_invoice',
      data: { orderId: orders[orders.length - 1].id }
    }
  }

  handleHelpCommand() {
    return {
      text: "I can help you with voice commands like: 'Book pickup for tomorrow', 'Check my order status', 'Recharge wallet 500 rupees', or 'Show my invoice'.",
      action: null
    }
  }

  saveCommandHistory(userId, command, response) {
    const history = JSON.parse(localStorage.getItem('voiceCommandHistory') || '[]')
    history.push({
      userId,
      command,
      response: response.text,
      action: response.action,
      timestamp: new Date().toISOString()
    })
    
    // Keep only last 50 commands
    if (history.length > 50) {
      history.splice(0, history.length - 50)
    }
    
    localStorage.setItem('voiceCommandHistory', JSON.stringify(history))
  }

  getCommandHistory(userId) {
    const history = JSON.parse(localStorage.getItem('voiceCommandHistory') || '[]')
    return history.filter(cmd => cmd.userId === userId)
  }
}

export const voiceService = new VoiceService()