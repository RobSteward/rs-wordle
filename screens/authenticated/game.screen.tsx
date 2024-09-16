import { SignedIn, SignedOut, useAuth, useUser } from '@clerk/clerk-expo'
import { Link, Stack } from 'expo-router'
import ThemedButton from '@/components/ThemedButton'
import { Colors } from '@/constants/Colors'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { StyleSheet, useColorScheme, View, Text } from 'react-native'
import ThemedKeyboard from '@/components/ThemedKeyboard'
import { IconButton } from 'react-native-paper'

const ROWS = 6

const GameScreen = () => {
  const { user } = useUser()
  const { signOut } = useAuth()
  const colorScheme = useColorScheme()
  const backgroundColor = Colors[colorScheme ?? 'light'].gameBackground
  const textColor = Colors[colorScheme ?? 'light'].text
  const grayColor = Colors[colorScheme ?? 'light'].gray
  const router = useRouter()

  const [rows, setRows] = useState<string[][]>(
    new Array(ROWS).fill(new Array(5).fill('A'))
  )
  const [currentRow, setCurrentRow] = useState(0)
  const [currentColumn, setCurrentColumn] = useState(0)

  const [correctLetters, setCorrectLetters] = useState<string[]>(['A'])
  const [wrongLetters, setWrongLetters] = useState<string[]>(['H'])
  const [presentLetters, setPresentLetters] = useState<string[]>(['K'])

  const addKey = (key: string) => {
    console.log(key)
    if (key === 'ENTER') {
      if (currentColumn === 5) {
        setCurrentRow(currentRow + 1)
        setCurrentColumn(0)
      }
    } else if (key === 'BACK') {
      if (currentColumn === 0) {
        setCurrentRow(currentRow - 1)
        setCurrentColumn(5)
      }
    } else {
      if (currentColumn === 5) {
        setCurrentRow(currentRow + 1)
        setCurrentColumn(0)
      }
      setRows((prevRows) => {
        const newRows = [...prevRows]
        newRows[currentRow][currentColumn] = key
        return newRows
      })
      setCurrentColumn(currentColumn + 1)
    }
  }

  console.log(rows)

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
                <IconButton
                  icon='logout'
                  onPress={() => signOut()}
                  iconColor={Colors[colorScheme ?? 'light'].icon}
                />
              </View>
            ),
          }}
        />
        <SignedIn>
          <View style={styles.gameField}>
            {rows.map((row, rowIndex) => (
              <View
                key={`row-${rowIndex}`}
                style={styles.row}
              >
                {row.map((cell, cellIndex) => (
                  <View
                    key={`cell-${rowIndex}-${cellIndex}`}
                    style={styles.cell}
                  >
                    <Text style={styles.cellText}>{cell}</Text>
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
        </SignedIn>
        <SignedOut>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text>Looks like you should not be here...</Text>
            <Link href='/(authentication)/'>
              <Text>Authenticate</Text>
            </Link>
          </View>
        </SignedOut>
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
    paddingVertical: 50,
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
})
