import { useState, useEffect } from 'react'
import { Brain, MessageCircle, Mic, TrendingUp, Users, Zap } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const AIAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    recommendations: {
      total: 0,
      accepted: 0,
      conversion: 0
    },
    chatbot: {
      totalQueries: 0,
      resolvedQueries: 0,
      topQuestions: []
    },
    voice: {
      totalCommands: 0,
      successfulCommands: 0,
      topCommands: []
    }
  })

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = () => {
    // Get data from localStorage
    const userBehavior = JSON.parse(localStorage.getItem('userBehavior') || '{}')
    const chatHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]')
    const voiceHistory = JSON.parse(localStorage.getItem('voiceCommandHistory') || '[]')

    // Calculate recommendation analytics
    const recommendationActions = userBehavior.actions?.filter(a => a.action === 'recommendation_clicked') || []
    const reminderActions = userBehavior.actions?.filter(a => a.action === 'reminder_acted') || []
    
    // Calculate chatbot analytics
    const botMessages = chatHistory.filter(msg => msg.sender === 'bot')
    const userMessages = chatHistory.filter(msg => msg.sender === 'user')
    
    // Get top questions
    const questionCounts = {}
    userMessages.forEach(msg => {
      const question = msg.message.toLowerCase()
      if (question.includes('order')) questionCounts['Order Status'] = (questionCounts['Order Status'] || 0) + 1
      else if (question.includes('price')) questionCounts['Pricing'] = (questionCounts['Pricing'] || 0) + 1
      else if (question.includes('service')) questionCounts['Services'] = (questionCounts['Services'] || 0) + 1
      else if (question.includes('time') || question.includes('hour')) questionCounts['Hours'] = (questionCounts['Hours'] || 0) + 1
      else questionCounts['Other'] = (questionCounts['Other'] || 0) + 1
    })

    const topQuestions = Object.entries(questionCounts)
      .map(([question, count]) => ({ question, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // Calculate voice analytics
    const successfulVoiceCommands = voiceHistory.filter(cmd => cmd.action !== null)
    const commandCounts = {}
    voiceHistory.forEach(cmd => {
      if (cmd.command.includes('book') || cmd.command.includes('order')) {
        commandCounts['Book Order'] = (commandCounts['Book Order'] || 0) + 1
      } else if (cmd.command.includes('status') || cmd.command.includes('track')) {
        commandCounts['Check Status'] = (commandCounts['Check Status'] || 0) + 1
      } else if (cmd.command.includes('wallet') || cmd.command.includes('recharge')) {
        commandCounts['Wallet'] = (commandCounts['Wallet'] || 0) + 1
      } else {
        commandCounts['Other'] = (commandCounts['Other'] || 0) + 1
      }
    })

    const topCommands = Object.entries(commandCounts)
      .map(([command, count]) => ({ command, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    setAnalytics({
      recommendations: {
        total: recommendationActions.length + reminderActions.length,
        accepted: recommendationActions.length + reminderActions.length,
        conversion: recommendationActions.length > 0 ? Math.round((recommendationActions.length / (recommendationActions.length + reminderActions.length)) * 100) : 0
      },
      chatbot: {
        totalQueries: userMessages.length,
        resolvedQueries: botMessages.length,
        topQuestions
      },
      voice: {
        totalCommands: voiceHistory.length,
        successfulCommands: successfulVoiceCommands.length,
        topCommands
      }
    })
  }

  const chartData = [
    { name: 'Recommendations', value: analytics.recommendations.total, color: '#3b82f6' },
    { name: 'Chatbot Queries', value: analytics.chatbot.totalQueries, color: '#10b981' },
    { name: 'Voice Commands', value: analytics.voice.totalCommands, color: '#f59e0b' }
  ]

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center">
          <Brain className="h-8 w-8 text-blue-600 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Analytics Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">Monitor AI features performance and user engagement</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <Zap className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">AI Recommendations</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.recommendations.total}</p>
              <p className="text-sm text-green-600">{analytics.recommendations.conversion}% conversion</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <MessageCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Chatbot Queries</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.chatbot.totalQueries}</p>
              <p className="text-sm text-green-600">{analytics.chatbot.resolvedQueries} resolved</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <Mic className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Voice Commands</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.voice.totalCommands}</p>
              <p className="text-sm text-green-600">{analytics.voice.successfulCommands} successful</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Feature Usage */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            AI Feature Usage
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Chatbot Questions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top Chatbot Questions
          </h3>
          <div className="space-y-3">
            {analytics.chatbot.topQuestions.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">{item.question}</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{item.count}</span>
              </div>
            ))}
            {analytics.chatbot.topQuestions.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">No chatbot data yet</p>
            )}
          </div>
        </div>

        {/* Voice Command Analytics */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Popular Voice Commands
          </h3>
          <div className="space-y-3">
            {analytics.voice.topCommands.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">{item.command}</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{item.count}</span>
              </div>
            ))}
            {analytics.voice.topCommands.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">No voice command data yet</p>
            )}
          </div>
        </div>

        {/* AI Performance Metrics */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            AI Performance Metrics
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">Recommendation Acceptance Rate</span>
              <span className="text-sm font-medium text-green-600">{analytics.recommendations.conversion}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">Chatbot Resolution Rate</span>
              <span className="text-sm font-medium text-green-600">
                {analytics.chatbot.totalQueries > 0 ? Math.round((analytics.chatbot.resolvedQueries / analytics.chatbot.totalQueries) * 100) : 0}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">Voice Command Success Rate</span>
              <span className="text-sm font-medium text-green-600">
                {analytics.voice.totalCommands > 0 ? Math.round((analytics.voice.successfulCommands / analytics.voice.totalCommands) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          💡 AI Insights & Recommendations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">Recommendation Engine</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {analytics.recommendations.total > 0 
                ? `Great! Users are engaging with AI recommendations. ${analytics.recommendations.conversion}% conversion rate shows good relevance.`
                : 'Start using the service to generate AI recommendations based on user behavior.'
              }
            </p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h4 className="font-medium text-green-900 dark:text-green-200 mb-2">Chatbot Performance</h4>
            <p className="text-sm text-green-700 dark:text-green-300">
              {analytics.chatbot.totalQueries > 0
                ? `Chatbot is handling ${analytics.chatbot.totalQueries} queries. Consider expanding responses for better coverage.`
                : 'Chatbot is ready to handle customer queries 24/7.'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIAnalytics