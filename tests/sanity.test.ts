import * as test from "tape";

test("setup", function (t) {
  t.end();
});

test("<Sanity Test>", async (t: any) => {
  const sample = true;

  const expected = sample;
  const actual = true;
  t.deepEqual(actual, expected);
  console.log("yay");
});

test("teardown", function (t) {
  // ...
  t.end();
});
