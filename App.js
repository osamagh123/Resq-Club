import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Main from './assets/stack/Main'
import { NativeBaseProvider } from 'native-base'

export default function App() {
  return (
    <NativeBaseProvider>
      <Main/>
    </NativeBaseProvider>
  )
}

const styles = StyleSheet.create({})