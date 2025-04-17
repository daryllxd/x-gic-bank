import { Transaction } from "../../types/transaction";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

export function bankStatementTable(transactions: Transaction[]): string {
  if (transactions.length === 0) {
    return "No transactions to display.";
  }

  const maxAmountWidth = Math.max(
    "Amount".length,
    ...transactions.map(
      (t) => formatCurrency(t.amount, { showSymbol: false }).length
    )
  );
  const maxBalanceWidth = Math.max(
    "Balance".length,
    ...transactions.map(
      (t) => formatCurrency(t.balance, { showSymbol: false }).length
    )
  );

  // Calculate max date width from the first transaction
  const dateWidth = Math.max(
    "Date".length,
    ...transactions.map((t) => formatDate(t.date).length)
  );

  return [
    `${"Date".padEnd(dateWidth)} | ${"Amount".padStart(
      maxAmountWidth
    )} | ${"Balance".padStart(maxBalanceWidth)}`,
    ...transactions.map(
      (t) =>
        `${formatDate(t.date)} | ${formatCurrency(t.amount, {
          showSymbol: false,
        }).padStart(maxAmountWidth)} | ${formatCurrency(t.balance, {
          showSymbol: false,
        }).padStart(maxBalanceWidth)}`
    ),
  ].join("\n");
}
