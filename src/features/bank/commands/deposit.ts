import { BankState } from "../BankState";
import { BankCommand } from "../types";
import { isValidAmount, MAX_DEPOSIT_AMOUNT } from "../utils";

export function createDepositCommand(
  bank: BankState
): BankCommand<number, [number]> {
  return (amount: number) => {
    if (!isValidAmount(amount)) {
      return {
        success: false,
        result: {
          reason:
            "Invalid amount: Must be positive and have max 2 decimal places",
        },
      };
    }

    const newBalance = bank.getBalance() + amount;
    if (newBalance > MAX_DEPOSIT_AMOUNT) {
      return {
        success: false,
        result: { reason: "Transaction would exceed maximum balance" },
      };
    }

    const transaction = {
      date: new Date(),
      amount,
      balance: newBalance,
    };

    bank.getTransactions().push(transaction);
    bank.returnToIdle();

    return {
      success: true,
      result: newBalance,
    };
  };
}
