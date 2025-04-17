import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders the welcome message and menu", () => {
    render(<App />);
    const output = screen.getByTestId("output");
    expect(output).toHaveTextContent("Welcome to AwesomeGIC Bank!");
    expect(output).toHaveTextContent("[D]eposit");
    expect(output).toHaveTextContent("[W]ithdraw");
    expect(output).toHaveTextContent("[P]rint statement");
    expect(output).toHaveTextContent("[Q]uit");
  });

  it("handles deposit command correctly", () => {
    render(<App />);
    const input = screen.getByRole("textbox");
    const output = screen.getByTestId("output");

    // Enter deposit command
    fireEvent.change(input, { target: { value: "D" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(output).toHaveTextContent("Please enter the amount to deposit:");

    // Enter amount
    fireEvent.change(input, { target: { value: "100" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(output).toHaveTextContent(
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
    expect(output).toHaveTextContent("Please enter the amount to withdraw:");

    // Enter withdrawal amount
    fireEvent.change(input, { target: { value: "50" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(output).toHaveTextContent(
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
    expect(output).toHaveTextContent("Insufficient funds for withdrawal.");
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
    expect(output).toHaveTextContent("Date | Amount | Balance");
  });
});
