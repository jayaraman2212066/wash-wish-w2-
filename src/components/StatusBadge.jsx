import React from 'react'
import { CheckCircle, Clock, Package, Truck, Sparkles } from 'lucide-react'

const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { 
      icon: Clock, 
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      label: 'Pending'
    },
    picked_up: { 
      icon: Package, 
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      label: 'Picked Up'
    },
    in_process: { 
      icon: Sparkles, 
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      label: 'In Process'
    },
    washed: { 
      icon: Sparkles, 
      color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      label: 'Washed'
    },
    ready_for_delivery: { 
      icon: Truck, 
      color: 'bg-orange-100 text-orange-800 border-orange-200',
      label: 'Ready'
    },
    delivered: { 
      icon: CheckCircle, 
      color: 'bg-green-100 text-green-800 border-green-200',
      label: 'Delivered'
    }
  }

  const config = statusConfig[status] || statusConfig.pending
  const Icon = config.icon

  return (
    <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${config.color}`}>
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
    </span>
  )
}

export default StatusBadge