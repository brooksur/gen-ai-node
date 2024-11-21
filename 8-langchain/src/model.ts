import { ChatOpenAI } from '@langchain/openai'

const model = new ChatOpenAI({
  modelName: 'gpt-4o-mini',
  temperature: 0.8,
  maxTokens: 1000
  // verbose: true
})

export async function main() {
  // const res = await model.invoke('Give me a good joke')
  // console.log(res.content)

  // const res = await model.batch([
  //   'Give me a good joke',
  //   'Give me a good joke about cats'
  // ])

  const res = await model.stream('Give me 4 good jokes')
  for await (const chunk of res) {
    console.log(chunk.content)
  }
}
