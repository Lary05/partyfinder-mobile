// src/screens/NewMatchesScreen.tsx
// "New Matches" screen — transpiled from the web MatchesScreen design.
// Key conversions:
//   react-responsive-masonry  → custom two-column ScrollView layout
//   framer-motion             → Reanimated (FadeInDown + whileTap scale)
//   lucide-react              → @expo/vector-icons/Ionicons
//   CSS linear-gradient       → expo-linear-gradient
//   useNavigate / goBack()    → @react-navigation/native useNavigation

import React from 'react';
import {
    View,
    Text,
    ScrollView,
    Pressable,
    StyleSheet,
    useWindowDimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    FadeInDown,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import { LoginRequiredShield } from '../components/ui/LoginRequiredShield';
import { ImageWithFallback } from '../components/ui/ImageWithFallback';

// ─── Image constants ────────────────────────────────────────────────────────────
const IMG_1 = 'https://images.unsplash.com/photo-1762324858811-6b63afd48a87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMGFzaWFuJTIwd29tYW4lMjBwb3J0cmFpdCUyMGZhc2hpb24lMjBkYXJrJTIwYWVzdGhldGljfGVufDF8fHx8MTc3NjU1NjA3MHww&ixlib=rb-4.1.0&q=80&w=1080';
const IMG_2 = 'https://images.unsplash.com/photo-1760050516416-5013f983b941?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMG1hbiUyMHVyYmFuJTIwc3RyZWV0d2VhciUyMHBvcnRyYWl0JTIwY29uZmlkZW50fGVufDF8fHx8MTc3NjU1NjA3MHww&ixlib=rb-4.1.0&q=80&w=1080';
const IMG_3 = 'https://images.unsplash.com/photo-1769650795757-c901425aefbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGN1cmx5JTIwaGFpciUyMHBvcnRyYWl0JTIwc3R1ZGlvJTIwZGFyayUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzc2NTU2MDcwfDA&ixlib=rb-4.1.0&q=80&w=1080';
const IMG_4 = 'https://images.unsplash.com/photo-1702579454530-a121c1742c15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHdvbWFuJTIwbXVzaWNpYW4lMjBjcmVhdGl2ZSUyMHBvcnRyYWl0JTIwbmlnaHR8ZW58MXx8fHwxNzc2NTU2MDcxfDA&ixlib=rb-4.1.0&q=80&w=1080';
const IMG_5 = 'https://images.unsplash.com/photo-1587526345205-4c9ee20d1073?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjB3aXRoJTIwZ2xhc3NlcyUyMGNyZWF0aXZlJTIwcG9ydHJhaXQlMjBkYXJrJTIwbW9vZHl8ZW58MXx8fHwxNzc2NTU2MDcxfDA&ixlib=rb-4.1.0&q=80&w=1080';
const IMG_6 = 'https://images.unsplash.com/photo-1768845431912-a5b1861767af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGJvbGQlMjBtYWtldXAlMjBlZGl0b3JpYWwlMjBkYXJrJTIwZmFzaGlvbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc3NjU1NjA3NHww&ixlib=rb-4.1.0&q=80&w=1080';
const IMG_7 = 'https://images.unsplash.com/photo-1769329426751-ef72533d01cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHdvbWFuJTIwb3V0ZG9vciUyMGNpdHklMjBwb3J0cmFpdCUyMHNtaWxlJTIwc29mdHxlbnwxfHx8fDE3NzY1NTYwNzV8MA&ixlib=rb-4.1.0&q=80&w=1080';
const IMG_8 = 'https://images.unsplash.com/photo-1770055204250-f756f10e1ebf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBhcnRpc3RpYyUyMGNyZWF0aXZlJTIwZGFyayUyMGJhY2tncm91bmQlMjBwb3J0cmFpdCUyMGNsb3NlJTIwdXB8ZW58MXx8fHwxNzc2NTU2MDc1fDA&ixlib=rb-4.1.0&q=80&w=1080';
const IMG_9 = 'https://images.unsplash.com/photo-1762968897033-866a0c870c67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHZpbnRhZ2UlMjBhZXN0aGV0aWMlMjBmaWxtJTIwcGhvdG9ncmFwaHklMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzY1NTYwNzV8MA&ixlib=rb-4.1.0&q=80&w=1080';

// ─── Data ───────────────────────────────────────────────────────────────────────
interface Match {
    id: number;
    name: string;
    age: number;
    distance: string;
    image: string;
    height: number;
    hot: boolean;
}

const matches: Match[] = [
    { id: 1, name: 'Citra',  age: 23, distance: '2.5 km', image: IMG_1, height: 260, hot: true  },
    { id: 2, name: 'Rafi',   age: 27, distance: '4.1 km', image: IMG_2, height: 200, hot: false },
    { id: 3, name: 'Mira',   age: 25, distance: '1.8 km', image: IMG_3, height: 220, hot: false },
    { id: 4, name: 'Luna',   age: 24, distance: '6.3 km', image: IMG_4, height: 280, hot: true  },
    { id: 5, name: 'Bram',   age: 28, distance: '3.0 km', image: IMG_5, height: 200, hot: false },
    { id: 6, name: 'Defina', age: 25, distance: '5.2 km', image: IMG_6, height: 260, hot: true  },
    { id: 7, name: 'Sari',   age: 22, distance: '7.4 km', image: IMG_7, height: 220, hot: false },
    { id: 8, name: 'Dano',   age: 26, distance: '2.1 km', image: IMG_8, height: 240, hot: false },
    { id: 9, name: 'Elara',  age: 23, distance: '3.8 km', image: IMG_9, height: 200, hot: false },
];

// ─── MatchCard ──────────────────────────────────────────────────────────────────
// Replaces: motion.div whileHover/whileTap → Reanimated scale on press
//           CSS linear-gradient overlay   → LinearGradient absoluteFillObject
//           lucide Flame, MapPin          → Ionicons flame, location
function MatchCard({ match, index, onPress }: { match: Match; index: number; onPress: () => void }) {
    const scale = useSharedValue(1);
    const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

    return (
        // FadeInDown replaces framer-motion initial/animate with staggered delay
        <Animated.View
            entering={FadeInDown.delay(index * 60).springify().stiffness(260).damping(22)}
            style={[animStyle, styles.cardWrapper, { height: match.height }]}
        >
            <Pressable
                onPressIn={() => { scale.value = withTiming(0.975, { duration: 100 }); }}
                onPressOut={() => { scale.value = withTiming(1, { duration: 150 }); }}
                onPress={onPress}
                style={StyleSheet.absoluteFillObject}
            >
                {/* Full-bleed photo */}
                <ImageWithFallback
                    source={match.image}
                    alt={match.name}
                    style={{ width: '100%', height: '100%' }}
                />

                {/* Dark gradient overlay: linear-gradient(to top, ...) */}
                <LinearGradient
                    colors={['rgba(0,0,0,0.88)', 'rgba(0,0,0,0.3)', 'transparent']}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0, y: 0 }}
                    style={StyleSheet.absoluteFillObject}
                />

                {/* 🔥 "Hot" badge — top-right */}
                {match.hot && (
                    <View style={styles.hotBadge}>
                        {/* Ionicons: flame (Flame) */}
                        <Ionicons name="flame" size={13} color="#f87171" />
                    </View>
                )}

                {/* Name + location — bottom */}
                <View style={styles.cardInfo}>
                    <View className="flex-row items-center" style={{ gap: 6, marginBottom: 2 }}>
                        <Text style={styles.cardName}>
                            {match.name}, {match.age}
                        </Text>
                        {/* Verified checkmark badge */}
                        <LinearGradient
                            colors={['#2563eb', '#3b82f6']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.verifiedBadge}
                        >
                            <Text style={{ color: '#fff', fontSize: 7, fontWeight: '900' }}>✓</Text>
                        </LinearGradient>
                    </View>
                    <View className="flex-row items-center" style={{ gap: 4 }}>
                        {/* Ionicons: location (MapPin) */}
                        <Ionicons name="location" size={10} color="#9ca3af" />
                        <Text style={styles.cardDistance}>{match.distance} away</Text>
                    </View>
                </View>
            </Pressable>
        </Animated.View>
    );
}

// ─── Custom two-column masonry layout ───────────────────────────────────────────
// Replaces react-responsive-masonry (not available in React Native).
// Even indices → left column, odd indices → right column.
// Each column is a flex-column View inside a flex-row ScrollView child.
function MasonryGrid({ items }: { items: Match[] }) {
    const GUTTER = 10;
    const { width } = useWindowDimensions();
    const navigation = useNavigation<any>();
    // Account for the parent's horizontal padding (16px each side)
    const colWidth = (width - 32 - GUTTER) / 2;

    const leftColumn  = items.filter((_, i) => i % 2 === 0);
    const rightColumn = items.filter((_, i) => i % 2 !== 0);

    return (
        <View style={{ flexDirection: 'row', gap: GUTTER }}>
            {/* Left column */}
            <View style={{ width: colWidth, gap: GUTTER }}>
                {leftColumn.map((match) => {
                    const globalIndex = items.indexOf(match);
                    return <MatchCard 
                        key={match.id} 
                        match={match} 
                        index={globalIndex} 
                        onPress={() => navigation.navigate('ChatDetail', { 
                            chatId: String(match.id), 
                            user: { name: match.name, avatar: match.image, handle: '@new_match' } 
                        })}
                    />;
                })}
            </View>
            {/* Right column */}
            <View style={{ width: colWidth, gap: GUTTER }}>
                {rightColumn.map((match) => {
                    const globalIndex = items.indexOf(match);
                    return <MatchCard 
                        key={match.id} 
                        match={match} 
                        index={globalIndex} 
                        onPress={() => navigation.navigate('ChatDetail', { 
                            chatId: String(match.id), 
                            user: { name: match.name, avatar: match.image, handle: '@new_match' } 
                        })}
                    />;
                })}
            </View>
        </View>
    );
}

// ─── Back button ────────────────────────────────────────────────────────────────
// Replaces: motion.button whileHover/whileTap → Reanimated scale
function BackButton({ onPress }: { onPress: () => void }) {
    const scale = useSharedValue(1);
    const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

    return (
        <Animated.View style={animStyle}>
            <Pressable
                onPressIn={() => { scale.value = withTiming(0.92, { duration: 80 }); }}
                onPressOut={() => { scale.value = withTiming(1, { duration: 120 }); }}
                onPress={onPress}
                style={styles.backButton}
            >
                {/* Ionicons: arrow-back (ArrowLeft) */}
                <Ionicons name="arrow-back" size={16} color="#d1d5db" />
            </Pressable>
        </Animated.View>
    );
}

// ─── Main screen ────────────────────────────────────────────────────────────────
export default function NewMatchesScreen() {
    const { isGuest } = useAuth();
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();

    const tabBarReserve = 76 + insets.bottom;

    // DEV_ONLY: Temporary bypass for UI development.
    // if (isGuest) {
    //     return <LoginRequiredShield />;
    // }

    return (
        <SafeAreaView edges={['top']} className="flex-1 bg-[#0B0D17]">
            {/* ── Header ── */}
            <View style={{ paddingHorizontal: 20, paddingTop: 28, paddingBottom: 16 }}>
                {/* Back button + title row */}
                <View className="flex-row items-center" style={{ gap: 12, marginBottom: 4 }}>
                    <BackButton onPress={() => navigation.goBack()} />
                    <Text style={{ color: '#fff', fontSize: 22, fontWeight: '800', letterSpacing: -0.4 }}>
                        New Matches ✨
                    </Text>
                </View>

                {/* "X people liked your profile" pill */}
                <View style={{ marginLeft: 48, marginTop: -2 }}>
                    <View style={styles.likePill}>
                        {/* LinearGradient background replaces CSS linear-gradient */}
                        <LinearGradient
                            colors={['rgba(59,130,246,0.12)', 'rgba(139,92,246,0.12)']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={StyleSheet.absoluteFillObject}
                        />
                        {/* Pulsing dot — approximated with a static glow dot (no CSS animate-pulse) */}
                        <View style={styles.likePillDot} />
                        <Text style={{ color: '#d8b4fe', fontSize: 10, fontWeight: '600', letterSpacing: 0.5 }}>
                            {matches.length} people liked your profile
                        </Text>
                    </View>
                </View>
            </View>

            {/* ── Pinterest-style masonry grid ── */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: tabBarReserve + 16 }}
            >
                <MasonryGrid items={matches} />
            </ScrollView>
        </SafeAreaView>
    );
}

// ─── StyleSheet ─────────────────────────────────────────────────────────────────
// NativeWind-first; StyleSheet only for shadows, complex borders, and
// values that can't be expressed as Tailwind utility classes.
const styles = StyleSheet.create({
    // Back button
    backButton: {
        width: 36,
        height: 36,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        flexShrink: 0,
    },

    // "X people liked" pill
    likePill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: 'rgba(139,92,246,0.28)',
        overflow: 'hidden',
        alignSelf: 'flex-start',
    },
    likePillDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#c084fc',
        shadowColor: '#c084fc',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.9,
        shadowRadius: 4,
    },

    // Match card
    cardWrapper: {
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.09)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 12,
        elevation: 8,
    },

    // 🔥 Hot badge
    hotBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(239,68,68,0.25)',
        borderWidth: 1,
        borderColor: 'rgba(239,68,68,0.45)',
        shadowColor: '#ef4444',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 6,
    },

    // Card info (name + distance)
    cardInfo: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 12,
        paddingBottom: 12,
    },
    cardName: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
        textShadowColor: 'rgba(0,0,0,0.6)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    cardDistance: {
        color: '#9ca3af',
        fontSize: 10,
    },

    // Verified checkmark circle
    verifiedBadge: {
        width: 16,
        height: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.7,
        shadowRadius: 4,
    },
});
