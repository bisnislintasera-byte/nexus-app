"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { id } from "date-fns/locale";

interface DateRangePickerProps {
  date?: DateRange;
  onChange?: (date: DateRange | undefined) => void;
  className?: string;
}

export function DateRangePicker({
  date,
  onChange,
  className,
}: DateRangePickerProps) {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(date);

  React.useEffect(() => {
    if (date) {
      setDateRange(date);
    }
  }, [date]);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !dateRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "dd MMM yyyy", { locale: id })} -{" "}
                  {format(dateRange.to, "dd MMM yyyy", { locale: id })}
                </>
              ) : (
                format(dateRange.from, "dd MMM yyyy", { locale: id })
              )
            ) : (
              <span>Pilih tanggal</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={(newDateRange) => {
              setDateRange(newDateRange);
              onChange?.(newDateRange);
            }}
            numberOfMonths={2}
            locale={id}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}