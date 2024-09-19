import ThemedKeyboard from '@/components/ThemedComponents/ThemedKeyboard'
import SettingsModal from '@/components/Modals/SettingsModal'
import { Colors } from '@/constants/Colors'
import { SignedIn, SignedOut, useAuth, useUser } from '@clerk/clerk-expo'
import { useRouter, useLocalSearchParams, Link, Stack } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { StyleSheet, useColorScheme, View, Text, Platform } from 'react-native'
import { IconButton } from 'react-native-paper'
import { Toast } from 'react-native-toast-notifications'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  ZoomIn,
} from 'react-native-reanimated'

const ROWS = 6

const GameScreen = () => {
  const colorScheme = useColorScheme()
  const router = useRouter()
  const { restart } = useLocalSearchParams()
  const { user } = useUser()
  const { signOut } = useAuth()

  const [targetWord, setTargetWord] = useState('ROBIN')
  const targetLetters = targetWord.split('')
  console.log('🚀 ~ Page ~ targetWord:', targetWord, targetLetters)

  const [rows, setRows] = useState<string[][]>(
    new Array(ROWS).fill(new Array(5).fill(''))
  )
  const [currentRow, setCurrentRow] = useState(0)
  const [currentColumn, _setCurrentColumn] = useState(0)

  const [correctLetters, setCorrectLetters] = useState<string[]>([''])
  const [notPresentLetters, setWrongLetters] = useState<string[]>([''])
  const [presentLetters, setPresentLetters] = useState<string[]>([''])

  const settingsModalRef = useRef<BottomSheetModal>(null)

  const columnStateRef = useRef(currentColumn)
  const setCurrentColumn = (column: number) => {
    columnStateRef.current = column
    _setCurrentColumn(column)
  }

  const processKey = (key: string) => {
    console.log('CURRENT: ', columnStateRef.current)

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
    } else {
      console.log('🚀 ~ addKey ~ curCol', columnStateRef.current)
      newRows[currentRow][columnStateRef.current] = key
      setRows(newRows)
      setCurrentColumn(columnStateRef.current + 1)
    }
  }

  const checkWord = () => {
    const currentWord = rows[currentRow].join('')

    if (currentWord.length < targetWord.length) {
      console.log('Word not long enough')
      const toastId = Toast.show('Not enough letters', {
        type: 'danger',
        placement: 'top',
        duration: 750,
      })
      shakeRow()
      return
    }

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
    setWrongLetters([...notPresentLetters, ...newNotPresentLetters])

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
          withTiming(Colors.light.wrong)
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

  const shakeRow = () => {
    const TIME = 80
    const OFFSET = 10

    offsetShakes[currentRow].value = withSequence(
      withTiming(-OFFSET, { duration: TIME / 2 }),
      withRepeat(withTiming(OFFSET, { duration: TIME }), 4, true),
      withTiming(0, { duration: TIME / 2 })
    )
  }

  const flipRow = () => {
    const TIME = 300
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
          withTiming(Colors.light.wrong)
        )
      }
    }
    return Colors.light.gray
  }

  const resetGame = () => {
    setRows(new Array(ROWS).fill(new Array(5).fill('')))
    setCurrentRow(0)
    setCurrentColumn(0)
    setCorrectLetters([''])
    setWrongLetters([''])
    setPresentLetters([''])
    setTargetWord('')
  }

  const handlePresentSettingsModal = () => settingsModalRef.current?.present()

  useEffect(() => {
    if (currentRow === 0) return

    rows[currentRow - 1].map((cell, cellIndex) => {
      setCellColor(cell, currentRow - 1, cellIndex)
      setBorderColor(cell, currentRow - 1, cellIndex)
    })
  }, [currentRow])

  const getCellColor = (cell: string, row: number, cellIndex: number) => {
    if (currentRow > row) {
      console.log(cell, targetLetters[cellIndex])
      if (cell === targetLetters[cellIndex]) {
        return Colors[colorScheme ?? 'light'].correct
      } else if (targetWord.includes(cell)) {
        return Colors[colorScheme ?? 'light'].present
      } else {
        return Colors[colorScheme ?? 'light'].wrong
      }
    }
    return 'transparent'
  }

  // const getBorderColor = (cell: string, row: number, column: number) => {
  //   if (currentRow > row) {
  //   }
  //   return 'transparent'
  // }

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
        <SignedIn></SignedIn>
        <View style={styles.gameField}>
          {rows.map((row, rowIndex) => (
            <View
              key={`row-${rowIndex}`}
              style={styles.row}
            >
              {row.map((cell, cellIndex) => (
                <View
                  key={`cell-${rowIndex}-${cellIndex}`}
                  style={[
                    styles.cell,
                    {
                      backgroundColor: getCellColor(cell, rowIndex, cellIndex),
                      borderColor: Colors[colorScheme ?? 'light'].border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.cellText,
                      { color: Colors[colorScheme ?? 'light'].text },
                    ]}
                  >
                    {cell}
                  </Text>
                </View>
              ))}
            </View>
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
})
