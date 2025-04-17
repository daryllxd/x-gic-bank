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
});
