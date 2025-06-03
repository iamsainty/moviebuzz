import { StyleSheet, Text, View } from "react-native";

export default function MovieDetail() {
  return (
    <View style={styles.container}>
      <Text>Movie Detail</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
