import { pipeline } from '@xenova/transformers'

async function embedder() {
  const embedder = await pipeline(
    'feature-extraction',
    'Xenova/all-MiniLM-L6-v2'
  )

  const result = await embedder('Hello, world!', {
    pooling: 'mean',
    normalize: true
  })

  console.log(result)
}

async function generateText() {
  const generator = await pipeline(
    'text2text-generation',
    'Xenova/LaMini-Flan-T5-783M'
  )

  const result = await generator('Hello, world!')

  console.log(result)
}
