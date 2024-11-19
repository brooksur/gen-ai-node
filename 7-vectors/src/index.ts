import { ChromaClient, OpenAIEmbeddingFunction } from 'chromadb'
import OpenAI from 'openai'
import fs from 'fs'
import path from 'path'

type University = {
  id: string
  document: string
}

class UniversityVector {
  private client: ChromaClient
  private universities: University[]
  private embeddingFunction: OpenAIEmbeddingFunction

  constructor() {
    this.universities = (() => {
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

    this.client = new ChromaClient({
      path: 'http://localhost:8000'
    })

    this.embeddingFunction = new OpenAIEmbeddingFunction({
      openai_api_key: process.env.OPENAI_API_KEY!,
      openai_model: 'text-embedding-3-small'
    })
  }

  async createCollection() {
    await this.client.createCollection({
      name: 'universities',
      embeddingFunction: this.embeddingFunction
    })
  }

  async populateCollection() {
    const collection = await this.getCollection()
    await collection.add({
      ids: this.universities.map((uni) => uni.id),
      documents: this.universities.map((uni) => uni.document)
    })
  }

  async getCollection() {
    return await this.client.getCollection({
      name: 'universities',
      embeddingFunction: this.embeddingFunction
    })
  }
}

class UniversityAssistant {
  private universityVector: UniversityVector
  private openai: OpenAI
  private messages: OpenAI.ChatCompletionMessageParam[]

  constructor() {
    this.universityVector = new UniversityVector()
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })
    this.messages = []
  }

  async getCollection() {
    return await this.universityVector.getCollection()
  }

  async handleQuery(queryText: string) {
    const collection = await this.getCollection()
    const result = await collection.query({
      queryTexts: queryText,
      nResults: 5
    })
    this.messages.push({
      role: 'system',
      content: `
        You are a helpful assistant that helps users understand universities.
        Answer the question using this information: ${result.documents[0].join(
          '\n'
        )}
      `
    })
    this.messages.push({
      role: 'user',
      content: queryText
    })
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0,
      messages: this.messages
    })
    this.messages.push(response.choices[0].message)
    return response.choices[0].message.content
  }
}

const universityAssistant = new UniversityAssistant()

process.stdin.addListener('data', async function (input) {
  const userInput = input.toString().trim()
  const response = await universityAssistant.handleQuery(userInput)
  console.log(response)
})
