import { router, Stack } from 'expo-router'
import React, { useEffect } from 'react'
import { useAuth } from '@clerk/clerk-expo'

export default function AuthenticatedRoutesLayout() {
  const { isSignedIn } = useAuth()

  // useEffect(() => {
  //   if (!isSignedIn) {
  //     console.log(
  //       'No valid auth session detected, redirecting to authentication'
  //     )
  //     router.replace('/(authentication)/')
  //   }
  // }, [isSignedIn])

  // if (!isSignedIn) {
  //   return null // or a loading spinner, or some other placeholder
  // }

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
