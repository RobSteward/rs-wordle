import { View, Text, useColorScheme } from 'react-native'
import { Button } from 'react-native-paper'
import React from 'react'
import { Colors } from '@/constants/Colors'

interface ButtonProps {
  title: string
  onPress?: () => void
  loading?: boolean
  disabled?: boolean
  styles?: object
  primary?: boolean
}

const ThemedButton: React.FC<ButtonProps> = ({
  title,
  onPress,
  loading,
  disabled,
  styles,
  primary,
}) => {
  const colorScheme = useColorScheme()
  const buttonTextColor = Colors[colorScheme ?? 'light'].buttonText

  return (
    <>
      <View style={{ alignItems: 'center' }}>
        <Button
          style={styles}
w          buttonColor={
            primary
              ? colorScheme === 'dark'
                ? '#212547'
                : '#1180ff'
              : colorScheme === 'dark'
              ? '#444444'
              : '#cccccc'
          }
          textColor={
            primary
              ? buttonTextColor
              : colorScheme === 'dark'
              ? '#ffffff'
              : '#000000'
          }
          onPress={onPress}
          loading={loading}
          disabled={disabled}
        >
          {title}
        </Button>
      </View>
    </>
  )
}
export default ThemedButton
