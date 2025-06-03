import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Button,
  ActivityIndicator,
} from "react-native";
import { fetchMovieDetails } from "../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function DetailsScreen({ route }) {
  const { imdbID } = route.params;
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const getDetails = async () => {
      const data = await fetchMovieDetails(imdbID);
      setMovie(data);
      setLoading(false);

      const favs = await AsyncStorage.getItem("favorites");
      const parsed = favs ? JSON.parse(favs) : [];
      const alreadyFav = parsed.some((m) => m.imdbID === imdbID);
      setIsFavorite(alreadyFav);
    };

    getDetails();
  }, []);

  const toggleFavorite = async () => {
    const favs = await AsyncStorage.getItem("favorites");
    const parsed = favs ? JSON.parse(favs) : [];

    let updated;
    if (isFavorite) {
      updated = parsed.filter((m) => m.imdbID !== imdbID);
    } else {
      updated = [...parsed, movie];
    }

    await AsyncStorage.setItem("favorites", JSON.stringify(updated));
    setIsFavorite(!isFavorite);
  };

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#666" style={{ marginTop: 40 }} />
    );
  }

  if (!movie) {
    return (
      <Text style={{ textAlign: "center", marginTop: 40 }}>
        Movie not found
      </Text>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{
          uri:
            movie.Poster !== "N/A"
              ? movie.Poster
              : "https://via.placeholder.com/300",
        }}
        style={styles.poster}
      />
      <Text style={styles.title}>{movie.Title}</Text>
      <Text style={styles.info}>🎬 Genre: {movie.Genre}</Text>
      <Text style={styles.info}>📅 Year: {movie.Year}</Text>
      <Text style={styles.info}>⭐ Rating: {movie.imdbRating}</Text>
      <Text style={styles.plot}>{movie.Plot}</Text>
      <View style={styles.button}>
        <Button
          title={
            isFavorite ? "Remove from Favorites ❤️" : "Add to Favorites 🤍"
          }
          onPress={toggleFavorite}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fefefe",
  },
  poster: {
    width: 300,
    height: 450,
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 6,
    textAlign: "center",
  },
  info: {
    fontSize: 16,
    marginBottom: 4,
  },
  plot: {
    marginVertical: 10,
    paddingHorizontal: 12,
    fontSize: 15,
    textAlign: "center",
    color: "#444",
  },
  button: {
    marginTop: 16,
    width: "80%",
  },
});
