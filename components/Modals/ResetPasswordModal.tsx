import React, { useState, useRef, useEffect } from 'react'
import { View, Animated, Platform, StyleSheet } from 'react-native'
import { Text, Icon, TextInput } from 'react-native-paper'
import { router } from 'expo-router'
import { Toast } from 'react-native-toast-notifications'
import * as Yup from 'yup'
import * as Crypto from 'expo-crypto'
import buttonShakeAnimation from '@/constants/ButtonShakeAnimation'
import EmailClientHelper from '@/utils/emailClientHelper'
import { useFormikContext, FormikProps, FormikValues } from 'formik'
import { useBottomSheetModal } from '@gorhom/bottom-sheet'
import { validateEmail } from '@/utils/validations/formValidations'
import ThemedForm from '@/components/ThemedForm'
import ThemedFormSubmit from '@/components/ThemedFormSubmit'
import ThemedFormField from '@/components/ThemedFormField'

interface ResetPasswordProps {
  email: string
}

const initialValues: ResetPasswordProps = {
  email: '',
}

const resetPasswordValidationSchema = Yup.object().shape({
  email: validateEmail,
})

const ResetPasswordModal: React.FC<{ prefill?: string }> = ({ prefill }) => {
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
    </>
    //TODO Fix button positioning not reacting to email field error message
  )
}

const styles = StyleSheet.create({
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
