import { router, Stack } from 'expo-router'
import React, { useEffect } from 'react'
import { useAuth } from '@clerk/clerk-expo'

export default function AuthenticatedRoutesLayout() {
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
        options={{
          headerShown: false,
          presentation: 'fullScreenModal',
          headerShadowVisible: false,
        }}
      />
    </Stack>
  )
}
