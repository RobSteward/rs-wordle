import { Redirect, Stack } from 'expo-router'
import React from 'react'
import { useAuth } from '@clerk/clerk-expo'
import { MD3Colors, IconButton } from 'react-native-paper'

export default function AuthenticationRoutesLayout() {
  const { isSignedIn } = useAuth()

  if (isSignedIn) {
    return <Redirect href={'/(authenticated)'} />
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  )
}
