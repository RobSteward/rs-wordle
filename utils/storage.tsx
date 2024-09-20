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

// type Listener = (key: string) => void

// export class MMKVFaker {
//   private data: { [key: string]: string | undefined } = {}
//   private listeners: Listener[] = []

//   getString(key: string): string | undefined {
//     return this.data[key]
//   }

//   set(key: string, value: string): void {
//     this.data[key] = value
//     this.notifyListeners(key)
//   }

//   delete(key: string): void {
//     delete this.data[key]
//     this.notifyListeners(key)
//   }

//   clearAll(): void {
//     this.data = {}
//     Object.keys(this.data).forEach((key) => this.notifyListeners(key))
//   }

//   addOnValueChangedListener(listener: Listener): () => void {
//     this.listeners.push(listener)
//     return () => {
//       const index = this.listeners.indexOf(listener)
//       if (index > -1) {
//         this.listeners.splice(index, 1)
//       }
//     }
//   }

//   private notifyListeners(key: string): void {
//     this.listeners.forEach((listener) => listener(key))
//   }
// }

// export const storage = __DEV__
//   ? new MMKVFaker()
//   : new MMKV({ id: `storage_${Math.random()}` })
