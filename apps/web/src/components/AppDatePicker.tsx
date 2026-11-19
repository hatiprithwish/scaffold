import { useState } from "react";
import { CalendarBlankIcon } from "@phosphor-icons/react";
import { Button } from "@/shadcn/ui/button";
import { Calendar } from "@/shadcn/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/shadcn/ui/popover";
import { cn } from "@/lib/utils";

interface AppDatePickerProps {
  id?: string;
  /** A local date, "YYYY-MM-DD". "" means no date. */
  value: string;
  onValueChange: (value: string) => void;
  /** Shown while no date is chosen. */
  placeholder?: string;
  /** Earliest / latest pickable day, "YYYY-MM-DD". */
  min?: string;
  max?: string;
  /** The user's today, "YYYY-MM-DD" (from the server, never the device). Marks today and powers the Today button. */
  today?: string;
  /** Show Clear. Off for a date the form requires. */
  clearable?: boolean;
  disabled?: boolean;
  className?: string;
  onBlur?: () => void;
  "aria-invalid"?: boolean;
  "aria-label"?: string;
}

// DEV_NOTE: A local date has no zone. It travels as "YYYY-MM-DD" and becomes a Date at local midnight only inside
// this component (react-day-picker works in local time), so no day ever shifts.
function toDate(value: string): Date | undefined {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return undefined;
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

function toLocalDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

// DEV_NOTE: "2026-11-19" → "Thu, 19 Nov 2026"
function formatValue(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

// DEV_NOTE: The one date field for the app: a trigger styled like AppSelect's that opens shadcn's Calendar in a
// Popover. Never the browser's <input type="date">: its picker can't be themed and looks different on every OS.
export default function AppDatePicker({
  id,
  value,
  onValueChange,
  placeholder = "Pick a day",
  min,
  max,
  today,
  clearable = true,
  disabled,
  className,
  onBlur,
  "aria-invalid": ariaInvalid,
  "aria-label": ariaLabel,
}: AppDatePickerProps) {
  const [open, setOpen] = useState(false);
  const selected = toDate(value);
  const minDate = min ? toDate(min) : undefined;
  const maxDate = max ? toDate(max) : undefined;
  const todayDate = today ? toDate(today) : undefined;
  const todayPickable =
    todayDate !== undefined &&
    (minDate === undefined || todayDate >= minDate) &&
    (maxDate === undefined || todayDate <= maxDate);

  const choose = (next: string) => {
    onValueChange(next);
    setOpen(false);
  };

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) onBlur?.();
      }}
    >
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          disabled={disabled}
          aria-invalid={ariaInvalid}
          aria-label={ariaLabel}
          data-placeholder={selected ? undefined : ""}
          className={cn(
            "flex h-9 w-full items-center justify-between gap-1.5 rounded-3xl border border-transparent bg-input/50 px-3 py-2 text-left text-sm whitespace-nowrap transition-[color,box-shadow,background-color] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
            className,
          )}
        >
          <span className="line-clamp-1">{selected ? formatValue(selected) : placeholder}</span>
          <CalendarBlankIcon className="pointer-events-none size-4 shrink-0 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto gap-2 p-2">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(date) => {
            if (date) choose(toLocalDate(date));
          }}
          defaultMonth={selected ?? todayDate}
          today={todayDate}
          startMonth={minDate}
          endMonth={maxDate}
          disabled={[
            ...(minDate ? [{ before: minDate }] : []),
            ...(maxDate ? [{ after: maxDate }] : []),
          ]}
          autoFocus
        />
        {(clearable || todayPickable) && (
          <div className="flex items-center justify-between gap-2 px-1 pb-1">
            {clearable ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={!selected}
                onClick={() => choose("")}
              >
                Clear
              </Button>
            ) : (
              <span />
            )}
            {todayPickable && today ? (
              <Button type="button" variant="ghost" size="sm" onClick={() => choose(today)}>
                Today
              </Button>
            ) : null}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
