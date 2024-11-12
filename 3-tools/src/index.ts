import OpenAI from 'openai'

class Chat {
  private openai: OpenAI
  private systemPrompt: string
  private context: OpenAI.ChatCompletionMessageParam[] = []

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
    this.systemPrompt =
      'You are a helpful assistant that gives information about the time of day'
  }

  async completion(prompt: string) {
    const userMessage: OpenAI.ChatCompletionMessageParam = {
      role: 'user',
      content: prompt,
    }

    this.context.push(userMessage)

    const preResponse = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: this.systemPrompt,
        },
        ...this.context,
      ],
      tools: [
        {
          type: 'function',
          function: {
            name: 'getTimeOfDay',
            description: 'Returns the time of day',
          },
        },
      ],
      tool_choice: 'auto',
    })

    const invokeTool = preResponse.choices[0].finish_reason === 'tool_calls'
    const toolCall = preResponse.choices[0].message.tool_calls![0]

    if (invokeTool) {
      const toolName = toolCall.function.name

      if (toolName === 'getTimeOfDay') {
        const timeOfDay = this.getTimeOfDay()
        this.context.push(preResponse.choices[0].message)
        this.context.push({
          role: 'tool',
          content: timeOfDay,
          tool_call_id: toolCall.id,
        })
      }
    }

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: this.context,
    })

    this.context.push(response.choices[0].message)

    return response.choices[0].message.content
  }

  getTimeOfDay() {
    return new Date().toLocaleTimeString()
  }
}

const chat = new Chat()

process.stdin.addListener('data', async function (input) {
  const userInput = input.toString().trim()
  const response = await chat.completion(userInput)
  console.log(response)
})
