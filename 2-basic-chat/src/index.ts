import { OpenAI } from 'openai'
import { encoding_for_model as encodingForModel } from 'tiktoken'

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
  tokens: number
}

class Chat {
  private openai: OpenAI
  private maxTokens: number = 700
  private model: string
  private history: ChatMessage[] = []

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
    this.model = 'gpt-4o-mini'
  }

  async chatCompletion(message: string) {
    const historyMessages = this.history.map((message) => ({
      role: message.role,
      content: message.content,
    }))

    const response = await this.openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a helpful chatbot',
        },
        ...historyMessages,
        {
          role: 'user',
          content: message,
        },
      ],
      model: this.model,
    })

    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
      tokens: this.calculateTookens(message),
    }

    const assistantMessage: ChatMessage = {
      role: 'assistant',
      content: response.choices[0].message.content ?? '',
      tokens: this.calculateTookens(response.choices[0].message.content ?? ''),
    }

    this.addToHistory([userMessage, assistantMessage])

    return assistantMessage.content
  }

  calculateTookens(message: string) {
    const encoder = encodingForModel('gpt-4o-mini')
    const encoded = encoder.encode(message)
    return encoded.length
  }

  countHistoryTokens() {
    return this.history.reduce((acc, message) => acc + message.tokens, 0)
  }

  addToHistory(messages: ChatMessage[]) {
    if (
      this.countHistoryTokens() +
        messages.reduce((acc, message) => acc + message.tokens, 0) >
      this.maxTokens
    ) {
      this.clearHistory()
    }
    this.history.push(...messages)
  }

  clearHistory() {
    this.history = []
  }
}

const chat = new Chat()

process.stdin.addListener('data', async function (input) {
  const userInput = input.toString().trim()
  const response = await chat.chatCompletion(userInput)
  console.log(response)
})
