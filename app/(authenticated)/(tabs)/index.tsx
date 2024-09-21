import GameScreen from '@/screens/authenticated/game.screen'
import { useLocalSearchParams } from 'expo-router'

const TabsRoute = () => {
  const { newGame } = useLocalSearchParams<{
    newGame: string
  }>()
  return (
    <>
      <GameScreen newGame={newGame === 'true'} />
    </>
  )
}

export default TabsRoute
