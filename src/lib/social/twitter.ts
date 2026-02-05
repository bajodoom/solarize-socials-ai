import { TwitterApi } from 'twitter-api-v2'

export interface SocialAccount {
  accessToken: string
  refreshToken?: string | null
}

export interface Post {
  content: string
  imageUrl?: string | null
}

export async function publishToTwitter(
  post: Post,
  account: SocialAccount
): Promise<{ success: boolean; postId?: string; error?: string }> {
  try {
    const client = new TwitterApi(account.accessToken)

    let mediaId: string | undefined

    // Upload image if present
    if (post.imageUrl) {
      try {
        // Download image and upload to Twitter
        const imageResponse = await fetch(post.imageUrl)
        const imageBuffer = await imageResponse.arrayBuffer()
        
        mediaId = await client.v1.uploadMedia(Buffer.from(imageBuffer), {
          mimeType: 'image/png',
        })
      } catch (error) {
        console.error('Error uploading image to Twitter:', error)
        // Continue without image
      }
    }

    // Create tweet
    const tweetData: any = {
      text: post.content,
    }

    if (mediaId) {
      tweetData.media = { media_ids: [mediaId] }
    }

    const tweet = await client.v2.tweet(tweetData)

    return {
      success: true,
      postId: tweet.data.id,
    }
  } catch (error) {
    console.error('Error publishing to Twitter:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export async function getTwitterAuthUrl(
  callbackUrl: string
): Promise<{ url: string; oauth_token: string; oauth_token_secret: string }> {
  if (!process.env.TWITTER_API_KEY || !process.env.TWITTER_API_SECRET) {
    throw new Error('Twitter API credentials not configured')
  }

  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
  })

  const authLink = await client.generateAuthLink(callbackUrl, {
    linkMode: 'authorize',
  })

  return {
    url: authLink.url,
    oauth_token: authLink.oauth_token,
    oauth_token_secret: authLink.oauth_token_secret,
  }
}

export async function getTwitterAccessToken(
  oauth_token: string,
  oauth_token_secret: string,
  oauth_verifier: string
): Promise<{
  accessToken: string
  accessSecret: string
  userId: string
  screenName: string
}> {
  if (!process.env.TWITTER_API_KEY || !process.env.TWITTER_API_SECRET) {
    throw new Error('Twitter API credentials not configured')
  }

  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: oauth_token,
    accessSecret: oauth_token_secret,
  })

  const { client: loggedClient, accessToken, accessSecret } =
    await client.login(oauth_verifier)

  const user = await loggedClient.v2.me()

  return {
    accessToken,
    accessSecret,
    userId: user.data.id,
    screenName: user.data.username,
  }
}
