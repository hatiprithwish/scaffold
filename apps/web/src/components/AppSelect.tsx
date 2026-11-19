import type { ReactNode } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select";
import { cn } from "@/lib/utils";

export interface AppSelectOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

interface AppSelectProps {
  id?: string;
  /** The chosen option's value. "" means nothing chosen, unless an option has the value "" (then that one is chosen). */
  value: string;
  onValueChange: (value: string) => void;
  options: AppSelectOption[];
  /** Shown while nothing is chosen. */
  placeholder?: string;
  disabled?: boolean;
  size?: "sm" | "default";
  className?: string;
  "aria-invalid"?: boolean;
  "aria-label"?: string;
}

// DEV_NOTE: Radix refuses an Item with value="". Callers may use "" for "none", so it travels as this sentinel inside
// and is turned back on the way out.
const EMPTY_VALUE = "__empty__";

// DEV_NOTE: The one dropdown for the app: shadcn's Select (never the browser's <select>), full width by default so a
// form's fields line up, opening under the trigger at its width. Takes plain options so a picker stays a list of data.
export default function AppSelect({
  id,
  value,
  onValueChange,
  options,
  placeholder,
  disabled,
  size = "default",
  className,
  "aria-invalid": ariaInvalid,
  "aria-label": ariaLabel,
}: AppSelectProps) {
  const hasEmptyOption = options.some((option) => option.value === "");
  const selected = value === "" && hasEmptyOption ? EMPTY_VALUE : value;

  return (
    <Select
      value={selected}
      onValueChange={(next) => onValueChange(next === EMPTY_VALUE ? "" : next)}
      disabled={disabled}
    >
      <SelectTrigger
        id={id}
        size={size}
        aria-invalid={ariaInvalid}
        aria-label={ariaLabel}
        className={cn("w-full", className)}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent position="popper" sideOffset={4}>
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value === "" ? EMPTY_VALUE : option.value}
            disabled={option.disabled}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
