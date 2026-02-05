import OpenAI from 'openai'
import { extractHashtags, getCharacterLimit } from '@/lib/utils'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface GenerateContentParams {
  topic: string
  platform: 'twitter' | 'linkedin' | 'instagram' | 'facebook'
  tone: 'professional' | 'casual' | 'funny' | 'inspiring'
  includeTrends?: boolean
  variations?: number
  trends?: Array<{ topic: string; hashtag?: string }>
}

export interface ContentVariation {
  text: string
  hashtags: string[]
  characterCount: number
}

export interface GeneratedContent {
  variations: ContentVariation[]
  platform: string
  tone: string
  aiModel: string
  prompt: string
}

export async function generateContent(
  params: GenerateContentParams
): Promise<GeneratedContent> {
  const {
    topic,
    platform,
    tone,
    includeTrends = false,
    variations = 3,
    trends = [],
  } = params

  const characterLimit = getCharacterLimit(platform)
  
  // Build the prompt based on parameters
  let prompt = `Generate ${variations} different ${tone} social media posts for ${platform} about: ${topic}\n\n`
  
  prompt += `Requirements:\n`
  prompt += `- Each variation should be unique and engaging\n`
  prompt += `- Stay within ${characterLimit} characters\n`
  prompt += `- Include relevant hashtags\n`
  prompt += `- Match the ${tone} tone\n`
  
  if (includeTrends && trends.length > 0) {
    prompt += `- Incorporate these trending topics if relevant: ${trends.map(t => t.hashtag || t.topic).join(', ')}\n`
  }
  
  if (platform === 'twitter') {
    prompt += `- Keep it concise and punchy\n`
    prompt += `- Use 2-3 hashtags maximum\n`
  } else if (platform === 'linkedin') {
    prompt += `- Use professional language\n`
    prompt += `- Can be more detailed\n`
    prompt += `- Include call-to-action if appropriate\n`
  } else if (platform === 'instagram') {
    prompt += `- Use engaging, visual language\n`
    prompt += `- Include emoji if fitting\n`
    prompt += `- Multiple hashtags are okay (5-10)\n`
  } else if (platform === 'facebook') {
    prompt += `- Conversational and engaging\n`
    prompt += `- Can include questions to drive engagement\n`
  }
  
  prompt += `\nFormat: Return only a JSON array with ${variations} objects, each with a "text" field containing the post content. Example:\n`
  prompt += `[{"text": "Post content here..."}, {"text": "Another variation..."}]`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are an expert social media content creator. Generate engaging, platform-optimized content that drives engagement.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 2000,
    })

    const response = completion.choices[0].message.content
    if (!response) {
      throw new Error('No response from OpenAI')
    }

    // Parse the JSON response
    let parsedVariations: Array<{ text: string }>
    try {
      parsedVariations = JSON.parse(response)
    } catch (e) {
      // If parsing fails, try to extract JSON from the response
      const jsonMatch = response.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        parsedVariations = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('Failed to parse AI response')
      }
    }

    // Process variations
    const processedVariations: ContentVariation[] = parsedVariations.map(
      (variation) => {
        const text = variation.text.trim()
        const hashtags = extractHashtags(text)
        return {
          text,
          hashtags,
          characterCount: text.length,
        }
      }
    )

    return {
      variations: processedVariations,
      platform,
      tone,
      aiModel: 'gpt-4o',
      prompt,
    }
  } catch (error) {
    console.error('Error generating content:', error)
    throw new Error(
      `Failed to generate content: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

export async function regenerateVariation(
  originalText: string,
  platform: string,
  tone: string
): Promise<ContentVariation> {
  const characterLimit = getCharacterLimit(platform)
  
  const prompt = `Create a new variation of this ${platform} post while maintaining the ${tone} tone:\n\n"${originalText}"\n\nRequirements:\n- Keep within ${characterLimit} characters\n- Make it unique but on the same topic\n- Include relevant hashtags\n- Return only the new post text, nothing else.`

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'You are an expert social media content creator.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.8,
    max_tokens: 500,
  })

  const text = completion.choices[0].message.content?.trim() || originalText
  const hashtags = extractHashtags(text)

  return {
    text,
    hashtags,
    characterCount: text.length,
  }
}
