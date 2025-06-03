import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { debounce } from "lodash";
import MovieCard from "../components/MovieCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const API_KEY = process.env.EXPO_PUBLIC_OMDB_API_KEY;

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [favorites, setFavorites] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    loadFavorites();
  }, []);

  useEffect(() => {
    if (query.length >= 2) {
      debouncedSearch(query, 1);
    } else {
      setMovies([]);
      setPage(1);
      setHasMore(false);
    }
  }, [query]);

  const debouncedSearch = debounce(async (searchTerm, pageNum) => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=${searchTerm}&page=${pageNum}`
      );
      const data = await res.json();
      if (data.Response === "True") {
        if (pageNum === 1) {
          setMovies(data.Search);
        } else {
          setMovies((prev) => [...prev, ...data.Search]);
        }
        setHasMore(data.Search.length >= 10);
      } else {
        setMovies([]);
        setHasMore(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, 600);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    debouncedSearch(query, nextPage);
  };

  const loadFavorites = async () => {
    const favs = await AsyncStorage.getItem("favorites");
    const parsed = favs ? JSON.parse(favs) : [];
    setFavorites(parsed);
  };

  const toggleFavorite = async (movie) => {
    const isFav = favorites.find((fav) => fav.imdbID === movie.imdbID);
    let updatedFavorites;
    if (isFav) {
      updatedFavorites = favorites.filter((fav) => fav.imdbID !== movie.imdbID);
    } else {
      updatedFavorites = [...favorites, movie];
    }
    setFavorites(updatedFavorites);
    await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const isFavorited = (movie) =>
    favorites.some((fav) => fav.imdbID === movie.imdbID);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search movies by title..."
        value={query}
        onChangeText={setQuery}
      />

      {!query.trim() && (
        <Text style={styles.infoText}>
          Input some characters of a movie title to get results.
        </Text>
      )}

      {isLoading && (
        <ActivityIndicator
          size="large"
          color="#6200ee"
          style={{ marginTop: 10 }}
        />
      )}

      <FlatList
        data={movies}
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
        ListEmptyComponent={
          query.length > 2 && !isLoading ? (
            <Text style={styles.infoText}>No movies found.</Text>
          ) : null
        }
      />

      {hasMore && !isLoading && (
        <TouchableOpacity style={styles.loadMoreBtn} onPress={loadMore}>
          <Text style={styles.loadMoreText}>Load More</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 10,
  },
  infoText: {
    textAlign: "center",
    color: "#555",
    marginTop: 20,
  },
  list: {
    paddingBottom: 80,
  },
  loadMoreBtn: {
    backgroundColor: "#6200ee",
    padding: 10,
    marginVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  loadMoreText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
