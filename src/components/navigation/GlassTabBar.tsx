// src/components/navigation/GlassTabBar.tsx
// Custom floating glassmorphism bottom tab bar for @react-navigation/bottom-tabs.
// Renders as an absolutely-positioned pill that floats above screen content.
// Styling is pixel-faithful to the original HomeScreen glass tab bar.

import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Map route names → Ionicons icon names
type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface TabConfig {
    icon: IoniconsName;
    label: string;
    isCenter?: boolean;
}

const TAB_CONFIG: Record<string, TabConfig> = {
    HomeFeed:  { icon: 'home',                      label: 'Kezdőlap' },
    Search:    { icon: 'search',                     label: 'Keresés' },
    Match:     { icon: 'flash',                      label: 'Match', isCenter: true },
    Messages:  { icon: 'chatbubble-ellipses-outline', label: 'Üzenetek' },
    Profile:   { icon: 'person-outline',             label: 'Profil' },
};

const glassNavShadow = Platform.select({
    ios:     { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.5, shadowRadius: 24 },
    android: { elevation: 18 },
    default: {},
});

const activeBubbleShadow = Platform.select({
    ios:     { shadowColor: '#3b82f6', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.35, shadowRadius: 12 },
    android: { elevation: 6 },
    default: {},
});

const matchActiveShadow = Platform.select({
    ios:     { shadowColor: '#3b82f6', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.55, shadowRadius: 18 },
    android: { elevation: 10 },
    default: {},
});

const matchInactiveShadow = Platform.select({
    ios:     { shadowColor: '#3b82f6', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.2, shadowRadius: 10 },
    android: { elevation: 4 },
    default: {},
});

export function GlassTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const insets = useSafeAreaInsets();

    return (
        // Absolute overlay — floats above all screen content on every tab.
        // pointerEvents="box-none" lets touches pass through the transparent wrapper margin.
        <View
            pointerEvents="box-none"
            style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                alignItems: 'center',
                zIndex: 200,
                elevation: 200,
                paddingBottom: insets.bottom,
            }}
        >
            <View style={{ marginBottom: 20, width: '100%', paddingHorizontal: 16 }}>
                <View
                    className="flex-row items-center justify-between rounded-3xl border border-white/10 px-2 py-2.5"
                    style={{ backgroundColor: 'rgba(13,16,32,0.92)', ...glassNavShadow }}
                >
                    {state.routes.map((route, index) => {
                        const isFocused = state.index === index;
                        const config = TAB_CONFIG[route.name];
                        if (!config) return null;
                        
                        const { options } = descriptors[route.key];

                        const onPress = () => {
                            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                            if (!isFocused && !event.defaultPrevented) {
                                navigation.navigate(route.name);
                            }
                        };

                        const onLongPress = () => {
                            navigation.emit({ type: 'tabLongPress', target: route.key });
                        };

                        // ── Center "Match" pill ──────────────────────────────────────────
                        if (config.isCenter) {
                            return (
                                <Pressable
                                    key={route.key}
                                    accessibilityRole="button"
                                    accessibilityLabel={options.tabBarAccessibilityLabel ?? config.label}
                                    accessibilityState={isFocused ? { selected: true } : {}}
                                    onPress={onPress}
                                    onLongPress={onLongPress}
                                    className="flex-row items-center gap-1.5 rounded-full border px-4 py-2"
                                    style={{
                                        backgroundColor: isFocused ? 'rgba(59,130,246,0.22)' : 'rgba(59,130,246,0.1)',
                                        borderColor: isFocused ? 'rgba(59,130,246,0.55)' : 'rgba(59,130,246,0.22)',
                                        ...(isFocused ? matchActiveShadow : matchInactiveShadow),
                                    }}
                                >
                                    <Ionicons
                                        name={config.icon}
                                        size={14}
                                        color="#93c5fd"
                                        style={{ opacity: isFocused ? 1 : 0.85 }}
                                    />
                                    <Text
                                        className="text-xs font-bold uppercase tracking-widest"
                                        style={{ color: '#93c5fd' }}
                                    >
                                        {config.label}
                                    </Text>
                                </Pressable>
                            );
                        }

                        // ── Regular icon button ──────────────────────────────────────────
                        return (
                            <Pressable
                                key={route.key}
                                accessibilityRole="button"
                                accessibilityLabel={options.tabBarAccessibilityLabel ?? config.label}
                                accessibilityState={isFocused ? { selected: true } : {}}
                                hitSlop={8}
                                onPress={onPress}
                                onLongPress={onLongPress}
                                className="h-9 w-9 items-center justify-center rounded-full"
                                style={{
                                    backgroundColor: isFocused ? 'rgba(59,130,246,0.15)' : 'transparent',
                                    ...(isFocused ? activeBubbleShadow : {}),
                                }}
                            >
                                <Ionicons
                                    name={config.icon}
                                    size={22}
                                    color={isFocused ? '#60a5fa' : 'rgba(255,255,255,0.3)'}
                                />
                            </Pressable>
                        );
                    })}
                </View>
            </View>
        </View>
    );
}
