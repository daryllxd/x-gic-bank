import { describe, expect, it } from "vitest";
import { formatCurrency } from "./formatCurrency";

describe("formatCurrency", () => {
  it("formats currency with symbol by default", () => {
    expect(formatCurrency(100)).toBe("$100.00");
    expect(formatCurrency(1000)).toBe("$1,000.00");
    expect(formatCurrency(1000.5)).toBe("$1,000.50");
    expect(formatCurrency(-100)).toBe("-$100.00");
  });

  it("formats currency without symbol when specified", () => {
    expect(formatCurrency(100, { showSymbol: false })).toBe("100.00");
    expect(formatCurrency(1000, { showSymbol: false })).toBe("1,000.00");
    expect(formatCurrency(1000.5, { showSymbol: false })).toBe("1,000.50");
    expect(formatCurrency(-100, { showSymbol: false })).toBe("-100.00");
  });

  it("handles zero and decimal values", () => {
    expect(formatCurrency(0)).toBe("$0.00");
    expect(formatCurrency(0.99)).toBe("$0.99");
    expect(formatCurrency(0.999)).toBe("$1.00"); // rounds up
  });
});
