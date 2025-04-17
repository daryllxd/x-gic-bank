interface FormatCurrencyOptions {
  showSymbol?: boolean;
}

export const formatCurrency = (
  amount: number,
  options: FormatCurrencyOptions = {}
): string => {
  const { showSymbol = true } = options;
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const parts = formatter.formatToParts(amount);
  return parts
    .map(({ type, value }) => {
      if (type === "currency" && !showSymbol) return "";
      return value;
    })
    .join("");
};
