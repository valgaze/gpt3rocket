## GPT3 Rocket 🚀

```
tl:dr; Little helper to easily "prime" & interact w/ GPT3's API w/ sample examples
```

---

**Note:** For the very impatient, go here: **[quickstart](#quickstart)** (or **[api opts](#api-options)**)

---

🚀 This is a little helper utlity designed mainly to explore conversational or "chat" interfaces with **[GPT3](https://github.com/openai/gpt-3)** but can also be useful for non conversational work.

The big idea is to make it very simple to send to GPT3's API:

- "Priming statement": Natural language description of the task to be performed (or the background/mood of a conversational agent)

- Some samples: GPT3 model does not need a lot of input/output pairs, but a few clues can help guide it to sucessfully complete our query.

If you're more visual or interested in GPT3's specifically for conversational interfaces, a full "chat" interface; w/ various debugging tooling is available here too: **[https://github.com/valgaze/gpt3-chat](https://github.com/valgaze/gpt3-chat)**

**SHOUT-OUT:** Many props to **[Shreya Shankar's](https://github.com/shreyashankar)** observations about adding examples & **["priming"](https://twitter.com/sh_reya/status/1284545996882468864)** & the **["sandbox" tool](https://github.com/shreyashankar/gpt3-sandbox)**

## Quickstart

### Install

```sh
npm i gpt3rocket --save
```

### Use

```ts
import { GPT3Rocket } from "gpt3rocket";

const config = {
  credential: "xxxxxxxxxxxxxxxxxxxxxxxx",
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
  console.log("< 1 >", result);

  /*
Request:
{
  "prompt": "The following is a conversation with an intelligent agent. The agent is kind, clever and eager to help\ninput:This is the 1st input\noutput:This is the first output\ninput:This is the 2nd input\noutput:This is the second output\ninput:This is the 3rd input\noutput:This is the third output\ninput:This is the 4th input!"
}
*/

  // Add extra priming  samples (these will override any samples add during initialization configuration)
  inst.add(["This is the 100th input", "This is the ONE HUNDREDTH output!"]);
  inst.add(["This is the 101st input", "This is the one hundred first output"]);

  const prompt2 = "This is the 105th input!!";
  const result2 = await inst
    .ask(prompt2)
    .catch((e) => console.log("<ERR 2.0>", e));
  console.log("< 2 >", result2);
}

main();
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
| credential     | //                                | API Key                                                   |
| APIConfig?: {} | //                                | **[See below](#apiconfig)**                               |
| APIFlags?: {}  | //                                | **[See below](#apiflags)**                                |
| Transform      | //                                | **[See below](#transformer-function)**                    |
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
