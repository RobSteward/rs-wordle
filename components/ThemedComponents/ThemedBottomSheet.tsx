import { StyleSheet, View, useColorScheme } from 'react-native'
import { Text } from 'react-native-paper'
import ThemedLinearGradient from '@/components/ThemedComponents/ThemedLinearGradient'
import React, { forwardRef, useMemo, useCallback } from 'react'
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet'

import LearnMoreModal from '@/components/Modals/LearnMoreModal'
import ResetPasswordModal from '@/components/Modals/ResetPasswordModal'
import VerifyAccountModal from '@/components/Modals/VerifyAccountModal'
import { Colors } from '@/constants/Colors'

import { string } from 'yup'

export type Ref = BottomSheetModal

type Props = {
  type: 'resetPasswordModal' | 'verifyAccountModal' | 'learnMoreModal'
  title: string
  description?: string
  initialIndex?: number
  snapPoint?: string[]
  prefill?: string
}

const DefaultBottomSheetModal = forwardRef<Ref, Props>((props, ref) => {
  const { type, title, description, initialIndex, snapPoint, prefill } = props
  const snapPoints = useMemo(() => snapPoint ?? ['50%'], [])
  const colorScheme = useColorScheme()

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        appearsOnIndex={initialIndex ?? 0}
        disappearsOnIndex={-1}
        opacity={0.75}
        {...props}
      />
    ),
    []
  )

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      enableDismissOnClose={true}
      enablePanDownToClose={true}
      name={type}
      backdropComponent={renderBackdrop}
      keyboardBehavior='interactive'
    >
      <ThemedLinearGradient>
        <View style={styles.container}>
          <Text
            style={[
              styles.title,
              { color: Colors[colorScheme ?? 'light'].text },
            ]}
          >
            {title}
          </Text>
          <Text
            style={[
              styles.description,
              { color: Colors[colorScheme ?? 'light'].text },
            ]}
          >
            {description}
          </Text>
          {type === 'resetPasswordModal' && (
            <ResetPasswordModal prefill={prefill} />
          )}
          {type === 'verifyAccountModal' && <VerifyAccountModal />}
          {type === 'learnMoreModal' && <LearnMoreModal />}
        </View>
      </ThemedLinearGradient>
    </BottomSheetModal>
  )
})

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  description: {
    alignSelf: 'flex-start',
  },
})

export default DefaultBottomSheetModal
