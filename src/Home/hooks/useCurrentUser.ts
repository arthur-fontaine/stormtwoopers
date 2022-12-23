import { useAtom } from "jotai"
import { useCallback } from "react"

import { currentUserAtom } from "../atoms/currentUserAtom"
import { useTwitterApiClient } from "../../shared/TwitterApiClient"

export const useCurrentUser = () => {
  const twitterApiClient = useTwitterApiClient()

  const [currentUser, setCurrentUser] = useAtom(currentUserAtom)

  const fetchCurrentUser = useCallback(async () => {
    const { data: user } = await twitterApiClient.getCurrentUser()
    setCurrentUser(user)
  }, [twitterApiClient, setCurrentUser])

  return { currentUser, fetchCurrentUser }
}
