"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
  success?: boolean
  errorMessage?: string
  isValidating?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, success, errorMessage, isValidating, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative">
          <textarea
            className={cn(
              "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
              error && "border-destructive bg-destructive/10 focus-visible:ring-destructive/50",
              success && "border-green-500 bg-green-500/10 focus-visible:ring-green-500/50",
              isValidating && "border-blue-500 focus-visible:ring-blue-500/50",
              className
            )}
            ref={ref}
            {...props}
          />
          {isValidating && (
            <div className="absolute right-3 bottom-3">
              <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
        {errorMessage && (
          <p className="mt-1 text-sm text-destructive animate-in fade-in-0 slide-in-from-bottom-1 duration-200">
            {errorMessage}
          </p>
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
