import { ChatOpenAI } from '@langchain/openai'
import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate
} from '@langchain/core/prompts'

export const model = new ChatOpenAI({
  modelName: 'gpt-4o-mini'
})

export async function fromTemplate() {
  const prompt = ChatPromptTemplate.fromTemplate(
    'Write a short description for the following product: {productName}'
  )

  const wholePrompt = await prompt.format({ productName: 'Granny Smith Apple' })

  // creating a chain
  const chain = prompt.pipe(model)
  const res = await chain.invoke({ productName: 'Granny Smith Apple' })
  console.log(res.content)
}

export async function fromMessages() {
  const prompt = ChatPromptTemplate.fromMessages([
    ['system', 'Write a short description for the following product:'],
    ['user', '{productName}']
  ])

  const chain = prompt.pipe(model)
  const res = await chain.invoke({ productName: 'Granny Smith Apple' })
  console.log(res.content)
}
