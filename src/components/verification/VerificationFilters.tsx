'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import type { DateRange } from 'react-day-picker';
import type { VerificationStatus, PMPeriode } from '@/types';
import type { FilterProps } from '@/types/verification';
import { useDebounce } from '@/hooks/useDebounce';

const statusOptions: { value: VerificationStatus | 'all'; label: string; }[] = [
  { value: 'all', label: 'Semua Status' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'APPROVED', label: 'Disetujui' },
  { value: 'REJECTED', label: 'Ditolak' },
];

export const VerificationFilters: React.FC<FilterProps> = ({
  filters,
  onFilterChange,
  pmPeriodeList,
  loading
}) => {
  const debouncedSearch = useDebounce(
    (field: string, value: string) => onFilterChange({ [field]: value }),
    300
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* TID Filter */}
        <div className="space-y-3">
          <Label htmlFor="tid" className="text-sm font-semibold text-gray-800">TID</Label>
          <Input
            id="tid"
            defaultValue={filters.tid}
            onChange={(e) => debouncedSearch('tid', e.target.value)}
            placeholder="Cari berdasarkan TID..."
            className="w-full h-11"
            disabled={loading}
          />
        </div>

        {/* Engineer ID Filter */}
        <div className="space-y-3">
          <Label htmlFor="engineerId" className="text-sm font-semibold text-gray-800">Engineer ID</Label>
          <Input
            id="engineerId"
            defaultValue={filters.engineerId}
            onChange={(e) => debouncedSearch('engineerId', e.target.value)}
            placeholder="Cari berdasarkan ID Engineer..."
            className="w-full h-11"
            disabled={loading}
          />
        </div>

        {/* Status Filter */}
        <div className="space-y-3">
          <Label htmlFor="filterStatus" className="text-sm font-semibold text-gray-800">Status</Label>
          <Select
            value={filters.status}
            onValueChange={(value: VerificationStatus | 'all') => 
              onFilterChange({ status: value })
            }
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* PM Periode Filter */}
        <div className="space-y-3">
          <Label htmlFor="filterPMPeriode" className="text-sm font-semibold text-gray-800">PM Periode</Label>
          <Select
            value={filters.pmPeriode}
            onValueChange={(value: PMPeriode) => 
              onFilterChange({ pmPeriode: value })
            }
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih PM Periode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua Periode</SelectItem>
              {pmPeriodeList.map((periode) => (
                <SelectItem key={periode} value={periode}>
                  {periode}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Advanced Search */}
      <div className="space-y-3">
        <Label htmlFor="searchQuery" className="text-sm font-semibold text-gray-800">Pencarian Umum</Label>
        <Input
          id="searchQuery"
          defaultValue={filters.searchQuery}
          onChange={(e) => debouncedSearch('searchQuery', e.target.value)}
          placeholder="Cari di semua kolom..."
          className="w-full h-11"
          disabled={loading}
        />
      </div>

      {/* Date Range */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-gray-800">Rentang Tanggal</Label>
        <DateRangePicker
          date={filters.dateRange ? { 
            from: filters.dateRange.start || undefined,
            to: filters.dateRange.end || undefined
          } : undefined}
          onChange={(dateRange) => onFilterChange({
            dateRange: dateRange ? {
              start: dateRange.from || null,
              end: dateRange.to || null
            } : undefined
          })}
        />
      </div>
    </div>
  );
};