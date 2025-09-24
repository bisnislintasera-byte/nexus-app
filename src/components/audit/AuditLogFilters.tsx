import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { DateRange } from 'react-day-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { AuditLogFilters as AuditLogFilterType } from '@/hooks/useAuditLogs';

interface FiltersProps {
  onFilterChange: (filters: AuditLogFilterType) => void;
}

export function AuditLogFilters({ onFilterChange }: FiltersProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const [actionType, setActionType] = useState<string>('');

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    onFilterChange({
      startDate: range?.from,
      endDate: range?.to,
      actionType
    });
  };

  const handleActionTypeChange = (value: string) => {
    setActionType(value);
    onFilterChange({
      startDate: dateRange?.from,
      endDate: dateRange?.to,
      actionType: value
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-full sm:w-[300px] justify-start text-left font-normal',
              !dateRange?.from && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange?.to ? (
                <>
                  {format(dateRange.from, 'LLL dd, y')} -{' '}
                  {format(dateRange.to, 'LLL dd, y')}
                </>
              ) : (
                format(dateRange.from, 'LLL dd, y')
              )
            ) : (
              'Pilih rentang tanggal'
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={handleDateRangeChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      <Select value={actionType} onValueChange={handleActionTypeChange}>
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Pilih tipe aktivitas" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Semua Aktivitas</SelectItem>
          <SelectItem value="CREATE_FORM">Pembuatan Form</SelectItem>
          <SelectItem value="SUBMIT_FORM">Pengajuan Form</SelectItem>
          <SelectItem value="APPROVE_FORM">Persetujuan Form</SelectItem>
          <SelectItem value="REJECT_FORM">Penolakan Form</SelectItem>
          <SelectItem value="UPDATE_FORM">Update Form</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}