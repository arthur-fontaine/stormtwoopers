import { atom } from "jotai"

export const twitterAuthenticationAtom = atom<{
  accessToken?: string
}>({
  accessToken: undefined,
})
