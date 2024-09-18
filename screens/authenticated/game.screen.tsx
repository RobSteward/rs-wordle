import { SignedIn, SignedOut, useAuth, useUser } from '@clerk/clerk-expo'
import { Link, Stack } from 'expo-router'
import ThemedButton from '@/components/ThemedButton'
import { Colors } from '@/constants/Colors'
import { useRouter } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { StyleSheet, useColorScheme, View, Text, Platform } from 'react-native'
import ThemedKeyboard from '@/components/ThemedKeyboard'
import { IconButton } from 'react-native-paper'
import { set } from 'date-fns'
import { Toast } from 'react-native-toast-notifications'

const ROWS = 1

const GameScreen = () => {
  const { user } = useUser()
  const { signOut } = useAuth()
  const colorScheme = useColorScheme()
  const backgroundColor = Colors[colorScheme ?? 'light'].gameBackground
  const textColor = Colors[colorScheme ?? 'light'].text
  const grayColor = Colors[colorScheme ?? 'light'].gray
  const router = useRouter()

  const [rows, setRows] = useState<string[][]>(
    new Array(ROWS).fill(new Array(5).fill(''))
  )
  const [currentRow, setCurrentRow] = useState(0)
  const [currentColumn, _setCurrentColumn] = useState(0)

  const [correctLetters, setCorrectLetters] = useState<string[]>([''])
  const [wrongLetters, setWrongLetters] = useState<string[]>([''])
  const [presentLetters, setPresentLetters] = useState<string[]>([''])

  // const [targetWord, setTargetWord] = useState<string>('')
  const [targetWord, setTargetWord] = useState('ROBIN')
  const [targetLetters] = useState(targetWord.split(''))

  const columnStateRef = useRef(currentColumn)
  const setCurrentColumn = (column: number) => {
    columnStateRef.current = column
    _setCurrentColumn(column)
  }

  const addKey = (key: string) => {
    console.log('Current', columnStateRef.current, key)

    const newRows = [...rows.map((row) => [...row])]

    if (key === 'ENTER') {
      checkCurrentWord()
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
      return
    } else {
      console.log('🚀 ~ addKey in current column', columnStateRef.current)
      newRows[currentRow][columnStateRef.current] = key
      setRows(newRows)
      setCurrentColumn(currentColumn + 1)
    }
  }

  const checkCurrentWord = () => {
    console.log('checking')
    const currentWord = rows[currentRow].join('')
    console.log(currentWord)

    if (currentWord.length < targetWord.length) {
      const toastId = Toast.show('Not enough letters', {
        type: 'danger',
        placement: 'top',
        duration: 750,
      })
      shakeRow()
      console.log('Word not long enough')
      return
    }

    const newCorrectLetters: string[] = []
    const newPresentLetters: string[] = []
    const newWrongLetters: string[] = []

    currentWord.split('').forEach((letter) => {
      if (targetWord.includes(letter)) {
        if (targetWord.indexOf(letter) === currentWord.indexOf(letter)) {
          newCorrectLetters.push(letter)
        } else {
          newPresentLetters.push(letter)
        }
      } else {
        newWrongLetters.push(letter)
      }
    })

    setCorrectLetters([...correctLetters, ...newCorrectLetters])
    setPresentLetters([...presentLetters, ...newPresentLetters])
    setWrongLetters([...wrongLetters, ...newWrongLetters])

    setTimeout(() => {
      console.log('current row ', currentRow, rows.length)
      if (currentWord === targetWord) {
        console.log('WIN')
        router.push(
          `/(authenticated)/end?win=true&word=${currentWord}&gameField=${JSON.stringify(
            rows
          )}`
        )
      } else if (currentRow + 1 >= rows.length) {
        console.log('GAME OVER')
        router.push(
          `/end?win=false&word=${currentWord}&gameField=${JSON.stringify(rows)}`
        )
      }
    }, 250)

    setCurrentRow(currentRow + 1)
    setCurrentColumn(0)
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        addKey('ENTER')
      } else if (event.key === 'Backspace') {
        addKey('BACKSPACE')
      } else if (event.key.length === 1) {
        addKey(event.key)
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

  const shakeRow = () => {
    const newRows = [...rows.map((row) => [...row])]
    newRows[currentRow] = newRows[currentRow].map((_, index) => {
      if (index === 0) {
        return 'shake'
      }
      return ''
    })
    setRows(newRows)
  }

  console.log(rows)

  const getCellColor = (cell: string, row: number, cellIndex: number) => {
    if (currentRow > row) {
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
      <View style={[styles.container, { backgroundColor }]}>
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
                  icon='help-circle-outline'
                  onPress={() => console.log('help')}
                  iconColor={Colors[colorScheme ?? 'light'].icon}
                />
                <IconButton
                  icon='podium'
                  onPress={() => console.log('podium')}
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
          onKeyPressed={addKey}
          onDelete={() => console.log('delete')}
          correctLetters={correctLetters}
          presentLetters={presentLetters}
          wrongLetters={wrongLetters}
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
