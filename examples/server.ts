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

/**
 * POST to localhost:3000/chat
 *
 * {
 *  "prompt": "Do you like oatmeal?",
 *  "samples: [
 *    ["This is the 1st input", "This is the first output"],
 *    ["This is the 2nd input", "This is the second output"],
 *    ["This is the 3rd input", "This is the third output"],
 *  ],
 *  "prefix": "The following is a conversation with an intelligent agent. The agent is kind, clever and eager to help"
 * }
 *
 */
app.post("/chat", gpt3Endpoint(config));

app.get("/health", (req, res) => {
  res.status(200).send(`Server is OK (${String(new Date())})`);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
