import { beforeEach, describe, expect, it } from "vitest";
import { BankState } from "./BankState";

describe("BankState", () => {
  let bankState: BankState;

  beforeEach(() => {
    bankState = new BankState();
  });

  describe("Initial State", () => {
    it("should initialize with zero balance, empty transactions, and idle state", () => {
      expect(bankState.getBalance()).toBe(0);
      expect(bankState.getTransactions()).toHaveLength(0);
      expect(bankState.getUIState()).toBe("idle");
    });
  });

  describe("State Transitions", () => {
    it("should transition to depositing state", () => {
      bankState.startDeposit();
      expect(bankState.getUIState()).toBe("depositing");
    });

    it("should transition to withdrawing state", () => {
      bankState.startWithdrawal();
      expect(bankState.getUIState()).toBe("withdrawing");
    });

    it("should return to idle state", () => {
      bankState.startDeposit();
      bankState.returnToIdle();
      expect(bankState.getUIState()).toBe("idle");
    });

    it("should correctly identify awaiting input state", () => {
      expect(bankState.isAwaitingInput()).toBe(false);

      bankState.startDeposit();
      expect(bankState.isAwaitingInput()).toBe(true);

      bankState.returnToIdle();
      expect(bankState.isAwaitingInput()).toBe(false);

      bankState.startWithdrawal();
      expect(bankState.isAwaitingInput()).toBe(true);
    });
  });

  describe("Deposit Operations", () => {
    it("should handle positive deposits and record correct transaction", () => {
      const success = bankState.deposit(100);
      expect(success).toBe(true);
      expect(bankState.getBalance()).toBe(100);

      const transactions = bankState.getTransactions();
      expect(transactions).toHaveLength(1);
      expect(transactions[0]).toMatchObject({
        amount: 100,
        balance: 100,
      });
      expect(transactions[0].date).toBeInstanceOf(Date);
    });

    it("should reject negative deposits", () => {
      const success = bankState.deposit(-100);
      expect(success).toBe(false);
      expect(bankState.getBalance()).toBe(0);
      expect(bankState.getTransactions()).toHaveLength(0);
    });

    it("should reject zero deposits", () => {
      const success = bankState.deposit(0);
      expect(success).toBe(false);
      expect(bankState.getBalance()).toBe(0);
      expect(bankState.getTransactions()).toHaveLength(0);
    });

    it("should maintain correct transaction history for multiple deposits", () => {
      bankState.deposit(100);
      bankState.deposit(200);

      const transactions = bankState.getTransactions();
      expect(transactions).toHaveLength(2);

      // First transaction
      expect(transactions[0]).toMatchObject({
        amount: 100,
        balance: 100,
      });

      // Second transaction
      expect(transactions[1]).toMatchObject({
        amount: 200,
        balance: 300,
      });

      expect(bankState.getBalance()).toBe(300);
    });

    it("should reject amounts with more than 2 decimal places", () => {
      expect(bankState.deposit(100.123)).toBe(false);
      expect(bankState.deposit(50.555)).toBe(false);
    });

    it("should accept amounts with up to 2 decimal places", () => {
      expect(bankState.deposit(100.12)).toBe(true);
      expect(bankState.deposit(50.5)).toBe(true);
      expect(bankState.deposit(75)).toBe(true);
    });

    it("should reject amounts over quadrillion", () => {
      expect(bankState.deposit(1_000_000_000_000_001)).toBe(false);
    });

    it("should reject if resulting balance would exceed quadrillion", () => {
      bankState.deposit(999_999_999_999_999);
      expect(bankState.deposit(2)).toBe(false);
    });
  });

  describe("Withdrawal Operations", () => {
    beforeEach(() => {
      bankState.deposit(500); // Set up initial balance
    });

    it("should handle valid withdrawals and record correct transaction", () => {
      const success = bankState.withdraw(100);
      expect(success).toBe(true);
      expect(bankState.getBalance()).toBe(400);

      const transactions = bankState.getTransactions();
      expect(transactions).toHaveLength(2);
      expect(transactions[1]).toMatchObject({
        amount: -100,
        balance: 400,
      });
    });

    it("should handle negative withdrawals (converting to positive)", () => {
      const success = bankState.withdraw(-100);
      expect(success).toBe(false);
      expect(bankState.getBalance()).toBe(500);

      const transactions = bankState.getTransactions();
      expect(transactions).toHaveLength(1);
    });

    it("should reject zero withdrawals", () => {
      const success = bankState.withdraw(0);
      expect(success).toBe(false);
      expect(bankState.getBalance()).toBe(500);
      expect(bankState.getTransactions()).toHaveLength(1);
    });

    it("should reject withdrawals exceeding balance", () => {
      const success = bankState.withdraw(600);
      expect(success).toBe(false);
      expect(bankState.getBalance()).toBe(500);
      expect(bankState.getTransactions()).toHaveLength(1);
    });

    it("should maintain correct transaction history for multiple withdrawals", () => {
      bankState.withdraw(100);
      bankState.withdraw(200);

      const transactions = bankState.getTransactions();
      expect(transactions).toHaveLength(3);

      // Initial deposit
      expect(transactions[0]).toMatchObject({
        amount: 500,
        balance: 500,
      });

      // First withdrawal
      expect(transactions[1]).toMatchObject({
        amount: -100,
        balance: 400,
      });

      // Second withdrawal
      expect(transactions[2]).toMatchObject({
        amount: -200,
        balance: 200,
      });

      expect(bankState.getBalance()).toBe(200);
    });

    it("should reject amounts with more than 2 decimal places", () => {
      expect(bankState.withdraw(100.123)).toBe(false);
      expect(bankState.withdraw(50.555)).toBe(false);
    });

    it("should accept amounts with up to 2 decimal places", () => {
      expect(bankState.withdraw(100.12)).toBe(true);
      expect(bankState.withdraw(50.5)).toBe(true);
      expect(bankState.withdraw(75)).toBe(true);
    });

    it("should reject amounts over quadrillion", () => {
      expect(bankState.withdraw(1_000_000_000_000_001)).toBe(false);
    });
  });

  describe("Mixed Operations", () => {
    it("should maintain correct transaction history for mixed deposits and withdrawals", () => {
      bankState.deposit(500);
      bankState.withdraw(100);
      bankState.deposit(200);
      bankState.withdraw(50);

      const transactions = bankState.getTransactions();
      expect(transactions).toHaveLength(4);

      // Verify each transaction in sequence
      expect(transactions[0]).toMatchObject({
        amount: 500,
        balance: 500,
      });

      expect(transactions[1]).toMatchObject({
        amount: -100,
        balance: 400,
      });

      expect(transactions[2]).toMatchObject({
        amount: 200,
        balance: 600,
      });

      expect(transactions[3]).toMatchObject({
        amount: -50,
        balance: 550,
      });

      expect(bankState.getBalance()).toBe(550);
    });
  });

  describe("Reset Operation", () => {
    it("should reset all state", () => {
      bankState.deposit(100);
      bankState.startDeposit();

      bankState.reset();

      expect(bankState.getBalance()).toBe(0);
      expect(bankState.getTransactions()).toHaveLength(0);
      expect(bankState.getUIState()).toBe("idle");
    });
  });
});
