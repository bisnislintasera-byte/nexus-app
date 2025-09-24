'use client'

import React from 'react'
import { Clock, CheckCircle, XCircle } from 'lucide-react'

interface StatusBadgeProps {
  status: string
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let className = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'
  let icon
  let text

  switch (status) {
    case 'PENDING':
      className += ' bg-yellow-100 text-yellow-800'
      icon = <Clock className="mr-1 h-3 w-3" />
      text = 'Pending'
      break
    case 'APPROVED':
      className += ' bg-green-100 text-green-800'
      icon = <CheckCircle className="mr-1 h-3 w-3" />
      text = 'Approved'
      break
    case 'REJECTED':
      className += ' bg-red-100 text-red-800'
      icon = <XCircle className="mr-1 h-3 w-3" />
      text = 'Rejected'
      break
    default:
      className += ' bg-gray-100 text-gray-800'
      text = 'Unknown'
  }

  return (
    <span className={className}>
      {icon}
      {text}
    </span>
  )
}

export { StatusBadge }