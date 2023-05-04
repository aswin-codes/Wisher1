/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { View, Text, useColorScheme } from 'react-native'
import React from 'react'
import HomeScreen from './components/HomeScreen'
import { NativeBaseProvider } from 'native-base'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Info from './components/Info'


const Stack = createNativeStackNavigator();

const App = () => {

  const isDarkMode = useColorScheme() === 'dark';

  return (
    <NavigationContainer>
      <NativeBaseProvider>
        <Stack.Navigator>
        <Stack.Screen name="Wisher"
          options={ isDarkMode ? {
            title: "Wisher",
            headerStyle: {
              backgroundColor: '#010001' 
            },
            headerTitleStyle: {
              fontFamily: 'Qartella-Bold',
              fontSize: 45,
              color: '#FFFFFF'
            },       
            } :
            {
              title: "Wisher",
              headerStyle: {
                backgroundColor:  '#EEEEEE',
              },
              headerTitleStyle: {
                fontFamily: 'Qartella-Bold',
                fontSize: 45,
                color:'#010001'
              },       
              }}
        component={HomeScreen}/>
        <Stack.Screen name="Info" component={Info}
        options={ isDarkMode ? {
          title: "Info",
          headerStyle: {
            backgroundColor: '#010001' 
          },
          headerTitleStyle: {
            fontFamily: 'Qartella-Bold',
            fontSize: 30,
            color: '#FFFFFF'
          },       
          } :
          {
            title: "Wisher",
            headerStyle: {
              backgroundColor:  '#EEEEEE',
            },
            headerTitleStyle: {
              fontFamily: 'Qartella-Bold',
              fontSize: 45,
              color:'#010001'
            },       
            }}/>
        </Stack.Navigator>
      </NativeBaseProvider>
    </NavigationContainer>
  )
}

export default App