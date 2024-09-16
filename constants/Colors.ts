/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { MD3Colors } from 'react-native-paper'

const tintColorLight = '#0a7ea4'
const tintColorDark = '#FFFFFF'

export const Colors = {
  light: {
    correctKey: '#4A7A44',
    presentKey: '#B59F3B',
    wrongKey: MD3Colors.error40,
    defaultKey: '#9CA3A8',
    primary: '#1180FF',
    secondary: '#212547',
    text: '#11181C',
    buttonText: '#FFFFFF',
    background: '#FFFFFF',
    backgroundGradientStart: '#1180FF',
    backgroundGradientEnd: '#212547',
    tint: tintColorLight,
    gray: '#484848',
    iconActive: '#1180FF',
    iconInactive: '#687076',
    icon: '#1180FF',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    gameBackground: '#FFFFFF',
  },
  dark: {
    correctKey: '#6AAA64',
    presentKey: '#C9B458',
    wrongKey: MD3Colors.error30,
    defaultKey: '#687076',
    primary: '#1180FF',
    secondary: '#212547',
    text: '#ECEDEE',
    buttonText: '#fff',
    background: '#212547',
    backgroundGradientStart: '#1180FF',
    backgroundGradientEnd: '#212547',
    tint: tintColorDark,
    gray: '#484848',
    iconActive: '#212547',
    iconInactive: '#9BA1A6',
    icon: '#ECEDEE',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    gameBackground: '#212547',
  },
}
