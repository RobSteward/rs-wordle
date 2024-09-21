const checkIsValidWord = async (word: string) => {
  const response = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
  )
  const data = await response.json()
  if (data.title === 'No Definitions Found') {
    return false
  } else {
    return true
  }
}

export default checkIsValidWord
