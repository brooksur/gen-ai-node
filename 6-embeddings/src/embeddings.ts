import OpenAI from 'openai'
import fs from 'fs'
import path from 'path'
import { cosineSimilarity } from './similarity'

const openai = new OpenAI()

export async function generateEmbeddings(input: string | string[]) {
  const response = await openai.embeddings.create({
    input,
    model: 'text-embedding-3-large',
  })

  return response
}

export function loadJSON<T>(fileName: string): T {
  const filePath = path.join(__dirname, fileName)
  const data = fs.readFileSync(filePath, 'utf8')
  return JSON.parse(data.toString())
}

export function saveJSON(data: any, fileName: string) {
  const dataString = JSON.stringify(data)
  const dataBuffer = Buffer.from(dataString)
  const filePath = path.join(__dirname, fileName)
  fs.writeFileSync(filePath, dataBuffer)
  console.log(`Saved ${fileName}`)
}

export async function createEmbeddings() {
  const data = loadJSON<string[]>('data.json')
  const embeddings = await generateEmbeddings(data)
  const dataWithEmbeddings: DataWithEmbeddings[] = data.map((item, index) => ({
    data: item,
    embeddings: embeddings.data[index].embedding,
  }))
  saveJSON(dataWithEmbeddings, 'data-embeddings.json')
}

export async function calculateSimilarities(
  input: string,
  dataWithEmbeddings: DataWithEmbeddings[]
) {
  const inputEmbeddings = (await generateEmbeddings(input)).data[0].embedding
  const similarities: {
    input: string
    similarity: number
  }[] = []

  dataWithEmbeddings.forEach((item) => {
    const similarity = cosineSimilarity(item.embeddings, inputEmbeddings)
    similarities.push({
      input: item.data,
      similarity,
    })
  })

  saveJSON(
    similarities.sort((a, b) => b.similarity - a.similarity),
    'similarities.json'
  )
}

type DataWithEmbeddings = {
  data: string
  embeddings: number[]
}
