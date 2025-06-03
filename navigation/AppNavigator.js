import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "../screens/HomeScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DetailsScreen from "../screens/DetailsScreen";
const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="MovieBuzz" component={HomeScreen} />
        <Stack.Screen name="MovieDetail" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
