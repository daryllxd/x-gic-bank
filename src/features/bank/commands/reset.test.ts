import { beforeEach, describe, expect, it } from "vitest";
import { BankState } from "../BankState";
import { createResetCommand } from "./reset";

describe("reset command", () => {
  let bank: BankState;
  let reset: ReturnType<typeof createResetCommand>;

  beforeEach(() => {
    bank = new BankState();
    reset = createResetCommand(bank);
  });

  it("should clear all transactions and return to idle state", () => {
    bank.addTransaction({
      date: new Date(),
      amount: 1000,
      balance: 1000,
    });
    bank.setUIState("depositing");

    const result = reset();

    expect(result).toBeSuccess();
    expect(bank.getTransactions()).toHaveLength(0);
  });
});
