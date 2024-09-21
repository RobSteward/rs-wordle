/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { MD3Colors } from 'react-native-paper'

export const Colors = {
  light: {
    correct: '#6AAC64',
    present: '#FFD700',
    notPresent: '#687076',
    default: '#F7F7F7',
    primary: '#1180FF',
    secondary: '#212547',
    text: '#212547',
    buttonPrimaryColor: '#1180FF',
    buttonText: '#212547',
    background: '#F7F7F7',
    border: '#1180FF',
    backgroundGradientStart: '#F7F7F7',
    backgroundGradientEnd: '#1180FF',
    gray: '#A0A5A9',
    iconActive: '#1180FF',
    iconInactive: '#687076',
    icon: '#212547',
    iconButtonIcon: '#1180FF',
    iconButtonBackground: '#F7F7F7',
    tabIconDefault: '#687076',
    gameBackground: '#F7F7F7',
    accent: '##f9c632',
    headerBackground: '#F7F7F7',
  },
  dark: {
    correct: '#6AAA64',
    present: '#C9B458',
    notPresent: MD3Colors.error30,
    default: '#687076',
    primary: '#1180FF',
    secondary: '#212547',
    text: '#F7F7F7',
    buttonPrimaryColor: '#212547',
    buttonText: '#F7F7F7',
    background: '#212547',
    border: '#F7F7F7',
    backgroundGradientStart: '#212547',
    backgroundGradientEnd: '#1180FF',
    gray: '#484848',
    iconActive: '#212547',
    iconInactive: '#9BA1A6',
    icon: '#F7F7F7',
    iconButtonIcon: '#F7F7F7',
    iconButtonBackground: '#212547',
    tabIconDefault: '#9BA1A6',
    gameBackground: '#212547',
    accent: '##f9c632',
    headerBackground: '#212547',
  },
}
