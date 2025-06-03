import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import SearchScreen from "./screens/SearchScreen";
import FavoritesScreen from "./screens/FavoritesScreen";
import DetailsScreen from "./screens/DetailsScreen";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Platform } from "react-native";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color }) => {
          let iconName;

          if (route.name === "Home")
            iconName = focused ? "home" : "home-outline";
          else if (route.name === "Search")
            iconName = focused ? "search" : "search-outline";
          else if (route.name === "Favourites")
            iconName = focused ? "heart" : "heart-outline";

          return <Ionicons name={iconName} size={20} color={color} />;
        },
        tabBarActiveTintColor: "#222222",
        tabBarInactiveTintColor: "#999999",
        tabBarStyle: styles.tabBar,
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: styles.tabBarLabel,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Favourites" component={FavoritesScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={Tabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="MovieDetail" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "white",
    height: 60,
    paddingBottom: Platform.OS === "ios" ? 20 : 10,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 5,
  },
});
