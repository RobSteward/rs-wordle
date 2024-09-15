import { StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import ThemedLinearGradient from '@/components/ThemedLinearGradient'
import React, { forwardRef, useMemo, useCallback } from 'react'
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet'

import LearnMoreModal from '@/components/LearnMoreModal'
import ResetPasswordModal from '@/components/ResetPasswordModal'
import VerifyAccountModal from '@/components/VerifyAccountModal'

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
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          {type === 'resetPasswordModal' && (
            <ResetPasswordModal prefill={prefill} />
          )}
          {type === 'verifyAccountModal' && <VerifyAccountModal />}
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
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  description: {
    color: 'white',
    alignSelf: 'flex-start',
  },
})

export default DefaultBottomSheetModal
