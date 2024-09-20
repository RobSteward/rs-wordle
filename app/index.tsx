import { StyleSheet, Text, View, useColorScheme } from 'react-native'
import IconLight from '@/assets/images/wordle-icon-light.svg'
import IconDark from '@/assets/images/wordle-icon-dark.svg'
import { Button } from 'react-native-paper'
import { Link, useRouter } from 'expo-router'
import { useState, useRef, useEffect } from 'react'
import { format } from 'date-fns'
import { Colors } from '@/constants/Colors'
import ThemedText from '@/components/ThemedComponents/ThemedText'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import LearnMoreModal from '@/components/Modals/LearnMoreModal'
import ThemedButton from '@/components/ThemedComponents/ThemedButton'
import { SignedIn, SignedOut, useAuth } from '@clerk/clerk-expo'
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated'
const AnimatedButton = Animated.createAnimatedComponent(Button)

export default function Index() {
  const [isLoading, setIsLoading] = useState(false)
  const colorScheme = useColorScheme()
  const backgroundColor = Colors[colorScheme ?? 'light'].background
  const textColor = Colors[colorScheme ?? 'light'].text
  const buttonTextColor = Colors[colorScheme ?? 'light'].buttonText
  const learnMoreModalRef = useRef<BottomSheetModal>(null)
  const router = useRouter()
  const { signOut, isSignedIn } = useAuth()

  const handlePresentLearnMoreModal = () => {
    learnMoreModalRef.current?.present()
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <LearnMoreModal ref={learnMoreModalRef} />
      <Animated.View
        style={styles.header}
        entering={FadeInDown}
      >
        {colorScheme === 'dark' ? (
          <IconDark
            width={100}
            height={100}
          />
        ) : (
          <IconLight
            width={100}
            height={100}
          />
        )}
        <ThemedText style={[styles.title]}>The Selection Lab wordle</ThemedText>
        <ThemedText style={styles.text}>
          Wordle clone based on words from the {'\n'}randomword api
        </ThemedText>
      </Animated.View>

      <View style={styles.menu}>
        <Link
          href={'/(authenticated)/(tabs)'}
          asChild
        >
          <AnimatedButton
            mode='elevated'
            buttonColor={colorScheme === 'dark' ? '#1180ff' : '#212547'}
            textColor='white'
            style={{ marginBottom: 20 }}
            entering={FadeInDown.delay(250)}
          >
            Play
          </AnimatedButton>
        </Link>
        <SignedOut>
          <ThemedButton
            title='Sign in'
            onPress={() => {
              router.push('/(authentication)/')
            }}
          />
        </SignedOut>
        <SignedIn>
          <ThemedButton
            title='Sign out'
            onPress={() => {
              signOut()
            }}
          />
        </SignedIn>

        <ThemedButton
          title='Learn more'
          onPress={handlePresentLearnMoreModal}
        />
      </View>

      <View style={styles.footer}>
        <ThemedText style={[styles.footerDate, { marginBottom: 10 }]}>
          {format(new Date(), 'MMMM d, yyyy')}
        </ThemedText>
        <ThemedText>version 1.0</ThemedText>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 40,
  },
  header: {
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 40,
    fontFamily: 'FrankRuhlLibre_800ExtraBold',
    textAlign: 'center',
  },
  text: {
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'FrankRuhlLibre_500Medium',
  },
  menu: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerDate: {
    fontSize: 16,
  },
})
