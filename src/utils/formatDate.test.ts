import { describe, expect, it } from "vitest";
import { formatDate } from "./formatDate";

describe("formatDate", () => {
  it("formats date in the correct format", () => {
    const date = new Date("2022-07-08T21:12:30");
    const result = formatDate(date);

    expect(result).toBe("8 Jul 2022 09:12:30PM");
  });

  it("should pad date with single-digit hour, minute, and second", () => {
    const date = new Date("2024-03-20T03:01:01");
    const expected = "20 Mar 2024 03:01:01AM";

    expect(formatDate(date)).toEqual(expected);
  });

  it("returns 'Invalid date' for invalid date input", () => {
    const invalidDate = new Date("invalid");
    const result = formatDate(invalidDate);

    expect(result).toBe("Invalid date");
  });
});
