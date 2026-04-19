import './global.css';
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/context/AuthContext';

import LoginScreen from './src/screens/LoginScreen';
import MainTabNavigator from './src/navigation/MainTabNavigator';
import EventDetailsScreen from './src/screens/EventDetailsScreen';

import ChatDetailScreen from './src/screens/ChatDetailScreen';

const Stack = createNativeStackNavigator();

function AppNavigation() {
    const { userToken, isGuest, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View className="flex-1 bg-neutral-950 items-center justify-center">
                <ActivityIndicator size="large" color="#3b82f6" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {userToken || isGuest ? (
                    <>
                        <Stack.Screen name="Home" component={MainTabNavigator} />
                        <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
                        <Stack.Screen name="ChatDetail" component={ChatDetailScreen} />
                    </>
                ) : (
                    <Stack.Screen name="Login" component={LoginScreen} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppNavigation />
      </AuthProvider>
    </SafeAreaProvider>
  );
}