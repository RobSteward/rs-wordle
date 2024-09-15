import { View, Text } from 'react-native'
import { SignedIn, SignedOut, useAuth, useUser } from '@clerk/clerk-expo'
import { Link } from 'expo-router'
import ThemedButton from '@/components/ThemedButton'

const TabsScreen = () => {
  const { user } = useUser()
  const { signOut } = useAuth()

  return (
    <View>
      <SignedIn>
        <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
        <ThemedButton
          onPress={() => signOut()}
          title='Sign out'
          primary
        />
      </SignedIn>
      <SignedOut>
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text>Looks like you should not be here...</Text>
          <Link href='/(authentication)/'>
            <Text>Authenticate</Text>
          </Link>
        </View>
      </SignedOut>
    </View>
  )
}
export default TabsScreen
