import { BankState } from "../BankState";
import { BankCommand } from "../types";
import { isValidAmount } from "../utils";

export function createWithdrawCommand(
  bank: BankState
): BankCommand<number, [number]> {
  return (amount: number) => {
    if (!isValidAmount(amount)) {
      return {
        success: false,
        result: {
          reason:
            "Invalid amount: Must be positive, under quadrillion, and have max 2 decimal places",
        },
      };
    }

    if (amount > bank.getBalance()) {
      return {
        success: false,
        result: { reason: "Insufficient funds" },
      };
    }

    const newBalance = bank.getBalance() - amount;
    const transaction = {
      date: new Date(),
      amount: -amount,
      balance: newBalance,
    };

    bank.addTransaction(transaction);
    bank.returnToIdle();

    return {
      success: true,
      result: newBalance,
    };
  };
}
