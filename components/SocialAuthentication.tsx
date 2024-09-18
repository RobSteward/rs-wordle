import { View, StyleSheet, useColorScheme } from 'react-native'
import { IconButton, Text } from 'react-native-paper'
import { Colors } from '@/constants/Colors'
import { useOAuth } from '@clerk/clerk-expo'
import { router } from 'expo-router'
import { Toast } from 'react-native-toast-notifications'

enum AuthenticationStrategy {
  Apple = 'oauth_apple',
  Google = 'oauth_google',
  Microsoft = 'oauth_microsoft',
}

const SocialAuthentication = () => {
  const colorScheme = useColorScheme()
  const { startOAuthFlow: appleAuthFlow } = useOAuth({
    strategy: AuthenticationStrategy.Apple,
  })
  const { startOAuthFlow: googleAuthFlow } = useOAuth({
    strategy: AuthenticationStrategy.Google,
  })
  const { startOAuthFlow: microsoftAuthFlow } = useOAuth({
    strategy: AuthenticationStrategy.Microsoft,
  })

  const onSelectAuth = async (strategy: AuthenticationStrategy) => {
    const selectedAuth = {
      [AuthenticationStrategy.Apple]: appleAuthFlow,
      [AuthenticationStrategy.Google]: googleAuthFlow,
      [AuthenticationStrategy.Microsoft]: microsoftAuthFlow,
    }[strategy]

    try {
      const { createdSessionId, setActive } = await selectedAuth()

      if (createdSessionId) {
        await setActive!({ session: createdSessionId })
        router.push('/')
      }
    } catch (error) {
      Toast.show('Something went wrong, please try again later.', {
        type: 'danger',
      })
    }
  }

  return (
    <>
      <View style={styles.seperatorView}>
        <View
          style={{
            borderBottomColor: Colors[colorScheme ?? 'light'].border,
            borderBottomWidth: StyleSheet.hairlineWidth,
            flex: 1,
          }}
        />
        <Text style={styles.text}> or use </Text>
        <View
          style={{
            borderBottomColor: Colors[colorScheme ?? 'light'].border,
            borderBottomWidth: StyleSheet.hairlineWidth,
            flex: 1,
          }}
        />
      </View>
      <View style={styles.socialButtonsContainer}>
        <IconButton
          icon='google'
          iconColor={Colors[colorScheme ?? 'light'].iconButtonIcon}
          size={20}
          style={{
            borderRadius: 10,
            marginBottom: 10,
            backgroundColor:
              Colors[colorScheme ?? 'light'].iconButtonBackground,
          }}
          onPress={() => {
            onSelectAuth(AuthenticationStrategy.Google)
          }}
        />
        <IconButton
          icon='microsoft'
          iconColor={Colors[colorScheme ?? 'light'].iconButtonIcon}
          size={20}
          style={{
            backgroundColor:
              Colors[colorScheme ?? 'light'].iconButtonBackground,
            borderRadius: 10,
            marginBottom: 10,
          }}
          onPress={() => {
            onSelectAuth(AuthenticationStrategy.Microsoft)
          }}
        />
        <IconButton
          icon='apple'
          iconColor={Colors[colorScheme ?? 'light'].iconButtonIcon}
          size={20}
          style={{
            backgroundColor:
              Colors[colorScheme ?? 'light'].iconButtonBackground,
            borderRadius: 10,
            marginBottom: 10,
          }}
          onPress={() => {
            onSelectAuth(AuthenticationStrategy.Apple)
          }}
        />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  text: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  },
  seperatorView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    gap: 10,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 50,
  },
})

export default SocialAuthentication
