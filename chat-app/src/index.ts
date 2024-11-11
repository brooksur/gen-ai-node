import { OpenAI } from 'openai'
import { encoding_for_model as encodingForModel } from 'tiktoken'

async function main() {}

function countTokens(prompt: string) {
  const encoder = encodingForModel('gpt-4o-mini')
  const encoded = encoder.encode(prompt)
  return encoded.length
}

main()
