// src/screens/FelfedezesSimulator.tsx
// Layout composer and state manager for the Barátkereső (Party Buddy) discovery screen.
// Per project rules (Section 4-A), this file is responsible ONLY for state and layout composition.
// All sub-components live in src/components/match/ and src/components/ui/.

import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProfileCard } from '../components/match/ProfileCard';
import { PageHeader } from '../components/ui/PageHeader';
import { Profile, profilesSeed } from '../data/dummyProfiles';

type FelfedezesSimulatorProps = {
    /** Extra bottom padding when embedded in HomeScreen so content stays above the floating tab bar */
    bottomInset?: number;
};

export default function FelfedezesSimulator({ bottomInset = 0 }: FelfedezesSimulatorProps) {
    // Per project rules (Section 5 – Match Screen Flow), the swipe view is the DEFAULT.
    // The pre-filtering search form ("Kivel bulizol ma?") is bypassed on mount.
    const [cards, setCards] = useState<Profile[]>(profilesSeed);
    const [removed, setRemoved] = useState<Profile[]>([]);
    const [swipeAction, setSwipeAction] = useState<'like' | 'pass' | null>(null);

    const flashOpacity = useSharedValue(0);
    const flashStyle = useAnimatedStyle(() => ({ opacity: flashOpacity.value }));

    const handleSwipe = useCallback(
        (direction: 'left' | 'right') => {
            setCards((prev) => {
                if (prev.length === 0) return prev;
                const [top, ...rest] = prev;
                setRemoved((r) => [top, ...r]);
                return rest;
            });
            const action = direction === 'right' ? 'like' : 'pass';
            setSwipeAction(action);
            flashOpacity.value = 0.32;
            flashOpacity.value = withTiming(0, { duration: 600 });
            setTimeout(() => setSwipeAction(null), 700);
        },
        [flashOpacity]
    );

    const handleReset = () => {
        setCards([...removed].reverse());
        setRemoved([]);
    };

    return (
        <SafeAreaView
            className="flex-1 bg-neutral-950"
            edges={['top']}
            style={{ paddingBottom: bottomInset }}
        >
            <View className="relative flex-1">
                <PageHeader searchPlaceholder="Enter what you are looking for..." />

                {/* Card deck area */}
                <View className="relative mx-4 flex-1 min-h-0">
                    {cards.length === 0 ? (
                        // Empty state – all profiles have been swiped
                        <View className="h-full w-full flex-col items-center justify-center gap-4">
                            <View
                                className="mb-2 h-20 w-20 items-center justify-center rounded-full border"
                                style={{
                                    backgroundColor: 'rgba(255,255,255,0.04)',
                                    borderColor: 'rgba(255,255,255,0.08)',
                                }}
                            >
                                <Text className="text-4xl">🎉</Text>
                            </View>
                            <Text className="text-xl font-bold text-white">You're all caught up!</Text>
                            <Text className="px-8 text-center text-sm text-gray-500">
                                No more profiles nearby. Check back later!
                            </Text>
                            {removed.length > 0 && (
                                <Pressable
                                    onPress={handleReset}
                                    className="mt-2 rounded-full border px-6 py-2.5"
                                    style={{
                                        backgroundColor: 'rgba(59,130,246,0.15)',
                                        borderColor: 'rgba(59,130,246,0.4)',
                                        shadowColor: '#3b82f6',
                                        shadowOpacity: 0.2,
                                        shadowRadius: 20,
                                    }}
                                >
                                    <Text className="text-sm font-semibold text-white">See them again</Text>
                                </Pressable>
                            )}
                        </View>
                    ) : (
                        // Stacked swipe deck – back cards rendered below the top card
                        <View className="relative h-full w-full">
                            {cards.slice(1, 3).map((profile, idx) => (
                                <View
                                    key={profile.id}
                                    className="absolute inset-0"
                                    style={{
                                        zIndex: cards.length - (idx + 1),
                                        transform: [
                                            { scale: 1 - (idx + 1) * 0.045 },
                                            { translateY: (idx + 1) * 16 },
                                        ],
                                    }}
                                >
                                    <ProfileCard profile={profile} onSwipe={handleSwipe} isTop={false} />
                                </View>
                            ))}
                            <View className="absolute inset-0" style={{ zIndex: cards.length }}>
                                <ProfileCard profile={cards[0]} onSwipe={handleSwipe} isTop={true} />
                            </View>
                        </View>
                    )}
                </View>

                {/* Action buttons – only shown while cards remain */}
                {cards.length > 0 && (
                    <View className="flex-shrink-0 flex-row items-center justify-center gap-8 py-4">
                        {/* Pass button */}
                        <Pressable
                            onPress={() => handleSwipe('left')}
                            className="h-16 w-16 items-center justify-center rounded-full border"
                            style={{
                                backgroundColor: 'rgba(239,68,68,0.1)',
                                borderColor: 'rgba(239,68,68,0.3)',
                                ...Platform.select({
                                    ios: {
                                        shadowColor: '#ef4444',
                                        shadowOffset: { width: 0, height: 0 },
                                        shadowOpacity: 0.45,
                                        shadowRadius: 22,
                                    },
                                    android: { elevation: 10 },
                                }),
                            }}
                        >
                            <Ionicons name="close" size={28} color="#f87171" />
                        </Pressable>

                        {/* Like / Going button */}
                        <Pressable
                            onPress={() => handleSwipe('right')}
                            className="h-16 w-16 items-center justify-center rounded-full border"
                            style={{
                                backgroundColor: 'rgba(34,197,94,0.1)',
                                borderColor: 'rgba(34,197,94,0.3)',
                                ...Platform.select({
                                    ios: {
                                        shadowColor: '#22c55e',
                                        shadowOffset: { width: 0, height: 0 },
                                        shadowOpacity: 0.5,
                                        shadowRadius: 22,
                                    },
                                    android: { elevation: 10 },
                                }),
                            }}
                        >
                            <Ionicons name="heart" size={28} color="#4ade80" />
                        </Pressable>
                    </View>
                )}

                {/* Full-screen flash overlay on swipe (like = green, pass = red) */}
                {swipeAction && (
                    <Animated.View
                        pointerEvents="none"
                        className="absolute inset-0"
                        style={[
                            flashStyle,
                            {
                                backgroundColor:
                                    swipeAction === 'like'
                                        ? 'rgba(34,197,94,0.22)'
                                        : 'rgba(239,68,68,0.22)',
                            },
                        ]}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}
