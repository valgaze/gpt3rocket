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
