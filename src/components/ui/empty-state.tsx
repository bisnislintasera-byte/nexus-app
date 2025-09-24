import { cn } from "@/lib/utils"
import { Inbox } from "lucide-react"

interface EmptyStateProps {
  title: string
  description: string
  icon?: React.ReactNode
  className?: string
}

export function EmptyState({
  title,
  description,
  icon = <Inbox className="h-12 w-12 text-gray-400" />,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("text-center py-12", className)}>
      <div className="mx-auto h-12 w-12 text-gray-400">{icon}</div>
      <h3 className="mt-2 text-sm font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
  )
}
