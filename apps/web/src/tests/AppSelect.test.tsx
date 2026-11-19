import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AppSelect from "@/components/AppSelect";

const options = [
  { value: "", label: "None" },
  { value: "a", label: "Alpha" },
  { value: "b", label: "Beta" },
];

// DEV_NOTE: Radix Select's options exist only while it is open, and Enter on the trigger opens it.
function open() {
  fireEvent.keyDown(screen.getByRole("combobox"), { key: "Enter" });
}

describe("AppSelect", () => {
  it("shows the chosen option and lists every option when opened", () => {
    render(<AppSelect value="a" onValueChange={vi.fn()} options={options} />);
    expect(screen.getByRole("combobox")).toHaveTextContent("Alpha");

    open();
    expect(screen.getAllByRole("option").map((option) => option.textContent)).toEqual([
      "None",
      "Alpha",
      "Beta",
    ]);
  });

  it("answers the picked value, and an empty string for the empty option", () => {
    const onValueChange = vi.fn();
    render(<AppSelect value="a" onValueChange={onValueChange} options={options} />);

    open();
    fireEvent.click(screen.getByRole("option", { name: "Beta" }));
    expect(onValueChange).toHaveBeenCalledWith("b");

    open();
    fireEvent.click(screen.getByRole("option", { name: "None" }));
    expect(onValueChange).toHaveBeenLastCalledWith("");
  });

  it("shows the placeholder while nothing is chosen", () => {
    render(
      <AppSelect
        value=""
        onValueChange={vi.fn()}
        options={options.slice(1)}
        placeholder="Choose one"
      />,
    );
    expect(screen.getByRole("combobox")).toHaveTextContent("Choose one");
  });
});
