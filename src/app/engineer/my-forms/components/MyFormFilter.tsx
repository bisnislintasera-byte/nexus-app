'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Filter } from 'lucide-react'
import { FormStatus } from '../hooks/useFormManagement'

interface FilterProps {
  selectedStatus: FormStatus
  onStatusChange: (status: FormStatus) => void
  counts: {
    all: number;
    pending: number;
    approved: number;
    rejected: number;
  }
}

const statusOptions: Array<{ label: string; value: FormStatus }> = [
  { label: 'All', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Rejected', value: 'REJECTED' }
]

export function MyFormFilter({ selectedStatus, onStatusChange }: FilterProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h1 className="text-2xl font-semibold">My Forms</h1>
      
      <div className="w-full sm:w-auto">
        {/* Desktop View */}
        <div className="hidden sm:flex items-center space-x-2">
          {statusOptions.map((option) => (
            <Button
              key={option.value}
              variant={selectedStatus === option.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => onStatusChange(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>

        {/* Mobile View */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="w-full sm:hidden">
            <Button variant="outline" className="w-full justify-between">
              <span className="flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                {statusOptions.find((opt) => opt.value === selectedStatus)?.label || 'Filter Status'}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            {statusOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => onStatusChange(option.value)}
                className="cursor-pointer"
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}