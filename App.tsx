import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableHighlight, View } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage'

// used for navigation
const Stack = createNativeStackNavigator()

export default function App() {
  //pages can be added inside the Stack.Navigator w/ a similar format
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function HomeScreen({ navigation }) {
  //to move between pages, use navigation.navigate(name)
  useEffect(() => {
    async function getData() {
      // this function is inside to avoid issues w/ react callbacks experienced earlier
      // put logic to get data from network here
    }
    getData()
  }, [])
  return (
    <View>
      <Text>Top Anime</Text>
    </View>
  )
}

const styles = StyleSheet.create({

});
