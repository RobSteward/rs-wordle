import { router, Stack } from 'expo-router'
import React from 'react'
import { useAuth } from '@clerk/clerk-expo'

export default function AuthenticatedRoutesLayout() {
  const { isSignedIn } = useAuth()

  if (!isSignedIn) {
    console.log('No valid auth session detected, redirecting to authentication')
    router.replace('/(authentication)/')
  }

  return (
    <Stack
      initialRouteName='/(tabs)/'
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name='(tabs)'
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='end'
        options={{ headerShown: false }}
      />
    </Stack>
  )
}
