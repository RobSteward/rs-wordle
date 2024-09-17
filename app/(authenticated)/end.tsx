import { useLocalSearchParams } from 'expo-router'

import EndScreen from '@/screens/authenticated/end.screen'
const EndRoute = () => {
  const { win, word, gameField } = useLocalSearchParams<{
    win: string
    word: string
    gameField: string
  }>()

  return (
    <EndScreen
      win={win}
      word={word}
      gameField={gameField}
    />
  )
}
export default EndRoute
