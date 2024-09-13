import { Redirect, Stack } from 'expo-router'
import React from 'react'
import { useAuth } from '@clerk/clerk-expo'

export default function AuthenticatedRoutesLayout() {
  const { isSignedIn } = useAuth()

  if (!isSignedIn) {
    return <Redirect href={'/(authentication)'} />
  }

  return <Stack />
}
