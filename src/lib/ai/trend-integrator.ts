import { prisma } from '@/lib/db'
import { TwitterApi } from 'twitter-api-v2'

export interface Trend {
  platform: string
  topic: string
  hashtag?: string
  rank: number
  category?: string
}

// Fetch trends from Twitter
export async function fetchTwitterTrends(): Promise<Trend[]> {
  if (!process.env.TWITTER_API_KEY || !process.env.TWITTER_API_SECRET) {
    console.warn('Twitter API credentials not configured')
    return []
  }

  try {
    const client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_SECRET,
    })

    // Note: Twitter API v2 trends endpoint requires authentication
    // This is a simplified implementation
    // You may need to use the v1.1 endpoint or implement proper OAuth
    
    // For now, return mock data or implement based on your Twitter API access level
    console.warn('Twitter trends fetching requires proper API access')
    return []
  } catch (error) {
    console.error('Error fetching Twitter trends:', error)
    return []
  }
}

// Fetch trends from database (cached)
export async function getCachedTrends(
  platform: string
): Promise<Trend[]> {
  const now = new Date()

  const trends = await prisma.trend.findMany({
    where: {
      platform,
      expiresAt: {
        gt: now,
      },
    },
    orderBy: {
      rank: 'asc',
    },
    take: 10,
  })

  return trends.map((trend: any) => ({
    platform: trend.platform,
    topic: trend.topic,
    hashtag: trend.hashtag || undefined,
    rank: trend.rank,
    category: trend.category || undefined,
  }))
}

// Store trends in database
export async function storeTrends(trends: Trend[]): Promise<void> {
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + 24) // 24 hour expiration

  const operations = trends.map((trend) =>
    prisma.trend.create({
      data: {
        platform: trend.platform,
        topic: trend.topic,
        hashtag: trend.hashtag,
        rank: trend.rank,
        category: trend.category,
        expiresAt,
      },
    })
  )

  await Promise.all(operations)
}

// Fetch or get cached trends
export async function fetchTrends(platform: string): Promise<Trend[]> {
  // First check cache
  const cachedTrends = await getCachedTrends(platform)
  
  if (cachedTrends.length > 0) {
    return cachedTrends
  }

  // If no cached trends, fetch new ones
  let trends: Trend[] = []

  if (platform === 'twitter') {
    trends = await fetchTwitterTrends()
  } else {
    // For other platforms, return mock trending topics
    trends = getMockTrends(platform)
  }

  // Store fetched trends
  if (trends.length > 0) {
    await storeTrends(trends)
  }

  return trends
}

// Mock trends for platforms without API integration
function getMockTrends(platform: string): Trend[] {
  const mockTopics = [
    { topic: 'AI Technology', hashtag: '#AI', category: 'Technology' },
    { topic: 'Social Media Marketing', hashtag: '#SocialMedia', category: 'Marketing' },
    { topic: 'Digital Transformation', hashtag: '#DigitalTransformation', category: 'Business' },
    { topic: 'Remote Work', hashtag: '#RemoteWork', category: 'Workplace' },
    { topic: 'Sustainability', hashtag: '#Sustainability', category: 'Environment' },
  ]

  return mockTopics.map((topic, index) => ({
    platform,
    topic: topic.topic,
    hashtag: topic.hashtag,
    rank: index + 1,
    category: topic.category,
  }))
}

// Integrate trends into content
export async function integrateTrendsIntoContent(
  content: string,
  trends: Trend[]
): Promise<string> {
  if (trends.length === 0) return content

  // Extract relevant hashtags from trends
  const trendHashtags = trends
    .filter((t) => t.hashtag)
    .map((t) => t.hashtag!)
    .slice(0, 3) // Limit to 3 trending hashtags

  // If content already has hashtags, append trending ones
  if (content.includes('#')) {
    return `${content} ${trendHashtags.join(' ')}`
  }

  // Otherwise, add trending hashtags at the end
  return `${content}\n\n${trendHashtags.join(' ')}`
}

// Clean up expired trends (should be run periodically)
export async function cleanupExpiredTrends(): Promise<number> {
  const now = new Date()

  const result = await prisma.trend.deleteMany({
    where: {
      expiresAt: {
        lt: now,
      },
    },
  })

  return result.count
}
