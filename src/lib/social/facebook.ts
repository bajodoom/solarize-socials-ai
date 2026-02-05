export interface SocialAccount {
  accessToken: string
  refreshToken?: string | null
  accountId: string
}

export interface Post {
  content: string
  imageUrl?: string | null
}

export async function publishToFacebook(
  post: Post,
  account: SocialAccount
): Promise<{ success: boolean; postId?: string; error?: string }> {
  try {
    const params = new URLSearchParams({
      message: post.content,
      access_token: account.accessToken,
    })

    if (post.imageUrl) {
      params.append('url', post.imageUrl)
    }

    const endpoint = post.imageUrl
      ? `https://graph.facebook.com/v18.0/${account.accountId}/photos`
      : `https://graph.facebook.com/v18.0/${account.accountId}/feed`

    const response = await fetch(endpoint, {
      method: 'POST',
      body: params,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Facebook API error: ${JSON.stringify(error)}`)
    }

    const result = await response.json()

    return {
      success: true,
      postId: result.id || result.post_id,
    }
  } catch (error) {
    console.error('Error publishing to Facebook:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export async function getFacebookAuthUrl(callbackUrl: string): Promise<string> {
  const appId = process.env.META_APP_ID
  if (!appId) {
    throw new Error('Facebook App ID not configured')
  }

  const params = new URLSearchParams({
    client_id: appId,
    redirect_uri: callbackUrl,
    scope: 'pages_manage_posts,pages_read_engagement',
    response_type: 'code',
  })

  return `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`
}

export async function getFacebookAccessToken(
  code: string,
  callbackUrl: string
): Promise<{ accessToken: string; expiresIn: number }> {
  const appId = process.env.META_APP_ID
  const appSecret = process.env.META_APP_SECRET

  if (!appId || !appSecret) {
    throw new Error('Facebook credentials not configured')
  }

  const params = new URLSearchParams({
    client_id: appId,
    client_secret: appSecret,
    redirect_uri: callbackUrl,
    code,
  })

  const response = await fetch(
    `https://graph.facebook.com/v18.0/oauth/access_token?${params.toString()}`
  )

  if (!response.ok) {
    throw new Error('Failed to get Facebook access token')
  }

  const data = await response.json()

  return {
    accessToken: data.access_token,
    expiresIn: data.expires_in,
  }
}

export async function getFacebookPages(
  accessToken: string
): Promise<Array<{ id: string; name: string; accessToken: string }>> {
  const response = await fetch(
    `https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`
  )

  if (!response.ok) {
    throw new Error('Failed to get Facebook pages')
  }

  const data = await response.json()

  return data.data.map((page: any) => ({
    id: page.id,
    name: page.name,
    accessToken: page.access_token,
  }))
}
