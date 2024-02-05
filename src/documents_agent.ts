import {
    OpenAIAgent,
    SimpleDirectoryReader,
    VectorStoreIndex,
    SummaryIndex,
    QueryEngineTool,
} from "llamaindex";


async function main() {
  // Load the documents
  const documents = await new SimpleDirectoryReader().loadData({
    directoryPath: "node_modules/llamaindex/examples",
  });
  
  // Create a vector index from the documents
  const vectorIndex =  await VectorStoreIndex.fromDocuments(documents);
  const summaryIndex = await SummaryIndex.fromDocuments(documents)

    // Create a query engine from the vector index
  const abramovQueryEngine = vectorIndex.asQueryEngine();
  const abramovSummaryEngine = summaryIndex.asQueryEngine();

  // Create a QueryEngineTool with the vector engine
  const vectorEngineTool = new QueryEngineTool({
    queryEngine: abramovQueryEngine,
    metadata: {
      name: "abramov_query_engine",
      description: "Use this engine to answer questions about Abramov",
    },
  });

  // Create a QueryEngineTool with the summary engine
  const summaryEngineTool = new QueryEngineTool({
    queryEngine: abramovSummaryEngine,
    metadata: {
      name: "abramov_summary_engine",
      description: "Use this engine to answer more specific and summary queries about Abramov",
    },
  });

  // Setup the agent 
  const agent = new OpenAIAgent({
    tools: [vectorEngineTool, summaryEngineTool],
    verbose: true,
  });

  // Chat with Agent
  const response = await agent.chat({
    message: "What was his salary?",
  });

  // Agent output
  console.log(String(response));
}

main().then(() => console.log("Done!"));