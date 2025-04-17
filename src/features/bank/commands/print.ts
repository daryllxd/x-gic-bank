import { Transaction } from "../../../types/transaction";
import { BankState } from "../BankState";
import { BankCommand } from "../types";

export function createPrintCommand(
  bank: BankState
): BankCommand<Transaction[]> {
  return () => ({
    success: true,
    result: bank.getTransactions(),
  });
}
