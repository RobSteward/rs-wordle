import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useCallback,
  useMemo,
} from 'react'
import {
  View,
  Animated,
  Platform,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native'
import { Text, Icon, TextInput } from 'react-native-paper'
import { router } from 'expo-router'
import { Toast } from 'react-native-toast-notifications'
import * as Yup from 'yup'
import { Ionicons } from '@expo/vector-icons'
import * as WebBrowser from 'expo-web-browser'
import { WebBrowserResult } from 'expo-web-browser'
import buttonShakeAnimation from '@/constants/ButtonShakeAnimation'
import EmailClientHelper from '@/utils/emailClientHelper'
import { useFormikContext, FormikProps, FormikValues } from 'formik'
import ThemedButton from '@/components/ThemedComponents/ThemedButton'
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  useBottomSheetModal,
} from '@gorhom/bottom-sheet'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { validateEmail } from '@/utils/validations/formValidations'
import ThemedForm from '@/components/ThemedComponents/ThemedForm'
import ThemedFormSubmit from '@/components/ThemedComponents/ThemedFormSubmit'
import ThemedFormField from '@/components/ThemedComponents/ThemedFormField'
import disc from '@jsamr/counter-style/presets/disc'
import MarkedList from '@jsamr/react-native-li'
import { Link } from 'expo-router'
import { Colors } from '@/constants/Colors'
export type Ref = BottomSheetModal

interface ResetPasswordProps {
  email: string
}

const initialValues: ResetPasswordProps = {
  email: '',
}

const resetPasswordValidationSchema = Yup.object().shape({
  email: validateEmail,
})

const ResetPasswordModal = forwardRef<Ref, { prefill?: string }>(
  ({ prefill }, ref) => {
    const snapPoints = useMemo(() => ['75%'], [])
    const { dismiss } = useBottomSheetModal()
    const { bottom } = useSafeAreaInsets()
    const shakeAnimationValue = useRef(new Animated.Value(0)).current
    const { dismissAll: dismissAllModals } = useBottomSheetModal()
    const emailHelper = new EmailClientHelper()
    const [resetPasswordEmailSentAgain, setResetPasswordEmailSentAgain] =
      useState(false)
    const REQUEST_TOKEN_TIMEOUT = 60000

    const handleOpenEmail = async () => {
      if (Platform.OS === 'ios') {
        console.log('Opening email client on iOS')
        //emailHelper.openMailClientIOS()
      } else if (Platform.OS === 'android') {
        console.log('Opening email client on Android')
        //emailHelper.openMailClientAndroid()
      }
    }

    const handleSubmit = async (values: FormikValues) => {
      try {
        await handleResetPassword(values.email)
      } catch (error) {
        buttonShakeAnimation(shakeAnimationValue)
      }
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

    const handleResetPassword = async (email: string) => {
      const toastId = Toast.show('Sending password reset link...', {
        type: 'normal',
        placement: 'top',
      })
      try {
        // await sendPasswordResetEmail(
        //   FIREBASE_AUTH,
        //   email,
        //   firebaseAuthActionCodeSettings
        // )
        Toast.update(toastId, 'Password reset link sent!', {
          type: 'success',
        })
        dismissAllModals()
        //TODO Set sign in mode to password and pass email to sign in form
      } catch (error) {
        buttonShakeAnimation(shakeAnimationValue)
        console.error(error)
        let errorMessage = 'An unknown error occurred'
        if (error instanceof Error) {
          errorMessage = error.message
        } else if (typeof error === 'string') {
          errorMessage = error
        }
        Toast.update(
          toastId,
          `Sending password reset link failed: ${errorMessage}`,
          {
            type: 'danger',
          }
        )
        throw new Error(errorMessage)
      }
    }

    const handleSendAgain = async () => {
      setResetPasswordEmailSentAgain(true)
      let toastId = Toast.show('Sending new verification token...', {
        type: 'normal',
        placement: 'top',
        duration: 5000,
        animationType: 'slide-in',
      })

      try {
        //TODO Trigger sending new verification token, invalidate old verification token
        await new Promise((resolve) => setTimeout(resolve, 2000))
        Toast.update(
          toastId,
          `New Verification token sent! Next link request available in ${
            REQUEST_TOKEN_TIMEOUT / 1000
          } seconds`,
          {
            type: 'success',
          }
        )
      } catch (e) {
        console.log('Error in ResetPasswordModal', e)
        throw new Error()
      } finally {
        setTimeout(() => {
          setResetPasswordEmailSentAgain(false)
        }, REQUEST_TOKEN_TIMEOUT)
      }
    }

    return (
      <>
        <BottomSheetModal
          ref={ref}
          index={0}
          backdropComponent={renderBackdrop}
          snapPoints={snapPoints}
        >
          <View style={styles.alignBottom}>
            <View style={styles.container}>
              <Text style={styles.whiteText}>
                Enter{' '}
                <Text
                  style={styles.underline}
                  onPress={() => {
                    handleOpenEmail()
                  }}
                >
                  your email
                </Text>
                <Icon
                  source='open-in-new'
                  size={15}
                  color='white'
                ></Icon>{' '}
                to receive reset password link.
              </Text>
              <Text style={styles.whiteText}>
                No email received?{' '}
                <Text
                  style={[
                    styles.underline,
                    resetPasswordEmailSentAgain
                      ? styles.grayText
                      : styles.whiteText,
                  ]}
                  onPress={() => {
                    handleSendAgain()
                  }}
                  disabled={resetPasswordEmailSentAgain}
                >
                  Request new reset password link
                </Text>
              </Text>
            </View>
            <ThemedForm
              initialValues={
                prefill ? { ...initialValues, email: prefill } : initialValues
              }
              validationSchema={resetPasswordValidationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, setFieldValue }: FormikProps<any>) => (
                <>
                  <ThemedFormField
                    name='email'
                    label='Email'
                    placeholder='Enter your email...'
                    autoFocus={true}
                    enablesReturnKeyAutomatically={true}
                    keyboardType='email-address'
                    enterKeyHint='next'
                    left={<TextInput.Icon icon='email' />}
                    right={
                      <TextInput.Icon
                        icon={'close'}
                        forceTextInputFocus={false}
                        onPress={() => {
                          setFieldValue('email', '')
                        }}
                        disabled={!values.email}
                        rippleColor='#FF9C01'
                      />
                    }
                  />
                  <Animated.View
                    style={{ transform: [{ translateX: shakeAnimationValue }] }}
                  >
                    <ThemedFormSubmit buttonAction='Receive link' />
                  </Animated.View>
                </>
              )}
            </ThemedForm>
          </View>
        </BottomSheetModal>
      </>
      //TODO Fix button positioning not reacting to email field error message
    )
  }
)

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
  alignBottom: {
    alignItems: 'flex-end',
  },
  container: {
    marginBottom: 20,
    marginTop: 10,
  },
  whiteText: {
    color: 'white',
  },
  underline: {
    textDecorationLine: 'underline',
  },
  grayText: {
    color: '#808080',
  },
})

export default ResetPasswordModal
