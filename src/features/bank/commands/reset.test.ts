import { describe, expect, it } from "vitest";
import { BankState } from "../BankState";
import { createResetCommand } from "./reset";

describe("reset command", () => {
  it("should clear all transactions and return to idle state", () => {
    const bank = new BankState();
    const reset = createResetCommand(bank);

    bank.addTransaction({
      date: new Date(),
      amount: 1000,
      balance: 1000,
    });
    bank.setUIState("depositing");

    const result = reset();

    expect(result).toEqual({ success: true });
    expect(bank.getTransactions()).toHaveLength(0);
  });
});
