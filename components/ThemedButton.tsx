import { View, Text, useColorScheme } from 'react-native'
import { Button } from 'react-native-paper'
import React from 'react'
import { Colors } from '@/constants/Colors'

interface ButtonProps {
  title: string
  onPress?: () => void
  loading?: boolean
}

const ThemedButton: React.FC<ButtonProps> = ({ title, onPress, loading }) => {
  const colorScheme = useColorScheme()
  const buttonTextColor = Colors[colorScheme ?? 'light'].buttonText

  return (
    <>
      <View style={{ alignItems: 'center' }}>
        <Button
          mode={colorScheme === 'dark' ? 'outlined' : 'contained'}
          buttonColor={colorScheme === 'dark' ? '#212547' : '#1180ff'}
          textColor={buttonTextColor}
          onPress={onPress}
          loading={loading}
        >
          {title}
        </Button>
      </View>
    </>
  )
}
export default ThemedButton
