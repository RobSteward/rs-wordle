/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { MD3Colors } from 'react-native-paper'

const tintColorLight = '#0a7ea4'
const tintColorDark = '#ECEDEE'

export const Colors = {
  light: {
    correct: '#6AAC64',
    present: '#FFD700',
    wrong: MD3Colors.error50,
    default: '#D3D3D3',
    primary: '#1180FF',
    secondary: '#212547',
    text: '#212547',
    buttonPrimaryColor: '#1180FF',
    buttonText: '#212547',
    background: '#ECEDEE',
    border: '#1180FF',
    backgroundGradientStart: '#1180FF',
    backgroundGradientEnd: '#212547',
    tint: tintColorLight,
    gray: '#484848',
    iconActive: '#1180FF',
    iconInactive: '#687076',
    icon: '#1180FF',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    gameBackground: '#ECEDEE',
  },
  dark: {
    correct: '#6AAA64',
    present: '#C9B458',
    wrong: MD3Colors.error30,
    default: '#687076',
    primary: '#1180FF',
    secondary: '#212547',
    text: '#ECEDEE',
    buttonPrimaryColor: '#212547',
    buttonText: '#ECEDEE',
    background: '#212547',
    border: '#ECEDEE',
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
