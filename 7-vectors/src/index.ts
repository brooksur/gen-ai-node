import { Pinecone } from '@pinecone-database/pinecone'
import { OpenAI } from 'openai'
import fs from 'fs'
import path from 'path'

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!
})

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
})

type University = {
  id: string
  description: string
}

const universities: University[] = (() => {
  const filePath = path.join(__dirname, 'universities.json')
  const file = fs.readFileSync(filePath, 'utf8')
  const uniData = JSON.parse(file)
  return uniData.map((uni: any) => ({
    id: uni.id,
    description: `${uni.name} is a university located in ${
      uni.location
    }, founded in ${uni.founded}. ${
      uni.description
    } The university specializes in ${uni.specialties.join(
      ', '
    )}. It has a student body of ${
      uni.studentBody
    } students and annual tuition of $${uni.tuition}.`
  }))
})()

const index = pc.index<University>('universities')

async function setupIndex() {
  const listIndexesResponse = await pc.listIndexes()
  const indexes = listIndexesResponse.indexes!.map((i) => i.name)
  if (!indexes.includes('universities')) {
    await pc.createIndex({
      name: 'universities',
      dimension: 1536,
      metric: 'cosine',
      spec: {
        serverless: {
          cloud: 'aws',
          region: 'us-east-1'
        }
      }
    })
  }
}

async function storeEmbeddings() {
  await Promise.all(
    universities.map(async (uni) => {
      const embedding = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: uni.description
      })

      await index.upsert([
        {
          id: 'uni-' + uni.id,
          values: embedding.data[0].embedding,
          metadata: uni
        }
      ])
    })
  )
}

async function queryEmbeddings(question: string) {
  const questionEmbeddingResult = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: question
  })

  const questionEmbedding = questionEmbeddingResult.data[0].embedding

  const queryResponse = await index.query({
    vector: questionEmbedding,
    topK: 5,
    includeMetadata: true,
    includeValues: true
  })

  return queryResponse
}

async function askModel(query: string) {
  query = query.toString().trim()
  const queryResponse = await queryEmbeddings(query)
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'You are a helpful assistant that answers questions about the following data about universities: ' +
          JSON.stringify(
            queryResponse.matches?.map((m) => m.metadata?.description)
          )
      },
      { role: 'user', content: query }
    ]
  })

  return response.choices[0].message.content
}

process.stdin.addListener('data', async function (input) {
  const userInput = input.toString().trim()
  const response = await askModel(userInput)
  console.log(response)
})
