import React, { useState, useEffect } from 'react'
import {
  View,
  StyleSheet,
  Text,
  Image,
  Keyboard,
  useColorScheme,
  ScrollView,
} from 'react-native'
import { Button } from 'react-native-paper'
import ThemedLinearGradient from '@/components/ThemedComponents/ThemedLinearGradient'
import SignUpScreen from './sign-up.screen'
import SignInScreen from './sign-in.screen'
import { useLocalSearchParams } from 'expo-router'
import { useRouter } from 'expo-router'
import IconLight from '@/assets/images/wordle-icon-light.svg'
import IconDark from '@/assets/images/wordle-icon-dark.svg'
import ThemedText from '@/components/ThemedComponents/ThemedText'
import { Colors } from '@/constants/Colors'
import SocialAuthentication from '@/components/SocialAuthentication'

interface AuthenticationScreenProps {
  authenticationType?: 'sign-in' | 'sign-up'
}

const AuthenticationScreen: React.FC<AuthenticationScreenProps> = () => {
  const router = useRouter()
  const colorScheme = useColorScheme()

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
    <ScrollView>
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
          {!keyboardVisible && <SocialAuthentication />}
          {!keyboardVisible && (
            <View style={styles.authenticationToggleContainer}>
              <Text style={{ color: Colors[colorScheme ?? 'light'].text }}>
                {isSignUp ? 'Existing' : 'No'} account?
              </Text>
              <Button
                mode='text'
                onPress={() => {
                  toggleAuthenticationMode()
                }}
                textColor={Colors[colorScheme ?? 'light'].text}
              >
                {isSignUp ? 'Sign in' : 'Sign up'}
              </Button>
            </View>
          )}
        </View>
      </ThemedLinearGradient>
    </ScrollView>
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
    paddingHorizontal: 50,
    textAlign: 'center',
    fontFamily: 'FrankRuhlLibre_500Medium',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
    paddingHorizontal: 20,
    maxWidth: 500,
  },
  authenticationContainer: {
    marginBottom: 5,
    marginTop: 5,
    flex: 1,
    justifyContent: 'flex-end',
  },
  text: {
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
})
