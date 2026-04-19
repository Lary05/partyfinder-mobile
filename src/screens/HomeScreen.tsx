// src/screens/HomeScreen.tsx
// ⚠️  DEPRECATED — This file has been superseded by the tab navigator architecture.
//
// The original monolithic HomeScreen has been broken up as follows:
//   Event feed   → HomeFeedScreen.tsx
//   Search       → SearchScreen.tsx
//   Profile      → ProfileScreen.tsx
//   Chat         → ChatScreen.tsx  (was already separate)
//   Match/Swipe  → FelfedezesSimulator.tsx  (was already separate)
//   Tab bar UI   → src/components/navigation/GlassTabBar.tsx
//   Navigator    → src/navigation/MainTabNavigator.tsx
//
// App.tsx now routes "Home" → MainTabNavigator. This file can be safely deleted.

export {};
