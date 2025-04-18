import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "../../../test/matchers";
import { BankState } from "../BankState";
import { BankStorage } from "../BankStorage";
import { createWithdrawCommand } from "./withdraw";

describe("withdraw command", () => {
  let bank: BankState;
  let withdraw: ReturnType<typeof createWithdrawCommand>;

  beforeEach(() => {
    bank = new BankState(new BankStorage());
    withdraw = createWithdrawCommand(bank);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("should reject negative or zero amounts", () => {
    const negativeResult = withdraw(-100);
    expect(negativeResult).toBeFailure(
      "Invalid amount: Must be positive, under quadrillion, and have max 2 decimal places"
    );

    const zeroResult = withdraw(0);
    expect(zeroResult).toBeFailure(
      "Invalid amount: Must be positive, under quadrillion, and have max 2 decimal places"
    );
  });

  it("should reject amounts with more than 2 decimal places", () => {
    const result = withdraw(100.123);
    expect(result).toBeFailure(
      "Invalid amount: Must be positive, under quadrillion, and have max 2 decimal places"
    );
  });

  it("should reject withdrawals that would exceed current balance", () => {
    // Set up initial balance
    bank.addTransaction({
      date: new Date(),
      amount: 100,
      balance: 100,
    });

    const result = withdraw(200); // This would exceed current balance
    expect(result).toBeFailure("Insufficient funds");
  });

  it("should successfully process valid withdrawals", () => {
    // Set up initial balance
    bank.addTransaction({
      date: new Date(),
      amount: 200,
      balance: 200,
    });

    const result = withdraw(100.5);
    expect(result).toBeSuccess();
    expect(result.result).toBe(99.5);

    // Verify transaction was added
    const transactions = bank.getTransactions();
    expect(transactions).toHaveLength(2);
    expect(transactions[1]).toMatchObject({
      amount: -100.5,
      balance: 99.5,
    });
  });
});
