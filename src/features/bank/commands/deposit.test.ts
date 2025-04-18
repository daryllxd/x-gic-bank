import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "../../../test/matchers";
import { BankState } from "../BankState";
import { MAX_DEPOSIT_AMOUNT } from "../utils";
import { createDepositCommand } from "./deposit";

describe("deposit command", () => {
  let bank: BankState;
  let deposit: ReturnType<typeof createDepositCommand>;

  beforeEach(() => {
    bank = new BankState();
    deposit = createDepositCommand(bank);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("should reject negative or zero amounts", () => {
    const negativeResult = deposit(-100);
    expect(negativeResult).toBeFailure(
      "Invalid amount: Must be positive and have max 2 decimal places"
    );

    const zeroResult = deposit(0);
    expect(zeroResult).toBeFailure(
      "Invalid amount: Must be positive and have max 2 decimal places"
    );
  });

  it("should reject amounts with more than 2 decimal places", () => {
    const result = deposit(100.123);
    expect(result).toBeFailure(
      "Invalid amount: Must be positive and have max 2 decimal places"
    );
  });

  it("should reject deposits that would exceed maximum balance", () => {
    bank.addTransaction({
      date: new Date(),
      amount: MAX_DEPOSIT_AMOUNT - 100,
      balance: MAX_DEPOSIT_AMOUNT - 100,
    });

    const result = deposit(200); // This would exceed max balance
    expect(result).toBeFailure("Transaction would exceed maximum balance");
  });

  it("should successfully process valid deposits", () => {
    const result = deposit(100.5);
    expect(result).toBeSuccess(100.5);

    // Verify transaction was added
    const transactions = bank.getTransactions();
    expect(transactions).toHaveLength(1);
    expect(transactions[0]).toMatchObject({
      amount: 100.5,
      balance: 100.5,
    });
  });
});
