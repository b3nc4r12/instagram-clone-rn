import React from "react"
import { View, Text } from "react-native"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import NewPostScreen from "./screens/NewPostScreen"
import LoginScreen from "./screens/LoginScreen"
import SignUpScreen from "./screens/SignUpScreen"
import MainScreen from "./screens/MainScreen"
import HomeScreen from "./screens/HomeScreen"
import PostScreen from "./screens/PostScreen"

const Stack = createNativeStackNavigator();

const screenOptions = {
    headerShown: false
}

export const SignedInStack = () => (
    <NavigationContainer>
        <Stack.Navigator initialRouteName="MainScreen" screenOptions={screenOptions}>
            <Stack.Screen name="MainScreen" component={MainScreen} />
            <Stack.Screen name="NewPostScreen" component={NewPostScreen} />
            <Stack.Screen name="PostScreen" component={PostScreen} />
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
        </Stack.Navigator>
    </NavigationContainer>
)

export const SignedOutStack = () => (
    <NavigationContainer>
        <Stack.Navigator initialRouteName="LoginScreen" screenOptions={screenOptions}>
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
        </Stack.Navigator>
    </NavigationContainer>
)