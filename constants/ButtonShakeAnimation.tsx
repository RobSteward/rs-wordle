import { Animated } from 'react-native'

const buttonShakeAnimation = (shakeAnimationValue: Animated.Value) => {
  Animated.sequence([
    Animated.timing(shakeAnimationValue, {
      toValue: 10,
      duration: 50,
      useNativeDriver: true,
    }),
    Animated.timing(shakeAnimationValue, {
      toValue: -10,
      duration: 50,
      useNativeDriver: true,
    }),
    Animated.timing(shakeAnimationValue, {
      toValue: 10,
      duration: 50,
      useNativeDriver: true,
    }),
    Animated.timing(shakeAnimationValue, {
      toValue: 0,
      duration: 50,
      useNativeDriver: true,
    }),
  ]).start()
}

export default buttonShakeAnimation
