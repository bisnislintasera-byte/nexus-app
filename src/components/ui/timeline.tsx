import { ReactNode } from 'react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { cn } from '@/lib/utils'

interface TimelineProps {
  children: ReactNode
  className?: string
}

interface TimelineItemProps {
  children: ReactNode
  className?: string
  icon?: ReactNode
  time?: Date | string
  active?: boolean
}

interface TimelineDayProps {
  date: Date
  children: ReactNode
  className?: string
}

export function Timeline({ children, className }: TimelineProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {children}
    </div>
  )
}

export function TimelineDay({ date, children, className }: TimelineDayProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm px-4 py-2 -mx-4">
        <h3 className="font-medium text-gray-500">
          {format(new Date(date), 'd MMMM yyyy', { locale: id })}
        </h3>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  )
}

export function TimelineItem({ 
  children, 
  className, 
  icon, 
  time,
  active = false 
}: TimelineItemProps) {
  return (
    <div className={cn('relative', className)}>
      {/* Timeline line */}
      <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200"></div>
      
      <div className="flex gap-4">
        {/* Icon */}
        <div 
          className={cn(
            "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2",
            active 
              ? "border-blue-500 bg-blue-50" 
              : "border-gray-200 bg-white"
          )}
        >
          {icon}
        </div>
        
        {/* Content */}
        <div className="flex-1 bg-white rounded-lg border border-gray-200 p-4">
          {children}
          
          {/* Timestamp */}
          {time && (
            <div className="mt-2 text-xs text-gray-500">
              {format(new Date(time), 'HH:mm:ss', { locale: id })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Re-export
export { Timeline as Root, TimelineDay as Day, TimelineItem as Item }