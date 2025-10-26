import React from 'react'

const EmptyState = ({ icon: Icon, title, description, action }) => {
  return (
    <div className="text-center py-12">
      <div className="relative mb-6">
        <img
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop&crop=center&auto=format"
          alt="Empty state"
          className="mx-auto w-48 h-32 object-cover rounded-lg opacity-50"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className="h-16 w-16 text-gray-400" />
        </div>
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">{description}</p>
      {action}
    </div>
  )
}

export default EmptyState