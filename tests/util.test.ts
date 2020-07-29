import * as test from "tape";
import { GPT3Rocket, RootConfig } from "./../src/index";
// Types
let inst: GPT3Rocket;

test("setup", function (t) {
  const config: RootConfig = {
    credential: "xxxxxxxxxxxxx",
  };
  inst = new GPT3Rocket(config);
  inst.add(["a", "b"]);
  inst.addPrefix("This is a prefix");
  t.end();
});

// this.clear in 2::
// inst.add, prefix
// from config

test("<inst.add, inst.addPrefix baseline>", async (t: any) => {
  const prompt = "Who made you?";
  const expected = "This is a prefix\ninput:a\noutput:b\ninput:Who made you?\n";
  const actual = inst.buildQuery(prompt);
  t.deepEqual(actual, expected);
});

test("<inst.add, inst.addPrefix custom transformer", async (t: any) => {
  const prompt = "Who made you?";
  const expected = "**This is a prefix-a,b-Who made you?**";

  inst.changeTransformer((prompt, samples, prefix) => {
    return `**${prefix}-${samples.join("\n")}-${prompt}**`;
  });
  const actual = inst.buildQuery(prompt);
  t.deepEqual(actual, expected);
  inst.resetTransformer();
});

test("<inst.clear: inst.add, inst.addPrefix clear>", async (t: any) => {
  const prompt = "Who made you?";
  const expected = "\n\ninput:Who made you?\n";

  inst.clear();
  const actual = inst.buildQuery(prompt);
  t.deepEqual(actual, expected);
});

test("<Prefix, samples set from config, baseline>", async (t: any) => {
  const prompt = "Who made you?";
  const expected = "This is a prefix\ninput:a\noutput:b\ninput:Who made you?\n";

  const samples = [["a", "b"]];
  const prefix = "This is a prefix";
  const config = {
    credential: "___________________",
    samples,
    prefix,
  };
  const inst2 = new GPT3Rocket(config);
  // inst.clear();
  const actual = inst2.buildQuery(prompt);
  t.deepEqual(actual, expected);
});

test("<Prefix, samples from config, clear>", async (t: any) => {
  const prompt = "Who made you?";
  const expected = "\n\ninput:Who made you?\n";

  const samples = [["a", "b"]];
  const prefix = "This is a prefix";
  const config = {
    credential: "___________________",
    samples,
    prefix,
  };
  const inst2 = new GPT3Rocket(config);
  inst2.clear();
  const actual = inst2.buildQuery(prompt);
  t.deepEqual(actual, expected);
});

test("teardown", function (t) {
  // ...
  t.end();
});
