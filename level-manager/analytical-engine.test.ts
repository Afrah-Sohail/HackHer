import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CARTRIDGES,
  createBalls,
  runProgram,
  selectTargets,
} from "./analytical-engine.ts";

const flipEverySecond = CARTRIDGES[0];
const stampRepeatFour = CARTRIDGES[1];
const stampEverySecond = CARTRIDGES[2];

describe("analytical engine", () => {
  it("numbers sixteen balls, alternating stamp and flip", () => {
    const balls = createBalls();
    assert.equal(balls.length, 16);
    assert.equal(
      balls.filter((ball) => ball.operation === "flip").length,
      8,
    );
    assert.equal(balls[0]?.operation, "stamp");
    assert.equal(balls[1]?.operation, "flip");
  });

  it("clears every even ball with the flip loop", () => {
    const balls = createBalls();
    const targets = selectTargets(balls, flipEverySecond).map((ball) => ball.index);
    assert.deepEqual(targets, [2, 4, 6, 8, 10, 12, 14, 16]);

    const result = runProgram(balls, [flipEverySecond]);
    assert.equal(result.combo, 8);
    assert.equal(
      result.balls.filter((ball) => ball.cleared).length,
      8,
    );
    assert.equal(result.clearedAll, false);
  });

  it("chains all sixteen balls when the stamp loop follows the flip loop", () => {
    const result = runProgram(createBalls(), [
      flipEverySecond,
      stampRepeatFour,
      stampRepeatFour,
    ]);

    assert.equal(result.clearedAll, true);
    assert.equal(result.combo, 16);
    assert.equal(result.strikes.length, 16);
    assert.equal(
      result.strikes.every((strike) => strike.matched),
      true,
    );
    assert.equal(result.scoreGained, 25 * ((16 * 17) / 2));
  });

  it("jams even balls when a stamp loop hits them", () => {
    const result = runProgram(createBalls(), [stampEverySecond]);
    assert.equal(result.combo, 0);
    assert.equal(
      result.balls.filter((ball) => ball.cleared).length,
      0,
    );
    assert.equal(
      result.balls.filter((ball) => ball.jammed).length,
      8,
    );
  });
});
