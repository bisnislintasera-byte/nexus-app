"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Filter, 
  X, 
  Calendar,
  MapPin,
  User,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterOption {
  id: string;
  label: string;
  type: "text" | "select" | "date" | "number";
  options?: { value: string; label: string }[];
  placeholder?: string;
}

interface UnifiedFilterProps {
  onSearch?: (value: string) => void;
  onFilterChange?: (filters: Record<string, any>) => void;
  filterOptions?: FilterOption[];
  searchPlaceholder?: string;
  className?: string;
  showSearch?: boolean;
  showFilters?: boolean;
}

const UnifiedFilter = ({
  onSearch,
  onFilterChange,
  filterOptions = [],
  searchPlaceholder = "Cari...",
  className,
  showSearch = true,
  showFilters = true,
}: UnifiedFilterProps) => {
  const [searchValue, setSearchValue] = React.useState("");
  const [filters, setFilters] = React.useState<Record<string, any>>({});
  const [showFilterDropdown, setShowFilterDropdown] = React.useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch?.(value);
  };

  const handleFilterChange = (id: string, value: any) => {
    const newFilters = { ...filters, [id]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchValue("");
    onSearch?.("");
    onFilterChange?.({});
  };

  const hasActiveFilters = searchValue !== "" || Object.keys(filters).some(key => filters[key] !== "");

  return (
    <div className={cn("flex flex-col sm:flex-row gap-3 mb-4", className)}>
      {showSearch && (
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={handleSearchChange}
            className="pl-10 pr-4 py-2 w-full"
          />
        </div>
      )}
      
      {showFilters && filterOptions.length > 0 && (
        <div className="relative">
          <Button
            variant="outline"
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className={cn(
              "flex items-center gap-2",
              hasActiveFilters && "border-primary text-primary"
            )}
          >
            <Filter className="h-4 w-4" />
            Filter
            {hasActiveFilters && (
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary"></span>
            )}
          </Button>
          
          {showFilterDropdown && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-gray-900">Filter</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-xs"
                >
                  Reset
                </Button>
              </div>
              
              <div className="space-y-4">
                {filterOptions.map((option) => (
                  <div key={option.id} className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      {option.label}
                    </label>
                    {option.type === "text" && (
                      <Input
                        placeholder={option.placeholder}
                        value={filters[option.id] || ""}
                        onChange={(e) => handleFilterChange(option.id, e.target.value)}
                      />
                    )}
                    {option.type === "select" && option.options && (
                      <select
                        value={filters[option.id] || ""}
                        onChange={(e) => handleFilterChange(option.id, e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Semua</option>
                        {option.options.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    )}
                    {option.type === "date" && (
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="date"
                          value={filters[option.id] || ""}
                          onChange={(e) => handleFilterChange(option.id, e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    )}
                    {option.type === "number" && (
                      <Input
                        type="number"
                        placeholder={option.placeholder}
                        value={filters[option.id] || ""}
                        onChange={(e) => handleFilterChange(option.id, e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end mt-4 pt-4 border-t border-gray-200">
                <Button
                  size="sm"
                  onClick={() => setShowFilterDropdown(false)}
                >
                  Terapkan
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
      
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
        >
          <X className="h-4 w-4" />
          <span className="hidden sm:inline">Hapus Filter</span>
        </Button>
      )}
    </div>
  );
};

export { UnifiedFilter };
export type { FilterOption };