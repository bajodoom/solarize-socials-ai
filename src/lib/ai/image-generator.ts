import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface GenerateImageParams {
  prompt: string
  style?: string
}

export interface GeneratedImage {
  url: string
  prompt: string
  revisedPrompt?: string
}

export async function generateImage(
  params: GenerateImageParams
): Promise<GeneratedImage> {
  const { prompt, style } = params

  let enhancedPrompt = prompt

  if (style) {
    enhancedPrompt = `${prompt}, ${style} style`
  }

  try {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: enhancedPrompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
    })

    const imageUrl = response.data[0].url
    const revisedPrompt = response.data[0].revised_prompt

    if (!imageUrl) {
      throw new Error('No image URL returned from OpenAI')
    }

    return {
      url: imageUrl,
      prompt: enhancedPrompt,
      revisedPrompt,
    }
  } catch (error) {
    console.error('Error generating image:', error)
    throw new Error(
      `Failed to generate image: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

export async function generateImageFromContent(
  content: string,
  platform: string
): Promise<GeneratedImage> {
  // Create an image generation prompt based on the content
  const prompt = `Create a professional, eye-catching image for a ${platform} post. The post is about: ${content.substring(0, 200)}. Make it visually appealing and suitable for social media.`

  return generateImage({ prompt })
}
