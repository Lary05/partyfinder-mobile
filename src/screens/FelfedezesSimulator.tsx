// src/screens/FelfedezesSimulator.tsx
// Layout composer and state manager for the Barátkereső (Party Buddy) discovery screen.
// Per project rules (Section 4-A), this file is responsible ONLY for state and layout composition.
// All sub-components live in src/components/match/ and src/components/ui/.

import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useState, useRef } from 'react';
import { Platform, Pressable, Text, View, Image } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    FadeIn,
    ZoomIn,
    FadeInDown,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ProfileCard, ProfileCardRef } from '../components/match/ProfileCard';
import { PageHeader } from '../components/ui/PageHeader';
import { Profile, profilesSeed } from '../data/dummyProfiles';
import { useAuth } from '../context/AuthContext';
import { LoginRequiredShield } from '../components/ui/LoginRequiredShield';

type FelfedezesSimulatorProps = {
    /** Extra bottom padding when embedded in HomeScreen so content stays above the floating tab bar */
    bottomInset?: number;
};

const RAMA_AVATAR = "https://images.unsplash.com/photo-1769142899668-5816cf1d920a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMG1hbiUyMGF2YXRhciUyMHByb2ZpbGUlMjBwaG90b3xlbnwxfHx8fDE3NzYyOTI0NzR8MA&ixlib=rb-4.1.0&q=80&w=1080";

export default function FelfedezesSimulator({ bottomInset = 0 }: FelfedezesSimulatorProps) {
    const { isGuest } = useAuth();
    const navigation = useNavigation<any>();

    // Per project rules (Section 5 – Match Screen Flow), the swipe view is the DEFAULT.
    // The pre-filtering search form ("Kivel bulizol ma?") is bypassed on mount.
    const [cards, setCards] = useState<Profile[]>(profilesSeed);
    const [removed, setRemoved] = useState<Profile[]>([]);
    const [swipeAction, setSwipeAction] = useState<'like' | 'pass' | null>(null);
    const [matchCelebration, setMatchCelebration] = useState<Profile | null>(null);
    const topCardRef = useRef<ProfileCardRef>(null);

    const flashOpacity = useSharedValue(0);
    const flashStyle = useAnimatedStyle(() => ({ opacity: flashOpacity.value }));

    const handleSwipe = useCallback(
        (direction: 'left' | 'right') => {
            const topCard = cards[0];
            if (direction === 'right' && topCard?.likesYou) {
                setMatchCelebration(topCard);
                return; // Wait for user to dismiss celebration
            }

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
        [cards, flashOpacity]
    );

    const dismissMatch = () => {
        if (!matchCelebration) return;
        setCards((prev) => {
            if (prev.length === 0) return prev;
            const [top, ...rest] = prev;
            setRemoved((r) => [top, ...r]);
            return rest;
        });
        setMatchCelebration(null);
    };

    const handleReset = () => {
        setCards([...removed].reverse());
        setRemoved([]);
    };

    if (isGuest) {
        return <LoginRequiredShield />;
    }

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
                                <ProfileCard ref={topCardRef} profile={cards[0]} onSwipe={handleSwipe} isTop={true} />
                            </View>
                        </View>
                    )}
                </View>

                {/* Action buttons – only shown while cards remain */}
                {cards.length > 0 && (
                    <View className="flex-shrink-0 flex-row items-center justify-center gap-8 py-4">
                        {/* Pass button */}
                        <Pressable
                            onPress={() => topCardRef.current?.swipeLeft()}
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
                            onPress={() => topCardRef.current?.swipeRight()}
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

                {/* Match Celebration Overlay */}
                {matchCelebration && (
                    <Animated.View
                        entering={FadeIn.duration(400)}
                        className="absolute inset-0 z-50 items-center justify-center px-6"
                        style={{ backgroundColor: 'rgba(11,13,23,0.95)' }}
                    >
                        <Animated.Text
                            entering={ZoomIn.delay(300).springify().damping(12)}
                            className="text-4xl font-extrabold text-white text-center mb-10"
                            style={{ 
                                textShadowColor: 'rgba(236,72,153,0.8)', 
                                textShadowOffset: {width: 0, height: 0}, 
                                textShadowRadius: 30,
                                color: '#fbcfe8',
                                fontStyle: 'italic',
                                letterSpacing: 2
                            }}
                        >
                            IT'S A MATCH!
                        </Animated.Text>

                        {/* Avatars */}
                        <View className="flex-row items-center justify-center mb-12">
                            <Animated.View entering={ZoomIn.delay(500).springify()} className="w-28 h-28 rounded-full border-4 border-[#0B0D17] overflow-hidden z-10" style={{ right: -20 }}>
                                <Image source={{ uri: RAMA_AVATAR }} className="w-full h-full" resizeMode="cover" />
                            </Animated.View>
                            <Animated.View entering={ZoomIn.delay(700).springify()} className="w-28 h-28 rounded-full border-4 border-[#0B0D17] overflow-hidden">
                                <Image source={{ uri: matchCelebration.avatarUrl }} className="w-full h-full" resizeMode="cover" />
                            </Animated.View>
                        </View>

                        <Animated.Text entering={FadeInDown.delay(900)} className="text-gray-300 text-center mb-12 px-4">
                            You and {matchCelebration.displayName} liked each other. Don't keep them waiting!
                        </Animated.Text>

                        <Animated.View entering={FadeInDown.delay(1000)} className="w-full gap-4">
                            <Pressable
                                onPress={() => {
                                    setMatchCelebration(null);
                                    navigation.navigate('ChatDetail', {
                                        chatId: `match-${matchCelebration.id}`,
                                        user: { name: matchCelebration.displayName, avatar: matchCelebration.avatarUrl, handle: `@${matchCelebration.displayName.toLowerCase().replace(/\s+/g,'')}` }
                                    });
                                }}
                                className="w-full rounded-2xl py-4 items-center justify-center"
                                style={{ backgroundColor: '#ec4899', shadowColor: '#ec4899', shadowOpacity: 0.4, shadowRadius: 15, elevation: 5 }}
                            >
                                <Text className="font-bold text-white text-lg">Send a Message</Text>
                            </Pressable>

                            <Pressable onPress={dismissMatch} className="w-full rounded-2xl py-4 items-center justify-center border border-white/20">
                                <Text className="font-semibold text-gray-300 text-lg">Keep Swiping</Text>
                            </Pressable>
                        </Animated.View>
                    </Animated.View>
                )}
            </View>
        </SafeAreaView>
    );
}
