/**
 * @description - We want to be able to handle the maximum amount of money in the world, but not go over.
 */
export const MAX_DEPOSIT_AMOUNT = 1_000_000_000_000_000;

/**
 * @description - There really is no way to do this accurately (because of floating point) than checking decimal points.
 */
export function hasValidDecimals(amount: number): boolean {
  const decimalStr = amount.toString().split(".")[1];
  return !decimalStr || decimalStr.length <= 2;
}

export function isValidAmount(amount: number): boolean {
  return amount > 0 && amount <= MAX_DEPOSIT_AMOUNT && hasValidDecimals(amount);
}
