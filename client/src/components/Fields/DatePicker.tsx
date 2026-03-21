"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useField } from "formik";
import { cn } from "@/lib/utils";

interface IDatePickerProps {
  label?: string;
  id: string;
  isRequired?: boolean;
  name: string;
  placeholder?: string;
  className?: string;
}

const DatePicker = ({
  label,
  id,
  isRequired,
  name,
  placeholder = "Pick a date",
  className,
}: IDatePickerProps) => {
  const [field, meta, helpers] = useField(name);

  // Convert string value from Formik to Date object if needed
  const selectedDate = field.value ? new Date(field.value) : undefined;

  const handleSelect = (date: Date | undefined) => {
    helpers.setValue(date);
    helpers.setTouched(true, false);
  };

  return (
    <div className={cn("w-full space-y-1.5", className)}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-300 transition-colors"
        >
          {label}
          {isRequired && <span className="ml-1 text-destructive">*</span>}
        </label>
      )}

      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal text-gray-400 hover:text-gray-200 transition-all duration-200",
              "rounded-md border border-white/10 bg-white/3 px-4 py-2.5 text-sm outline-none",
              "hover:bg-white/5 hover:border-white/20",
              "focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20",
              !selectedDate && "text-muted-foreground",
              meta.touched && meta.error && "border-red-500/50 bg-red-500/2"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-violet-400/80" />
            {selectedDate ? (
              format(selectedDate, "PPP")
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 border border-white/10 bg-background/95 backdrop-blur-xl" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            initialFocus
            className="rounded-xl text-gray-400"
          />
        </PopoverContent>
      </Popover>

      {meta.touched && meta.error && (
        <p className="mt-1 animate-in fade-in slide-in-from-top-1 text-xs font-medium text-red-500/90">
          {meta.error}
        </p>
      )}
    </div>
  );
};

export default DatePicker;

