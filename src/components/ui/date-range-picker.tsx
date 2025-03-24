import * as React from "react"
import { addDays, format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"


interface DatePickerWithRangeProps extends React.HTMLAttributes<HTMLDivElement> {
    date: DateRange | undefined;
    setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}

export function DatePickerWithRange({
    className,
    date,
    setDate,
    ...props
}: DatePickerWithRangeProps) {

    return (
        <div className={cn("grid gap-2", className)} {...props}>
            <Popover>
                <PopoverTrigger asChild>
                    <button
                        id="date"
                        className={cn(
                            "cursor-pointer flex h-9 w-[300px] min-w-0 items-center justify-start rounded-md border border-input bg-transparent px-3 py-1 shadow-xs transition-[color,box-shadow] md:text-sm font-paragraph text-base text-left",
                            "outline-none ring-0",
                            "placeholder:text-muted-foreground/50",
                            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(date.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Pick a date range</span>
                        )}
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
