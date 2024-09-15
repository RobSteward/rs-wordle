/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    buttonText: '#fff',
    background: '#fff',
    backgroundGradientStart: '#1180FF',
    backgroundGradientEnd: '#212547',
    tint: tintColorLight,
    gray: '#484848',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    buttonText: '#fff',
    background: '#212547',
    backgroundGradientStart: '#1180FF',
    backgroundGradientEnd: '#212547',
    tint: tintColorDark,
    gray: '#484848',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
}
