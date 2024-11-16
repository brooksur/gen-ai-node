import OpenAI from 'openai'
import fs from 'fs'
import path from 'path'

class ImageAssistant {
  private openai: OpenAI

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }

  async generateImage(prompt: string) {
    const response = await this.openai.images.generate({
      model: 'dall-e-2',
      prompt,
      style: 'natural',
      n: 1,
      size: '1024x1024',
      response_format: 'b64_json',
    })

    const image = response.data[0].b64_json

    if (!image) {
      throw new Error('No image data returned')
    }

    const imagePath = await this.saveImage(image, 'image.png')

    return imagePath
  }

  async generateVariation(imagePath: string) {
    imagePath = path.join(__dirname, imagePath)
    const response = await this.openai.images.createVariation({
      image: fs.createReadStream(imagePath),
      model: 'dall-e-2',
      n: 1,
      response_format: 'b64_json',
    })

    const image = response.data[0].b64_json

    if (!image) {
      throw new Error('No image data returned')
    }

    const newImagePath = await this.saveImage(image, 'variation.png')

    return newImagePath
  }

  async generateEdit(imagePath: string, maskPath: string, prompt: string) {
    imagePath = path.join(__dirname, imagePath)
    maskPath = path.join(__dirname, maskPath)

    const response = await this.openai.images.edit({
      image: fs.createReadStream(imagePath),
      mask: fs.createReadStream(maskPath),
      prompt,
      response_format: 'b64_json',
    })

    const image = response.data[0].b64_json

    if (!image) {
      throw new Error('No image data returned')
    }

    const newImagePath = await this.saveImage(image, 'edit.png')

    return newImagePath
  }

  private async saveImage(image: string, filename: string) {
    const imagePath = path.join(__dirname, filename)
    fs.writeFileSync(imagePath, Buffer.from(image, 'base64'))
    console.log(`Image saved to ${imagePath}`)
    return imagePath
  }
}

const imageAssistant = new ImageAssistant()

imageAssistant
  .generateEdit('image.png', 'mask.png', 'Add a lightning strike!')
  .then(console.log)
