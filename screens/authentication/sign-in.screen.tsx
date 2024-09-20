import React, { useState, useRef, useCallback, useEffect } from 'react'
import { View, Text, Animated, StyleSheet, useColorScheme } from 'react-native'
import { TextInput, Button, MD3Colors, IconButton } from 'react-native-paper'
import { Toast } from 'react-native-toast-notifications'
import { router } from 'expo-router'
import { FormikProps, FormikValues } from 'formik'
import * as Yup from 'yup'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import ThemedForm from '@/components/ThemedComponents/ThemedForm'
import ThemedFormSubmit from '@/components/ThemedComponents/ThemedFormSubmit'
import ThemedFormField from '@/components/ThemedComponents/ThemedFormField'
import buttonShakeAnimation from '@/constants/ButtonShakeAnimation'
import {
  validateEmail,
  validatePassword,
} from '@/utils/validations/formValidations'
import isEmail from 'validator/lib/isEmail'
import ThemedButton from '@/components/ThemedComponents/ThemedButton'
import VerifyAccountModal from '@/components/Modals/VerifyAccountModal'
import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Colors } from '@/constants/Colors'
import SocialAuthentication from '@/components/SocialAuthentication'
import ResetPasswordModal from '@/components/Modals/ResetPasswordModal'

interface SignInFormProps {
  email: string
  password: string
}

const initialValues: SignInFormProps = {
  email: 'robinscharf@gmail.com',
  password: 'Aererert1!',
}

const SignInValidationSchema = Yup.object().shape({
  email: validateEmail,
  password: validatePassword,
})

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()
  const shakeAnimationValue = useRef(new Animated.Value(0)).current
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const colorScheme = useColorScheme()
  const resetPasswordModalRef = useRef<BottomSheetModal>(null)

  const handleSubmit = async (values: FormikValues) => {
    setIsLoading(true)
    return handleSignIn(values)
  }

  const handleSignIn = async (values: FormikValues) => {
    const toastId = Toast.show('Signing in...', {
      type: 'normal',
      placement: 'top',
    })

    const updateToast = async (
      message: string,
      type: 'normal' | 'success' | 'danger'
    ) => {
      Toast.update(toastId, message, {
        type,
      })
    }

    const createAccount = async () => {
      if (!isLoaded) {
        return
      }

      updateToast('Signing in...', 'normal')
      try {
        const signInAttempt = await signIn.create({
          identifier: values.email,
          password: values.password,
        })

        if (signInAttempt.status === 'complete') {
          await setActive({ session: signInAttempt.createdSessionId })
          updateToast('Signed in!', 'success')
          router.replace('/(authenticated)/')
        } else {
          throw new Error('Sign in failed')
        }
      } catch (err: any) {
        updateToast(`Registration failed. Please try again`, 'danger')
      } finally {
        setIsLoading(false)
      }
    }

    try {
      createAccount()
    } catch (error: any) {
      handleSignInError(error, toastId)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignInError = (error: any, toastId: string) => {
    buttonShakeAnimation(shakeAnimationValue)
    let errorMessage = 'An unknown error occurred'
    if (
      error &&
      typeof error === 'object' &&
      'errors' in error &&
      Array.isArray(error.errors) &&
      error.errors.length > 0
    ) {
      errorMessage = error.errors[0].message
    } else if (typeof error === 'string') {
      errorMessage = error
    }
    Toast.update(toastId, `Sign in failed: ${errorMessage}`, {
      type: 'danger',
    })
  }

  const handlePresentResetPasswordModal = () =>
    resetPasswordModalRef.current?.present()

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <>
        <ThemedForm
          initialValues={initialValues}
          validationSchema={SignInValidationSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            setFieldValue,
            setFieldTouched,
            isSubmitting,
          }: FormikProps<any>) => (
            <View>
              <ResetPasswordModal
                ref={resetPasswordModalRef}
                prefill={values.email}
              />
              <Text style={styles.headerText}>Welcome Back!</Text>
              <Text style={styles.text}>
                Enter your email and password to sign in.
              </Text>
              <ThemedFormField
                name='email'
                label='Email'
                autoCapitalize='none'
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
                    rippleColor={MD3Colors.error0}
                  />
                }
              />
              <ThemedFormField
                name='password'
                label='Password'
                placeholder='Enter a password...'
                secureTextEntry={!showPassword}
                autoFocus={false}
                enablesReturnKeyAutomatically={true}
                keyboardType='default'
                textContentType='password'
                enterKeyHint='send'
                left={<TextInput.Icon icon='lock' />}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye' : 'eye-off'}
                    forceTextInputFocus={false}
                    onPress={() => {
                      setShowPassword(!showPassword)
                    }}
                    disabled={!values.password}
                    rippleColor={MD3Colors.error0}
                  />
                }
              />
              <Button
                mode='text'
                textColor='#FFFFFF'
                onPress={handlePresentResetPasswordModal}
                style={{ opacity: 0.5, alignItems: 'flex-end' }}
              >
                Reset password
              </Button>
              <Animated.View
                style={{
                  marginTop: 20,
                  transform: [{ translateX: shakeAnimationValue }],
                }}
              >
                <ThemedFormSubmit buttonAction='Sign in' />
              </Animated.View>
            </View>
          )}
        </ThemedForm>
      </>
    </View>
  )
}

const styles = StyleSheet.create({
  headerText: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  text: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  },
})
