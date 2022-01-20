import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';

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
  const [anime, setAnime] = useState(null)
  const [favorites, setFavorites] = useState([])
  //to move between pages, use navigation.navigate(name)

  function addToFavorites(index) {
    console.log(index)
    let favs = favorites
    favs.push(anime[index])
    console.log(favs)
    setFavorites(favs)
  }
  useEffect(() => {
    async function getData() {
      // this function is inside to avoid issues w/ react callbacks experienced earlier
      // put logic to get data from network here
      const data = await fetch('https://api.jikan.moe/v4/top/anime')
      const dataJSON = await data.json()

      setAnime(dataJSON.data)
    }
    getData()
  }, [])
  return (
    <View style={styles.container}>
      <Text style={styles.largeHeading}>Favorites</Text>
      <FlatList data={favorites} renderItem={({item, index}) => (
        <Text>{index}</Text>
      )} keyExtractor={(item, index) => index}/>
      <Text style={styles.largeHeading}>Top Anime</Text>
      <FlatList data={anime} renderItem={({item, index}) => (
        <View style={styles.anime}>
        <Text style={styles.title}>{item.title}</Text>
        <Image source={{uri: item.images.jpg.image_url}} style={styles.posterImage} />
        <TouchableOpacity onPress={() => {
          addToFavorites(index)
        }}><Text>Add</Text></TouchableOpacity>
        </View>
      )} keyExtractor={(item) => {item.mal_id}}/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  largeHeading: {
    fontSize: 32,
    fontWeight: 'bold'
  },
  title: {
    color: 'blue'
  },
  posterImage: {
    width: 200,
    height: 300
  },
  anime: {
    backgroundColor: 'white',
    borderRadius: 5,
    marginVertical: 15,
    padding: 25
  }
});
