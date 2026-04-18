import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Image,
    ImageErrorEventData,
    NativeSyntheticEvent,
    PanResponder,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, {
    Extrapolation,
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const CITRA_IMAGE =
    'https://images.unsplash.com/photo-1759853900346-8d1ee0af7ca8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMGFzaWFuJTIwd29tYW4lMjBwb3J0cmFpdCUyMGRhcmslMjBqYWNrZXQlMjBmYXNoaW9ufGVufDF8fHx8MTc3NjI5MjQ3NHww&ixlib=rb-4.1.0&q=80&w=1080';

const PROFILE_2 =
    'https://images.unsplash.com/photo-1588072719654-9a95b5bb42d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHdvbWFuJTIwcG9ydHJhaXQlMjBtdXNpYyUyMGZlc3RpdmFsJTIwbmlnaHR8ZW58MXx8fHwxNzc2MjkyNTE0fDA&ixlib=rb-4.1.0&q=80&w=1080';

const PROFILE_3 =
    'https://images.unsplash.com/photo-1724118135600-35009a8d6a89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMG1hbiUyMHBvcnRyYWl0JTIwdXJiYW4lMjBzdHlsZXxlbnwxfHx8fDE3NzYyOTI1MTR8MA&ixlib=rb-4.1.0&q=80&w=1080';

const RAMA_AVATAR =
    'https://images.unsplash.com/photo-1769142899668-5816cf1d920a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMG1hbiUyMGF2YXRhciUyMHByb2ZpbGUlMjBwaG90b3xlbnwxfHx8fDE3NzYyOTI0NzR8MA&ixlib=rb-4.1.0&q=80&w=1080';

const profilesSeed = [
    {
        id: 1,
        name: 'Citra',
        age: 23,
        distance: '2.5 km away',
        education: 'Master of Information Technology, 2025',
        likesYou: true,
        image: CITRA_IMAGE,
        event: { name: 'Boiler Room', date: '25 Nov' },
        mutuals: 3,
    },
    {
        id: 2,
        name: 'Alya',
        age: 24,
        distance: '3.1 km away',
        education: 'Bachelor of Fine Arts, 2024',
        likesYou: false,
        image: PROFILE_2,
        event: { name: 'Djakarta Warehouse', date: '02 Dec' },
        mutuals: 5,
    },
    {
        id: 3,
        name: 'Dano',
        age: 27,
        distance: '1.8 km away',
        education: 'MBA Business Design, 2023',
        likesYou: false,
        image: PROFILE_3,
        event: { name: 'We The Fest', date: '14 Dec' },
        mutuals: 2,
    },
];

interface Profile {
    id: number;
    name: string;
    age: number;
    distance: string;
    education: string;
    likesYou: boolean;
    image: string;
    event: { name: string; date: string };
    mutuals: number;
}

function ImageWithFallback({
    source,
    alt,
    className,
    style,
}: {
    source: string;
    alt: string;
    className?: string;
    style?: object;
}) {
    const [failed, setFailed] = useState(false);
    const uri = failed
        ? 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80'
        : source;

    return (
        <Image
            accessibilityLabel={alt}
            source={{ uri }}
            className={className}
            style={style}
            resizeMode="cover"
            onError={(_e: NativeSyntheticEvent<ImageErrorEventData>) => setFailed(true)}
        />
    );
}

interface PageHeaderProps {
    searchPlaceholder?: string;
}

function GlassCard({ children, className }: { children: React.ReactNode; className?: string }) {
    if (Platform.OS === 'ios') {
        return (
            <View className={className} style={{ position: 'relative', overflow: 'hidden' }}>
                <BlurView
                    intensity={48}
                    tint="dark"
                    style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
                />
                <View className="relative z-10">{children}</View>
            </View>
        );
    }
    return (
        <View className={className} style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
            {children}
        </View>
    );
}

function PageHeader({ searchPlaceholder = 'Enter what you are looking for...' }: PageHeaderProps) {
    return (
        <>
            <View className="mx-4 mt-2 mb-2 overflow-hidden rounded-3xl border border-white/10">
                <GlassCard className="px-4 py-3">
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center gap-3">
                            <View
                                className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full"
                                style={{ borderWidth: 2, borderColor: 'rgba(255,255,255,0.18)' }}
                            >
                                <ImageWithFallback source={RAMA_AVATAR} alt="Rama" className="h-full w-full" />
                            </View>
                            <View>
                                <View className="flex-row items-center gap-1.5">
                                    <Text className="text-xs text-gray-400">Hi,</Text>
                                    <Text className="text-sm font-semibold text-white">Rama</Text>
                                    <Text className="text-sm">👋</Text>
                                </View>
                                <View className="mt-0.5 flex-row items-center gap-1">
                                    <Ionicons name="location" size={10} color="#60a5fa" />
                                    <Text className="text-[10px] text-gray-500">Bandung, Indonesia</Text>
                                </View>
                            </View>
                        </View>

                        <View className="flex-row items-center gap-2">
                            <Pressable
                                className="h-8 w-8 items-center justify-center rounded-full border border-white/10"
                                style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
                            >
                                <Ionicons name="notifications-outline" size={16} color="#9ca3af" />
                            </Pressable>
                            <Pressable
                                className="h-8 w-8 items-center justify-center rounded-full border border-white/10"
                                style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
                            >
                                <Ionicons name="options-outline" size={16} color="#9ca3af" />
                            </Pressable>
                        </View>
                    </View>
                </GlassCard>
            </View>

            <View className="mx-4 mb-3 overflow-hidden rounded-2xl border border-white/10">
                <GlassCard className="flex-row items-center gap-2.5 px-3.5 py-2.5">
                    <Ionicons name="search" size={16} color="#52525b" />
                    <TextInput
                        placeholder={searchPlaceholder}
                        placeholderTextColor="#52525b"
                        className="flex-1 bg-transparent text-xs text-gray-400"
                    />
                    <Pressable
                        className="h-6 w-6 items-center justify-center rounded-lg border"
                        style={{
                            backgroundColor: 'rgba(59,130,246,0.18)',
                            borderColor: 'rgba(59,130,246,0.3)',
                        }}
                    >
                        <Ionicons name="options-outline" size={12} color="#60a5fa" />
                    </Pressable>
                </GlassCard>
            </View>
        </>
    );
}

interface CardProps {
    profile: Profile;
    onSwipe: (direction: 'left' | 'right') => void;
    isTop: boolean;
}

const AnimatedView = Animated.createAnimatedComponent(View);

function ProfileCard({ profile, onSwipe, isTop }: CardProps) {
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

type FelfedezesSimulatorProps = {
    /** Extra bottom padding when embedded in HomeScreen so content stays above the floating tab bar */
    bottomInset?: number;
};

export default function FelfedezesSimulator({ bottomInset = 0 }: FelfedezesSimulatorProps) {
    const [currentView, setCurrentView] = useState<'search' | 'swipe'>('search');
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

    if (currentView === 'swipe') {
        return (
            <SafeAreaView
                className="flex-1 bg-neutral-950"
                edges={['top']}
                style={{ paddingBottom: bottomInset }}
            >
                <View className="relative flex-1">
                    <PageHeader searchPlaceholder="Enter what you are looking for..." />

                    <View className="relative mx-4 flex-1 min-h-0">
                        {cards.length === 0 ? (
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

                    {cards.length > 0 && (
                        <View className="flex-shrink-0 flex-row items-center justify-center gap-8 py-4">
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

                    <View className="border-t border-white/5 bg-black/40 px-4 pb-2 pt-3">
                        <TouchableOpacity
                            onPress={() => setCurrentView('search')}
                            className="items-center rounded-2xl border border-white/10 py-3"
                            style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                        >
                            <Text className="text-sm font-semibold text-white">⬅ Vissza a kereséshez</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <View className="flex-1 bg-neutral-950" style={{ paddingBottom: bottomInset }}>
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 32 }}
            >
                <View className="border-b border-gray-800 bg-neutral-950 px-6 pb-6 pt-16 shadow-md">
                    <Text className="text-4xl font-extrabold tracking-tight text-white">Felfedezés</Text>
                </View>

                <View className="px-6 pt-8">
                    <View className="rounded-[28px] border border-gray-700 bg-gray-800/90 p-7 shadow-xl">
                        <View className="mb-6">
                            <Text className="mb-3 text-sm font-bold uppercase tracking-widest text-gray-400">
                                Város
                            </Text>
                            <View className="h-16 justify-center rounded-2xl border border-gray-700 bg-gray-950 px-5 shadow-inner">
                                <Text className="text-base font-semibold text-gray-300">Budapest ▼</Text>
                            </View>
                        </View>

                        <View className="mb-6">
                            <Text className="mb-3 text-sm font-bold uppercase tracking-widest text-gray-400">
                                Dátum
                            </Text>
                            <View className="h-16 justify-center rounded-2xl border border-gray-700 bg-gray-950 px-5 shadow-inner">
                                <Text className="text-base font-semibold text-gray-300">Válassz dátumot 📅</Text>
                            </View>
                        </View>

                        <View className="mb-10">
                            <Text className="mb-3 text-sm font-bold uppercase tracking-widest text-gray-400">
                                Műfajok
                            </Text>
                            <View className="mt-1 flex-row flex-wrap gap-3">
                                {['EDM', 'Techno', 'Retro'].map((genre) => (
                                    <View key={genre} className="rounded-full border border-gray-600 bg-gray-800 px-5 py-3 shadow-sm">
                                        <Text className="font-bold tracking-wide text-gray-200">{genre}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={() => {
                                setCards(profilesSeed);
                                setRemoved([]);
                                setCurrentView('swipe');
                            }}
                            className="items-center rounded-2xl bg-indigo-600 py-5 shadow-lg"
                            style={{ shadowColor: '#4f46e5', shadowOpacity: 0.4 }}
                        >
                            <Text className="text-lg font-extrabold tracking-widest text-white">
                                Kivel bulizol ma? → Barátkereső indítása
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
