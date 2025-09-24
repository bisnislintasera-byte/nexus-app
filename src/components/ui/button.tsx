"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform active:transition-none data-[ripple]:overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-md hover:bg-primary/90 focus:ring-primary/50 active:bg-primary/80 hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg data-[state='open']:bg-primary/90 aria-disabled:opacity-50 aria-disabled:pointer-events-none",
        destructive:
          "bg-destructive text-destructive-foreground shadow-md hover:bg-destructive/90 focus:ring-destructive/50 active:bg-destructive/80 hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg data-[state='open']:bg-destructive/90 aria-disabled:opacity-50 aria-disabled:pointer-events-none",
        outline:
          "border border-input bg-background shadow-md hover:bg-accent hover:text-accent-foreground focus:ring-accent active:bg-accent/80 hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg data-[state='open']:bg-accent aria-disabled:opacity-50 aria-disabled:pointer-events-none",
        secondary:
          "bg-secondary text-secondary-foreground shadow-md hover:bg-secondary/80 focus:ring-secondary/50 active:bg-secondary/70 hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg data-[state='open']:bg-secondary/80 aria-disabled:opacity-50 aria-disabled:pointer-events-none",
        ghost: "hover:bg-accent hover:text-accent-foreground focus:ring-accent active:bg-accent/80 hover:scale-[1.02] active:scale-[0.98] data-[state='open']:bg-accent aria-disabled:opacity-50 aria-disabled:pointer-events-none",
        link: "text-primary underline-offset-4 hover:underline focus:ring-primary/50 active:text-primary/80 hover:scale-[1.02] data-[state='open']:underline aria-disabled:opacity-50 aria-disabled:pointer-events-none",
        success:
          "bg-success text-success-foreground shadow-md hover:bg-success/90 focus:ring-success/50 active:bg-success/80 hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg data-[state='open']:bg-success/90 aria-disabled:opacity-50 aria-disabled:pointer-events-none",
        warning:
          "bg-warning text-warning-foreground shadow-md hover:bg-warning/90 focus:ring-warning/50 active:bg-warning/80 hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg data-[state='open']:bg-warning/90 aria-disabled:opacity-50 aria-disabled:pointer-events-none",
        info:
          "bg-info text-info-foreground shadow-md hover:bg-info/90 focus:ring-info/50 active:bg-info/80 hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg data-[state='open']:bg-info/90 aria-disabled:opacity-50 aria-disabled:pointer-events-none",
        // New variants
        gradient:
          "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-md hover:opacity-90 focus:ring-primary/50 active:opacity-80 hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg data-[state='open']:opacity-90 aria-disabled:opacity-50 aria-disabled:pointer-events-none",
        shimmer:
          "bg-gradient-to-r from-primary/80 to-primary text-primary-foreground shadow-md relative overflow-hidden hover:from-primary/90 hover:to-primary focus:ring-primary/50 active:from-primary/70 active:to-primary/90 hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg data-[state='open']:from-primary/90 aria-disabled:opacity-50 aria-disabled:pointer-events-none",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
        xs: "h-6 rounded-xs px-2 text-xs",
        xl: "h-12 rounded-lg px-10 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // Add shimmer effect for the shimmer variant
    const shimmerEffect = variant === "shimmer" ? (
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="h-full w-1/3 bg-white/30 blur-[10px] animate-shimmer"></span>
      </span>
    ) : null
    
    // Ripple effect implementation
    const handleRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
      const button = e.currentTarget;
      const ripple = document.createElement("span");
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.6);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
      `;
      
      button.dataset.ripple = "true";
      button.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
        if (button.childElementCount === 1) { // Only the original children remain
          delete button.dataset.ripple;
        }
      }, 600);
    };
    
    // Enhanced accessibility props
    const accessibilityProps = {
      'aria-busy': loading,
      'aria-disabled': props.disabled || loading,
      tabIndex: props.disabled || loading ? -1 : 0,
      role: asChild ? undefined : 'button',
    };
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={loading || props.disabled}
        onClick={(e) => {
          if (!props.disabled && !loading && variant !== "link") {
            handleRipple(e);
          }
          props.onClick?.(e);
        }}
        onKeyDown={(e) => {
          // Trigger ripple effect on Space or Enter key press
          if ((e.key === " " || e.key === "Enter") && !props.disabled && !loading && variant !== "link") {
            const fakeEvent = {
              currentTarget: e.currentTarget,
              clientX: e.currentTarget.getBoundingClientRect().left + e.currentTarget.offsetWidth / 2,
              clientY: e.currentTarget.getBoundingClientRect().top + e.currentTarget.offsetHeight / 2
            } as React.MouseEvent<HTMLButtonElement>;
            handleRipple(fakeEvent);
          }
          // Allow Space key to trigger button click (default behavior is already handled by browser)
          props.onKeyDown?.(e);
        }}
        {...accessibilityProps}
        {...props}
      >
        {loading ? (
          <>
            <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" aria-hidden="true"></span>
            <span>{children}</span>
          </>
        ) : (
          <>
            {shimmerEffect}
            {children}
          </>
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
