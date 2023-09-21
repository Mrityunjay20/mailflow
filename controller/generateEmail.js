const body = require('body-parser');
const { DiscussServiceClient } = require("@google-ai/generativelanguage");
const { GoogleAuth } = require("google-auth-library");
const { json } = require('body-parser');
const { param } = require('../routes/authRoute');
require('dotenv').config();

const MODEL_NAME = "models/chat-bison-001";
const API_KEY = process.env.PALM_API;

const client = new DiscussServiceClient({
  authClient: new GoogleAuth().fromAPIKey(API_KEY),
});

async function main(mailbody,mailtone, mailLength) {
  const result = await client.generateMessage({
    model: MODEL_NAME, // Required. The model to use to generate the result.
    temperature: 0.4, // Optional. Value `0.0` always uses the highest-probability result.
    candidateCount: 1, // Optional. The number of candidate results to generate.
    prompt: {
      // optional, preamble context to prime responses
      context: `Write a formal email with its subject for the message content of 100 words and write it in a ${mailtone} tone, word limit is ${mailLength}`,
        // context: "write a movie script of 10 dialoges",
      // Optional. Examples for further fine-tuning of responses.
        //       examples: [
        //         {
        //           input: { content: "What is the capital of California?" },
        //           output: {
        //             content:
        //               `If the capital of California is what you seek,
        // Sacramento is where you ought to peek.`,
        //           },
        //         },
        //       ],
      // Required. Alternating prompt/response messages.
      messages: [{ content: mailbody}],
    },
  });
  return (result[0].candidates[0].content);
}

// main();


exports.makeemail = async (req,res)=>{ 
    console.log("hello makememail " + req.body.emailContent +" "+ req.body.emailContext+" "+ req.body.mailLength);
    const paramail = await main(req.body.emailContent, req.body.emailContext, req.body.mailLength);
    // String(paramail);
    res.send(paramail);
    console.log(paramail);
}