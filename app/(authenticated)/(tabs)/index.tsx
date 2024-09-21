import React, { useEffect } from 'react'
import GameScreen from '@/screens/authenticated/game.screen'
import { useLocalSearchParams } from 'expo-router'

const TabsRoute = () => {
  const { newGame } = useLocalSearchParams<{
    newGame: string
  }>()

  useEffect(() => {
    if (newGame === 'true') {
      console.log('new game')
    }
  }, [newGame])

  return (
    <>
      <GameScreen newGame={newGame === 'true'} />
    </>
  )
}
export default TabsRoute
