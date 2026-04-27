"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "./utils";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      navLayout="around"
      className={cn("p-3", className)}
      classNames={{
        root: "w-fit",
        months: "flex flex-col gap-4",
        month: cn(
          "w-full gap-y-2",
          "grid grid-cols-[minmax(0,2.25rem)_1fr_minmax(0,2.25rem)] items-center",
        ),
        month_caption: "col-start-2 row-start-1 flex min-w-0 justify-center px-1",
        caption_label: "truncate text-center text-sm font-semibold text-foreground",
        button_previous: cn(
          "col-start-1 row-start-1 inline-flex size-8 shrink-0 items-center justify-center rounded-lg",
          "text-muted-foreground transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          "disabled:pointer-events-none disabled:opacity-25",
        ),
        button_next: cn(
          "col-start-3 row-start-1 inline-flex size-8 shrink-0 items-center justify-center rounded-lg",
          "text-muted-foreground transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          "disabled:pointer-events-none disabled:opacity-25",
        ),
        month_grid:
          "col-span-3 row-start-2 w-full table-fixed border-collapse text-center",
        weekdays: "",
        weekday:
          "h-8 w-[14.28%] p-0 text-[11px] font-medium uppercase tracking-wide text-muted-foreground",
        weeks: "",
        week: "mt-0.5",
        day: "relative h-10 p-0 text-center align-middle text-sm",
        day_button: cn(
          "mx-auto flex size-9 items-center justify-center rounded-lg font-normal",
          "text-foreground transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-35",
          props.mode === "range"
            ? "aria-selected:bg-accent aria-selected:text-accent-foreground"
            : "aria-selected:bg-primary aria-selected:text-primary-foreground aria-selected:hover:bg-primary aria-selected:hover:text-primary-foreground",
        ),
        range_start: "day-range-start rounded-l-md bg-accent/25",
        range_end: "day-range-end rounded-r-md bg-accent/25",
        range_middle:
          "rounded-none bg-accent/20 [&_button]:rounded-none [&_button]:bg-transparent aria-selected:bg-accent/30",
        selected:
          "bg-transparent [&_button]:bg-primary [&_button]:font-medium [&_button]:text-primary-foreground [&_button]:hover:bg-primary [&_button]:hover:text-primary-foreground",
        today: "[&_button]:ring-2 [&_button]:ring-primary/25 [&_button]:ring-offset-0",
        outside:
          "text-muted-foreground/45 [&_button]:text-muted-foreground/45 [&_button]:hover:bg-transparent",
        disabled:
          "text-muted-foreground/35 [&_button]:cursor-not-allowed [&_button]:text-muted-foreground/35 [&_button]:hover:bg-transparent",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ className, orientation }) =>
          orientation === "right" ? (
            <ChevronRight className={cn("size-4", className)} aria-hidden />
          ) : (
            <ChevronLeft className={cn("size-4", className)} aria-hidden />
          ),
      }}
      {...props}
    />
  );
}

export { Calendar };
