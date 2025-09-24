'use client';

import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, ChevronDown } from "lucide-react";

interface DataTableProps<T> {
  data: T[];
  columns: {
    key: string;
    title: string;
    render?: (item: T) => React.ReactNode;
    sortable?: boolean;
    priority?: number; // 1 = always show, 2 = show on tablet+, 3 = show on desktop
    mobileLabel?: boolean; // Whether to show the column title as a label on mobile
  }[];
  actions?: {
    label: string;
    onClick: (item: T) => void;
    icon?: React.ReactNode;
  }[];
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (column: string) => void;
  className?: string;
}

export function DataTable<T>({
  data,
  columns,
  actions,
  sortColumn,
  sortDirection,
  onSort,
  className
}: DataTableProps<T>) {
  return (
    <div className={cn("w-full overflow-auto", className)}>
      {/* Desktop and Tablet View */}
      <table className="hidden sm:table w-full">
        <thead>
          <tr className="border-b">
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  "h-12 px-4 text-left align-middle font-medium text-muted-foreground",
                  column.priority === 2 && "hidden md:table-cell",
                  column.priority === 3 && "hidden lg:table-cell",
                  column.sortable && "cursor-pointer select-none"
                )}
                onClick={() => column.sortable && onSort?.(column.key)}
              >
                <div className="flex items-center gap-1">
                  {column.title}
                  {column.sortable && sortColumn === column.key && (
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        sortDirection === 'desc' && "rotate-180"
                      )}
                    />
                  )}
                </div>
              </th>
            ))}
            {actions && <th className="w-[100px]" />}
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr
              key={i}
              className="border-b transition-colors hover:bg-muted/50"
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={cn(
                    "p-4",
                    column.priority === 2 && "hidden md:table-cell",
                    column.priority === 3 && "hidden lg:table-cell"
                  )}
                >
                  {column.render
                    ? column.render(item)
                    : (item as any)[column.key]}
                </td>
              ))}
              {actions && (
                <td className="p-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {actions.map((action, i) => (
                        <DropdownMenuItem
                          key={i}
                          onClick={() => action.onClick(item)}
                        >
                          {action.icon}
                          {action.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile View */}
      <div className="sm:hidden space-y-4">
        {data.map((item, i) => (
          <div
            key={i}
            className="border rounded-lg p-4 space-y-3"
          >
            {columns.map((column) => (
              <div key={column.key}>
                {column.mobileLabel && (
                  <span className="text-sm font-medium text-muted-foreground">
                    {column.title}:
                  </span>
                )}
                <div className={cn(
                  column.mobileLabel && "mt-1",
                  "text-sm"
                )}>
                  {column.render
                    ? column.render(item)
                    : (item as any)[column.key]}
                </div>
              </div>
            ))}
            {actions && (
              <div className="flex gap-2 mt-3 pt-3 border-t">
                {actions.map((action, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => action.onClick(item)}
                  >
                    {action.icon}
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}