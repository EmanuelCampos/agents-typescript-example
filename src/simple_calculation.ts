import { FunctionTool, OpenAIAgent } from "llamaindex";

// Define a function to sum two numbers
function sum({ a, b }: { a: number; b: number }): number {
  return a + b;
}

// Define a function to multiply two numbers
function multiply({ a, b }: { a: number; b: number }): number {
  return a * b;
}

// Sum properties to give to the LLM
const sumJSON = {
  type: "object",
  properties: {
      a: {
      type: "number",
      description: "The first number",
      },
      b: {
      type: "number",
      description: "The second number",
      },
  },
  required: ["a", "b"],
};

// Multiply properties to give to the LLM
const multiplyJSON = {
  type: "object",
  properties: {
      a: {
      type: "number",
      description: "The number to multiply",
      },
      b: {
      type: "number",
      description: "The multiplier",
      },
  },
  required: ["a", "b"],
};
  
// Create sum function tool
const sumFunctionTool = new FunctionTool(sum, {
  name: "sum",
  description: "Use this function to sum two numbers",
  parameters: sumJSON,
});

// Creat multiply function tool
const multiplyFunctionTool = new FunctionTool(multiply, {
  name: "multiply",
  description: "Use this function to divide two numbers",
  parameters: multiplyJSON,
});

async function main() {
  // Setup the agent with the respective tools
  const agent = new OpenAIAgent({
    tools: [sumFunctionTool, multiplyFunctionTool],
    verbose: true,
  });

  // Chat with LLM
  const response = await agent.chat({
    message: "How much is 5 + 5? then multiply by 2",
  });

  // Agent output
  console.log(String(response));
}

main().then(() => console.log("Done!"));