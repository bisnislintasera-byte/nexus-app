"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";

interface ColumnDef<T> {
  id: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  className?: string;
}

interface StandardTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  isLoading?: boolean;
  emptyState?: {
    title: string;
    description: string;
    icon?: React.ReactNode;
  };
  className?: string;
  onRowClick?: (row: T) => void;
  rowClassName?: string;
  mobileView?: (row: T) => React.ReactNode;
}

function StandardTable<T>({
  columns,
  data,
  isLoading = false,
  emptyState,
  className,
  onRowClick,
  rowClassName,
  mobileView,
}: StandardTableProps<T>) {
  if (isLoading) {
    return (
      <div className={cn("w-full", className)}>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.id} className={column.className}>
                  <Skeleton className="h-4 w-24" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                {columns.map((column) => (
                  <TableCell key={column.id} className={column.className}>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (data.length === 0) {
    if (emptyState) {
      return (
        <div className={cn("w-full", className)}>
          <EmptyState
            title={emptyState.title}
            description={emptyState.description}
            icon={emptyState.icon}
          />
        </div>
      );
    }
    return (
      <div className={cn("w-full text-center py-8 text-gray-500", className)}>
        Tidak ada data yang tersedia
      </div>
    );
  }

  // Mobile view
  if (mobileView) {
    return (
      <div className={cn("w-full", className)}>
        <div className="md:hidden">
          {data.map((row, index) => (
            <div 
              key={index} 
              className={cn(
                "border-b border-gray-200 py-4 px-4 hover:bg-gray-50 transition-colors",
                onRowClick && "cursor-pointer",
                rowClassName
              )}
              onClick={() => onRowClick?.(row)}
            >
              {mobileView(row)}
            </div>
          ))}
        </div>
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead 
                    key={column.id} 
                    className={cn("font-semibold text-gray-700", column.className)}
                  >
                    {column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, index) => (
                <TableRow
                  key={index}
                  className={cn(
                    onRowClick && "cursor-pointer hover:bg-gray-50",
                    rowClassName
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column) => (
                    <TableCell 
                      key={column.id} 
                      className={column.className}
                    >
                      {column.cell(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  // Desktop view only
  return (
    <div className={cn("w-full", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead 
                key={column.id} 
                className={cn("font-semibold text-gray-700", column.className)}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow
              key={index}
              className={cn(
                onRowClick && "cursor-pointer hover:bg-gray-50",
                rowClassName
              )}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((column) => (
                <TableCell 
                  key={column.id} 
                  className={column.className}
                >
                  {column.cell(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export { StandardTable };
export type { ColumnDef };