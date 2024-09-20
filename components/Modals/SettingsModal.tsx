import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import React, { forwardRef, useCallback, useMemo, useState } from 'react'
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  useBottomSheetModal,
} from '@gorhom/bottom-sheet'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useColorScheme } from 'react-native'
import { Link } from 'expo-router'
import { Colors } from '@/constants/Colors'
import ThemedLinearGradient from '../ThemedComponents/ThemedLinearGradient'
import { Switch } from 'react-native-paper'
import { useMMKVBoolean } from 'react-native-mmkv'
import { storage } from '@/utils/storage'

export type Ref = BottomSheetModal

const SettingsModal = forwardRef<Ref>((props, ref) => {
  const snapPoints = useMemo(() => ['50%'], [])
  const { dismiss } = useBottomSheetModal()
  const { bottom } = useSafeAreaInsets()
  const colorScheme = useColorScheme()
  const [darkMode, setDarkMode] = useMMKVBoolean('dark-mode', storage)
  const [hardMode, setHardMode] = useMMKVBoolean('hard-mode', storage)
  const [notificationsEnabled, setNotificationsEnabled] = useMMKVBoolean(
    'notifications-enabled',
    storage
  )

  const toggleDarkMode = () => {
    ;(prev) => !!!prev
  }
  const toggleHardMode = () => {
    ;(prev) => !!!prev
  }
  const toggleNotifcationsEnabled = () => {
    ;(prev) => !!!prev
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

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      backdropComponent={renderBackdrop}
      snapPoints={snapPoints}
    >
      <ThemedLinearGradient>
        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <Link
              href={'/(authenticated)/'}
              asChild
            ></Link>
            <TouchableOpacity onPress={() => dismiss()}>
              <Ionicons
                name='close'
                size={28}
                color={Colors.light.gray}
              />
            </TouchableOpacity>
          </View>
          <Text
            style={[
              styles.containerTitle,
              { color: Colors[colorScheme ?? 'light'].text },
            ]}
          >
            Settings
          </Text>
          <View
            style={{
              borderBottomColor: Colors[colorScheme ?? 'light'].border,
              borderBottomWidth: StyleSheet.hairlineWidth,
              margin: 20,
            }}
          />
          <BottomSheetScrollView>
            <View style={styles.row}>
              <View style={styles.rowText}>
                <Text
                  style={[
                    styles.rowTitle,
                    { color: Colors[colorScheme ?? 'light'].text },
                  ]}
                >
                  Dark mode
                </Text>
                <Text
                  style={[
                    styles.rowSubtitle,
                    { color: Colors[colorScheme ?? 'light'].text },
                  ]}
                >
                  Toggle manually between light and dark mode
                </Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={toggleDarkMode}
              />
            </View>
            <View style={styles.row}>
              <View style={styles.rowText}>
                <Text
                  style={[
                    styles.rowTitle,
                    { color: Colors[colorScheme ?? 'light'].text },
                  ]}
                >
                  Hard mode
                </Text>
                <Text
                  style={[
                    styles.rowSubtitle,
                    { color: Colors[colorScheme ?? 'light'].text },
                  ]}
                >
                  Toggle the game to hard mode
                </Text>
              </View>
              <Switch
                value={hardMode}
                onValueChange={toggleHardMode}
              />
            </View>
            <View style={styles.row}>
              <View style={styles.rowText}>
                <Text
                  style={[
                    styles.rowTitle,
                    { color: Colors[colorScheme ?? 'light'].text },
                  ]}
                >
                  Enable Notifications
                </Text>
                <Text
                  style={[
                    styles.rowSubtitle,
                    { color: Colors[colorScheme ?? 'light'].text },
                  ]}
                >
                  Toggle the game to hard mode
                </Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={toggleNotifcationsEnabled}
              />
            </View>
          </BottomSheetScrollView>
        </View>
      </ThemedLinearGradient>
    </BottomSheetModal>
  )
})
const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  containerTitle: {
    fontSize: 30,
    textAlign: 'center',
    fontFamily: 'FrankRuhlLibre_900Black',
  },
  headerRow: {
    padding: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  link: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 20,
    fontFamily: 'FrankRuhlLibre_900Black',
    marginBottom: 5,
  },
  rowSubtitle: {
    fontSize: 12,
  },
})

export default SettingsModal
