import React from 'react'

const FeatureCard = ({ icon: Icon, title, description, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 border-blue-200',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-600 border-green-200',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 border-purple-200',
    orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 border-orange-200'
  }

  return (
    <div className={`p-6 rounded-xl border transition-all hover:shadow-lg hover:scale-105 ${colorClasses[color]}`}>
      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-white/50 mb-4">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  )
}

export default FeatureCard