import { Transaction } from "../../types/transaction";

export type UIState = "idle" | "depositing" | "withdrawing";

/**
 * @description - We want to be able to handle the maximum amount of money in the world, but not go too much
 */
const MAX_DEPOSIT_AMOUNT = 1_000_000_000_000_000;

/**
 * @description - There really is no way to do this accurately (because of floating point) than checking decimal points.
 */
function hasValidDecimals(amount: number): boolean {
  const decimalStr = amount.toString().split(".")[1];
  return !decimalStr || decimalStr.length <= 2;
}

function isValidAmount(amount: number): boolean {
  return amount > 0 && amount <= MAX_DEPOSIT_AMOUNT && hasValidDecimals(amount);
}

export class BankState {
  private balance: number = 0;
  private transactions: Transaction[] = [];
  private uiState: UIState = "idle";

  constructor() {
    this.balance = 0;
    this.transactions = [];
    this.uiState = "idle";
  }

  // Getters
  getBalance(): number {
    return this.balance;
  }

  getTransactions(): Transaction[] {
    return [...this.transactions];
  }

  getUIState(): UIState {
    return this.uiState;
  }

  isAwaitingInput(): boolean {
    return this.uiState === "depositing" || this.uiState === "withdrawing";
  }

  // State transitions
  startDeposit(): void {
    this.uiState = "depositing";
  }

  startWithdrawal(): void {
    this.uiState = "withdrawing";
  }

  returnToIdle(): void {
    this.uiState = "idle";
  }

  // Transaction operations
  deposit(amount: number): boolean {
    if (!isValidAmount(amount)) {
      return false;
    }

    const newBalance = this.balance + amount;
    if (newBalance > MAX_DEPOSIT_AMOUNT) {
      return false;
    }

    const transaction: Transaction = {
      date: new Date(),
      amount,
      balance: newBalance,
    };

    this.transactions.push(transaction);
    this.balance = newBalance;
    this.returnToIdle();
    return true;
  }

  withdraw(amount: number): boolean {
    if (!isValidAmount(amount)) {
      return false;
    }

    if (amount > this.balance) {
      return false;
    }

    const newBalance = this.balance - amount;
    const transaction: Transaction = {
      date: new Date(),
      amount: -amount,
      balance: newBalance,
    };

    this.transactions.push(transaction);
    this.balance = newBalance;
    this.returnToIdle();
    return true;
  }

  // Reset state (useful for testing)
  reset(): void {
    this.balance = 0;
    this.transactions = [];
    this.uiState = "idle";
  }
}
