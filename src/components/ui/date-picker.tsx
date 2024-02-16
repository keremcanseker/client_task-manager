"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function DatePickerWithPresets({
  onDateChange,
}: {
  onDateChange: (date: Date) => void;
}) {
  const [date, setDate] = React.useState<Date>();
  const handleDateChange = (selectedDate: Date) => {
    setDate(selectedDate);
    onDateChange(selectedDate); // Pass the selected date to the parent component
  };
  return (
    <Popover>
      <PopoverTrigger asChild className="">
        <Button
          variant={"outline"}
          className={cn(
            " justify-start text-left w-full font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
        <Select
          onValueChange={(value) => {
            setDate(addDays(new Date(), parseInt(value)));
            onDateChange(addDays(new Date(), parseInt(value)));
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="0">Today</SelectItem>
            <SelectItem value="1">Tomorrow</SelectItem>
            <SelectItem value="3">In 3 days</SelectItem>
            <SelectItem value="7">In a week</SelectItem>
          </SelectContent>
        </Select>
        <div className="rounded-md border ">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(day: Date | undefined) => {
              if (day) {
                handleDateChange(day);
              }
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
