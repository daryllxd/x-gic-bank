import { expect } from "vitest";

declare module "vitest" {
  interface Assertion<T = any> {
    toBeSuccess(expectedResult?: T): void;
    toBeFailure(expectedReason?: string): void;
  }
}

expect.extend({
  toBeSuccess(
    received: { success: boolean; result: any },
    expectedResult?: any
  ) {
    const { isNot } = this;
    const pass = received.success === true;

    if (!pass) {
      return {
        message: () =>
          `expected ${received} to be a success${
            expectedResult ? ` with result ${expectedResult}` : ""
          }`,
        pass: false,
      };
    }

    if (expectedResult !== undefined && received.result !== expectedResult) {
      return {
        message: () =>
          `expected success with result ${expectedResult}, but got ${received.result}`,
        pass: false,
      };
    }

    return {
      message: () =>
        `expected ${received} not to be a success${
          expectedResult ? ` with result ${expectedResult}` : ""
        }`,
      pass: true,
    };
  },

  toBeFailure(
    received: { success: boolean; result: { reason: string } },
    expectedReason?: string
  ) {
    const { isNot } = this;
    const pass = received.success === false;

    if (!pass) {
      return {
        message: () =>
          `expected ${received} to be a failure${
            expectedReason ? ` with reason "${expectedReason}"` : ""
          }`,
        pass: false,
      };
    }

    if (
      expectedReason !== undefined &&
      received.result.reason !== expectedReason
    ) {
      return {
        message: () =>
          `expected failure with reason "${expectedReason}", but got "${received.result.reason}"`,
        pass: false,
      };
    }

    return {
      message: () =>
        `expected ${received} not to be a failure${
          expectedReason ? ` with reason "${expectedReason}"` : ""
        }`,
      pass: true,
    };
  },
});
