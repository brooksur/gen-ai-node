import OpenAI from 'openai'

type Flight = {
  id: string
  from: string
  to: string
  price: number
}

export class FlightAssistant {
  private openai: OpenAI
  private messages: OpenAI.ChatCompletionMessageParam[] = []
  private toolDefs: OpenAI.ChatCompletionTool[] = []
  private flights: Flight[] = []

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
    this.messages = [
      {
        role: 'system',
        content:
          'You are a helpful assistant that helps users find and reserve flights',
      },
    ]
    this.toolDefs = [
      {
        type: 'function',
        function: {
          name: 'findFlights',
          description: "Finds flights based on the user's input",
        },
      },
      {
        type: 'function',
        function: {
          name: 'reserveFlight',
          description: 'Reserves a flight',
          parameters: {
            type: 'object',
            properties: {
              flightId: {
                type: 'string',
                description: 'The ID of the flight to reserve',
              },
            },
            required: ['flightId'],
          },
        },
      },
    ]
    this.flights = [
      {
        id: '1',
        from: 'New York',
        to: 'Los Angeles',
        price: 100,
      },
      {
        id: '2',
        from: 'New York',
        to: 'Chicago',
        price: 200,
      },
      {
        id: '3',
        from: 'New York',
        to: 'Miami',
        price: 300,
      },
      {
        id: '4',
        from: 'New York',
        to: 'San Francisco',
        price: 400,
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
      messages: this.messages,
      tools: this.toolDefs,
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

      if (toolName === 'findFlights') {
        const flights = this.findFlights()
        this.messages.push({
          role: 'tool',
          content: flights,
          tool_call_id: toolCall.id,
        })
      }

      if (toolName === 'reserveFlight') {
        const args = JSON.parse(toolCall.function.arguments)
        const flightStatus = this.reserveFlight(args.flightId)
        this.messages.push({
          role: 'tool',
          content: flightStatus,
          tool_call_id: toolCall.id,
        })
      }
    }

    const secondResponse = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: this.messages,
    })

    this.messages.push(secondResponse.choices[0].message)

    return secondResponse.choices[0].message.content
  }

  findFlights() {
    return this.flights
      .map(
        (flight) =>
          `${flight.id}: ${flight.from} to ${flight.to} for ${flight.price}`
      )
      .join('\n')
  }

  reserveFlight(flightId: string) {
    const flight = this.flights.find((flight) => flight.id === flightId)

    if (!flight) {
      return 'Flight not found'
    }

    return `Flight ${flight.from} to ${flight.to} reserved successfully for ${flight.price}`
  }
}
