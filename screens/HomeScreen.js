import React, { useState } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  StyleSheet,
} from "react-native";
import SearchBar from "../components/SearchBar";
import MovieCard from "../components/MovieCard";
import { fetchMoviesByTitle } from "../utils/api";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const navigation = useNavigation();

  const handleSearch = async (term) => {
    if (!term) return;
    setSearchTerm(term);
    setLoading(true);
    setPage(1);
    const results = await fetchMoviesByTitle(term, 1);
    setMovies(results);
    setLoading(false);
  };

  const loadMore = async () => {
    const nextPage = page + 1;
    const more = await fetchMoviesByTitle(searchTerm, nextPage);
    setMovies((prev) => [...prev, ...more]);
    setPage(nextPage);
  };

  return (
    <View style={styles.container}>
      <SearchBar onSearch={handleSearch} />
      {loading ? (
        <ActivityIndicator size="large" color="#666" />
      ) : movies.length === 0 ? (
        <Text style={styles.noResult}>No movies found</Text>
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.imdbID}
          renderItem={({ item }) => (
            <MovieCard
              title={item.Title}
              poster={item.Poster}
              year={item.Year}
              onPress={() =>
                navigation.navigate("Details", { imdbID: item.imdbID })
              }
            />
          )}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fefefe" },
  noResult: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 16,
    color: "#999",
  },
});
