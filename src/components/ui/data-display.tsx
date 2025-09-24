"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { 
  Calendar, 
  MapPin, 
  User, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle
} from "lucide-react";

interface DataFieldProps {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

const DataField = ({
  label,
  value,
  icon,
  className,
}: DataFieldProps) => {
  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-center text-sm text-gray-500">
        {icon && <span className="mr-1.5">{icon}</span>}
        <span>{label}</span>
      </div>
      <div className="text-sm font-medium text-gray-900">{value}</div>
    </div>
  );
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const StatusBadge = ({
  status,
  className,
}: StatusBadgeProps) => {
  const statusConfig = {
    PENDING: {
      label: "Pending",
      icon: <Clock className="h-3 w-3" />,
      className: "bg-amber-100 text-amber-800 border border-amber-200"
    },
    APPROVED: {
      label: "Disetujui",
      icon: <CheckCircle className="h-3 w-3" />,
      className: "bg-green-100 text-green-800 border border-green-200"
    },
    REJECTED: {
      label: "Ditolak",
      icon: <XCircle className="h-3 w-3" />,
      className: "bg-red-100 text-red-800 border border-red-200"
    },
    ENGINEER: {
      label: "Engineer",
      icon: <User className="h-3 w-3" />,
      className: "bg-blue-100 text-blue-800 border border-blue-200"
    },
    VERIFIKATOR: {
      label: "Verifikator",
      icon: <CheckCircle className="h-3 w-3" />,
      className: "bg-green-100 text-green-800 border border-green-200"
    },
    ADMIN: {
      label: "Administrator",
      icon: <User className="h-3 w-3" />,
      className: "bg-purple-100 text-purple-800 border border-purple-200"
    },
    default: {
      label: status,
      icon: <AlertCircle className="h-3 w-3" />,
      className: "bg-gray-100 text-gray-800 border border-gray-200"
    }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.default;

  return (
    <span className={cn(
      "inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm",
      config.className,
      className
    )}>
      {config.icon && <span className="mr-1">{config.icon}</span>}
      {config.label}
    </span>
  );
};

interface DataRowProps {
  label: string;
  value: string | number | null | undefined;
  icon?: React.ReactNode;
  className?: string;
}

const DataRow = ({
  label,
  value,
  icon,
  className,
}: DataRowProps) => {
  return (
    <div className={cn("flex items-center justify-between py-2", className)}>
      <div className="flex items-center text-sm text-gray-500">
        {icon && <span className="mr-2">{icon}</span>}
        <span>{label}</span>
      </div>
      <div className="text-sm font-medium text-gray-900 truncate max-w-[50%] text-right">
        {value ?? "N/A"}
      </div>
    </div>
  );
};

interface DataSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const DataSection = ({
  title,
  children,
  className,
}: DataSectionProps) => {
  return (
    <div className={cn("border border-gray-200 rounded-lg", className)}>
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

export {
  DataField,
  StatusBadge,
  DataRow,
  DataSection,
};