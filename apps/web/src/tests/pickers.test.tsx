import { render, screen, fireEvent, within } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AppDatePicker from "@/components/AppDatePicker";
import AppTimePicker from "@/components/AppTimePicker";

// DEV_NOTE: The app's date and time fields (CLAUDE.md, "Form controls"): never a native input, values as plain
// "YYYY-MM-DD" / "HH:mm" strings, no day shifted by the device's zone.
describe("AppDatePicker", () => {
  it("renders a themed trigger, never a native date input", () => {
    const { container } = render(
      <AppDatePicker id="day" value="" onValueChange={vi.fn()} placeholder="Someday" />,
    );
    expect(container.querySelector('input[type="date"]')).toBeNull();
    expect(screen.getByRole("button", { name: /Someday/ })).toBeInTheDocument();
  });

  it("shows the chosen day without shifting it", () => {
    render(<AppDatePicker value="2026-11-19" onValueChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: /Thu, 19 Nov 2026/ })).toBeInTheDocument();
  });

  it("picks a day from the calendar as YYYY-MM-DD and closes", () => {
    const onValueChange = vi.fn();
    render(<AppDatePicker value="" onValueChange={onValueChange} today="2026-11-19" />);
    fireEvent.click(screen.getByRole("button", { name: /Pick a day/ }));
    const grid = screen.getByRole("grid");
    fireEvent.click(within(grid).getByText("24"));
    expect(onValueChange).toHaveBeenCalledWith("2026-11-24");
    expect(screen.queryByRole("grid")).toBeNull();
  });

  it("refuses days before min, and offers Today and Clear", () => {
    const onValueChange = vi.fn();
    render(
      <AppDatePicker
        value="2026-11-20"
        onValueChange={onValueChange}
        min="2026-11-19"
        today="2026-11-19"
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /Fri, 20 Nov 2026/ }));
    expect(within(screen.getByRole("grid")).getByText("18").closest("button")).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: "Today" }));
    expect(onValueChange).toHaveBeenLastCalledWith("2026-11-19");

    fireEvent.click(screen.getByRole("button", { name: /Fri, 20 Nov 2026/ }));
    fireEvent.click(screen.getByRole("button", { name: "Clear" }));
    expect(onValueChange).toHaveBeenLastCalledWith("");
  });
});

describe("AppTimePicker", () => {
  it("is an AppSelect over 15-minute slots plus the none option, never a native time input", () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <AppTimePicker
        value=""
        onValueChange={onValueChange}
        noneLabel="No time"
        placeholder="No time"
      />,
    );
    expect(container.querySelector('input[type="time"]')).toBeNull();
    fireEvent.click(screen.getByRole("combobox"));
    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(1 + 96);
    fireEvent.click(screen.getByRole("option", { name: "7:30 AM" }));
    expect(onValueChange).toHaveBeenCalledWith("07:30");
  });

  it("keeps a saved time that is off the 15-minute grid", () => {
    render(<AppTimePicker value="07:10" onValueChange={vi.fn()} />);
    expect(screen.getByRole("combobox")).toHaveTextContent("7:10 AM");
  });
});
