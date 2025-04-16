import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders the command app", () => {
    render(<App />);
    expect(screen.getByText("Command App")).toBeInTheDocument();
  });

  it("handles command A correctly", () => {
    render(<App />);
    const input = screen.getByPlaceholderText("Enter command (A, B, or C)");
    fireEvent.change(input, { target: { value: "A" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(screen.getByText("apple")).toBeInTheDocument();
  });

  it("handles command B correctly", () => {
    render(<App />);
    const input = screen.getByPlaceholderText("Enter command (A, B, or C)");
    fireEvent.change(input, { target: { value: "B" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(screen.getByText("Banana")).toBeInTheDocument();
  });

  it("handles command C with argument correctly", () => {
    render(<App />);
    const input = screen.getByPlaceholderText("Enter command (A, B, or C)");
    fireEvent.change(input, { target: { value: "C test" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(screen.getByText("Calculate: test")).toBeInTheDocument();
  });

  it("shows error for command C without argument", () => {
    render(<App />);
    const input = screen.getByPlaceholderText("Enter command (A, B, or C)");
    fireEvent.change(input, { target: { value: "C" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(
      screen.getByText("Error: Command C requires an argument")
    ).toBeInTheDocument();
  });
});
