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
  icon?: string
  textColor?: string
}

const ThemedButton: React.FC<ButtonProps> = ({
  title,
  onPress,
  loading,
  disabled,
  styles,
  primary,
  icon,
  textColor,
}) => {
  const colorScheme = useColorScheme()
  const buttonTextColor = Colors[colorScheme ?? 'light'].buttonText

  return (
    <>
      <View style={{ alignItems: 'center' }}>
        <Button
          icon={icon}
          style={[styles, { width: '50%' }]}
          buttonColor={
            primary
              ? Colors[colorScheme ?? 'light'].buttonPrimaryColor
              : Colors[colorScheme ?? 'light'].gray
          }
          textColor={
            textColor ? textColor : Colors[colorScheme ?? 'light'].buttonText
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
