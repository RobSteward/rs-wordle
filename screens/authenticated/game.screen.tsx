import ThemedKeyboard, {
  BACKSPACE,
  ENTER,
} from '@/components/ThemedComponents/ThemedKeyboard'
import SettingsModal from '@/components/Modals/SettingsModal'
import { Colors } from '@/constants/Colors'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { useRouter, useLocalSearchParams, Link, Stack } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { StyleSheet, useColorScheme, View, Text, Platform } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  ZoomIn,
} from 'react-native-reanimated'
import { SignedIn, SignedOut, useAuth, useUser } from '@clerk/clerk-expo'
import { Toast } from 'react-native-toast-notifications'
import { IconButton } from 'react-native-paper'
import checkIsValidWord from '@/api/checkIsValidWord'
import getRandomWord from '@/api/getRandomWord'
import { set } from 'date-fns'
import ThemedLinearGradient from '@/components/ThemedComponents/ThemedLinearGradient'
import LottieView from 'lottie-react-native'

const ROWS = parseInt(process.env.EXPO_PUBLIC_ROWS ?? '6')
const MAX_WORD_ATTEMPTS = parseInt(
  process.env.EXPO_PUBLIC_MAX_WORD_ATTEMPTS ?? '10'
)

interface GameScreenProps {
  newGame?: boolean
}

const GameScreen: React.FC<GameScreenProps> = ({ newGame = false }) => {
  const [targetWord, setTargetWord] = useState('')
  const targetLetters = targetWord.split('')
  const colorScheme = useColorScheme()
  const router = useRouter()
  const { user } = useUser()
  const { signOut } = useAuth()
  const [counter, setCounter] = useState(0)
  const [isNewGame, setIsNewGame] = useState<boolean>(newGame)
  const [isLoading, setIsLoading] = useState(false)
  const [rows, setRows] = useState<string[][]>(
    new Array(ROWS).fill(new Array(5).fill(''))
  )
  const [currentRow, setCurrentRow] = useState(0)
  const [currentColumn, _setCurrentColumn] = useState(0)

  const [correctLetters, setCorrectLetters] = useState<string[]>([''])
  const [presentLetters, setPresentLetters] = useState<string[]>([''])
  const [notPresentLetters, setNotPresentLetters] = useState<string[]>([''])

  const settingsModalRef = useRef<BottomSheetModal>(null)

  const columnStateRef = useRef(currentColumn)
  const setCurrentColumn = (column: number) => {
    columnStateRef.current = column
    _setCurrentColumn(column)
  }

  const processKey = (key: string) => {
    const newRows = [...rows.map((row) => [...row])]

    if (key === 'ENTER') {
      checkWord()
    } else if (key === 'BACKSPACE') {
      if (columnStateRef.current === 0) {
        newRows[currentRow][0] = ''
        setRows(newRows)
        return
      }

      newRows[currentRow][columnStateRef.current - 1] = ''

      setCurrentColumn(columnStateRef.current - 1)
      setRows(newRows)
      return
    } else if (columnStateRef.current >= newRows[currentRow].length) {
      shakeRow()
      return
    } else {
      newRows[currentRow][columnStateRef.current] = key
      setRows(newRows)
      setCurrentColumn(columnStateRef.current + 1)
    }
  }

  const checkWord = () => {
    const currentWord = rows[currentRow].join('')

    if (currentWord.length < targetWord.length) {
      const toastId = Toast.show('Not enough letters', {
        type: 'danger',
        placement: 'top',
        duration: 1000,
      })
      shakeRow()
      return
    }

    flipRow()

    const newCorrectLetters: string[] = []
    const newPresentLetters: string[] = []
    const newNotPresentLetters: string[] = []

    currentWord.split('').forEach((letter, index) => {
      if (letter === targetWord[index]) {
        newCorrectLetters.push(letter)
      } else if (targetWord.includes(letter)) {
        newPresentLetters.push(letter)
      } else {
        newNotPresentLetters.push(letter)
      }
    })

    setCorrectLetters([...correctLetters, ...newCorrectLetters])
    setPresentLetters([...presentLetters, ...newPresentLetters])
    setNotPresentLetters([...notPresentLetters, ...newNotPresentLetters])

    setTimeout(() => {
      if (currentWord === targetWord) {
        router.push(
          `/(authenticated)/end?win=true&word=${currentWord}&gameField=${JSON.stringify(
            rows
          )}`
        )
      } else if (currentRow + 1 >= rows.length) {
        router.push(
          `/end?win=false&word=${currentWord}&gameField=${JSON.stringify(rows)}`
        )
      }
    }, 1000)

    setCurrentRow(currentRow + 1)
    setCurrentColumn(0)
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        processKey('ENTER')
      } else if (event.key === 'Backspace') {
        processKey('BACKSPACE')
      } else if (event.key.length === 1) {
        processKey(event.key)
      }
    }

    if (Platform.OS === 'web') {
      window.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      if (Platform.OS === 'web') {
        window.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [currentColumn])

  const setCellColor = (cell: string, rowIndex: number, cellIndex: number) => {
    if (currentRow >= rowIndex) {
      if (targetLetters[cellIndex] === cell) {
        cellBackgrounds[rowIndex][cellIndex].value = withDelay(
          cellIndex * 200,
          withTiming(Colors.light.correct)
        )
      } else if (targetLetters.includes(cell)) {
        cellBackgrounds[rowIndex][cellIndex].value = withDelay(
          cellIndex * 200,
          withTiming(Colors.light.present)
        )
      } else {
        cellBackgrounds[rowIndex][cellIndex].value = withDelay(
          cellIndex * 200,
          withTiming(Colors.light.notPresent)
        )
      }
    } else {
      cellBackgrounds[rowIndex][cellIndex].value = withTiming('transparent', {
        duration: 100,
      })
    }
  }

  const offsetShakes = Array.from({ length: ROWS }, () => useSharedValue(0))

  const rowStyles = Array.from({ length: ROWS }, (_, index) =>
    useAnimatedStyle(() => {
      return {
        transform: [{ translateX: offsetShakes[index].value }],
      }
    })
  )

  const shakeRow = () => {
    const TIME = 60
    const OFFSET = 10

    offsetShakes[currentRow].value = withSequence(
      withTiming(-OFFSET, { duration: TIME / 2 }),
      withRepeat(withTiming(OFFSET, { duration: TIME }), 4, true),
      withTiming(0, { duration: TIME / 2 })
    )
  }

  const tileRotates = Array.from({ length: ROWS }, () =>
    Array.from({ length: 5 }, () => useSharedValue(0))
  )

  const cellBackgrounds = Array.from({ length: ROWS }, () =>
    Array.from({ length: 5 }, () => useSharedValue('transparent'))
  )

  const cellBorders = Array.from({ length: ROWS }, () =>
    Array.from({ length: 5 }, () => useSharedValue(Colors.light.gray))
  )

  const tileStyles = Array.from({ length: ROWS }, (_, index) => {
    return Array.from({ length: 5 }, (_, tileIndex) =>
      useAnimatedStyle(() => {
        return {
          transform: [{ rotateX: `${tileRotates[index][tileIndex].value}deg` }],
          borderColor: cellBorders[index][tileIndex].value,
          backgroundColor: cellBackgrounds[index][tileIndex].value,
        }
      })
    )
  })

  const flipRow = () => {
    const TIME = 150
    const OFFSET = 90

    tileRotates[currentRow].forEach((value, index) => {
      value.value = withDelay(
        index * 100,
        withSequence(
          withTiming(OFFSET, { duration: TIME }, () => {}),
          withTiming(0, { duration: TIME })
        )
      )
    })
  }

  const setBorderColor = (
    cell: string,
    rowIndex: number,
    cellIndex: number
  ) => {
    if (currentRow > rowIndex && cell !== '') {
      if (targetLetters[cellIndex] === cell) {
        cellBorders[rowIndex][cellIndex].value = withDelay(
          cellIndex * 200,
          withTiming(Colors.light.correct)
        )
      } else if (targetLetters.includes(cell)) {
        cellBorders[rowIndex][cellIndex].value = withDelay(
          cellIndex * 200,
          withTiming(Colors.light.present)
        )
      } else {
        cellBorders[rowIndex][cellIndex].value = withDelay(
          cellIndex * 200,
          withTiming(Colors.light.notPresent)
        )
      }
    }
    return Colors.light.gray
  }

  const resetGame = async () => {
    setIsLoading(true)
    if (counter >= MAX_WORD_ATTEMPTS) {
      throw new Error('Could not retrieve a valid word, try again later')
    }
    try {
      setCurrentRow(0)
      setCurrentColumn(0)
      setCorrectLetters([''])
      setPresentLetters([''])
      setNotPresentLetters([''])
      setRows(new Array(ROWS).fill(new Array(5).fill('')))
      rows.forEach((row, rowIndex) => {
        row.forEach((_, cellIndex) => {
          cellBackgrounds[rowIndex][cellIndex].value = 'transparent'
          cellBorders[rowIndex][cellIndex].value = Colors.light.gray
        })
      })
      newGame = false
      setIsNewGame(false)
      const newWord = await getRandomWord()
      const isValidWord = await checkIsValidWord(newWord)
      if (isValidWord) {
        console.log('New word', newWord.toUpperCase())
        setTargetWord(newWord.toUpperCase())
        setCounter(0)
      } else {
        setCounter(counter + 1)
        return resetGame()
      }
    } catch (error) {
      throw new Error('Could not retrieve a valid word, try again later')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    resetGame()
  }, [])

  useEffect(() => {
    if (newGame) {
      setIsNewGame(true)
    }
  }, [newGame])

  useEffect(() => {
    if (isNewGame) {
      resetGame()
      newGame = false
    }
  }, [isNewGame])

  const handlePresentSettingsModal = () => settingsModalRef.current?.present()

  useEffect(() => {
    if (currentRow === 0) return

    rows[currentRow - 1].map((cell, cellIndex) => {
      setCellColor(cell, currentRow - 1, cellIndex)
      setBorderColor(cell, currentRow - 1, cellIndex)
    })
  }, [currentRow])

  if (isLoading) {
    return (
      <ThemedLinearGradient>
        <View style={styles.loadingContainer}>
          <Text
            style={[
              styles.text,
              { color: Colors[colorScheme ?? 'light'].text },
            ]}
          >
            Loading...
          </Text>
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
    <>
      <View
        style={[
          styles.container,
          { backgroundColor: Colors[colorScheme ?? 'light'].gameBackground },
        ]}
      >
        <SettingsModal ref={settingsModalRef} />
        <Stack.Screen
          options={{
            headerShown: true,
            headerTintColor: Colors[colorScheme ?? 'light'].icon,
            title: 'Wordle',
            headerTitleStyle: {
              fontSize: 25,
              fontFamily: 'FrankRuhlLibre_800ExtraBold',
            },
            headerLeft: () => (
              <IconButton
                icon='arrow-left'
                onPress={() => {
                  router.navigate('../')
                }}
                iconColor={Colors[colorScheme ?? 'light'].icon}
              />
            ),
            headerRight: () => (
              <View
                style={{
                  flexDirection: 'row',
                }}
              >
                <IconButton
                  icon='cog'
                  onPress={handlePresentSettingsModal}
                  iconColor={Colors[colorScheme ?? 'light'].icon}
                />
                <IconButton
                  icon='refresh'
                  onPress={() => {
                    resetGame()
                  }}
                  iconColor={Colors[colorScheme ?? 'light'].icon}
                />
                <SignedOut>
                  <IconButton
                    icon='login'
                    iconColor={Colors[colorScheme ?? 'light'].icon}
                    onPress={() => router.push('/(authentication)/')}
                  />
                </SignedOut>
                <SignedIn>
                  <IconButton
                    icon='logout'
                    onPress={() => signOut()}
                    iconColor={Colors[colorScheme ?? 'light'].icon}
                  />
                </SignedIn>
              </View>
            ),
          }}
        />
        <SignedOut>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}
          >
            <Text
              style={[
                styles.noticeText,
                { color: Colors[colorScheme ?? 'light'].text },
              ]}
            >
              You're not logged in.{' '}
              <Link
                href='/(authentication)/'
                style={{ textDecorationLine: 'underline' }}
              >
                Authenticate
              </Link>{' '}
              to save your streaks!
            </Text>
          </View>
        </SignedOut>
        <View style={styles.gameField}>
          {rows.map((row, rowIndex) => (
            <Animated.View
              key={`row-${rowIndex}`}
              style={[styles.row, rowStyles[rowIndex]]}
            >
              {row.map((cell, cellIndex) => (
                <Animated.View
                  key={`cell-${rowIndex}-${cellIndex}`}
                  entering={ZoomIn.delay(50 * cellIndex)}
                >
                  <Animated.View
                    style={[styles.cell, tileStyles[rowIndex][cellIndex]]}
                  >
                    <Animated.Text
                      style={[
                        styles.cellText,
                        { color: Colors[colorScheme ?? 'light'].text },
                      ]}
                    >
                      {cell}
                    </Animated.Text>
                  </Animated.View>
                </Animated.View>
              ))}
            </Animated.View>
          ))}
        </View>
        <ThemedKeyboard
          onKeyPressed={processKey}
          correctLetters={correctLetters}
          presentLetters={presentLetters}
          wrongLetters={notPresentLetters}
        />
      </View>
    </>
  )
}
export default GameScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    paddingVertical: 10,
    gap: 10,
  },
  gameField: {
    alignItems: 'center',
    gap: 5,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  cell: {
    width: 50,
    height: 50,
    borderWidth: 2,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellText: {
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  noticeText: {
    fontSize: 12,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  text: {
    fontFamily: 'FrankRuhlLibre_800ExtraBold',
    fontSize: 30,
  },
})
