import { maybeCompleteAuthSession } from "expo-web-browser"
import { exchangeCodeAsync, makeRedirectUri, useAuthRequest } from "expo-auth-session"
import { useAtom } from "jotai"
import { Platform } from "react-native"
import { useEffect } from "react"

import { twitterAuthenticationAtom } from "../atoms/twitterAuthenticationAtom"
import config from "../../shared/config"

const useProxy = Platform.select({ web: false, default: true })

maybeCompleteAuthSession()

const twitterOptions = {
  clientId: config.twitter.clientId,
  scopes: [
    "tweet.read",
    "users.read",
    "follows.read",
    "follows.write"
  ],
  discovery: {
    authorizationEndpoint: "https://twitter.com/i/oauth2/authorize",
    tokenEndpoint: "https://api.twitter.com/2/oauth2/token",
    revocationEndpoint: "https://twitter.com/i/oauth2/revoke",
  },
}

export const useTwitterAuthentication = () => {
  const [twitterAuthentication, setTwitterAuthentication] = useAtom(twitterAuthenticationAtom)

  const redirectUri = makeRedirectUri({
    scheme: config.app.id,
    useProxy
  })

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: twitterOptions.clientId,
      redirectUri,
      usePKCE: true,
      scopes: twitterOptions.scopes,
    },
    twitterOptions.discovery
  )

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params

      exchangeCodeAsync(
        {
          clientId: twitterOptions.clientId,
          scopes: twitterOptions.scopes,
          redirectUri,
          code,
          extraParams: { code_verifier: request?.codeVerifier || '' },
        },
        twitterOptions.discovery
      )
        .then(setTwitterAuthentication)
        .catch(console.error)
    }
  }, [response])

  return {
    twitterAuthentication,
    promptAuth: () => promptAsync({ useProxy }),
  }
}
