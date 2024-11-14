import OpenAI from 'openai'

class Chat {
  private openai: OpenAI
  private messages: OpenAI.ChatCompletionMessageParam[] = []

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
    this.messages = [
      {
        role: 'system',
        content: `You are a helpful assistant that gives information about:
          - the time of day
          - order status
          `,
      },
    ]
  }

  async completion(prompt: string) {
    const userMessage: OpenAI.ChatCompletionMessageParam = {
      role: 'user',
      content: prompt,
    }

    this.messages.push(userMessage)

    const firstResponse = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [...this.messages],
      tools: [
        {
          type: 'function',
          function: {
            name: 'getTimeOfDay',
            description: 'Returns the time of day',
          },
        },
        {
          type: 'function',
          function: {
            name: 'getOrderStatus',
            description: 'Returns the status of an order',
            parameters: {
              type: 'object',
              properties: {
                orderId: {
                  type: 'string',
                  description: 'The ID of the order',
                },
              },
              required: ['orderId'],
            },
          },
        },
      ],
      tool_choice: 'auto',
    })

    this.messages.push(firstResponse.choices[0].message)

    const invokeTool = firstResponse.choices[0].finish_reason === 'tool_calls'

    if (!invokeTool) {
      return firstResponse.choices[0].message.content
    }

    const toolCalls = firstResponse.choices[0].message.tool_calls!
    for (const toolCall of toolCalls) {
      const toolName = toolCall.function.name

      if (toolName === 'getTimeOfDay') {
        const timeOfDay = this.getTimeOfDay()
        this.messages.push({
          role: 'tool',
          content: timeOfDay,
          tool_call_id: toolCall.id,
        })
      }

      if (toolName === 'getOrderStatus') {
        const args = JSON.parse(toolCall.function.arguments)
        const orderStatus = this.getOrderStatus(args.orderId)
        this.messages.push({
          role: 'tool',
          content: orderStatus,
          tool_call_id: toolCall.id,
        })
      }
    }

    this.messages.push(firstResponse.choices[0].message)

    const secondResponse = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: this.messages,
    })

    this.messages.push(secondResponse.choices[0].message)

    return secondResponse.choices[0].message.content
  }

  getTimeOfDay() {
    return new Date().toLocaleTimeString()
  }

  getOrderStatus(orderId: string) {
    return `Order ${orderId} is ${
      Math.random() > 0.5 ? 'approved' : 'rejected'
    }`
  }
}

const chat = new Chat()

process.stdin.addListener('data', async function (input) {
  const userInput = input.toString().trim()
  const response = await chat.completion(userInput)
  console.log(response)
})
