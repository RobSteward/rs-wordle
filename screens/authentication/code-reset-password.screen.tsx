import { Animated, Platform, StyleSheet, Text, View } from 'react-native'
import React, { Ref, useEffect, useRef, useState } from 'react'
import { useColorScheme } from 'react-native'
import { Colors } from '@/constants/Colors'
import { useSignIn } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { Toast } from 'react-native-toast-notifications'
import { useFormik, FormikProps, FormikValues } from 'formik'
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field'
import ThemedForm from '@/components/ThemedComponents/ThemedForm'
import ThemedFormSubmit from '@/components/ThemedComponents/ThemedFormSubmit'
import ThemedFormField from '@/components/ThemedComponents/ThemedFormField'
import { Icon, MD3Colors, TextInput } from 'react-native-paper'
import * as Yup from 'yup'
import buttonShakeAnimation from '@/constants/ButtonShakeAnimation'
import {
  validatePassword,
  validateConfirmPassword,
} from '@/utils/validations/formValidations'
import { WINDOW_HEIGHT } from '@gorhom/bottom-sheet'

interface AnimateCellProps {
  hasValue: boolean
  index: number
  isFocused: boolean
}

const { Value, Text: AnimatedText } = Animated
const animationsColor = [...new Array(6)].map(() => new Value(0))
const animationsScale = [...new Array(6)].map(() => new Value(1))

interface ResetPasswordProps {
  password: string
  confirmPassword: string
}

const initialValues: ResetPasswordProps = {
  password: '',
  confirmPassword: '',
}

const resetPasswordValidationSchema = Yup.object().shape({
  password: validatePassword,
  confirmPassword: validateConfirmPassword,
})

const CodeResetPasswordScreen = ({
  onSetSnapPoint,
}: {
  onSetSnapPoint: (index: number) => void
}) => {
  const colorScheme = useColorScheme()
  const [code, setCode] = useState('')
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: code,
    setValue: setCode,
  })
  const codeFieldRef = useBlurOnFulfill({ value: code, cellCount: 6 })
  const [showPasswordFields, setShowPasswordFields] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const shakeAnimationValue = useRef(new Animated.Value(0)).current
  const { signIn, setActive } = useSignIn()
  const [secondFactor, setSecondFactor] = useState(false)

  const animateCell = ({ hasValue, index, isFocused }: AnimateCellProps) => {
    Animated.parallel([
      Animated.timing(animationsColor[index], {
        useNativeDriver: false,
        toValue: isFocused ? 1 : 0,
        duration: 250,
      }),
      Animated.spring(animationsScale[index], {
        useNativeDriver: false,
        toValue: hasValue ? 0 : 1,
        speed: hasValue ? 300 : 250,
      }),
    ]).start()
  }

  const renderCell = ({
    index,
    symbol,
    isFocused,
  }: {
    index: number
    symbol: string | undefined
    isFocused: boolean
  }) => {
    const hasValue = Boolean(symbol)
    const animatedCellStyle = {
      backgroundColor: hasValue
        ? animationsScale[index].interpolate({
            inputRange: [0, 1],
            outputRange: [
              Colors[colorScheme ?? 'light'].gameBackground,
              Colors.light.primary,
            ],
          })
        : animationsColor[index].interpolate({
            inputRange: [0, 1],
            outputRange: [
              Colors[colorScheme ?? 'light'].gameBackground,
              Colors.light.primary,
            ],
          }),
      borderRadius: animationsScale[index].interpolate({
        inputRange: [0, 1],
        outputRange: [80, 15],
      }),
      transform: [
        {
          scale: animationsScale[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0.5, 1],
          }),
        },
      ],
    }

    setTimeout(() => {
      animateCell({ hasValue, index, isFocused })
    }, 100)

    return (
      <Animated.View
        key={index}
        onLayout={getCellOnLayoutHandler(index)}
        style={[styles.cell, animatedCellStyle]}
      >
        <AnimatedText
          style={[
            styles.cellText,
            { color: Colors[colorScheme ?? 'light'].text },
          ]}
        >
          {symbol || (isFocused ? <Cursor /> : null)}
        </AnimatedText>
      </Animated.View>
    )
  }

  const handleSubmit = async (values: FormikValues) => {
    const toastId = Toast.show('Resetting password...', {
      type: 'normal',
      placement: 'top',
    })
    try {
      await resetPassword(code, values.password)
      Toast.update(toastId, 'Password reset successful', {
        type: 'success',
        placement: 'top',
      })
    } catch (error) {
      Toast.update(toastId, `Password reset failed: ${error}`, {
        type: 'danger',
      })
      buttonShakeAnimation(shakeAnimationValue)
    }
  }

  const resetPassword = async (code: string, password: string) => {
    try {
      await signIn
        ?.attemptFirstFactor({
          strategy: 'reset_password_email_code',
          code,
          password,
        })
        .then((result) => {
          if (result.status === 'needs_second_factor') {
            setSecondFactor(true)
          } else if (result.status === 'complete') {
            setActive({ session: result.createdSessionId })
          } else {
            throw new Error(JSON.stringify(result))
          }
        })
        .catch((err) => {
          console.log('Error', err.errors[0].longMessage)
          throw new Error(`${err.errors[0].longMessage}`)
        })
    } catch (error) {
      let errorMessage = 'An unknown error occurred'
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === 'string') {
        errorMessage = error
      }
      throw new Error(errorMessage)
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
  useEffect(() => {
    if (code.length === 6) {
      setShowPasswordFields(true)
      onSetSnapPoint(1)
    } else {
      setShowPasswordFields(false)
      onSetSnapPoint(0)
    }
  }, [code])

  return (
    <>
      <Text
        style={[styles.text, { color: Colors[colorScheme ?? 'light'].text }]}
      >
        Enter the code that was sent to{' '}
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
      </Text>
      <CodeField
        ref={codeFieldRef}
        {...props}
        value={code}
        onChangeText={setCode}
        cellCount={6}
        keyboardType='number-pad'
        textContentType='password'
        renderCell={renderCell}
        autoFocus={true}
      />
      {showPasswordFields && (
        <View>
          <ThemedForm
            initialValues={initialValues}
            validationSchema={resetPasswordValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ values }: FormikProps<any>) => (
              <>
                <View>
                  <Text
                    style={[
                      styles.text,
                      { color: Colors[colorScheme ?? 'light'].text },
                    ]}
                  >
                    Enter a new password
                  </Text>
                  <ThemedFormField
                    name='password'
                    label='Password'
                    placeholder='Enter a password...'
                    secureTextEntry={!showPassword}
                    autoFocus={false}
                    enablesReturnKeyAutomatically={true}
                    keyboardType='default'
                    textContentType='password'
                    enterKeyHint='next'
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
                  <View
                    style={[
                      styles.buttonContainer,
                      { top: WINDOW_HEIGHT * 0.32 },
                    ]}
                  >
                    <Animated.View
                      style={{
                        transform: [{ translateX: shakeAnimationValue }],
                      }}
                    >
                      <ThemedFormSubmit buttonAction='Set password' />
                    </Animated.View>
                  </View>
                </View>
              </>
            )}
          </ThemedForm>
        </View>
      )}
    </>
  )
}
export default CodeResetPasswordScreen
const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
  },
  cellText: {
    fontSize: 36,
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
