"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

export interface BackButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Size variant of the button
   * @default "default"
   */
  size?: "sm" | "default" | "lg";
  /**
   * Style variant of the button
   * @default "secondary"
   */
  variant?: "ghost" | "secondary" | "outline";
  /**
   * Optional custom text for the button
   * @default "Kembali"
   */
  text?: string;
  /**
   * Optional custom icon to replace the default ArrowLeft
   */
  icon?: React.ElementType;
  /**
   * Whether to show the icon
   * @default true
   */
  showIcon?: boolean;
}

const BackButton = React.forwardRef<HTMLButtonElement, BackButtonProps>(
  ({ 
    className, 
    size = "default", 
    variant = "secondary", 
    text = "Kembali", 
    icon: IconComponent = ArrowLeft,
    showIcon = true,
    onClick,
    ...props 
  }, ref) => {
    const router = useRouter();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      if (!e.defaultPrevented) {
        router.back();
      }
    };

    // Determine classes based on size and variant props
    const sizeClasses = 
      size === "sm" ? "px-3 py-1.5 text-sm" : 
      size === "lg" ? "px-5 py-2.5 text-lg" : 
      "px-4 py-2 text-sm";

    const variantClasses = 
      variant === "ghost" 
        ? "hover:bg-accent hover:text-accent-foreground border-transparent bg-transparent dark:hover:bg-accent dark:hover:text-accent-foreground" :
      variant === "outline" 
        ? "border border-input bg-background hover:bg-accent hover:text-accent-foreground dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:hover:text-white" :
      // secondary variant (default)
      "bg-secondary text-secondary-foreground hover:bg-secondary/80 border-transparent dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600";

    return (
      <button
        ref={ref}
        onClick={handleClick}
        className={cn(
          "inline-flex items-center gap-2 rounded-lg transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          sizeClasses,
          variantClasses,
          className
        )}
        {...props}
      >
        {showIcon && <IconComponent className="h-4 w-4" />}
        {text}
      </button>
    );
  }
);

BackButton.displayName = "BackButton";

export { BackButton };