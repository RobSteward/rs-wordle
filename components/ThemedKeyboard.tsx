import { Colors } from '@/constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import {
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  useWindowDimensions,
  View,
} from 'react-native'
import { Icon, IconButton, MD3Colors } from 'react-native-paper'

type ThemedKeyboardProps = {
  onKeyPressed: (key: string) => void
  onDelete: () => void
  correctLetters: string[]
  wrongLetters: string[]
  presentLetters: string[]
}

export const ENTER = 'ENTER'
export const BACKSPACE = 'BACKSPACE'

const keys = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'],
]

const ThemedKeyboard = ({
  onKeyPressed,
  onDelete,
  correctLetters,
  wrongLetters,
  presentLetters,
}: ThemedKeyboardProps) => {
  const colorScheme = useColorScheme()
  const { width } = useWindowDimensions()
  const keyWidth = (width - 50) / keys[0].length
  const keyHeight = 50

  const isSpecialKey = (key: string) => [ENTER, BACKSPACE].includes(key)

  const isIncluded = (key: string) =>
    [...correctLetters, ...wrongLetters, ...presentLetters].includes(key)

  return (
    <View style={styles.container}>
      {keys.map((row, rowIndex) => (
        <View
          key={`row-${rowIndex}`}
          style={styles.row}
        >
          {row.map((key, keyIndex) => (
            <Pressable
              key={`key-${keyIndex}`}
              onPress={() => onKeyPressed(key)}
              style={({ pressed }) => [
                styles.key,
                {
                  width: keyWidth,
                  height: keyHeight,
                  backgroundColor: '#DDDDDD',
                },
                isSpecialKey(key) && { width: keyWidth * 1.5 },
                {
                  backgroundColor: correctLetters.includes(key)
                    ? Colors[colorScheme ?? 'light'].correct
                    : presentLetters.includes(key)
                    ? Colors[colorScheme ?? 'light'].present
                    : wrongLetters.includes(key)
                    ? Colors[colorScheme ?? 'light'].wrong
                    : Colors[colorScheme ?? 'light'].default,
                },
                pressed && { backgroundColor: '#AAAAAA' },
              ]}
            >
              <View>
                <Text
                  style={[
                    styles.keyText,
                    isIncluded(key) && { color: 'white' },
                  ]}
                >
                  {isSpecialKey(key) ? (
                    key === 'ENTER' ? (
                      <Ionicons
                        name='return-down-back'
                        size={20}
                        color={MD3Colors.neutral0}
                      />
                    ) : (
                      <Ionicons
                        name='backspace-outline'
                        size={20}
                        color={MD3Colors.neutral0}
                      />
                    )
                  ) : (
                    key
                  )}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      ))}
    </View>
  )
}
export default ThemedKeyboard
const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 50,
  },
  row: {
    flexDirection: 'row',
    gap: 5,
    marginVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  key: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  keyText: {
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
})
