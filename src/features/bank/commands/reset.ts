import { BankState } from "../BankState";
import { BankCommand } from "../types";

export function createResetCommand(bank: BankState): BankCommand {
  return () => {
    bank.resetTransactions();
    bank.returnToIdle();
    return { success: true };
  };
}
