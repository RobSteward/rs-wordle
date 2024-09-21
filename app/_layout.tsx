import { Stack, useRouter } from 'expo-router'
import {
  FrankRuhlLibre_500Medium,
  FrankRuhlLibre_800ExtraBold,
  FrankRuhlLibre_900Black,
  useFonts,
} from '@expo-google-fonts/frank-ruhl-libre'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect, useState } from 'react'
import {
  useColorScheme,
  View,
  Text,
  Image,
  StyleSheet,
  Appearance,
  Platform,
} from 'react-native'
import {
  ThemeProvider,
  DarkTheme,
  DefaultTheme,
} from '@react-navigation/native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo'
import { tokenCache } from '@/utils/cache'
import { MD3Colors, IconButton } from 'react-native-paper'
import * as React from 'react'
import { ToastProvider } from 'react-native-toast-notifications'
import LottieView from 'lottie-react-native'
import ThemedLinearGradient from '@/components/ThemedComponents/ThemedLinearGradient'
import { getData } from '@/utils/storage'
import { EventRegister } from 'react-native-event-listeners'
import { LogBox } from 'react-native'

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

if (!publishableKey) {
  throw new Error(
    'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env'
  )
}

SplashScreen.preventAutoHideAsync()

if (__DEV__) {
  const ignoreWarns = ['Clerk: ']

  const warn = console.warn
  console.warn = (...arg) => {
    for (const warning of ignoreWarns) {
      if (arg[0].startsWith(warning)) {
        return
      }
    }
    warn(...arg)
  }

  LogBox.ignoreLogs(ignoreWarns)
}

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const [fontsLoaded, fontsLoadedError] = useFonts({
    FrankRuhlLibre_500Medium,
    FrankRuhlLibre_800ExtraBold,
    FrankRuhlLibre_900Black,
  })
  const router = useRouter()

  const fetchTheme = async () => {
    try {
      const darkModeValue = await getData('dark-mode')
      const isDarkMode = darkModeValue === 'true'

      if (
        Platform.OS !== 'web' &&
        isDarkMode !== null &&
        isDarkMode !== undefined
      ) {
        Appearance.setColorScheme(isDarkMode ? 'dark' : 'light')
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    }
  }

  useEffect(() => {
    fetchTheme()

    const eventListener = EventRegister.addEventListener(
      'isDarkMode',
      (darkModeValue) => {
        if (Platform.OS !== 'web') {
          Appearance.setColorScheme(darkModeValue ? 'dark' : 'light')
        }
      }
    )

    return () => {
      EventRegister.removeEventListener(eventListener as string)
    }
  }, [])

  useEffect(() => {
    if (fontsLoaded || fontsLoadedError) {
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded, fontsLoadedError])

  if (!fontsLoaded && !fontsLoadedError) {
    return (
      <ThemedLinearGradient>
        <View style={styles.container}>
          <Text style={styles.text}>Loading...</Text>
          <LottieView
            source={require('@/assets/animations/LoaderAnimation.json')}
            style={{
              width: '20%',
              height: '20%',
            }}
            autoPlay
            loop
          />
        </View>
      </ThemedLinearGradient>
    )
  }

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      tokenCache={tokenCache}
    >
      <ClerkLoaded>
        <ToastProvider>
          <ThemeProvider
            value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
          >
            <GestureHandlerRootView>
              <BottomSheetModalProvider>
                <Stack
                  initialRouteName={'(index'}
                  screenOptions={{
                    headerShown: false,
                  }}
                >
                  <Stack.Screen name='index' />
                  <Stack.Screen
                    name='(authentication)'
                    options={{
                      // presentation: 'modal',
                      headerShadowVisible: false,
                      headerShown: true,
                      headerTitle: 'Authentication',
                      headerLeft: () => (
                        <IconButton
                          icon='close'
                          iconColor={MD3Colors.primary20}
                          size={20}
                          onPress={() => router.back()}
                        />
                      ),
                    }}
                  />
                </Stack>
              </BottomSheetModalProvider>
            </GestureHandlerRootView>
          </ThemeProvider>
        </ToastProvider>
      </ClerkLoaded>
    </ClerkProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  text: {
    fontFamily: 'FrankRuhlLibre_800ExtraBold',
    fontSize: 30,
    color: '#fff',
  },
})