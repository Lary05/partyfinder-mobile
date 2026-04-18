// src/components/match/ProfileCard.tsx
// Tinder-style draggable profile card with PanResponder and Reanimated animations.
// Belongs to the match/ domain as it encapsulates the full swipe gesture logic.

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useMemo } from 'react';
import { PanResponder, Text, View } from 'react-native';
import Animated, {
    Extrapolation,
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { Profile } from '../../data/dummyProfiles';
import { ImageWithFallback } from '../ui/ImageWithFallback';

export interface CardProps {
    profile: Profile;
    onSwipe: (direction: 'left' | 'right') => void;
    isTop: boolean;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export function ProfileCard({ profile, onSwipe, isTop }: CardProps) {
    const translateX = useSharedValue(0);

    useEffect(() => {
        translateX.value = 0;
    }, [profile.id]);

    const panResponder = useMemo(
        () =>
            PanResponder.create({
                onStartShouldSetPanResponder: () => isTop,
                onMoveShouldSetPanResponder: () => isTop,
                onPanResponderMove: (_, g) => {
                    if (!isTop) return;
                    translateX.value = g.dx;
                },
                onPanResponderRelease: (_, g) => {
                    if (!isTop) return;
                    if (Math.abs(g.dx) > 100) {
                        runOnJS(onSwipe)(g.dx > 0 ? 'right' : 'left');
                        translateX.value = 0;
                    } else {
                        translateX.value = withSpring(0, { damping: 18, stiffness: 220 });
                    }
                },
            }),
        [isTop, onSwipe]
    );

    const cardMotion = useAnimatedStyle(() => {
        const rotate = interpolate(translateX.value, [-220, 220], [-18, 18], Extrapolation.CLAMP);
        const opacity = interpolate(
            translateX.value,
            [-220, -120, 0, 120, 220],
            [0.72, 1, 1, 1, 0.72],
            Extrapolation.CLAMP
        );
        return {
            transform: [{ translateX: translateX.value }, { rotate: `${rotate}deg` }],
            opacity,
        };
    });

    const goingStamp = useAnimatedStyle(() => ({
        opacity: interpolate(translateX.value, [20, 100], [0, 1], Extrapolation.CLAMP),
    }));

    const passStamp = useAnimatedStyle(() => ({
        opacity: interpolate(translateX.value, [-100, -20], [1, 0], Extrapolation.CLAMP),
    }));

    // Non-top cards: render a simplified background version (no gesture handlers)
    if (!isTop) {
        return (
            <View className="absolute inset-0 overflow-hidden rounded-3xl border border-white/10">
                <ImageWithFallback source={profile.image} alt={profile.name} className="h-full w-full" />
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.8)']}
                    style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
                />
            </View>
        );
    }

    return (
        <AnimatedView
            {...panResponder.panHandlers}
            style={[cardMotion]}
            className="absolute inset-0"
        >
            <View
                className="relative h-full w-full overflow-hidden rounded-3xl border border-white/15"
                style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 16 },
                    shadowOpacity: 0.45,
                    shadowRadius: 24,
                    elevation: 12,
                }}
            >
                <ImageWithFallback source={profile.image} alt={profile.name} className="h-full w-full" />
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.25)', 'rgba(0,0,0,0.85)']}
                    locations={[0, 0.45, 1]}
                    style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
                />

                {/* GOING stamp – appears when swiping right */}
                <AnimatedView
                    style={[
                        goingStamp,
                        {
                            position: 'absolute',
                            top: 40,
                            right: 24,
                            borderWidth: 2,
                            borderColor: '#4ade80',
                            borderRadius: 12,
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            transform: [{ rotate: '15deg' }],
                            shadowColor: '#4ade80',
                            shadowOpacity: 0.5,
                            shadowRadius: 16,
                        },
                    ]}
                >
                    <Text className="text-xl font-black tracking-wider text-green-400">GOING</Text>
                </AnimatedView>

                {/* PASS stamp – appears when swiping left */}
                <AnimatedView
                    style={[
                        passStamp,
                        {
                            position: 'absolute',
                            top: 40,
                            left: 24,
                            borderWidth: 2,
                            borderColor: '#f87171',
                            borderRadius: 12,
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            transform: [{ rotate: '-15deg' }],
                            shadowColor: '#f87171',
                            shadowOpacity: 0.5,
                            shadowRadius: 16,
                        },
                    ]}
                >
                    <Text className="text-xl font-black tracking-wider text-red-400">PASS</Text>
                </AnimatedView>

                {/* "She likes you" badge */}
                {profile.likesYou && (
                    <View
                        className="absolute left-4 top-4 flex-row items-center gap-1.5 rounded-full border border-purple-400/30 px-3 py-1.5"
                        style={{
                            backgroundColor: 'rgba(126,63,241,0.75)',
                            shadowColor: '#7e3ff1',
                            shadowOpacity: 0.4,
                            shadowRadius: 20,
                        }}
                    >
                        <Ionicons name="heart" size={14} color="#fff" />
                        <Text className="text-xs font-semibold tracking-wide text-white">She likes you</Text>
                    </View>
                )}

                {/* Bottom info panel */}
                <View className="absolute bottom-0 left-0 right-0 p-4">
                    <View className="mb-1">
                        <View className="mb-0.5 flex-row items-center gap-2">
                            <Text className="text-2xl font-bold text-white">
                                {profile.name}, {profile.age}
                            </Text>
                            <View
                                className="h-5 w-5 items-center justify-center rounded-full"
                                style={{
                                    backgroundColor: '#3b82f6',
                                    shadowColor: '#3b82f6',
                                    shadowOpacity: 0.8,
                                    shadowRadius: 8,
                                }}
                            >
                                <Text className="text-[9px] font-bold text-white">✓</Text>
                            </View>
                        </View>
                        <View className="mb-0.5 flex-row items-center gap-1">
                            <Ionicons name="location-outline" size={12} color="#9ca3af" />
                            <Text className="text-xs text-gray-300">{profile.distance}</Text>
                        </View>
                        <View className="flex-row items-center gap-1">
                            <Ionicons name="school-outline" size={12} color="#9ca3af" />
                            <Text className="text-xs text-gray-400">{profile.education}</Text>
                        </View>
                    </View>

                    {/* Event & Mutuals info chips */}
                    <View className="mt-3 flex-row gap-2">
                        <View
                            className="flex-1 rounded-2xl border p-2.5"
                            style={{
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                borderColor: 'rgba(59,130,246,0.5)',
                                shadowColor: '#3b82f6',
                                shadowOpacity: 0.25,
                                shadowRadius: 14,
                            }}
                        >
                            <View className="mb-1.5 flex-row items-center gap-1.5">
                                <View
                                    className="h-5 w-5 items-center justify-center rounded-full"
                                    style={{ backgroundColor: 'rgba(59,130,246,0.25)' }}
                                >
                                    <Ionicons name="musical-notes" size={10} color="#60a5fa" />
                                </View>
                                <Text className="text-[9px] font-medium uppercase tracking-wider text-gray-400">
                                    Top Event
                                </Text>
                            </View>
                            <Text className="text-xs font-bold leading-tight text-white">{profile.event.name}</Text>
                            <Text className="mt-0.5 text-[9px] text-gray-400">
                                {profile.event.date} · Bandung
                            </Text>
                        </View>

                        <View
                            className="flex-1 rounded-2xl border p-2.5"
                            style={{
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                borderColor: 'rgba(168,85,247,0.5)',
                                shadowColor: '#a855f7',
                                shadowOpacity: 0.25,
                                shadowRadius: 14,
                            }}
                        >
                            <View className="mb-1.5 flex-row items-center gap-1.5">
                                <View
                                    className="h-5 w-5 items-center justify-center rounded-full"
                                    style={{ backgroundColor: 'rgba(168,85,247,0.25)' }}
                                >
                                    <Ionicons name="people" size={10} color="#c084fc" />
                                </View>
                                <Text className="text-[9px] font-medium uppercase tracking-wider text-gray-400">
                                    Mutuals
                                </Text>
                            </View>
                            <Text className="text-xs font-bold leading-tight text-white">
                                {profile.mutuals} Friends
                            </Text>
                            <Text className="mt-0.5 text-[9px] text-gray-400">Going to this event</Text>
                        </View>
                    </View>
                </View>
            </View>
        </AnimatedView>
    );
}
