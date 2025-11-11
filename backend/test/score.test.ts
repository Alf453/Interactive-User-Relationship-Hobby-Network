import { describe, it, expect } from "vitest";
import { computePopularityPure } from "../src/services/scoreService";
describe("Popularity score", () => {
  it("computes friends + 0.5 * shared hobbies", () => {
    const user = { hobbies: ["music", "travel"], friends: ["B", "C"] };
    const friends = [
      { hobbies: ["music", "tech"] },
      { hobbies: ["travel", "music"] },
    ];
    const score = computePopularityPure(user as any, friends as any);
    expect(score).toBe(2 + 2 * 0.5);
  });
});
