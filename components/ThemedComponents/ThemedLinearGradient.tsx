import { ScrollView, StyleSheet, useColorScheme, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import React, { ReactNode } from 'react'

interface LinearGradientProps {
  children: ReactNode
  justify?:
    | 'center'
    | 'flex-start'
    | 'flex-end'
    | 'space-between'
    | 'space-around'
}
import { Colors } from '@/constants/Colors'

const ThemedLinearGradient: React.FC<LinearGradientProps> = ({
  children,
  justify = 'center',
}) => {
  const colorScheme = useColorScheme()

  return (
    <LinearGradient
      colors={[
        Colors[colorScheme ?? 'light'].backgroundGradientStart,
        Colors[colorScheme ?? 'light'].backgroundGradientEnd,
      ]}
      style={[styles.container, { justifyContent: justify }]}
    >
      {children}
    </LinearGradient>
  )
}

export default ThemedLinearGradient

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
})
