import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Platform.OS === "android" ? "#f9f9f9" : undefined}
      />
      <View style={styles.container}>
        <Text style={styles.title}>Your Favorites</Text>

        {!favorites.length ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.heartIcon}>❤️</Text>
            <Text style={styles.emptyText}>
              You haven't added any favorites yet.
            </Text>
            <Text style={styles.subText}>
              Browse movies and tap the heart to save them here.
            </Text>
          </View>
        ) : (
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
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingTop: Platform.OS === "android" ? 30 : 0,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 15,
    color: "#333",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  heartIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#555",
    textAlign: "center",
  },
  subText: {
    fontSize: 14,
    color: "#777",
    marginTop: 6,
    textAlign: "center",
  },
  list: {
    paddingBottom: 20,
  },
});
