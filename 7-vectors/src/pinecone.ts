import { Pinecone } from '@pinecone-database/pinecone'

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!
})

/*
  string value
  embedding vector
  metadata
*/

type CoolType = {
  coolness: number
  reference: string
}

async function createNamespace() {
  const index = getIndex()
  const namespace = index.namespace('cool-namespace')
}

function getIndex() {
  return pinecone.index<CoolType>('cool-index')
}

async function createIndex() {
  const index = await pinecone.createIndex({
    name: 'cool-index',
    dimension: 1536,
    metric: 'cosine',
    spec: {
      serverless: {
        cloud: 'aws',
        region: 'us-east-1'
      }
    }
  })
  console.log(index)
}

async function listIndexes() {
  const indexes = await pinecone.listIndexes()
  console.log(indexes)
}

async function generateNumberArray() {
  return Array.from({ length: 1536 }, () => Math.random())
}

async function upsertVectors() {
  const embedding = await generateNumberArray()
  const index = getIndex()
  const result = await index.upsert([
    {
      id: 'id-1',
      values: embedding,
      metadata: {
        coolness: 10,
        reference: 'https://example.com'
      }
    }
  ])
}
