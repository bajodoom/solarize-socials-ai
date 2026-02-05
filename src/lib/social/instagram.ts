export interface SocialAccount {
  accessToken: string
  refreshToken?: string | null
  accountId: string
}

export interface Post {
  content: string
  imageUrl?: string | null
}

export async function publishToInstagram(
  post: Post,
  account: SocialAccount
): Promise<{ success: boolean; postId?: string; error?: string }> {
  try {
    // Instagram requires an image for posts
    if (!post.imageUrl) {
      return {
        success: false,
        error: 'Instagram posts require an image',
      }
    }

    // Step 1: Create media container
    const containerParams = new URLSearchParams({
      image_url: post.imageUrl,
      caption: post.content,
      access_token: account.accessToken,
    })

    const containerResponse = await fetch(
      `https://graph.facebook.com/v18.0/${account.accountId}/media`,
      {
        method: 'POST',
        body: containerParams,
      }
    )

    if (!containerResponse.ok) {
      const error = await containerResponse.json()
      throw new Error(`Instagram container error: ${JSON.stringify(error)}`)
    }

    const containerData = await containerResponse.json()
    const creationId = containerData.id

    // Step 2: Publish the container
    const publishParams = new URLSearchParams({
      creation_id: creationId,
      access_token: account.accessToken,
    })

    const publishResponse = await fetch(
      `https://graph.facebook.com/v18.0/${account.accountId}/media_publish`,
      {
        method: 'POST',
        body: publishParams,
      }
    )

    if (!publishResponse.ok) {
      const error = await publishResponse.json()
      throw new Error(`Instagram publish error: ${JSON.stringify(error)}`)
    }

    const publishData = await publishResponse.json()

    return {
      success: true,
      postId: publishData.id,
    }
  } catch (error) {
    console.error('Error publishing to Instagram:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// Instagram uses Facebook authentication
export async function getInstagramAuthUrl(callbackUrl: string): Promise<string> {
  const appId = process.env.META_APP_ID
  if (!appId) {
    throw new Error('Facebook App ID not configured')
  }

  const params = new URLSearchParams({
    client_id: appId,
    redirect_uri: callbackUrl,
    scope: 'instagram_basic,instagram_content_publish',
    response_type: 'code',
  })

  return `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`
}

export async function getInstagramBusinessAccount(
  accessToken: string,
  facebookPageId: string
): Promise<{ id: string; username: string }> {
  const response = await fetch(
    `https://graph.facebook.com/v18.0/${facebookPageId}?fields=instagram_business_account&access_token=${accessToken}`
  )

  if (!response.ok) {
    throw new Error('Failed to get Instagram business account')
  }

  const data = await response.json()

  if (!data.instagram_business_account) {
    throw new Error('No Instagram business account linked to this Facebook page')
  }

  const igAccountId = data.instagram_business_account.id

  // Get Instagram account details
  const igResponse = await fetch(
    `https://graph.facebook.com/v18.0/${igAccountId}?fields=username&access_token=${accessToken}`
  )

  if (!igResponse.ok) {
    throw new Error('Failed to get Instagram account details')
  }

  const igData = await igResponse.json()

  return {
    id: igAccountId,
    username: igData.username,
  }
}
