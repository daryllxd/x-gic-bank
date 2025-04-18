import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Transaction } from "../../types/transaction";
import { BankStorage } from "./BankStorage";

describe("BankStorage", () => {
  let storage: BankStorage;

  beforeEach(() => {
    vi.spyOn(Storage.prototype, "getItem");
    vi.spyOn(Storage.prototype, "setItem");
    vi.spyOn(console, "error").mockImplementation(() => {});
    storage = new BankStorage();
  });

  afterEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("should return empty array when no transactions are stored", () => {
    const transactions = storage.loadTransactions();
    expect(transactions).toEqual([]);
    expect(localStorage.getItem).toHaveBeenCalledWith(
      "x-gic-bank-transactions"
    );
  });

  // Because localStorage is a string, we need to handle transactions with date as string
  it("should handle transactions with date as string", () => {
    const transactions: Transaction[] = [
      {
        // @ts-expect-error - date is a string
        date: "2025-04-18T03:47:38.655Z",
        amount: 1000,
        balance: 1000,
      },
      {
        // @ts-expect-error - date is a string
        date: "2025-04-18T03:47:39.794Z",
        amount: -500,
        balance: 500,
      },
    ];

    storage.saveTransactions(transactions);
    const loadedTransactions = storage.loadTransactions();

    expect(loadedTransactions).toHaveLength(2);
    expect(loadedTransactions[0].date).toBeInstanceOf(Date);
    expect(loadedTransactions[1].date).toBeInstanceOf(Date);
    expect(loadedTransactions).toEqual(
      transactions.map((t) => ({
        ...t,
        date: t.date instanceof Date ? t.date : new Date(t.date),
      }))
    );
  });

  it("should handle invalid stored data", () => {
    vi.spyOn(Storage.prototype, "getItem").mockReturnValue("invalid json");

    const transactions = storage.loadTransactions();
    expect(transactions).toEqual([]);
    expect(console.error).toHaveBeenCalledWith(
      "Failed to load transactions from localStorage",
      expect.any(Error)
    );
  });
});
