import { StatusBar } from 'react-native'
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

  return (
    <>
      <StatusBar barStyle='light-content' />
      <Tabs
        screenOptions={{
          tabBarStyle: {
            borderTopWidth: 0,
            height: 60,
            paddingBottom: 5,
          },
          tabBarActiveTintColor: Colors.light.tint,
          tabBarInactiveTintColor: Colors.light.gray,
          tabBarLabelStyle: {
            fontSize: 12,
            marginBottom: 5,
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
            tabBarIcon: ({ focused, color, size }) => (
              <MaterialCommunityIcons
                name='dice-3'
                size={size}
                color={color}
              />
            ),
            tabBarLabel: 'Play',
            title: 'Play',
          }}
        />
      </Tabs>
    </>
  )
}

export default TabsLayout
