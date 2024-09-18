import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import React, { forwardRef, useCallback, useMemo, useState } from 'react'
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
export type Ref = BottomSheetModal

import { Link } from 'expo-router'
import { Colors } from '@/constants/Colors'

const settingsModal = forwardRef<Ref>((props, ref) => {
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
})

export default settingsModal
