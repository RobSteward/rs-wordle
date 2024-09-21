import { StatusBar, useColorScheme } from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import { Redirect, Tabs } from 'expo-router'
import React from 'react'
import { Colors } from '@/constants/Colors'
import { useEffect } from 'react'
import { useRouter } from 'expo-router'

const TabsLayout = () => {
  const router = useRouter()
  const colorScheme = useColorScheme()

  return (
    <>
      <StatusBar barStyle='light-content' />
      <Tabs
        screenOptions={{
          tabBarStyle: {
            borderTopWidth: 2,
            height: 75,
            paddingBottom: 5,
            backgroundColor: Colors[colorScheme ?? 'light'].background,
            shadowOffset: {
              width: 0,
              height: 12,
            },
            shadowOpacity: 0.58,
            shadowRadius: 16.0,
            elevation: 24,
          },
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].text,
          tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].iconInactive,
          tabBarLabelStyle: {
            fontSize: 12,
            marginBottom: 10,
          },
          tabBarIconStyle: {
            marginTop: 5,
          },
          headerShown: false,
        }}
        initialRouteName='index'
      >
        <Tabs.Screen
          name='index'
          options={{
            tabBarIcon: ({ focused, size }) => {
              return (
                <MaterialCommunityIcons
                  name={focused ? 'dice-3' : 'dice-3-outline'}
                  size={size}
                  color={Colors[colorScheme ?? 'light'].buttonText}
                />
              )
            },
            tabBarLabel: 'Wordle',
            title: 'Wordle',
          }}
        />
      </Tabs>
    </>
  )
}

export default TabsLayout
