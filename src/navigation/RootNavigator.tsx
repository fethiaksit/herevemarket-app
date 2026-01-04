import React from "react";
import { ActivityIndicator, SafeAreaView, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomePage from "../screens/HomePage";
import AuthLandingScreen from "../screen/AuthLandingScreen";
import LoginScreen from "../screen/LoginScreen";
import RegisterScreen from "../screen/RegisterScreen";
import AddressListScreen from "../screen/AddressListScreen";
import { AuthStackParamList, MainStackParamList } from "./types";
import { useAuth } from "../context/AuthContext";

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainStack = createNativeStackNavigator<MainStackParamList>();

function AuthStackNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="AuthLanding" component={AuthLandingScreen} />
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

function MainStackNavigator() {
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      <MainStack.Screen name="Home" component={HomePage} />
      <MainStack.Screen name="AddressList" component={AddressListScreen} />
    </MainStack.Navigator>
  );
}

export default function RootNavigator() {
  const { token, isGuest, loading } = useAuth();

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#004AAD" />
      </SafeAreaView>
    );
  }

  return (
    <NavigationContainer>
      {token || isGuest ? <MainStackNavigator /> : <AuthStackNavigator />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
