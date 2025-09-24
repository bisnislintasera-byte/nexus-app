'use client';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FormLayoutProps {
  children: React.ReactNode;
  className?: string;
  sidebar?: React.ReactNode;
  actions?: React.ReactNode;
  title?: string;
  description?: string;
}

export function FormLayout({
  children,
  className,
  sidebar,
  actions,
  title,
  description,
}: FormLayoutProps) {
  return (
    <div className={cn(
      "container mx-auto px-4 py-6 md:py-8",
      "min-h-[calc(100vh-4rem)]", // Account for header
      className
    )}>
      <Card className="w-full">
        <div className="flex flex-col lg:flex-row">
          {/* Sidebar - collapses to top on mobile */}
          {sidebar && (
            <div className="lg:w-64 p-4 lg:p-6 border-b lg:border-b-0 lg:border-r">
              {sidebar}
            </div>
          )}

          {/* Main content */}
          <div className="flex-1">
            {/* Header */}
            {(title || description) && (
              <div className="p-4 lg:p-6 border-b bg-muted/10">
                {title && (
                  <h1 className="text-xl font-semibold text-foreground">
                    {title}
                  </h1>
                )}
                {description && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {description}
                  </p>
                )}
              </div>
            )}

            {/* Form content */}
            <div className="p-4 lg:p-6 space-y-6">
              {children}
            </div>

            {/* Actions */}
            {actions && (
              <div className="sticky bottom-0 p-4 lg:p-6 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
                  {actions}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}