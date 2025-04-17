import { Transaction } from "../../types/transaction";

export type UIState = "idle" | "depositing" | "withdrawing";

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
    if (amount <= 0) {
      return false;
    }

    const newBalance = this.balance + amount;
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
    if (amount <= 0 || amount > this.balance) {
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
