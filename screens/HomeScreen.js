import React from "react";
import { View, Text, StyleSheet, SafeAreaView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.greeting}>Welcome to</Text>
          <Text style={styles.heading}>MovieBuzz</Text>
          <Text style={styles.description}>
            Explore the world of cinema with{" "}
            <Text style={styles.accent}>MovieBuzz</Text> — your go-to app for
            discovering movies. Search, discover, and save your favorite films
            in one place.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Designed and developed with <Ionicons name="heart" size={14} /> by
            Priyanshu Chaurasiya
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: Platform.OS === "android" ? 30 : 0,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 36,
  },
  content: {
    marginTop: 100,
  },
  greeting: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 12,
  },
  heading: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: "#555",
  },
  accent: {
    fontWeight: "bold",
  },
  footer: {
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: "#888",
  },
});
