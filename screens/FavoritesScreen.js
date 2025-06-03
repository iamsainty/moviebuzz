import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MovieCard from "../components/MovieCard";
import { useNavigation } from "@react-navigation/native";

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const getFavorites = async () => {
      const favs = await AsyncStorage.getItem("favorites");
      const parsed = favs ? JSON.parse(favs) : [];
      setFavorites(parsed);
    };

    const unsubscribe = navigation.addListener("focus", getFavorites);
    return unsubscribe;
  }, [navigation]);

  if (!favorites.length) {
    return (
      <View style={styles.center}>
        <Text style={styles.empty}>
          ❤️ You’ll see your favorite movies here.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={favorites}
      keyExtractor={(item) => item.imdbID}
      renderItem={({ item }) => (
        <MovieCard
          title={item.Title}
          poster={item.Poster}
          year={item.Year}
          onPress={() =>
            navigation.navigate("MovieDetail", { imdbID: item.imdbID })
          }
        />
      )}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  empty: {
    fontSize: 16,
    color: "#777",
  },
  list: {
    padding: 10,
    backgroundColor: "#fff",
  },
});
