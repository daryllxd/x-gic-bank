export interface BankCommandResult<TReturn = undefined> {
  success: boolean;
  result?: TReturn | { reason: string };
}

export type BankCommand<TReturn = undefined, Args extends any[] = []> = (
  ...args: Args
) => BankCommandResult<TReturn>;

export type UIState = "idle" | "depositing" | "withdrawing";
