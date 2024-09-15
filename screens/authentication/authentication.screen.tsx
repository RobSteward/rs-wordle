import React, { useState, useEffect } from 'react'
import {
  View,
  StyleSheet,
  Text,
  Image,
  Keyboard,
  useColorScheme,
} from 'react-native'
import { Button } from 'react-native-paper'
import ThemedLinearGradient from '@/components/ThemedLinearGradient'
import SignUpScreen from './sign-up.screen'
import SignInScreen from './sign-in.screen'
import { useLocalSearchParams } from 'expo-router'
import { useOAuth } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import IconLight from '@/assets/images/wordle-icon-light-variant.svg'
import IconDark from '@/assets/images/wordle-icon-dark.svg'
import ThemedText from '@/components/ThemedText'

interface AuthenticationScreenProps {
  authenticationType?: 'sign-in' | 'sign-up'
}

enum AuthenticationStrategy {
  Apple = 'oauth_apple',
  Google = 'oauth_google',
  Microsoft = 'oauth_microsoft',
}

const AuthenticationScreen: React.FC<AuthenticationScreenProps> = () => {
  const router = useRouter()
  const colorScheme = useColorScheme()
  const { startOAuthFlow: appleAuthFlow } = useOAuth({
    strategy: AuthenticationStrategy.Apple,
  })
  const { startOAuthFlow: googleAuthFlow } = useOAuth({
    strategy: AuthenticationStrategy.Google,
  })
  const { startOAuthFlow: microsoftAuthFlow } = useOAuth({
    strategy: AuthenticationStrategy.Microsoft,
  })

  const onSelectAuth = async (strategy: AuthenticationStrategy) => {
    console.log('Starting OAuth flow...', strategy)
  }
  const { authenticationType } = useLocalSearchParams()
  const [isSignUp, setIsSignUp] = useState<boolean>(
    authenticationType === 'sign-up'
  )
  const [keyboardVisible, setKeyboardVisible] = useState(false)
  const toggleAuthenticationMode = () => setIsSignUp(!isSignUp)

  useEffect(() => {
    const keyboardDidShow = () => setKeyboardVisible(true)
    const keyboardDidHide = () => setKeyboardVisible(false)

    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      keyboardDidShow
    )
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      keyboardDidHide
    )

    return () => {
      keyboardDidShowListener.remove()
      keyboardDidHideListener.remove()
    }
  }, [])

  return (
    <ThemedLinearGradient>
      <View style={styles.headerContainer}>
        {colorScheme === 'dark' ? (
          <IconDark
            width={50}
            height={50}
            style={styles.logo}
          />
        ) : (
          <IconLight
            width={50}
            height={50}
            style={styles.logo}
          />
        )}
        <ThemedText style={styles.title}>The Selection Lab wordle</ThemedText>
      </View>

      <View style={styles.container}>
        <View style={styles.authenticationContainer}>
          {isSignUp ? <SignUpScreen /> : <SignInScreen />}
        </View>
        {/* {!keyboardVisible && <SocialLogins isSignUp={isSignUp} />} */}

        <View style={styles.authenticationToggleContainer}>
          <Text style={styles.authenticationToggleText}>
            {isSignUp ? 'Existing' : 'No'} account?
          </Text>
          <Button
            mode='text'
            onPress={() => {
              toggleAuthenticationMode()
            }}
            textColor='white'
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </Button>
        </View>
      </View>
    </ThemedLinearGradient>
  )
}

export default AuthenticationScreen

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: 50,
  },
  logo: {
    marginTop: 20,
    marginBottom: 10,
    alignSelf: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    paddingHorizontal: 50,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
    paddingHorizontal: 20,
  },
  authenticationContainer: {
    marginBottom: 5,
    marginTop: 5,
    flex: 1,
    justifyContent: 'flex-end',
  },
  text: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  },
  authenticationToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  authenticationToggleText: {
    color: 'white',
  },
})
