## GPT3 Rocket 🚀

```
tl:dr; Little helper to easily "prime" & interact w/ GPT3's API w/ sample examples
```

---

**Note:** For the very impatient, go here: **[quickstart](#quickstart)** (or **[api opts](#api-options)**)

---

🚀 This is a little helper utlity designed mainly to explore conversational or "chat" interfaces with **[GPT3](https://github.com/openai/gpt-3)** but can also be useful for non conversational work uses.

The big idea is to make it very simple to send to GPT3's API the following:

- **"Priming statement"**: Natural language description of the task to be performed (or the background/mood of a conversational agent)

- **Some samples:** GPT3 model does not need a lot of input/output pairs, but a few clues or demonstrations of how the agent behaves can help guide it to sucessfully "complete" our query

If you're interested in exploring GPT3's capabililties for conversational interfaces, a full "chat" interface; w/ various debugging tooling is available here too: **[https://github.com/valgaze/gpt3-chat](https://github.com/valgaze/gpt3-chat)**

**SHOUT-OUT:** Many props to **[Shreya Shankar's](https://github.com/shreyashankar)** observations about adding examples & **["priming"](https://twitter.com/sh_reya/status/1284545996882468864)** & the **["sandbox" tool](https://github.com/shreyashankar/gpt3-sandbox)**

## Quickstart

### Install

```sh
npm i gpt3rocket --save
```

### Use

```js
const { GPT3Rocket } = require("gpt3rocket");

const rootConfig = {
  debug: false, // Set true for logging
  credential: "XXXXXXXXXXXXX",
  samples: [
    ["What's your best advice?", "Whatever you are, be a good one"],
    [
      "How did you feel when you lost an election?",
      "I felt like a little boy who stubbed his toe in the dark-- too old to cry, but it hurt too much to laugh",
    ],
    [
      "What is an important lesson you've learned?",
      "Nearly all men can stand adversity, but if you want to test a man’s character, give him power.",
    ],
  ],
  prefix:
    "This is conversation with Abraham Lincoln. Lincoln was an American statesman and lawyer who served as the 16th president of the United States from 1861 to 1865. Lincoln led the nation through its greatest moral, constitutional, and political crisis in the American Civil War. He succeeded in preserving the Union, abolishing slavery, bolstering the federal government, and modernizing the U.S. economy. Lincoln was born into poverty in a log cabin and was raised on the frontier primarily in Indiana. He sought to reconcile the war-torn nation by exonerating the secessionists. On April 14, 1865, just days after the war's end at Appomattox, Lincoln was attending the play Our American Cousin at Ford's Theatre with his wife Mary when he was assassinated by Confederate sympathizer John Wilkes Booth. Lincoln is remembered as the United States' martyr hero, and he is consistently ranked as the greatest U.S. president in history.",
  APIFlags: {
    temperature: 0.2,
  },
};

async function main(config) {
  const inst = new GPT3Rocket(config);
  const prompt = "Who are you?";
  const result = await inst
    .ask(prompt)
    .catch((e) => console.log("<ERR 1.0>", e));

  console.log("< 1 >", result); // < 1 > { text: 'I am Abraham Lincoln.' }

  inst.add(["This is the 100th input", "This is the ONE HUNDREDTH output!"]);
  inst.add(["This is the 101st input", "This is the one hundred first output"]);

  const prompt2 = "This is the 105th input!!";
  const result2 = await inst
    .ask(prompt2)
    .catch((e) => console.log("<ERR 2.0>", e));
  console.log("< 2 >", result2); // < 2 > { text: 'This is the one hundred fifth output!!' }
}

main(rootConfig);
```

## Server endpoint

```ts
import express, { Request, Response } from "express"; // $ npm i express @types/express --save
import { gpt3Endpoint } from "gpt3rocket";
const port = process.env.port || 3000;
const app = express();

export const config = {
  credential: "xxxxxxxxxxxxxxxxxxx",
  APIFlags: {
    temperature: 0.5,
  },
};

app.post("/chat", gpt3Endpoint(config));

/**
 * POST to localhost:3000/chat
 *
 * {
 *  "prompt": "This is the 4th input!",
 *  "samples: [
 *    ["This is the 1st input", "This is the first output"],
 *    ["This is the 2nd input", "This is the second output"],
 *    ["This is the 3rd input", "This is the third output"],
 *  ],
 *  "prefix": "The following is a conversation with an intelligent agent. The agent is kind, clever and eager to help"
 * }
 *
 */

app.get("/health", (req, res) => {
  res.status(200).send(`Server is OK (${String(new Date())})`);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
```

## Methods

| Method            | Description                                                       | Signature                                                                                                               |
| ----------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Ask               | Ask for a completion                                              | `async ask(prompt: string, samples: Samples = [], prefix?: string, APIFlags: APIFlags = {}, APIConfig: APIConfig = {})` |
| Add               | Add a single sample pair of one input & one output                | `add(sample: [string, string])`                                                                                         |
| addPrefix         | Add a prefix statement (appended to start of API call by default) | `addPrefix(prefix: string) {`                                                                                           |
| clear             | Clear all samples & prefixes                                      | //                                                                                                                      |
| updateCredential  | Change the change used by library                                 | //                                                                                                                      |
| changeTransformer | Change the transformer function                                   | //                                                                                                                      |
| resetTransformer  | Reset transformer function to default                             | //                                                                                                                      |

## API Options

## Configuration

| item           | Example/Default                   | Remarks                                                   |
| -------------- | --------------------------------- | --------------------------------------------------------- |
| samples        | `[['input here', 'output here']]` | List of input/output string pairs                         |
| prefix         | `blah blah blah`                  | Top-line prefix to "set the table" of the API interaction |
| credential     | xxxxxxxxxxxxxxxxxxxxxxxx          | API Key                                                   |
| APIConfig?: {} | //                                | **[See below](#apiconfig)**                               |
| APIFlags?: {}  | //                                | **[See below](#apiflags)**                                |
| transform      | //                                | **[See below](#transformer-function)**                    |
| inputString    | `input`                           | Label for samples in priming, defaults to "input"         |
| outputString   | `output`                          | Label for samples in priming, defaults to "output"        |

## APIConfig

_Basic config for the API itelf_

| item          | Example/Default                                       | Remarks                                                                                                        |
| ------------- | ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| full_response | FALSE                                                 | Flag whether or not completion should return full api response, pr just the text with the output token removed |
| endpoint      | https://api.openai.com/v1/engines/davinci/completions | Defaults to https://api.openai.com/v1/engines/davinci/completions)\* Endpoint                                  |

## APIFlags

_Tweak individual requests_

| item        | Example/Default | Remarks                                                                                   |
| ----------- | --------------- | ----------------------------------------------------------------------------------------- |
| engine      | davinci         | Engine id (there are 4 main engines ada/babbage/curie/davinci)                            |
| prompt      | //              | Input which will be "completed" by the system                                             |
| max_tokens  | 20              | How many "tokens" (words or portions of words) to return in a completion, max of 512      |
| temperature | 0.5             | 0-1, 0 means more predictable and more to 1 is more random                                |
| top_p       | //              | 0-1, represents a percentage threshold for values it will accept. Use this OR temperature |
| n           | //              | Number of choices to create for each prompt                                               |
| stream      | //              | True/false                                                                                |
| logprobs    | //              | Return n most likely tokens                                                               |
| stop        | \n              | Stopping character                                                                        |

## Transformer Function

_Function to control how prompt, prefix, and samples are structured when sent to API. Receives prompt, samples, prefix, inputString, outputString_

Samples in the form of

```ts
const samples = [['marco', 'polo'], ['marrrrrccccoo', 'pollllooo']
```

ex.

```ts
const _transformer = (prompt, samples, prefix, inputString, outputString) => {
  const decoratedSamples = [].concat(...samples).map((example, idx) => {
    if (!(idx % 2)) {
      return `${inputString}:${example}`;
    } else {
      return `${outputString}:${example}`;
    }
  });
  return `${prefix}\n${decoratedSamples.join(
    "\n"
  )}\n${inputString}:${prompt}\n`;
};
```
