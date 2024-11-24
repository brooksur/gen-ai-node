import { HfInference } from '@huggingface/inference'
import fs from 'fs'

const inference = new HfInference(process.env.HF_TOKEN)

async function embed() {
  const output = await inference.featureExtraction({
    inputs: ['Hello, world!', 'Goodbye, world!', 'Hi there!', 'Hello, world!'],
    model: 'sentence-transformers/all-MiniLM-L6-v2'
  })

  console.log(output)
}

async function translate() {
  const output = await inference.translation({
    inputs: 'Hello, world!',
    model: 't5-base'
  })

  console.log(output)
}

async function translate2() {
  const output = await inference.translation({
    inputs: 'Hello, world!',
    model: 'facebook/nllb-200-distilled-600M',
    // @ts-ignore
    parameters: {
      tgt_lang: 'fr',
      src_lang: 'en'
    }
  })

  console.log(output)
}

async function answerQuestion() {
  const output = await inference.questionAnswering({
    inputs: {
      question: 'What is the meaning of life?',
      context: `The quick brown fox jumps over the lazy dog.`
    },
    model: 'deepset/roberta-base-squad2'
  })

  console.log(output)
}

async function textToImage() {
  const output = await inference.textToImage({
    inputs: 'A beautiful mountain landscape at sunset',
    model: 'stabilityai/stable-diffusion-2'
  })

  fs.writeFileSync('output.png', Buffer.from(await output.arrayBuffer()))

  console.log(output)
}

import './transformers.ts'
