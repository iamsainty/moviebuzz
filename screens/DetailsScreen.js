import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { fetchMovieDetails } from "../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";

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
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#666" />
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>⚠️ Movie not found</Text>
      </View>
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

      <View style={styles.details}>
        <Text style={styles.title}>{movie.Title}</Text>
        <Text style={styles.subtitle}>Directed by {movie.Director}</Text>

        <View style={styles.infoGroup}>
          <Text style={styles.infoItem}>Genre: {movie.Genre}</Text>
          <Text style={styles.infoItem}>Year: {movie.Year}</Text>
          <Text style={styles.infoItem}>IMDb: {movie.imdbRating}</Text>
        </View>

        <Text style={styles.plot}>{movie.Plot}</Text>

        <TouchableOpacity
          style={[
            styles.favoriteButton,
            isFavorite ? styles.favActive : styles.favInactive,
          ]}
          onPress={toggleFavorite}
        >
          <FontAwesome
            name={isFavorite ? "heart" : "heart-o"}
            size={20}
            color="#fff"
          />
          <Text style={styles.favText}>
            {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  error: {
    fontSize: 18,
    color: "#444",
    textAlign: "center",
  },
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  poster: {
    width: "100%",
    height: 450,
    borderRadius: 12,
    marginBottom: 20,
  },
  details: {
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#222",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 12,
  },
  infoGroup: {
    marginBottom: 16,
    gap: 6,
  },
  infoItem: {
    fontSize: 14,
    color: "#444",
    flexDirection: "row",
    alignItems: "center",
  },
  plot: {
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
    marginBottom: 20,
  },
  favoriteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    gap: 10,
  },
  favText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  favActive: {
    backgroundColor: "#c0392b",
  },
  favInactive: {
    backgroundColor: "#2980b9",
  },
});
