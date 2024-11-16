import OpenAI from 'openai'
import fs from 'fs'
import path from 'path'

class TextToSpeech {
  private openai: OpenAI

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }

  async createTranscription(filePath: string) {
    const response = await this.openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: 'whisper-1',
      language: 'en',
    })

    return response.text
  }

  async createTranslation(filePath: string) {
    const response = await this.openai.audio.translations.create({
      file: fs.createReadStream(filePath),
      model: 'whisper-1',
    })

    return response.text
  }

  async createSpeech(text: string) {
    const response = await this.openai.audio.speech.create({
      model: 'tts-1',
      input: text,
      voice: 'shimmer',
      response_format: 'mp3',
    })

    const buffer = Buffer.from(await response.arrayBuffer())
    fs.writeFileSync('speech.mp3', buffer)

    return response
  }
}

const textToSpeech = new TextToSpeech()

textToSpeech.createSpeech('Hello........ WORLD!').then((response) => {
  console.log(response)
})
