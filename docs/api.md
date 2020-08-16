Skeleton Config:

```ts
RootConfig {
  samples?: []; // Training samples
  prefix?: ''; // Top-line prefix to "set the table" of the API interaction
  credential: ''; //  sensitive key
  APIConfig?: {}; // Config for API
  APIFlags?: {}; // Config for individual API requests
  transform?: 'function' // Function to transform function, takes prompt, samples, prefix, inputString, outputStrjng)
  inputString?: 'input'; // Optional label for samples, defaults to "input"
  outputString?: 'ouytput' // Optional label for samples, defaults to "output"
}
```

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
| debug          | `false`                           | Toggle for descriptive/debug logging                      |

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
