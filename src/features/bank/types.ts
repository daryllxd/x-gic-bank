export interface BankCommandResult<T = undefined> {
  success: boolean;
  result?: T | { reason: string };
}

export type BankCommand<T = undefined, Args extends any[] = []> = (
  ...args: Args
) => BankCommandResult<T>;

export type UIState = "idle" | "depositing" | "withdrawing";
