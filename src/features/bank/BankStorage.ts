import { Transaction } from "../../types/transaction";

const STORAGE_KEY = "x-gic-bank-transactions";

interface BankStore {
  loadTransactions(): Transaction[];
  saveTransactions(transactions: Transaction[]): void;
}

/**
 * @description Store transactions in localStorage for now - we can change it to a database later.
 * @note We can add a new store by implementing the BankStore interface.
 */
export class BankStorage implements BankStore {
  loadTransactions(): Transaction[] {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.map((t: Transaction) => ({
          ...t,
          date: new Date(t.date),
        }));
      } catch (e) {
        console.error("Failed to load transactions from localStorage", e);
        return [];
      }
    }
    return [];
  }

  saveTransactions(transactions: Transaction[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }
}
