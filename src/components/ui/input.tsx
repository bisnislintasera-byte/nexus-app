"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  success?: boolean
  errorMessage?: string
  isValidating?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, success, errorMessage, isValidating, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative">
          <input
            type={type}
            className={cn(
              "flex h-11 w-full rounded-lg border border-input bg-background px-4 py-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 hover:border-ring/50",
              error && "border-destructive bg-destructive/10 focus-visible:ring-destructive/50",
              success && "border-green-500 bg-green-500/10 focus-visible:ring-green-500/50",
              isValidating && "border-blue-500 focus-visible:ring-blue-500/50",
              className
            )}
            ref={ref}
            {...props}
          />
          {isValidating && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
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
Input.displayName = "Input"

export { Input }
