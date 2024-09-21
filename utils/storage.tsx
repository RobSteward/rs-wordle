import AsyncStorage from '@react-native-async-storage/async-storage'

export const storeData = async (key: string, value: string) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem(key, jsonValue)
  } catch (error) {
    throw new Error('Failed to storing data in storage')
  }
}

export const getData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key)
    return value != null ? JSON.parse(value) : null
  } catch (error) {
    throw new Error('Failed to retrieve data from storage')
  }
}

//COMMENT: I was unable to get mmkv to work without moving to 3.0 on the new architecture
// import { MMKV } from 'react-native-mmkv'
// const storage = new MMKV()