import { OpenAI } from 'openai'
import { encoding_for_model as encodingForModel } from 'tiktoken'

const openai = new OpenAI()

async function main() {
  const prompt = 'How tall is mount everest?'
  const tokenCount = countTokens(prompt)
  console.log('tokenCount: ', tokenCount)

  const res = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a helpful assistant that can answer questions about the world
        You are given a prompt and return JSON with the following keys:
          - answer: the answer to the question
          - source: the source of the answer
        `,
      },
      { role: 'user', content: prompt },
    ],
    n: 2,
    frequency_penalty: 0.5,
    seed: 6900,
  })

  const json1 = JSON.parse(res.choices[0].message.content ?? '')
  const json2 = JSON.parse(res.choices[1].message.content ?? '')

  console.log('\n', json1, '\n')
  console.log('\n', json2, '\n')
}

function countTokens(prompt: string) {
  const encoder = encodingForModel('gpt-4o-mini')
  const encoded = encoder.encode(prompt)
  return encoded.length
}

main()
