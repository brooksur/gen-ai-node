import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { Document } from '@langchain/core/documents'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { CheerioWebBaseLoader } from '@langchain/community/document_loaders/web/cheerio'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'

const model = new ChatOpenAI({
  modelName: 'gpt-4o-mini',
  temperature: 0.7
})

const myData = [
  'My name is John Doe',
  'My name is Bob Smith',
  'My favorite color is blue',
  'My favorite color is red'
]

const question = 'What is a mountain donut?'

export async function main() {
  // Load the data
  const loader = new CheerioWebBaseLoader('http://mountaindonuts.com')
  const docs = await loader.load()

  // Split the data into chunks
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200
  })
  const splitDocs = await splitter.splitDocuments(docs)

  // Create the vector store
  const vectorStore = new MemoryVectorStore(new OpenAIEmbeddings())
  await vectorStore.addDocuments(splitDocs)

  // Create the retrieval
  const retriever = vectorStore.asRetriever({
    k: 2
  })

  const results = await retriever.invoke(question)
  const resultDocs = results.map((result) => result.pageContent)

  // Create the prompt
  const prompt = ChatPromptTemplate.fromMessages([
    [
      'system',
      'Answer the users question based on the following context: {context}'
    ],
    ['user', '{question}']
  ])

  const chain = prompt.pipe(model)

  const response = await chain.invoke({
    context: resultDocs.join('\n'),
    question
  })

  console.log(response.content)
}

main()
