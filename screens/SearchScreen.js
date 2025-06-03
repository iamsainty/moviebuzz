import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Platform,
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
    <View style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Platform.OS === "android" ? "#f9f9f9" : undefined}
      />
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Search movies by title..."
          placeholderTextColor="#999"
          value={query}
          onChangeText={setQuery}
        />

        {!query.trim() && (
          <Text style={styles.infoText}>
            Start typing to explore movies by their title.
          </Text>
        )}

        {isLoading && (
          <ActivityIndicator
            size="large"
            color="#000"
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
              isFavorite={isFavorited(item)}
              onFavoriteToggle={() => toggleFavorite(item)}
              onPress={() =>
                navigation.navigate("MovieDetail", { imdbID: item.imdbID })
              }
            />
          )}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            query.length >= 2 && !isLoading ? (
              <Text style={styles.infoText}>
                No results found for "{query}"
              </Text>
            ) : null
          }
        />

        {hasMore && !isLoading && (
          <TouchableOpacity style={styles.loadMoreBtn} onPress={loadMore}>
            <Text style={styles.loadMoreText}>Load More</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
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
    padding: 16,
  },
  input: {
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    elevation: 1,
  },
  infoText: {
    textAlign: "center",
    fontSize: 14,
    marginTop: 20,
  },
  list: {
    paddingBottom: 100,
    marginTop: 10,
  },
  loadMoreBtn: {
    backgroundColor: "#000",
    paddingVertical: 10,
    marginVertical: 16,
    marginHorizontal: 40,
    borderRadius: 10,
    alignItems: "center",
    elevation: 2,
  },
  loadMoreText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});
