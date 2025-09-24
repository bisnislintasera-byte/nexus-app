"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  mobileClassName?: string;
  desktopClassName?: string;
}

const ResponsiveContainer = ({
  children,
  className,
  mobileClassName,
  desktopClassName,
}: ResponsiveContainerProps) => {
  return (
    <div
      className={cn(
        "w-full", 
        className,
        "max-sm:", mobileClassName,
        "min-[640px]:", desktopClassName
      )}
    >
      {children}
    </div>
  );
};

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  mobileColumns?: number;
  desktopColumns?: number;
  gap?: number | string;
}

const ResponsiveGrid = ({
  children,
  className,
  mobileColumns = 1,
  desktopColumns = 3,
  gap = 4,
}: ResponsiveGridProps) => {
  return (
    <div
      className={cn(
        "grid",
        `grid-cols-${mobileColumns} sm:grid-cols-${desktopColumns}`,
        `gap-${gap}`,
        className
      )}
    >
      {children}
    </div>
  );
};

interface ResponsiveCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  actions?: React.ReactNode;
  mobileFullWidth?: boolean;
}

const ResponsiveCard = ({
  children,
  className,
  title,
  actions,
  mobileFullWidth = true,
}: ResponsiveCardProps) => {
  return (
    <div
      className={cn(
        "bg-white rounded-lg border border-gray-200 shadow-sm",
        mobileFullWidth && "w-full",
        className
      )}
    >
      {(title || actions) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border-b border-gray-200">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          )}
          {actions && <div className="mt-2 sm:mt-0">{actions}</div>}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
};

interface ResponsiveButtonGroupProps {
  children: React.ReactNode;
  className?: string;
  verticalOnMobile?: boolean;
}

const ResponsiveButtonGroup = ({
  children,
  className,
  verticalOnMobile = true,
}: ResponsiveButtonGroupProps) => {
  return (
    <div
      className={cn(
        "flex gap-2",
        verticalOnMobile && "flex-col sm:flex-row",
        className
      )}
    >
      {children}
    </div>
  );
};

export {
  ResponsiveContainer,
  ResponsiveGrid,
  ResponsiveCard,
  ResponsiveButtonGroup,
};