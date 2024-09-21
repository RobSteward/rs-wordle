import React, { useState, forwardRef, useCallback, useMemo } from 'react'
import { View, StyleSheet, Image, useColorScheme } from 'react-native'
import { Text } from 'react-native-paper'
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  useBottomSheetModal,
} from '@gorhom/bottom-sheet'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Colors } from '@/constants/Colors'
import ThemedLinearGradient from '../ThemedComponents/ThemedLinearGradient'
import RequestResetPasswordScreen from '@/screens/authentication/request-reset-password.screen'
import CodeResetPasswordScreen from '@/screens/authentication/code-reset-password.screen'
export type Ref = BottomSheetModal

interface ResetPasswordProps {
  email: string
}

const initialValues: ResetPasswordProps = {
  email: '',
}

const ResetPasswordModal = forwardRef<Ref, { prefill?: string }>(
  ({ prefill }, ref) => {
    const snapPoints = useMemo(() => ['50%', '70%'], [])
    const colorScheme = useColorScheme()
    const { dismiss } = useBottomSheetModal()
    const { bottom } = useSafeAreaInsets()
    const { dismissAll: dismissAllModals } = useBottomSheetModal()
    const [successfulCreation, setSuccessfulCreation] = useState(false)

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
      <>
        <BottomSheetModal
          ref={ref}
          index={0}
          backdropComponent={renderBackdrop}
          snapPoints={snapPoints}
        >
          <ThemedLinearGradient justify='flex-start'>
            <>
              <View style={styles.container}>
                <Text
                  style={[
                    styles.title,
                    { color: Colors[colorScheme ?? 'light'].text },
                  ]}
                >
                  Reset Password
                </Text>
                {!successfulCreation && (
                  <RequestResetPasswordScreen
                    prefill={prefill}
                    emitSuccess={() => {
                      setSuccessfulCreation(true)
                    }}
                  />
                )}
                {successfulCreation && (
                  <CodeResetPasswordScreen
                    onSetSnapPoint={(index: number) =>
                      (
                        ref as React.RefObject<BottomSheetModal>
                      )?.current?.snapToIndex(index)
                    }
                  />
                )}
              </View>
            </>
          </ThemedLinearGradient>
        </BottomSheetModal>
      </>
    )
  }
)

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    padding: 20,
    gap: 10,
  },
  title: {
    fontSize: 30,
    padding: 10,
    textAlign: 'center',
    fontFamily: 'FrankRuhlLibre_500Medium',
  },
})
export default ResetPasswordModal
