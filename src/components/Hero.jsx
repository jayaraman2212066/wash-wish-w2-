import React from 'react'
import { Sparkles, Clock, Shield, Truck } from 'lucide-react'

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 mb-8 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-40 h-40 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-0 left-20 w-40 h-40 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Content */}
        <div>
          <div className="flex items-center mb-4">
            <Sparkles className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              WashWish
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            Professional laundry service at your doorstep. Fresh, clean, and delivered with care.
          </p>
          
          {/* Features */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-sm text-gray-600 dark:text-gray-300">24-48 Hours</span>
            </div>
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-sm text-gray-600 dark:text-gray-300">100% Safe</span>
            </div>
            <div className="flex items-center">
              <Truck className="h-5 w-5 text-purple-600 mr-2" />
              <span className="text-sm text-gray-600 dark:text-gray-300">Free Pickup</span>
            </div>
            <div className="flex items-center">
              <Sparkles className="h-5 w-5 text-pink-600 mr-2" />
              <span className="text-sm text-gray-600 dark:text-gray-300">Premium Quality</span>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=400&fit=crop&crop=center"
            alt="Laundry Service"
            className="rounded-xl shadow-2xl w-full h-80 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
        </div>
      </div>
    </div>
  )
}

export default Hero