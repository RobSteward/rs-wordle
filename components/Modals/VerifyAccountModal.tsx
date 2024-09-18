import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  Animated,
  Platform,
  StyleSheet,
  useColorScheme,
} from 'react-native'
import { Text, Icon } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'
import * as Crypto from 'expo-crypto'
import { Toast } from 'react-native-toast-notifications'
import * as Yup from 'yup'
import buttonShakeAnimation from '@/constants/ButtonShakeAnimation'
import EmailClientHelper from '@/utils/emailClientHelper'
import { useBottomSheetModal } from '@gorhom/bottom-sheet'
import ThemedButton from '@/components/ThemedComponents/ThemedButton'
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field'
import { useSignUp } from '@clerk/clerk-expo'
import { Colors } from '@/constants/Colors'

const verifyAccountSchema = Yup.object().shape({
  token: Yup.array()
    .of(Yup.string().length(1))
    .length(6)
    .required('Verification token is required'),
})

const { Value, Text: AnimatedText } = Animated
const animationsColor = [...new Array(6)].map(() => new Value(0))
const animationsScale = [...new Array(6)].map(() => new Value(1))

const REQUEST_TOKEN_TIMEOUT = 60000

interface AnimateCellProps {
  hasValue: boolean
  index: number
  isFocused: boolean
}

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

const VerifyAccountModal: React.FC = () => {
  const colorScheme = useColorScheme()
  const { dismissAll: dismissAllModals } = useBottomSheetModal()
  const { signUp, isLoaded, setActive } = useSignUp()
  const [code, setCode] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [tokenSentAgain, setTokenSentAgain] = useState(false)
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: code,
    setValue: setCode,
  })
  const shakeAnimationValue = useRef(new Animated.Value(0)).current
  const emailHelper = new EmailClientHelper()
  const ref = useBlurOnFulfill({ value: code, cellCount: 6 })

  useEffect(() => {
    if (code.length === 6) {
      handleSubmit()
    }
  }, [code])

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
    }, 0)

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

  const handleOpenEmail = async () => {
    if (Platform.OS === 'ios') {
      emailHelper.openMailClientIOS()
    } else if (Platform.OS === 'android') {
      emailHelper.openMailClientAndroid()
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      await handleVerification()
    } catch (error) {
      buttonShakeAnimation(shakeAnimationValue)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    dismissAllModals()
  }

  const handleVerification = async () => {
    if (!isLoaded) {
      return
    }

    let toastId = Toast.show('Verifying...', {
      type: 'normal',
      placement: 'top',
      duration: 4000,
      animationType: 'slide-in',
    })

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      })
      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId })
        await AsyncStorage.setItem('is_verified', 'true')
        Toast.update(toastId, 'Verified!', {
          type: 'success',
        })
        dismissAllModals()
      } else {
        Toast.update(toastId, 'Verification failed', {
          type: 'danger',
        })
      }
    } catch (error: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      let errorMessage = 'An unknown error occurred'
      if (error.errors && error.errors.length > 0) {
        errorMessage = error.errors[0].longMessage
      }
      Toast.update(toastId, `Verification failed: ${errorMessage}`, {
        type: 'danger',
      })
      setCode('')
      throw new Error(errorMessage)
    }
  }

  const handleSendAgain = async () => {
    setTokenSentAgain(true)
    let toastId = Toast.show('Sending new verification token...', {
      type: 'normal',
      placement: 'top',
      duration: 5000,
      animationType: 'slide-in',
    })

    try {
      //TODO Trigger sending new verification token, invalidate old verification token
      // await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      setCode('')
      Toast.update(
        //TODO Extract token to constants
        toastId,
        `Verification token sent! Next token request available in ${
          REQUEST_TOKEN_TIMEOUT / 1000
        } seconds`,
        {
          type: 'success',
        }
      )
    } catch (e) {
      Toast.update(toastId, `Failed to resent verification email: ${e}`, {
        type: 'danger',
      })
    } finally {
      setTimeout(() => {
        setTokenSentAgain(false)
      }, REQUEST_TOKEN_TIMEOUT)
    }
  }

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.text}>
          A verification token has been sent to{' '}
          <Text
            style={styles.linkText}
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
          ></Icon>
          .
        </Text>
        <Text style={styles.text}>
          Enter the token below to verify your account. No token received?{' '}
          <Text
            style={[styles.linkText, tokenSentAgain && styles.disabledText]}
            onPress={() => {
              handleSendAgain()
            }}
            disabled={tokenSentAgain}
          >
            Request new token
          </Text>
        </Text>
      </View>
      <View>
        <CodeField
          ref={ref}
          {...props}
          value={code}
          onChangeText={setCode}
          cellCount={6}
          keyboardType='number-pad'
          textContentType='password'
          renderCell={renderCell}
          autoFocus={true}
        />
        <View style={styles.buttonContainer}>
          <Animated.View
            style={{ transform: [{ translateX: shakeAnimationValue }] }}
          >
            <ThemedButton
              onPress={handleSubmit}
              title='Verify account'
              disabled={isLoading}
              loading={isLoading}
              primary={true}
            />
          </Animated.View>
          <ThemedButton
            onPress={handleCancel}
            title='Cancel verification'
            disabled={isLoading}
          />
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
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
  container: {
    marginBottom: 20,
    gap: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 50,
    marginTop: 50,
  },
  text: {
    color: 'white',
  },
  linkText: {
    color: 'white',
    textDecorationLine: 'underline',
  },
  disabledText: {
    color: '#6b7280',
  },
})

export default VerifyAccountModal
