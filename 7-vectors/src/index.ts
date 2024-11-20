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
  const namespace = await pinecone.createNamespace({
    indexName: 'cool-index',
    name: 'cool-namespace'
  })
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

listIndexes()
