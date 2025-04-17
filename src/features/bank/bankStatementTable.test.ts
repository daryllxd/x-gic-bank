import { describe, expect, it } from "vitest";
import { bankStatementTable } from "./bankStatementTable";

describe("bankStatementTable", () => {
  it("should return empty message when no transactions", () => {
    expect(bankStatementTable([])).toBe("No transactions to display.");
  });

  it("should format single transaction correctly", () => {
    const transactions = [
      {
        date: new Date("2024-03-20T10:30:00"),
        amount: 1000,
        balance: 1000,
      },
    ];

    const expected = `
Date                   |   Amount |  Balance
20 Mar 2024 10:30:00AM | 1,000.00 | 1,000.00
`.trim();

    expect(bankStatementTable(transactions)).toBe(expected);
  });

  it("should align amounts and balances correctly with varying lengths", () => {
    const transactions = [
      {
        date: new Date("2024-03-20T10:30:00"),
        amount: 1000,
        balance: 1000,
      },
      {
        date: new Date("2024-03-21T15:45:00"),
        amount: 1000000,
        balance: 1001000,
      },
    ];

    const expected = `
Date                   |       Amount |      Balance
20 Mar 2024 10:30:00AM |     1,000.00 |     1,000.00
21 Mar 2024 03:45:00PM | 1,000,000.00 | 1,001,000.00
`.trim();

    expect(bankStatementTable(transactions)).toBe(expected);
  });

  it("should handle negative amounts correctly", () => {
    const transactions = [
      {
        date: new Date("2024-03-20T10:30:00"),
        amount: -500,
        balance: 500,
      },
    ];

    const expected = `
Date                   |  Amount | Balance
20 Mar 2024 10:30:00AM | -500.00 |  500.00
`.trim();

    expect(bankStatementTable(transactions)).toBe(expected);
  });

  it("should handle small amounts correctly and ensure header alignment", () => {
    const transactions = [
      {
        date: new Date("2024-03-20T10:30:00"),
        amount: 1,
        balance: 1,
      },
    ];

    const expected = `
Date                   | Amount | Balance
20 Mar 2024 10:30:00AM |   1.00 |    1.00
`.trim();

    expect(bankStatementTable(transactions)).toBe(expected);
  });
});
