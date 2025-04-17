import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders the welcome message and menu", () => {
    render(<App />);
    const output = screen.getByTestId("output");
    expect(output.textContent).toContain("Welcome to AwesomeGIC Bank!");
    expect(output.textContent).toContain("[D]eposit");
    expect(output.textContent).toContain("[W]ithdraw");
    expect(output.textContent).toContain("[P]rint statement");
    expect(output.textContent).toContain("[Q]uit");
  });

  it("handles deposit command correctly", () => {
    render(<App />);
    const input = screen.getByRole("textbox");
    const output = screen.getByTestId("output");

    // Enter deposit command
    fireEvent.change(input, { target: { value: "D" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(output.textContent).toContain(
      "Please enter the amount to deposit (or 'Q' to cancel):"
    );

    // Enter amount
    fireEvent.change(input, { target: { value: "100" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(output.textContent).toContain(
      "Thank you. $100.00 has been deposited to your account."
    );
  });

  it("handles withdrawal command correctly", () => {
    render(<App />);
    const input = screen.getByRole("textbox");
    const output = screen.getByTestId("output");

    // First deposit some money
    fireEvent.change(input, { target: { value: "D" } });
    fireEvent.keyDown(input, { key: "Enter" });
    fireEvent.change(input, { target: { value: "200" } });
    fireEvent.keyDown(input, { key: "Enter" });

    // Then withdraw
    fireEvent.change(input, { target: { value: "W" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(output.textContent).toContain(
      "Please enter the amount to withdraw (or 'Q' to cancel):"
    );

    // Enter withdrawal amount
    fireEvent.change(input, { target: { value: "50" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(output.textContent).toContain(
      "Thank you. $50.00 has been withdrawn from your account."
    );
  });

  it("shows error for insufficient funds", () => {
    render(<App />);
    const input = screen.getByRole("textbox");
    const output = screen.getByTestId("output");

    // Try to withdraw without any balance
    fireEvent.change(input, { target: { value: "W" } });
    fireEvent.keyDown(input, { key: "Enter" });
    fireEvent.change(input, { target: { value: "100" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(output.textContent).toContain("Insufficient funds for withdrawal.");
  });

  it("handles print statement command correctly", () => {
    render(<App />);
    const input = screen.getByRole("textbox");
    const output = screen.getByTestId("output");

    // First make a deposit
    fireEvent.change(input, { target: { value: "D" } });
    fireEvent.keyDown(input, { key: "Enter" });
    fireEvent.change(input, { target: { value: "100" } });
    fireEvent.keyDown(input, { key: "Enter" });

    // Then print statement
    fireEvent.change(input, { target: { value: "P" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(output.textContent).toContain("Date");
    expect(output.textContent).toContain("Amount");
    expect(output.textContent).toContain("Balance");
  });
});
