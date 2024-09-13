import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native'
import React, { forwardRef, useCallback, useMemo, useState } from 'react'
import ThemedButton from './ThemedButton'
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
export type Ref = BottomSheetModal

import disc from '@jsamr/counter-style/presets/disc'
import MarkedList from '@jsamr/react-native-li'
import { Link } from 'expo-router'
import { Colors } from '@/constants/Colors'

const TECH_STACK = [
  'MacOs',
  'Visual Studio Code',
  'Cody',
  'GitHub Copilot',
  'GitHub',
  'React Native',
  'Expo',
  'Firebase Hosting ',
  'Firestore',
  'Clerk',
  'Typescript',
  'Jest',
  'Google Fonts',
  'Date FNS',
  'Affinity Designer',
]

const learnMoreModal = forwardRef<Ref>((props, ref) => {
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
        opacity={0.2}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
        onPress={dismiss}
      />
    ),
    []
  )

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      backdropComponent={renderBackdrop}
      snapPoints={snapPoints}
    >
      <View style={styles.contentContainer}>
        <View style={styles.modalBtns}>
          <Link
            href={'/(authentication)'}
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

          <View style={{ marginVertical: 20 }}>
            <MarkedList
              counterRenderer={disc}
              lineStyle={{ paddingHorizontal: 40, gap: 10, marginVertical: 10 }}
            >
              {TECH_STACK.map((value, index) => (
                <Text
                  key={index}
                  style={styles.listText}
                >
                  {value}
                </Text>
              ))}
            </MarkedList>
          </View>
          <Text style={styles.disclaimer}>
            <Text>This interview submission app is based on a </Text>
            <Text
              onPress={() =>
                Linking.openURL('https://www.youtube.com/watch?v=pTonpjmKtiE')
              }
            >
              YouTube tutorial by Simon Grimm
            </Text>
            <Text>
              . No code was copied from the GitHub repository. Any styling and
              design changes are my own. The app is not intended to be used as a
              Wordle clone and does not intent to infringe on the Wordle
              trademark. I'm surprised you're reading this far. Now that I have
              your attention: Did you know that the
            </Text>
            <Text
              onPress={() =>
                Linking.openURL(
                  'https://meetings-eu1.hubspot.com/joris-heikamp/'
                )
              }
            >
              {' '}
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
})

export default learnMoreModal
