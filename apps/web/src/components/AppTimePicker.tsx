import AppSelect, { type AppSelectOption } from "@/components/AppSelect";

interface AppTimePickerProps {
  id?: string;
  /** A wall-clock time, "HH:mm" (24 h). "" means no time. */
  value: string;
  onValueChange: (value: string) => void;
  /** Label of the "no time" option. Omit it for a time the form requires. */
  noneLabel?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  "aria-invalid"?: boolean;
  "aria-label"?: string;
}

const STEP_MINUTES = 15;

// DEV_NOTE: "07:30" → "7:30 AM". A wall-clock time with no zone, so it's formatted in UTC (never shifted).
function formatTime(value: string): string {
  const [hours, minutes] = value.split(":").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(1970, 0, 1, hours, minutes)));
}

const SLOTS: string[] = Array.from({ length: (24 * 60) / STEP_MINUTES }, (_, index) => {
  const minute = index * STEP_MINUTES;
  return `${String(Math.floor(minute / 60)).padStart(2, "0")}:${String(minute % 60).padStart(2, "0")}`;
});

// DEV_NOTE: The one time field for the app: AppSelect over 15-minute slots, so it looks and behaves like every other
// dropdown (type-ahead, scrolls to the chosen slot). Never the browser's <input type="time">. A saved time off the
// grid (set elsewhere) is kept as its own option, so opening the form never changes it.
export default function AppTimePicker({
  id,
  value,
  onValueChange,
  noneLabel,
  placeholder = "Pick a time",
  disabled,
  className,
  "aria-invalid": ariaInvalid,
  "aria-label": ariaLabel,
}: AppTimePickerProps) {
  const slots = value && !SLOTS.includes(value) ? [...SLOTS, value].sort() : SLOTS;
  const options: AppSelectOption[] = [
    ...(noneLabel === undefined ? [] : [{ value: "", label: noneLabel }]),
    ...slots.map((slot) => ({ value: slot, label: formatTime(slot) })),
  ];

  return (
    <AppSelect
      id={id}
      value={value}
      onValueChange={onValueChange}
      options={options}
      placeholder={placeholder}
      disabled={disabled}
      className={className}
      aria-invalid={ariaInvalid}
      aria-label={ariaLabel}
    />
  );
}
