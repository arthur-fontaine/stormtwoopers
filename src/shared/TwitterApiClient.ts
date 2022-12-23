import { useAtom } from "jotai"
import { useMemo } from "react"
import type { types as TwitterTypes } from "twitter-api-sdk"
import { twitterAuthenticationAtom } from "../Auth/atoms/twitterAuthenticationAtom"

export class TwitterApiClient {
  public fetch: typeof fetch

  constructor(readonly accessToken: string) {
    this.fetch = (input, init) => fetch(
      `https://api.twitter.com/2${input}`,
      {
        ...init,
        headers: {
          ...init?.headers,
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
  }

  async getFollowing(userId: string, nextToken?: string): Promise<TwitterTypes.paths['/2/users/{id}/following']['get']['responses']['200']['content']['application/json']> {
    const response = await this.fetch(`/users/${userId}/following?user.fields=profile_image_url,username,name,description,public_metrics&max_results=100${nextToken ? `&pagination_token=${nextToken}` : ""}`, {
      method: "GET",
    })
    return response.json()
  }

  async getCurrentUser(): Promise<TwitterTypes.paths['/2/users/me']['get']['responses']['200']['content']['application/json']> {
    const response = await this.fetch("/users/me", {
      method: "GET",
    })
    return response.json()
  }

  async unfollow(sourceUserId: string, targetUserId: string): Promise<TwitterTypes.paths['/2/users/{source_user_id}/following/{target_user_id}']['delete']['responses']['200']['content']['application/json']> {
    const response = await this.fetch(`/users/${sourceUserId}/following/${targetUserId}`, {
      method: "DELETE",
    })
    return response.json()
  }
}

export const useTwitterApiClient = () => {
  const [twitterAuthentication] = useAtom(twitterAuthenticationAtom)
  const accessToken = useMemo(() => twitterAuthentication.accessToken!, [twitterAuthentication.accessToken])

  const twitterApiClient = useMemo(() => new TwitterApiClient(accessToken), [accessToken])

  return twitterApiClient
}
