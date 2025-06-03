import debounce from 'lodash.debounce';
import React, { useState, useCallback } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const debouncedSearch = useCallback(
    debounce((text) => {
      onSearch(text);
    }, 500),
    []
  );

  const handleChange = (text) => {
    setQuery(text);
    debouncedSearch(text);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search for movies..."
        value={query}
        onChangeText={handleChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});
