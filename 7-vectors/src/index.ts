import { ChromaClient, OpenAIEmbeddingFunction } from 'chromadb'
import OpenAI from 'openai'
import fs from 'fs'
import path from 'path'

type University = {
  id: string
  document: string
}

const universities: University[] = (() => {
  const data = fs.readFileSync(
    path.join(__dirname, 'universities.json'),
    'utf-8'
  )
  const rawData = JSON.parse(data)
  return rawData.map((uni: any) => ({
    id: uni.id,
    document: `${uni.name} is a university located in ${
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

const client = new ChromaClient({
  path: 'http://localhost:8000'
})

const embeddingFunction = new OpenAIEmbeddingFunction({
  openai_api_key: process.env.OPENAI_API_KEY!,
  openai_model: 'text-embedding-3-small'
})

async function createCollection() {
  await client.createCollection({
    name: 'universities'
  })
  console.log('Universities collection created')
}

async function getCollection() {
  const collection = await client.getCollection({
    name: 'universities',
    embeddingFunction
  })

  console.log('Universities collection retrieved')

  return collection
}

async function populateCollection() {
  const collection = await getCollection()
  await collection.add({
    ids: universities.map((uni) => uni.id),
    documents: universities.map((uni) => uni.document)
  })
  console.log('Universities collection populated')
}
