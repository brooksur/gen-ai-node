import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai'
import { Chroma } from '@langchain/community/vectorstores/chroma'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'
import path from 'path'

const model = new ChatOpenAI({
  modelName: 'gpt-4o-mini',
  temperature: 0.7
})

const question = 'Can you tell me about pricing?'

export async function main() {
  // Load the data
  const loader = new PDFLoader(path.resolve(__dirname, '../delete-later.pdf'), {
    splitPages: true,
    parsedItemSeparator: '\n\n'
  })
  const docs = await loader.load()

  // Split the data into chunks
  const splitter = new RecursiveCharacterTextSplitter({
    separators: ['\n\n', '\n', '.', '!', '?', ';'],
    chunkSize: 1000,
    chunkOverlap: 200
  })
  const splitDocs = await splitter.splitDocuments(docs)

  // Create the vector store
  const vectorStore = await Chroma.fromDocuments(
    splitDocs,
    new OpenAIEmbeddings(),
    {
      collectionName: 'documents',
      url: 'http://localhost:8000'
    }
  )

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
