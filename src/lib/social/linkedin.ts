export interface SocialAccount {
  accessToken: string
  refreshToken?: string | null
  accountId: string
}

export interface Post {
  content: string
  imageUrl?: string | null
}

export async function publishToLinkedIn(
  post: Post,
  account: SocialAccount
): Promise<{ success: boolean; postId?: string; error?: string }> {
  try {
    const postData: any = {
      author: `urn:li:person:${account.accountId}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: post.content,
          },
          shareMediaCategory: post.imageUrl ? 'IMAGE' : 'NONE',
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
      },
    }

    if (post.imageUrl) {
      // For simplicity, we'll post without image processing
      // In production, you'd need to upload the image first using LinkedIn's upload API
      console.warn('LinkedIn image upload not fully implemented')
    }

    const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${account.accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify(postData),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`LinkedIn API error: ${error}`)
    }

    const result = await response.json()

    return {
      success: true,
      postId: result.id,
    }
  } catch (error) {
    console.error('Error publishing to LinkedIn:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export async function getLinkedInAuthUrl(
  callbackUrl: string
): Promise<string> {
  const clientId = process.env.LINKEDIN_CLIENT_ID
  if (!clientId) {
    throw new Error('LinkedIn client ID not configured')
  }

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: callbackUrl,
    scope: 'r_liteprofile r_emailaddress w_member_social',
  })

  return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`
}

export async function getLinkedInAccessToken(
  code: string,
  callbackUrl: string
): Promise<{ accessToken: string; expiresIn: number }> {
  const clientId = process.env.LINKEDIN_CLIENT_ID
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('LinkedIn credentials not configured')
  }

  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: callbackUrl,
    client_id: clientId,
    client_secret: clientSecret,
  })

  const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  })

  if (!response.ok) {
    throw new Error('Failed to get LinkedIn access token')
  }

  const data = await response.json()

  return {
    accessToken: data.access_token,
    expiresIn: data.expires_in,
  }
}

export async function getLinkedInProfile(
  accessToken: string
): Promise<{ id: string; name: string }> {
  const response = await fetch('https://api.linkedin.com/v2/me', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to get LinkedIn profile')
  }

  const data = await response.json()

  return {
    id: data.id,
    name: `${data.localizedFirstName} ${data.localizedLastName}`,
  }
}
