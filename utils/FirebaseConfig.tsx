import { Platform } from 'react-native'
import { initializeApp } from 'firebase/app'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_MEASUREMENT_ID,
}

export const firebaseAuthActionCodeSettings = {
  url: process.env.EXPO_PUBLIC_REDIRECT_URL,
  handleCodeInApp: true,
  iOS: {
    bundleId: process.env.EXPO_PUBLIC_BUNDLE_IDENTIFIER,
  },
  android: {
    packageName: process.env.EXPO_PUBLIC_BUNDLE_IDENTIFIER,
    installApp: true,
    minimumVersion: process.env.EXPO_PUBLIC_MINIMUM_ANDROID_VERSION,
  },
  dynamicLinkDomain: process.env.EXPO_PUBLIC_DYNAMIC_LINK_DOMAIN,
}

const isRunningOnLocalhost = () => {
  return process.env.EXPO_PUBLIC_IS_DEVELOPMENT === 'true'
}

export const FIREBASE_APP = initializeApp(firebaseConfig)
export const FIREBASE_DB = getFirestore(FIREBASE_APP)

if (isRunningOnLocalhost()) {
  console.log('Connecting to Firestore emulator')
  const emulatorHost = Platform.OS === 'android' ? '10.0.2.2' : 'localhost'
  connectFirestoreEmulator(FIREBASE_DB, emulatorHost, 8080)
}
