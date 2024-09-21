import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  useColorScheme,
} from 'react-native'
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import ThemedButton from '@/components/ThemedComponents/ThemedButton'
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  useBottomSheetModal,
} from '@gorhom/bottom-sheet'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import * as WebBrowser from 'expo-web-browser'
import { WebBrowserResult } from 'expo-web-browser'
import { Toast } from 'react-native-toast-notifications'
import { Colors } from '@/constants/Colors'

import { getDoc, collection, doc } from 'firebase/firestore'
import { FIREBASE_DB } from '@/utils/FirebaseConfig'

import disc from '@jsamr/counter-style/presets/disc'
import MarkedList from '@jsamr/react-native-li'
import { Link } from 'expo-router'
import { set } from 'date-fns'
import LottieView from 'lottie-react-native'

export type Ref = BottomSheetModal

const learnMoreModal = forwardRef<Ref>((props, ref) => {
  const [techStack, setTechStack] = useState<string[]>([])
  const colorScheme = useColorScheme()

  const snapPoints = useMemo(() => ['90%'], [])
  const { dismiss } = useBottomSheetModal()
  const { bottom } = useSafeAreaInsets()
  const [webBrowserResult, setWebBrowserResult] =
    useState<WebBrowserResult | null>(null)

  const handleButtonPress = async () => {
    let result = await WebBrowser.openBrowserAsync(
      'https://github.com/RobSteward/rs-wordle'
    )
    setWebBrowserResult(result)
  }

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        opacity={0.75}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
        onPress={dismiss}
      />
    ),
    []
  )

  const fetchTechStack = async () => {
    try {
      const documentRef = doc(FIREBASE_DB, `system/LEARN_MORE_DATA`)
      const documentSnapshot = await getDoc(documentRef)
      const TECH_STACK = documentSnapshot.data()?.technologies || []
      if (TECH_STACK.length > 0) {
        setTechStack(TECH_STACK)
      } else {
        throw new Error('Could not load data')
      }
    } catch (error) {
      Toast.show(`${error}`, {
        type: 'danger',
        placement: 'top',
        duration: 3000,
      })
    }
  }

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      backdropComponent={renderBackdrop}
      snapPoints={snapPoints}
      onChange={(index) => {
        if (index >= 0) {
          fetchTechStack()
        }
      }}
    >
      <View style={styles.contentContainer}>
        <View style={styles.modalBtns}>
          <Link
            href={'/(authenticated)/'}
            asChild
          >
            <TouchableOpacity
              onPress={() => {
                dismiss()
              }}
            >
              <Text style={styles.buttonText}>Play</Text>
            </TouchableOpacity>
          </Link>
          <TouchableOpacity onPress={() => dismiss()}>
            <Ionicons
              name='close'
              size={28}
              color={Colors.light.gray}
            />
          </TouchableOpacity>
        </View>
        <BottomSheetScrollView>
          <Text style={styles.containerTitle}>
            The Selection Lab Interview Task
          </Text>
          <Text style={styles.containerSubtitle}>
            Submission by Robin Scharf
          </Text>
          {/* <Image
            source={require('@/assets/images/splash.png')}
            style={styles.image}
          /> */}

          <View>
            <Text style={styles.header}>Tech Stack</Text>
            {techStack.length ? (
              <MarkedList
                counterRenderer={disc}
                lineStyle={{
                  paddingHorizontal: 40,
                  gap: 10,
                  marginVertical: 10,
                }}
              >
                {techStack.map((value, index) => (
                  <Text
                    key={index}
                    style={styles.listText}
                  >
                    {value}
                  </Text>
                ))}
              </MarkedList>
            ) : (
              <View style={styles.loadingContainer}>
                <Text
                  style={[
                    styles.text,
                    { color: Colors[colorScheme ?? 'light'].text },
                  ]}
                >
                  Loading...
                </Text>
                <LottieView
                  source={require('@/assets/animations/LoaderAnimation.json')}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  autoPlay
                  loop
                />
              </View>
            )}
          </View>
          <Text style={styles.header}>Disclaimer</Text>
          <Text style={styles.disclaimer}>
            <Text>This interview submission app is based on a </Text>
            <Text
              onPress={() =>
                Linking.openURL('https://www.youtube.com/watch?v=pTonpjmKtiE')
              }
              style={styles.link}
            >
              YouTube tutorial by Simon Grimm
            </Text>
            <Text>
              . No code was copied from the GitHub repository. Any errors,
              mistakes and bugs are my own. All correctly used patterns,
              stuctures, design principles and business logic credit is due to
              the resources I consulted in making this project. The Firebase
              database on this project is currenly in test mode, and proper
              security rules should be developed at some point would this be a
              real app. The app is not intended to be used as a Wordle clone and
              does not intent to infringe on the Wordle trademark. I'm surprised
              you're reading this far. Now that I have your attention: Did you
              know that the{' '}
            </Text>
            <Text
              onPress={() =>
                Linking.openURL(
                  'https://meetings-eu1.hubspot.com/joris-heikamp/'
                )
              }
              style={styles.link}
            >
              callback CTA on your homepage
            </Text>
            <Text> is missing utm parameters?</Text>
          </Text>
        </BottomSheetScrollView>
        <View style={[styles.footer, { paddingBottom: bottom }]}>
          <ThemedButton
            title='View GitHub repository'
            onPress={handleButtonPress}
          />
        </View>
      </View>
    </BottomSheetModal>
  )
})
const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerTitle: {
    fontSize: 30,
    padding: 10,
    textAlign: 'center',
    fontFamily: 'FrankRuhlLibre_900Black',
  },
  containerSubtitle: {
    fontSize: 20,
    padding: 10,
    textAlign: 'center',
    fontFamily: 'FrankRuhlLibre_500Medium',
  },
  image: {
    width: '90%',
    alignSelf: 'center',
    height: 40,
  },
  modalBtns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold',
  },
  header: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4f4f4f',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  listText: {
    fontSize: 14,
    flexShrink: 1,
    fontWeight: 'bold',
    color: '#4f4f4f',
  },
  disclaimer: {
    fontSize: 10,
    fontWeight: 'thin',
    color: '#484848',
    marginHorizontal: 30,
    lineHeight: 18,
    marginBottom: 20,
  },
  footer: {
    backgroundColor: '#fff',
    marginTop: 'auto',
    paddingHorizontal: 20,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    paddingTop: 20,
  },
  link: {
    color: '#000',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    fontSize: 15,
  },
})

export default learnMoreModal
