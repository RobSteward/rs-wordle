import ThemedButton from '@/components/ThemedButton'
import ThemedLinearGradient from '@/components/ThemedLinearGradient'
import { Colors } from '@/constants/Colors'
import { SignedOut } from '@clerk/clerk-expo'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { Image, StyleSheet, Text, useColorScheme, View } from 'react-native'
import { Button, IconButton } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const EndScreen = () => {
  const insets = useSafeAreaInsets()
  const { win, word, gameField } = useLocalSearchParams<{
    win: string
    word: string
    gameField?: string
  }>()

  const colorScheme = useColorScheme()

  const router = useRouter()
  const [userScores, setUserScores] = useState<any>({
    playedCount: 42,
    winCount: 5,
    currentStreak: 2,
  })

  const shareResults = () => {
    const shareData = {
      title: 'Wordle',
      message: `I won ${win} times in a row!`,
    }
  }

  const navigateToTabs = () => {
    router.dismissAll()
    router.push('/(authenticated)/(tabs)/')
  }

  return (
    <>
      <View
        style={{
          paddingTop: insets.top,
          alignItems: 'flex-end',
        }}
      >
        <IconButton
          icon='close'
          size={25}
          onPress={() => navigateToTabs()}
        />
      </View>

      <ThemedLinearGradient>
        <View style={styles.header}>
          <View style={styles.mainContent}>
            <Image
              source={require('@/assets/images/adaptive-icon.png')}
              style={{ width: 100, height: 100 }}
            />
            <Text style={styles.title}>
              {win ? 'Congratulations! You won.' : 'Thanks for playing today'}
            </Text>
            <Text style={styles.text}>
              {win ? 'Some win text' : 'Some lost text'}
            </Text>
          </View>
          <SignedOut>
            <Text>Want to save your progress?</Text>
            <ThemedButton
              title='Create Free Account'
              onPress={() => router.push('/(authentication)/')}
            />
          </SignedOut>
        </View>
        <Button onPress={() => router.back()}>Share</Button>
        <Text>Some result</Text>
      </ThemedLinearGradient>
    </>
  )
}
export default EndScreen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 50,
    paddingVertical: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  mainContent: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title: {
    fontSize: 30,
    fontFamily: 'FrankRuhlLibre_800ExtraBold',
    color: 'black',
    textAlign: 'center',
  },
  text: {
    fontSize: 20,
    fontFamily: 'FrankRuhlLibre_500Medium',
    color: 'black',
    textAlign: 'left',
  },
})
