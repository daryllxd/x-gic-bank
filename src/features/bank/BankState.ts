import { Transaction } from "../../types/transaction";
import { BankStorage } from "./BankStorage";
import { createDepositCommand } from "./commands/deposit";
import { createPrintCommand } from "./commands/print";
import { createResetCommand } from "./commands/reset";
import { createWithdrawCommand } from "./commands/withdraw";
import { UIState } from "./types";

export class BankState {
  private transactions: Transaction[] = [];
  private uiState: UIState = "idle";
  private storage: BankStorage;

  constructor(storage: BankStorage) {
    this.storage = storage;
    this.transactions = storage.loadTransactions();
    this.uiState = "idle";
  }

  // Commands
  public readonly deposit = createDepositCommand(this);
  public readonly withdraw = createWithdrawCommand(this);
  public readonly print = createPrintCommand(this);
  public readonly reset = createResetCommand(this);

  getBalance(): number {
    return this.transactions.length > 0
      ? this.transactions[this.transactions.length - 1].balance
      : 0;
  }

  getTransactions(): Transaction[] {
    return this.transactions;
  }

  getUIState(): UIState {
    return this.uiState;
  }

  // Setters (needed for commands)
  addTransaction(transaction: Transaction): void {
    this.transactions.push(transaction);
    this.storage.saveTransactions(this.transactions);
  }

  setUIState(state: UIState): void {
    this.uiState = state;
  }

  isAwaitingInput(): boolean {
    return this.uiState === "depositing" || this.uiState === "withdrawing";
  }

  startDeposit(): void {
    this.uiState = "depositing";
  }

  startWithdrawal(): void {
    this.uiState = "withdrawing";
  }

  returnToIdle(): void {
    this.uiState = "idle";
  }

  resetTransactions(): void {
    this.transactions = [];
    this.storage.saveTransactions(this.transactions);
  }
}
