const getRandomWord = async () => {
  const response = await fetch(
    'https://random-word-api.herokuapp.com/word?length=5'
  )
  const data = await response.json()
  return data[0]
}

export default getRandomWord
