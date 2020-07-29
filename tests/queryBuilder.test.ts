import * as test from "tape";
import { GPT3Rocket, RootConfig } from "./../src/index";
// Types
let inst: GPT3Rocket;

test("setup", function (t) {
  const config: RootConfig = {
    credential: "xxxxxxxxxxxxx",
  };
  inst = new GPT3Rocket(config);

  t.end();
});

test("<Build Query, with sample + prefix, default transform>", async (t: any) => {
  const prompt = "Who made you?";
  const samples = [
    ["a", "b"],
    ["c", "d"],
    ["e", "f"],
    ["g", "h"],
  ];
  const prefix = "This agent returns the next letter of the alphabet";
  const actual = inst.buildQuery(prompt, samples, prefix);

  const expected = `This agent returns the next letter of the alphabet\ninput:a\noutput:b\ninput:c\noutput:d\ninput:e\noutput:f\ninput:g\noutput:h\ninput:Who made you?\n`;
  t.deepEqual(actual, expected);
});

test("<Build Query, with no sample or prefix, default transform>", async (t: any) => {
  const prompt = "Who made you?";
  const actual = inst.buildQuery(prompt);

  const expected = "\n\ninput:Who made you?\n";
  t.deepEqual(actual, expected);
});

test("teardown", function (t) {
  // ...
  t.end();
});
