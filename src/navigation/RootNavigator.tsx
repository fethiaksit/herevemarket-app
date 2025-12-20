import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomePage from "../screen/HomePage";
import CategoryProductsScreen from "../screen/CategoryProductsScreen";
import { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomePage} />
        <Stack.Screen
          name="CategoryProducts"
          component={CategoryProductsScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
