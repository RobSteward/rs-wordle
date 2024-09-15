import { StyleSheet, useColorScheme, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import React, { ReactNode } from 'react'

interface LinearGradientProps {
  children: ReactNode
}
import { Colors } from '@/constants/Colors'

const ThemedLinearGradient: React.FC<LinearGradientProps> = ({ children }) => {
  const colorScheme = useColorScheme()

  return (
    <LinearGradient
      colors={
        useColorScheme() === 'dark'
          ? [
              Colors.light.backgroundGradientEnd,
              Colors.light.backgroundGradientStart,
            ]
          : [
              Colors.light.backgroundGradientStart,
              Colors.light.backgroundGradientEnd,
            ]
      }
      style={styles.container}
    >
      {children}
    </LinearGradient>
  )
}

export default ThemedLinearGradient

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'orange',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 300,
  },
})
