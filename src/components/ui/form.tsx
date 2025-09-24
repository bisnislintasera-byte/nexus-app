"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

const formVariants = cva("space-y-4", {
  variants: {
    variant: {
      default: "",
      card: "rounded-lg border bg-card p-6 shadow-sm",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

interface FormFieldProps {
  id: string
  label: string
  error?: string
  success?: boolean
  isValidating?: boolean
  helperText?: string
  children: React.ReactNode
}

const FormField = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & FormFieldProps
>(({ id, label, error, success, isValidating, helperText, children, className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("space-y-2", className)} {...props}>
      <Label htmlFor={id}>{label}</Label>
      {React.isValidElement(children) && children.type === Input
        ? React.cloneElement(children as React.ReactElement<any>, {
            id,
            error: !!error,
            success,
            isValidating,
            errorMessage: error,
          })
        : React.isValidElement(children) && children.type === Textarea
        ? React.cloneElement(children as React.ReactElement<any>, {
            id,
            error: !!error,
            success,
            isValidating,
            errorMessage: error,
          })
        : children}
      {helperText && !error && (
        <p className="mt-1 text-sm text-muted-foreground">{helperText}</p>
      )}
    </div>
  )
})
FormField.displayName = "FormField"

const FormActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col sm:flex-row sm:justify-end gap-2 pt-4", className)}
    {...props}
  />
))
FormActions.displayName = "FormActions"

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & VariantProps<typeof formVariants>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm", className)}
    {...props}
  />
))
FormMessage.displayName = "FormMessage"

export { FormField, FormActions, FormMessage, formVariants }
