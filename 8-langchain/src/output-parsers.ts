import { ChatOpenAI } from '@langchain/openai'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import {
  CommaSeparatedListOutputParser,
  StructuredOutputParser
} from '@langchain/core/output_parsers'

export const model = new ChatOpenAI({
  modelName: 'gpt-4o-mini',
  temperature: 0.7
})

export async function commaSeparatedListParser() {
  const prompt = ChatPromptTemplate.fromTemplate(
    'Provide the first 5 ingredients for the following recipe: {recipe}'
  )

  const parser = new CommaSeparatedListOutputParser()

  const chain = prompt.pipe(model).pipe(parser)
  const res = await chain.invoke({ recipe: 'Spaghetti Carbonara' })
  console.log(res)
}

export async function structuredOutputParser() {
  const prompt = ChatPromptTemplate.fromTemplate(
    `
      Extract information from the following text:
      Formatting instructions: {formatInstructions}
      Text: {text}
    `
  )
  const parser = StructuredOutputParser.fromNamesAndDescriptions({
    name: 'The name of the person',
    likes: 'The likes of the person'
  })

  const chain = prompt.pipe(model).pipe(parser)

  const res = await chain.invoke({
    formatInstructions: parser.getFormatInstructions(),
    text: 'John likes to eat pizza and watch movies'
  })
  console.log(res)
}
