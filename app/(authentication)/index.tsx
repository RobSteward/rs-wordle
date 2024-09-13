import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { useOAuth } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import SignUpScreen from '@/screens/authentication/sign-up.screen'
import SignInScreen from '@/screens/authentication/sign-in.screen'

enum AuthenticationStrategy {
  Apple = 'oauth_apple',
  Google = 'oauth_google',
  Microsoft = 'oauth_microsoft',
}

const Authentication = () => {
  const router = useRouter()
  const { startOAuthFlow: appleAuthFlow } = useOAuth({
    strategy: AuthenticationStrategy.Apple,
  })
  const { startOAuthFlow: googleAuthFlow } = useOAuth({
    strategy: AuthenticationStrategy.Google,
  })
  const { startOAuthFlow: microsoftAuthFlow } = useOAuth({
    strategy: AuthenticationStrategy.Microsoft,
  })

  const onSelectAuth = async (strategy: AuthenticationStrategy) => {}
  const [isSignUp, setIsSignUp] = useState(true)
  return <>{isSignUp ? <SignUpScreen /> : <SignInScreen />}</>
}
export default Authentication
