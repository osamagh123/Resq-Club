import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/Home';
import History from '../screens/History';


function HomeScreen() {
    return(
        <Home/>
    )
}

function HistoryScreen() {
    return(
        <History/>
    )
}

const Stack = createNativeStackNavigator();

export default function Main() {
  return (
    <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}} />
            <Stack.Screen name="History" component={HistoryScreen} options={{headerShown: false}} />
        </Stack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({})