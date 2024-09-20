import React, { useState, useRef, useCallback, useEffect } from 'react'
import { View, Text, Animated, StyleSheet } from 'react-native'
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
  validateConfirmPassword,
} from '@/utils/validations/formValidations'
import isEmail from 'validator/lib/isEmail'
import { useSignUp } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import VerifyAccountModal from '@/components/Modals/VerifyAccountModal'

interface SignUpFormProps {
  email: string
  password: string
  confirmPassword: string
}

const initialValues: SignUpFormProps = {
  email: 'robinscharf@gmail.com',
  password: 'Aererert1!',
  confirmPassword: 'Aererert1!',
}

const signUpValidationSchema = Yup.object().shape({
  email: validateEmail,
  password: validatePassword,
  confirmPassword: validateConfirmPassword,
})

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()
  const shakeAnimationValue = useRef(new Animated.Value(0)).current
  const verifyAccountModalRef = useRef<BottomSheetModal>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [pendingVerification, setPendingVerification] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isExpired, setIsExpired] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [code, setCode] = useState('')

  const handleSubmit = async (values: FormikValues) => {
    setIsLoading(true)
    return handleSignUp(values)
  }

  const handleSignUp = async (values: FormikValues) => {
    setIsExpired(false)
    setIsVerified(false)
    setPendingVerification(false)

    const toastId = Toast.show('Signing up...', {
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

      updateToast('Creating account...', 'normal')
      try {
        await signUp.create({
          emailAddress: values.email,
          password: values.password,
        })
        await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
        setPendingVerification(true)
        updateToast('Temporary account created - Please verify!', 'success')
        if (signUp && isVerified) router.replace('/(authenticated)/(tabs)')
      } catch (err: any) {
        updateToast('Registration failed. Please try again', 'danger')
      } finally {
        setIsLoading(false)
      }
    }

    try {
      createAccount()
    } catch (error: any) {
      handleSignUpError(error, toastId)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUpError = (error: any, toastId: string) => {
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
    Toast.update(toastId, `Sign up failed: ${errorMessage}`, {
      type: 'danger',
    })
  }

  const handlePresentModalPress = useCallback(() => {
    console.log('handlePresentModalPress')
    verifyAccountModalRef.current?.present()
  }, [])

  useEffect(() => {
    if (pendingVerification) {
      handlePresentModalPress()
    }
  }, [pendingVerification])

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      {!pendingVerification && (
        <>
          <ThemedForm
            initialValues={initialValues}
            validationSchema={signUpValidationSchema}
            onSubmit={handleSubmit}
          >
            {({
              values,
              setFieldValue,
              setFieldTouched,
              isSubmitting,
            }: FormikProps<any>) => (
              <View>
                <Text style={styles.headerText}>Welcome!</Text>
                <Text style={styles.text}>
                  Enter your email and a password to create an account.
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
                <ThemedFormField
                  name='confirmPassword'
                  label='Confirm password'
                  placeholder='Confirm your password...'
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
                      disabled={!values.confirmPassword}
                      rippleColor={MD3Colors.error0}
                    />
                  }
                />
                <Animated.View
                  style={{
                    marginTop: 20,
                    transform: [{ translateX: shakeAnimationValue }],
                  }}
                >
                  <ThemedFormSubmit buttonAction='Sign up' />
                </Animated.View>
              </View>
            )}
          </ThemedForm>
        </>
      )}
      {pendingVerification && (
        <>
          <VerifyAccountModal />
        </>
      )}
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
