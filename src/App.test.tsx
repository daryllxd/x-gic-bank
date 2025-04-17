import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import App from "./App";

describe("App", () => {
  it("should maintain focus on input after clicking outside", () => {
    render(<App />);
    const input = screen.getByTestId("command-input");

    // Click outside the input
    fireEvent.click(document.body);

    // Verify input is still focused
    expect(document.activeElement).toBe(input);
  });

  it("should maintain focus on input after blur event", () => {
    render(<App />);
    const input = screen.getByTestId("command-input");
    const focusSpy = vi.spyOn(input, "focus");

    // Trigger blur event
    fireEvent.blur(input);

    // Verify input is still focused
    expect(document.activeElement).toBe(input);
    expect(focusSpy).toHaveBeenCalled();
  });

  it("should call handleCommand when Enter is pressed", () => {
    render(<App />);
    const input = screen.getByTestId("command-input");

    // Type a command
    fireEvent.change(input, { target: { value: "D" } });

    // Press Enter
    fireEvent.keyDown(input, { key: "Enter" });

    // Verify the command was processed by checking the output
    expect(screen.getByTestId("output").textContent).toContain(
      "Please enter the amount to deposit"
    );
  });
});
