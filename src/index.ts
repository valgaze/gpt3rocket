import axios from "axios";
export interface APIResponseChoice {
  text: string;
  index: number;
  logprobs?: number;
  finish_reason: string;
}

export interface APIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: APIResponseChoice[];
}

export type Sample = string[][];
export type Samples = string[][];

export interface APIFlags {
  engine?: string; // The engine model id-- there 4 models, ada, babbage, curie, davinci)
  prompt?: string; // One or more prompts to generate from. Can be a string, list of strings, a list of integers (i.e. a single prompt encoded as tokens), or list of lists of integers (i.e. many prompts encoded as integers).
  max_tokens?: number; // How many tokens to complete to. Can return fewer if a stop sequence is hit.
  temperature?: number; // What sampling temperature to use. Higher values means the model will take more risks. Try 0.9 for more creative applications, and 0 (argmax sampling) for ones with a well-defined answer. We generally recommend using this or top_p but not both.
  top_p?: number; // An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered. We generally recommend using this or temperature but not both.
  n?: number; // How many choices to create for each prompt.
  stream?: boolean; // Whether to stream back partial progress. If set, tokens will be sent as data-only server-sent events as they become available, with the stream terminated by a data: [DONE] message.
  logprobs?: number; // Include the log probabilities on the logprobs most likely tokens. So for example, if logprobs is 10, the API will return a list of the 10 most likely tokens. If logprobs is supplied, the API will always return the logprob of the sampled token, so there may be up to logprobs+1 elements in the response.
  stop?: string; // One or more sequences where the API will stop generating further tokens. The returned text will not contain the stop sequence.
  [key: string]: any;
}

export interface APIConfig {
  full_response?: boolean; // Defaults to false, if set to true .ask() will return full response w/ metadata
  endpoint?: string; // Defaults to 'https://api.openai.com/v1/engines/davinci/completions' (can change engine in APIConfig)
}

export interface RootConfig {
  samples?: Samples; // Training samples
  prefix?: string; // Top-line prefix to "set the table" of the API interaction
  credential: string; //  sensitive key
  APIConfig?: APIConfig;
  APIFlags?: APIFlags;
  transform?: any;
  inputString?: string; // Label for samples, defaults to "input"
  outputString?: string; // Label for samples, defaults to "output"
}
/**
 * ## Opts: Samples & prefix
 * Samples & a prefix string will prime your agent
 *
 * ### opts.samples (optional)
 *
 * *array of Samples*
 *
 * ```ts
 * const samples = [['marco', 'polo'], ['marrrrrccccoo', 'pollllooo']
 * ```
 * ### opts.prefix (optional)
 * String to prepend to top of message as "primer"
 *
 * *string*
 *
 *```ts
 * const prefix = 'The following is an exchange between the user and an intelligent agent. The agent is friendly, prompt, and wants to help the
 * ```
 *
 ## Transform (optional)
 * An optional function to adjust how the prefix & samples are structured when sent to API
 *
 * Receives samples, prefix, inputString, outputString
 * Without a custom function, a template will look like the following
 *  
 * ``` 
 *  Prefix phrase ____
 *  input: aaa
 *  output: bbb
 *  input: ${user_prompt_goes_here}
 *```
 *
 *
 * ```ts
 * const transform = ({samples, prefix, inputString, outputString} => {
 *  const decoratedSamples = samples.map((example, idx) => {
 *    if (!(idx % 2)) {
 *      return `${inputString}:${example}`;
 *    } else {
 *      return `${outputString}:${example}`;
 *    }
 *  });
 *  
 * return `\n${prefix}\n${decoratedSamples.join("\n")}`;
 * 
 * })
 * 
 * ```
 *
 * ## APIConfig
 * ```
 * engine:string;  // The engine ID, defaults to davinci (ada, babbage, curie, davinci)
 * prompt?:string;  //One or more prompts to generate from. Can be a string, list of strings, a list of integers (i.e. a single prompt encoded as tokens), or list of lists of integers (i.e. many prompts encoded as integers).
 * max_tokens?:number;  //How many tokens to complete to. Can return fewer if a stop sequence is hit.
 * temperature?:number;  //What sampling temperature to use. Higher values means the model will take more risks. Try 0.9 for more creative applications, and 0 (argmax sampling) for ones with a well-defined answer. We generally recommend using this or top_p but not both.
 * top_p?:number;  //An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered. We generally recommend using this or temperature but not both.
 * n?:number;  //How many choices to create for each prompt.
 * stream?:boolean;  //Whether to stream back partial progress. If set, tokens will be sent as data-only server-sent events as they become available, with the stream terminated by a data: [DONE] message.
 * logprobs?:integer;  //Include the log probabilities on the logprobs most likely tokens. So for example, if logprobs is 10, the API will return a list of the 10 most likely tokens. If logprobs is supplied, the API will always return the logprob of the sampled token, so there may be up to logprobs+1 elements in the response.
 * stop?:string;  //One or more sequences where the API will stop generating further tokens. The returned text will not contain the stop sequence. *
 * ```
 */
export class GPT3Rocket {
  public config: RootConfig;

  constructor(configRef: RootConfig) {
    const defaults = {
      samples: [],
      prefix: "",
      transform: this._transformer,
      inputString: "input",
      outputString: "output",
      credential: "______________________-",
      APIConfig: {
        endpoint: "https://api.openai.com/v1/engines/davinci/completions",
        full_response: false,
      },
      APIFlags: {
        max_tokens: 20,
        temperature: 0.3,
        stop: "\n",
      },
    };
    this.config = Object.assign(defaults, configRef);
  }

  buildQuery(prompt: string, samples: Samples = [], prefix: string = "") {
    let prefixRef = this.config.prefix || "";
    if (prefix) {
      prefixRef = prefix;
    }
    let sampleRef = this.config.samples || [];
    if (samples && samples.length) {
      // Q: merge samples?
      sampleRef = samples;
    }

    if (typeof this.config.transform === "function") {
      return this.config.transform(
        prompt,
        sampleRef,
        prefixRef as string,
        this.config.inputString,
        this.config.outputString
      );
    } else {
      return this._transformer(
        prompt,
        sampleRef,
        prefixRef as string,
        this.config.inputString as string,
        this.config.outputString as string
      );
    }
  }

  async ask(
    prompt: string,
    samples: Samples = [
      ["What are you?", "I am a helper agent here to answer your questions!"],
    ],
    prefix: string = "This is a conversation with a helpful agent. The agent is kind, clever and eager to help",
    APIFlags: APIFlags = {},
    APIConfig: APIConfig = {}
  ): Promise<any> {
    let query = prompt;
    if (samples && samples.length) {
      query = this.buildQuery(prompt, samples, prefix);
    }
    const mergedAPIConfig = Object.assign(this.config.APIConfig, APIConfig);
    const mergedAPIFlags = Object.assign(this.config.APIFlags, APIFlags);

    const endpoint = mergedAPIConfig.endpoint;
    const result = await axios
      .post(
        endpoint as string,
        {
          prompt: query,
          ...mergedAPIFlags,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.config.credential}`,
          },
        }
      )
      .catch((e) => {
        if (e.response && e.response.status === 401) {
          console.log(`\n\n<YOUR CREDENTIAL IS LIKELY INVALID>\n\n`);
        }
        throw new Error(e);
      });

    const { full_response } = mergedAPIConfig;
    if (full_response) {
      return result.data;
    } else {
      const res = result.data.choices[0].text || "";
      const target = `${this.config.outputString}:`; // ex output:
      return { text: res.replace(target, "") };
    }
  }

  add(sample: [string, string]) {
    if (sample.length > 2 || sample.length < 2 || !Array.isArray(sample)) {
      throw new Error("Sample should be exactly one input & one output");
    }
    this?.config?.samples?.push(sample);
  }

  addPrefix(prefix: string) {
    this.config.prefix = prefix;
  }

  changeTransformer(
    transformerFunction: (
      prompt: string,
      samples: Samples,
      prefix: string,
      inputString: string,
      outputString: string
    ) => string
  ) {
    if (typeof transformerFunction === "function") {
      this.config.transform = transformerFunction;
    }
  }

  resetTransformer() {
    this.config.transform = this._transformer;
  }

  clear() {
    this.clearSamples();
    this.clearPrefix();
  }

  clearSamples() {
    this.config.samples = [];
  }

  clearPrefix() {
    this.config.prefix = "";
  }

  updateCredential(credential: string) {
    this.config.credential = credential;
  }

  _transformer(
    prompt: string,
    samples: Samples,
    prefix: string,
    inputString: string,
    outputString: string
  ) {
    //@ts-ignore
    const decoratedSamples = [].concat(...samples).map((example, idx) => {
      if (!(idx % 2)) {
        return `${inputString}:${example}`;
      } else {
        return `${outputString}:${example}`;
      }
    });

    if (prefix && decoratedSamples.length) {
      return `${prefix}\n${decoratedSamples.join(
        "\n"
      )}\n${inputString}:${prompt}\n`;
    } else {
      return `${inputString}:${prompt}\n`;
    }
  }
}

/**
 * ENDPOINT
 *
 */
export const gpt3Endpoint = (config: RootConfig) => {
  const inst = new GPT3Rocket(config);

  // TODO: req/res types, body-parser/no body-parser
  return async (req: any, res: any, next: any) => {
    const {
      samples = [],
      prefix = "",
      APIConfig = {},
      APIFlags = {},
      prompt,
    } = req.body;
    const result = await inst.ask(prompt, samples, prefix, APIFlags, APIConfig);
    return res.status(200).send(result);
  };
};
