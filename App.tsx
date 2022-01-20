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
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
function DetailsScreen({ navigation, route }) {
  const {data} = route.params;
  console.log(data)
  console.log(route.params)

  return (
    <View style={styles.container}>
      <Image source={{uri: data.images.jpg.image_url}} style={styles.posterImage} />
      <Text>{data.title_english}</Text>
      <Text>{data.type}</Text>
      <Text>{data.synopsis}</Text>
    </View>
  )
}
function HomeScreen({ navigation }) {
  const [anime, setAnime] = useState(null)
  const [favorites, setFavorites] = useState([])
  //to move between pages, use navigation.navigate(name)

  function addToFavorites(index) {
    setFavorites(favorites.concat(anime[index]))
    try {
      AsyncStorage.setItem("favorites", JSON.stringify(favorites))
    }
    catch (e) {
      console.log(e)
    }
  }
  useEffect(() => {
    async function getData() {
      // this function is inside to avoid issues w/ react callbacks experienced earlier
      // put logic to get data from network here
      const data = await fetch('https://api.jikan.moe/v4/top/anime')
      const dataJSON = await data.json()

      setAnime(dataJSON.data)

      try {
        const favoritesAsync = await AsyncStorage.getItem("favorites")
        if (favoritesAsync !== null) {
          setFavorites(JSON.parse(favoritesAsync))
        }
      } catch (e) {
        console.error("There was an error setting favorites: ", e)
      }

    }
    getData()
  }, [])
  return (
    <View style={styles.container}>
      <Text style={styles.largeHeading}>Favorites</Text>
      <FlatList numColumns={4} data={favorites} renderItem={({ item, index }) => (
        <TouchableHighlight onPress={() => {
          navigation.navigate("Details", {data: item})
        }}>
          <Image source={{ uri: item.images.jpg.image_url }} style={styles.posterImage} />
        </TouchableHighlight>
      )} keyExtractor={(item) => (item.mal_id)} />


      <Text style={styles.largeHeading}>Top Anime</Text>
      <FlatList data={anime} renderItem={({ item, index }) => (
        <View style={styles.anime}>
          <Text style={styles.title}>{item.title}</Text>
          <Image source={{ uri: item.images.jpg.image_url }} style={styles.posterImage} />
          <TouchableOpacity onPress={() => {
            addToFavorites(index)
          }}>
            <Text>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            navigation.navigate("Details")
          }}>
            <Text>View Details</Text>
          </TouchableOpacity>
        </View>
      )} keyExtractor={(item) => (item.mal_id)} />
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
    minWidth: 100,
    minHeight: 300,
  },
  anime: {
    backgroundColor: 'white',
    borderRadius: 5,
    marginVertical: 15,
    padding: 25
  }
});
