import {
  Platform,
  Animated,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native'
import ThemedForm from '@/components/ThemedComponents/ThemedForm'
import * as Yup from 'yup'
import { validateEmail } from '@/utils/validations/formValidations'
import { useFormikContext, FormikProps, FormikValues } from 'formik'
import ThemedFormSubmit from '@/components/ThemedComponents/ThemedFormSubmit'
import ThemedFormField from '@/components/ThemedComponents/ThemedFormField'
import { Colors } from '@/constants/Colors'
import buttonShakeAnimation from '@/constants/ButtonShakeAnimation'
import { forwardRef, Ref, useRef, useState } from 'react'
import { useSignIn } from '@clerk/clerk-expo'
import { router } from 'expo-router'
import { Toast } from 'react-native-toast-notifications'
import { Icon, TextInput } from 'react-native-paper'
import { WINDOW_HEIGHT } from '@gorhom/bottom-sheet'

interface RequestResetPasswordScreenProps {
  prefill?: string
  emitSuccess: () => void
}

const initialValues: RequestResetPasswordScreenProps = {
  prefill: '',
  emitSuccess: () => {},
}

const resetPasswordValidationSchema = Yup.object().shape({
  email: validateEmail,
})

const RequestResetPasswordScreen: React.FC<RequestResetPasswordScreenProps> = ({
  prefill,
  emitSuccess,
}) => {
  const shakeAnimationValue = useRef(new Animated.Value(0)).current
  const { signIn, isLoaded } = useSignIn()
  const [successfulCreation, setSuccessfulCreation] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)
  const colorScheme = useColorScheme()
  const [resetPasswordEmailSentAgain, setResetPasswordEmailSentAgain] =
    useState(false)
  const REQUEST_CODE_TIMEOUT = 60000

  const handleSubmit = async (values: FormikValues) => {
    try {
      await handleRequestResetPassword(values.email)
    } catch (error) {
      buttonShakeAnimation(shakeAnimationValue)
    }
  }

  const handleRequestResetPassword = async (email: string) => {
    const toastId = Toast.show('Sending password reset code...', {
      type: 'normal',
      placement: 'top',
    })
    try {
      await signIn
        ?.create({
          strategy: 'reset_password_email_code',
          identifier: email,
        })
        .then((_) => {
          emitSuccess()
          Toast.update(toastId, 'Password reset code sent!', {
            type: 'success',
          })
        })
        .catch((err) => {
          console.error('error', err.errors[0].longMessage)
          Toast.update(toastId, err.errors[0].longMessage, {
            type: 'danger',
          })
        })
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
        `Sending password reset code failed: ${errorMessage}`,
        {
          type: 'danger',
        }
      )
      throw new Error(errorMessage)
    }
  }

  const handleRequestAgain = async () => {
    setResetPasswordEmailSentAgain(true)
    let toastId = Toast.show('Sending new verification code...', {
      type: 'normal',
      placement: 'top',
      duration: 5000,
      animationType: 'slide-in',
    })

    try {
      //TODO Trigger sending new password reset code, invalidate old password reset code
      await new Promise((resolve) => setTimeout(resolve, 2000))
      Toast.update(
        toastId,
        `New code sent! Next code request available in ${
          REQUEST_CODE_TIMEOUT / 1000
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
      }, REQUEST_CODE_TIMEOUT)
    }
  }

  const handleOpenEmail = async () => {
    if (Platform.OS === 'ios') {
      console.log('Opening email client on iOS')
      //emailHelper.openMailClientIOS()
    } else if (Platform.OS === 'android') {
      console.log('Opening email client on Android')
      //emailHelper.openMailClientAndroid()
    }
  }

  return (
    <ThemedForm
      initialValues={
        prefill ? { ...initialValues, email: prefill } : initialValues
      }
      validationSchema={resetPasswordValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue }: FormikProps<any>) => (
        <>
          <View>
            <Text
              style={[
                styles.text,
                { color: Colors[colorScheme ?? 'light'].text },
              ]}
            >
              Enter{' '}
              <Text
                style={[
                  styles.underline,
                  { color: Colors[colorScheme ?? 'light'].text },
                ]}
                onPress={() => {
                  handleOpenEmail()
                }}
              >
                your email
              </Text>{' '}
              <Icon
                source='open-in-new'
                size={15}
                color={Colors[colorScheme ?? 'light'].text}
              ></Icon>{' '}
              to receive a temporary code to reset your password.
              {'\n'}No email received?{' '}
              <Text
                style={[
                  styles.underline,
                  {
                    color: resetPasswordEmailSentAgain
                      ? Colors[colorScheme ?? 'light'].iconInactive
                      : Colors[colorScheme ?? 'light'].text,
                  },
                ]}
                onPress={() => {
                  handleRequestAgain
                }}
                disabled={resetPasswordEmailSentAgain}
              >
                Request new code
              </Text>
            </Text>
          </View>
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
              />
            }
          />
          <View style={[styles.buttonContainer, { top: WINDOW_HEIGHT * 0.38 }]}>
            <Animated.View
              style={{
                transform: [{ translateX: shakeAnimationValue }],
              }}
            >
              <ThemedFormSubmit buttonAction='Receive code' />
            </Animated.View>
          </View>
        </>
      )}
    </ThemedForm>
  )
}

export default RequestResetPasswordScreen

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  buttonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  title: {
    fontSize: 30,
    padding: 10,
    textAlign: 'center',
    fontFamily: 'FrankRuhlLibre_500Medium',
  },
  text: {
    fontSize: 20,
    marginVertical: 10,
  },
  underline: {
    textDecorationLine: 'underline',
  },
})
