import { useAtom } from "jotai"
import { useCallback, useState } from "react"

import { useTwitterApiClient } from "../../shared/TwitterApiClient"
import { followingAtom } from "../atoms/followingAtom"

export const useFollowing = () => {
  const twitterApiClient = useTwitterApiClient()

  const [following, setFollowing] = useAtom(followingAtom)
  const [nextToken, setNextToken] = useState<string | undefined>()

  const fetchFollowing = useCallback(async (userId: string, usePagination = true) => {
    const { data: following, meta } = await twitterApiClient.getFollowing(userId, usePagination ? nextToken : undefined)

    setNextToken(meta?.next_token)
    setFollowing((prev) => {
      let newFollowing = following
      if (usePagination) {
        newFollowing = [...(prev ?? []), ...(following ?? [])]
      }
      return newFollowing
    })
  }, [twitterApiClient, setFollowing, nextToken])

  return { following, fetchFollowing }
}
