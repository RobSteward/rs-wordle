import ThemedButton from '@/components/ThemedComponents/ThemedButton'
import ThemedLinearGradient from '@/components/ThemedComponents/ThemedLinearGradient'
import { Colors } from '@/constants/Colors'
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import {
  Image,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  useWindowDimensions,
} from 'react-native'
import { Button, Icon, IconButton, MD3Colors } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import LottieView from 'lottie-react-native'
import IconLight from '@/assets/images/wordle-icon-light.svg'
import IconDark from '@/assets/images/wordle-icon-dark.svg'
import * as MailComposer from 'expo-mail-composer'
import { FIREBASE_DB } from '@/utils/FirebaseConfig'
import { doc, getDoc, increment, setDoc, updateDoc } from 'firebase/firestore'
import { set } from 'date-fns'

const EndScreen = ({
  win,
  word,
  gameField,
}: {
  win: string
  word: string
  gameField?: string
}) => {
  const { width, height } = useWindowDimensions()
  const insets = useSafeAreaInsets()
  const winAnimationRef = useRef<LottieView>(null)
  const confettiAnimationRef = useRef<LottieView>(null)
  const colorScheme = useColorScheme()
  const { user } = useUser()

  const router = useRouter()
  const [userScores, setUserScores] = useState<any>({
    gameCount: 42,
    winCount: 5,
    currentStreak: 2,
    highestStreak: 10,
  })

  const shareResults = () => {
    const game = JSON.parse(gameField!)
    const imageText: string[][] = []
    const wordLetters = word.split('')

    game.forEach((row: string[], rowIndex: number) => {
      imageText.push([])
      row.forEach((letter: string, columnIndex: number) => {
        if (letter === wordLetters[columnIndex]) {
          imageText[rowIndex].push('🟩')
        } else if (wordLetters.includes(letter)) {
          imageText[rowIndex].push('🟨')
        } else {
          imageText[rowIndex].push('⬜')
        }
      })
    })

    console.log('Image text', imageText)

    const html = `
    <!DOCTYPE html>
<html>
<head>
    <style>
        .game {
        display: flex,
        flex-direction: column,
            border-collapse: collapse;
            margin: 20px 0;
        }
        .row {
                display: flex,
        flex-direction: row,

            padding: 10px;
        }
        .cell {
         display: flex,
        justify-content: center,
        align-items: center,

            padding: 10px;
        }
    </style>
</head>
<body>
   <div class="game">
        ${imageText
          .map(
            (row) =>
              `<div class="row">${row
                .map((cell) => `<div class="cell">${cell}</div>`)
                .join('')}</div>`
          )
          .join('')}
    </div>
</body>
</html>
    `

    MailComposer.composeAsync({
      subject: 'I just played The Selection Lab Wordle',
      isHtml: true,
      body: html,
    })
  }

  const navigateToTabs = () => {
    router.dismissAll()
    router.replace('/(tabs)')
  }

  const startNewGame = () => {
    router.dismissAll()
    router.navigate(`/(authenticated)/(tabs)/?newGame=true`)
  }

  useEffect(() => {
    if (win === 'true') {
      confettiAnimationRef.current?.play(0)
    }
  }, [])

  useEffect(() => {
    if (user) {
      setUserData(userScores, user.id)
    }
  }, [user])

  const setUserData = async (data: any, userId: string) => {
    if (!user) {
      throw new Error('User is not defined. Cannot update user data.')
    }

    const documentRef = doc(FIREBASE_DB, `scores/${userId}`)
    const documentSnapshot = await getDoc(documentRef)
    if (documentSnapshot.exists()) {
      const data = documentSnapshot.data()
      const res = await setDoc(
        documentRef,
        {
          LAST_GAME_STATUS: win === 'true' ? 'win' : 'lose',
          LAST_GAME_DATE: new Date().toISOString(),
          GAME_COUNT: increment(1),
          WIN_COUNT: increment(win === 'true' ? 1 : 0),
          CURRENT_STREAK:
            win === 'true' && data.LAST_GAME_STATUS === 'win'
              ? data.CURRENT_STREAK + 1
              : win === 'true'
              ? 1
              : 0,
          HIGHEST_STREAK:
            data.CURRENT_STREAK > data.highestStreak
              ? data.CURRENT_STREAK
              : data.HIGHEST_STREAK,
        },
        {
          merge: true,
          mergeFields: [
            'GAME_COUNT',
            'WIN_COUNT',
            'CURRENT_STREAK',
            'HIGHEST_STREAK',
            'LAST_GAME_STATUS',
            'LAST_GAME_DATE',
          ],
        }
      )
    } else {
      const res = await setDoc(documentRef, {
        LAST_GAME_STATUS: win === 'true' ? 'win' : 'lose',
        LAST_GAME_DATE: new Date().toISOString(),
        GAME_COUNT: increment(1),
        WIN_COUNT: increment(win === 'true' ? 1 : 0),
        CURRENT_STREAK: increment(win === 'true' ? 1 : 0),
        HIGHEST_STREAK: win === 'true' ? increment(1) : increment(0),
      })
    }
  }

  return (
    <>
      <View
        style={{
          paddingTop: insets.top,
          alignItems: 'flex-end',
          backgroundColor: Colors[colorScheme ?? 'light'].headerBackground,
        }}
      >
        <IconButton
          icon='close'
          size={30}
          iconColor={Colors[colorScheme ?? 'light'].text}
          onPress={() => navigateToTabs()}
        />
      </View>

      <ThemedLinearGradient justify='flex-start'>
        <>
          <View style={styles.header}>
            <LottieView
              ref={confettiAnimationRef}
              source={require('@/assets/animations/ConfettiAnimation.json')}
              style={[styles.confettiLottie, { top: height / 2.16, bottom: 0 }]}
              resizeMode='cover'
              loop={false}
              autoPlay={false}
            />
            {win === 'true' ? (
              <LottieView
                source={require('@/assets/animations/WinAnimation.json')}
                autoPlay={true}
                loop={true}
                ref={winAnimationRef}
                speed={1.5}
                style={{
                  width: 100,
                  height: 100,
                }}
              />
            ) : colorScheme === 'dark' ? (
              <IconDark
                width={100}
                height={100}
              />
            ) : (
              <IconLight
                width={100}
                height={100}
              />
            )}
            <Text
              style={[
                styles.title,
                { color: Colors[colorScheme ?? 'light'].text },
              ]}
            >
              {win === 'true' ? 'Congratulations!' : 'Thanks for playing today'}
            </Text>
          </View>
          <View style={styles.content}>
            <SignedOut>
              <Text
                style={[
                  styles.text,
                  { color: Colors[colorScheme ?? 'light'].text },
                ]}
              >
                Want to see your streaks &{'\n'}save your progress?
              </Text>
              <ThemedButton
                title='Create Free Account'
                onPress={() => {
                  router.dismissAll()
                  router.push('/(authentication)/?authenticationType=sign-up')
                }}
                primary={true}
              />
              <Text style={[{ color: Colors[colorScheme ?? 'light'].text }]}>
                Existing account?{' '}
                <Text
                  style={[
                    {
                      color: Colors[colorScheme ?? 'light'].text,
                      textDecorationLine: 'underline',
                    },
                  ]}
                  onPress={() => {
                    router.dismissAll()
                    router.push('/(authentication)/?authenticationType=sign-in')
                  }}
                >
                  Sign in.
                </Text>
              </Text>
            </SignedOut>
            <SignedIn>
              <Text
                style={[
                  styles.text,
                  { color: Colors[colorScheme ?? 'light'].text },
                ]}
              >
                Your Statistics
              </Text>
              <View style={[styles.statistics]}>
                <View style={styles.scoreContainer}>
                  <View>
                    <Text
                      style={[
                        styles.score,
                        { color: Colors[colorScheme ?? 'light'].text },
                      ]}
                    >
                      {userScores.gameCount}
                    </Text>
                    <Text
                      style={[{ color: Colors[colorScheme ?? 'light'].text }]}
                    >
                      Games Played
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={[
                        styles.score,
                        { color: Colors[colorScheme ?? 'light'].text },
                      ]}
                    >
                      {userScores.winCount}
                    </Text>
                    <Text
                      style={[{ color: Colors[colorScheme ?? 'light'].text }]}
                    >
                      Games Won
                    </Text>
                  </View>
                </View>
                <View style={styles.scoreContainer}>
                  <View>
                    <Text
                      style={[
                        styles.score,
                        { color: Colors[colorScheme ?? 'light'].text },
                      ]}
                    >
                      {userScores.currentStreak}
                    </Text>
                    <Text
                      style={[{ color: Colors[colorScheme ?? 'light'].text }]}
                    >
                      Current Streak
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={[
                        styles.score,
                        { color: Colors[colorScheme ?? 'light'].text },
                      ]}
                    >
                      {userScores.highestStreak}
                    </Text>
                    <Text
                      style={[{ color: Colors[colorScheme ?? 'light'].text }]}
                    >
                      Highest Streak
                    </Text>
                  </View>
                </View>
              </View>
            </SignedIn>
            <View style={styles.shareContainer}>
              <IconButton
                icon='share'
                mode='contained-tonal'
                iconColor={Colors[colorScheme ?? 'light'].iconButtonIcon}
                containerColor={
                  Colors[colorScheme ?? 'light'].iconButtonBackground
                }
                rippleColor={
                  Colors[colorScheme ?? 'light'].iconButtonBackground
                }
                animated={true}
                size={20}
                onPress={() => {
                  shareResults()
                }}
              />
              <Text style={[{ color: Colors[colorScheme ?? 'light'].text }]}>
                Share your results with a friend!
              </Text>
            </View>
            <View
              style={{
                backgroundColor: Colors[colorScheme ?? 'light'].border,
                height: StyleSheet.hairlineWidth,
                width: '100%',
                marginVertical: 10,
              }}
            />
          </View>
          <View style={styles.bottomContainer}>
            <ThemedButton
              title='Play again'
              onPress={() => {
                startNewGame()
              }}
              primary={true}
              styles={{ width: '100%' }}
            />
          </View>
        </>
      </ThemedLinearGradient>
    </>
  )
}
export default EndScreen
const styles = StyleSheet.create({
  header: {
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    padding: 20,
  },
  content: {
    alignItems: 'center',
    gap: 20,
  },
  title: {
    fontSize: 30,
    fontFamily: 'FrankRuhlLibre_800ExtraBold',
    textAlign: 'center',
  },
  text: {
    fontSize: 25,
    fontFamily: 'FrankRuhlLibre_500Medium',
    textAlign: 'center',
    marginBottom: 50,
  },
  confettiLottie: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -1,
    pointerEvents: 'none',
  },
  statistics: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 50,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 50,
  },
  score: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bottomContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1,
    marginBottom: 100,
  },
  shareContainer: {
    alignItems: 'center',
    gap: 5,
  },
})
