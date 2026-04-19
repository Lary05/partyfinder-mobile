// src/navigation/MainTabNavigator.tsx
// Root tab navigator for the main authenticated app shell.
// Uses the GlassTabBar custom component so the floating pill UI is preserved.
// headerShown: false on every screen — screens handle their own safe-area top insets.

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlassTabBar } from '../components/navigation/GlassTabBar';
import MessagesScreen from '../screens/MessagesScreen';
import NewMatchesScreen from '../screens/NewMatchesScreen';
import FelfedezesSimulator from '../screens/FelfedezesSimulator';
import HomeFeedScreen from '../screens/HomeFeedScreen';
import ProfileDashboardScreen from '../screens/ProfileDashboardScreen';
import SearchScreen from '../screens/SearchScreen';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
    const insets = useSafeAreaInsets();
    // This value is forwarded to screens that render swipe cards or unbounded scroll content
    // so they can apply bottom padding equal to the floating tab bar height.
    const tabBarReserve = 76 + insets.bottom;

    return (
        <Tab.Navigator
            tabBar={(props) => <GlassTabBar {...props} />}
            screenOptions={{
                headerShown: false,
                // Disable the native tab bar background — our custom bar handles everything.
                tabBarStyle: { display: 'none' },
            }}
        >
            <Tab.Screen name="HomeFeed" component={HomeFeedScreen} />
            <Tab.Screen name="Search" component={SearchScreen} />
            {/*
             * FelfedezesSimulator receives bottomInset so its swipe cards sit above
             * the floating tab bar, exactly as it did when embedded in the old HomeScreen.
             * React Navigation doesn't pass custom props to screens directly, so we use
             * an initialParams wrapper.
             */}
            <Tab.Screen
                name="Match"
                options={{ unmountOnBlur: false }}
            >
                {() => <FelfedezesSimulator bottomInset={tabBarReserve} />}
            </Tab.Screen>
            <Tab.Screen name="Messages" component={MessagesScreen} />
            {/* NewMatches is registered but hidden from the bottom bar by GlassTabBar */}
            <Tab.Screen name="NewMatches" component={NewMatchesScreen} />
            <Tab.Screen name="Profile" component={ProfileDashboardScreen} />
        </Tab.Navigator>
    );
}
