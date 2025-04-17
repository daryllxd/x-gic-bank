import { describe, expect, it } from "vitest";
import { Transaction } from "../../../types/transaction";
import { BankState } from "../BankState";
import { createPrintCommand } from "./print";

describe("print command", () => {
  it("should return empty transactions list initially", () => {
    const bank = new BankState();
    const print = createPrintCommand(bank);

    const result = print();
    expect(result).toEqual({
      success: true,
      result: [],
    });
  });

  it("should return all transactions in chronological order", () => {
    const bank = new BankState();
    const print = createPrintCommand(bank);

    // Add transactions
    bank.addTransaction({
      date: new Date("2024-03-20T10:00:00"),
      amount: 1000,
      balance: 1000,
    });
    bank.addTransaction({
      date: new Date("2024-03-20T11:00:00"),
      amount: -500,
      balance: 500,
    });
    bank.addTransaction({
      date: new Date("2024-03-20T12:00:00"),
      amount: 200,
      balance: 700,
    });

    const result = print();
    expect(result.success).toBe(true);
    expect(result.result).toHaveLength(3);

    if (!result.success || !result.result) {
      throw new Error("Expected successful result with transactions");
    }

    const transactions = result.result as Transaction[];

    // Verify transaction order and details
    expect(transactions[0]).toMatchObject({
      amount: 1000,
      balance: 1000,
    });
    expect(transactions[1]).toMatchObject({
      amount: -500,
      balance: 500,
    });
    expect(transactions[2]).toMatchObject({
      amount: 200,
      balance: 700,
    });
  });
});
