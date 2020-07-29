import { GPT3Rocket } from "gpt3rocket";

const config = {
  credential: "xxxxxxxxxxxxxxxxxxx",
  samples: [
    ["This is the 1st input", "This is the first output"],
    ["This is the 2nd input", "This is the second output"],
    ["This is the 3rd input", "This is the third output"],
  ],
  prefix:
    "The following is a conversation with an intelligent agent. The agent is kind, clever and eager to help",
  APIFlags: {
    stop: "\n",
    temperature: 0.3, // Closer to 0 more predictable, closer to 1 more random/creative
  },
};

async function main() {
  const inst = new GPT3Rocket(config);
  const prompt = "This is the 4th input!!";
  const result = await inst
    .ask(prompt)
    .catch((e) => console.log("<ERR 1.0>", e));
  console.log("<1>", result);

  // Add extra priming
  inst.add(["This is the 100th input", "This is the ONE HUNDREDTH output!"]);
  inst.add(["This is the 101st input", "This is the one hundred first output"]);

  const prompt2 = "This is the 105th input!!";
  const result2 = await inst
    .ask(prompt2)
    .catch((e) => console.log("<ERR 2.0>", e));
  console.log("<2>", result2);
}

main();
