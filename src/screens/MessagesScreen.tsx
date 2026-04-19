// src/screens/MessagesScreen.tsx
// Premium Messages list screen — transpiled from the web design to React Native.
// Replaces: framer-motion → Reanimated, lucide-react → Ionicons,
//           linear-gradient CSS → expo-linear-gradient,
//           react-router navigate → @react-navigation/native useNavigation.

import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    Pressable,
    StyleSheet,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    FadeInDown,
    FadeOutUp,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import { LoginRequiredShield } from '../components/ui/LoginRequiredShield';
import { ImageWithFallback } from '../components/ui/ImageWithFallback';

// ─── Avatar constants (same URLs as the web source) ────────────────────────────
const A1 = 'https://images.unsplash.com/photo-1762324858811-6b63afd48a87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMGFzaWFuJTIwd29tYW4lMjBwb3J0cmFpdCUyMGZhc2hpb24lMjBkYXJrJTIwYWVzdGhldGljfGVufDF8fHx8MTc3NjU1NjA3MHww&ixlib=rb-4.1.0&q=80&w=1080';
const A2 = 'https://images.unsplash.com/photo-1760050516416-5013f983b941?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMG1hbiUyMHVyYmFuJTIwc3RyZWV0d2VhciUyMHBvcnRyYWl0JTIwY29uZmlkZW50fGVufDF8fHx8MTc3NjU1NjA3MHww&ixlib=rb-4.1.0&q=80&w=1080';
const A3 = 'https://images.unsplash.com/photo-1769650795757-c901425aefbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGN1cmx5JTIwaGFpciUyMHBvcnRyYWl0JTIwc3R1ZGlvJTIwZGFyayUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzc2NTU2MDcwfDA&ixlib=rb-4.1.0&q=80&w=1080';
const A4 = 'https://images.unsplash.com/photo-1702579454530-a121c1742c15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHdvbWFuJTIwbXVzaWNpYW4lMjBjcmVhdGl2ZSUyMHBvcnRyYWl0JTIwbmlnaHR8ZW58MXx8fHwxNzc2NTU2MDcxfDA&ixlib=rb-4.1.0&q=80&w=1080';
const A5 = 'https://images.unsplash.com/photo-1587526345205-4c9ee20d1073?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjB3aXRoJTIwZ2xhc3NlcyUyMGNyZWF0aXZlJTIwcG9ydHJhaXQlMjBkYXJrJTIwbW9vZHl8ZW58MXx8fHwxNzc2NTU2MDcxfDA&ixlib=rb-4.1.0&q=80&w=1080';
const A6 = 'https://images.unsplash.com/photo-1768845431912-a5b1861767af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGJvbGQlMjBtYWtldXAlMjBlZGl0b3JpYWwlMjBkYXJrJTIwZmFzaGlvbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc3NjU1NjA3NHww&ixlib=rb-4.1.0&q=80&w=1080';

// ─── Chat data ──────────────────────────────────────────────────────────────────
interface Chat {
    id: number;
    name: string;
    handle: string;
    avatar: string;
    lastMessage: string;
    time: string;
    unread: number;
    online: boolean;
    read: boolean;
}

const chats: Chat[] = [
    { id: 1, name: 'Citra',  handle: '@citra_techno',     avatar: A1, lastMessage: 'omg the lineup is insane 🔥 you going?',         time: '2m',        unread: 3, online: true,  read: false },
    { id: 2, name: 'Rafi',   handle: '@rafi.wav',          avatar: A2, lastMessage: 'Saved you a spot near the stage 👀',              time: '14m',       unread: 1, online: true,  read: false },
    { id: 3, name: 'Mira',   handle: '@mira_loops',        avatar: A3, lastMessage: 'haha yes let\'s go early this time',              time: '1h',        unread: 0, online: false, read: true  },
    { id: 4, name: 'Luna',   handle: '@luna.soundscape',   avatar: A4, lastMessage: 'That set was unreal — found new fav DJ',          time: '3h',        unread: 0, online: true,  read: true  },
    { id: 5, name: 'Bram',   handle: '@bram_studiocraft',  avatar: A5, lastMessage: 'You: sent you the ticket link 🎟',                time: 'Yesterday', unread: 0, online: false, read: true  },
    { id: 6, name: 'Defina', handle: '@defina.noire',      avatar: A6, lastMessage: 'Can\'t wait!! Counting down the days 💜',         time: 'Yesterday', unread: 0, online: false, read: true  },
];

// ─── Animated "View New Matches" button ────────────────────────────────────────
// Replicates framer-motion's whileHover/whileTap scale with Reanimated.
function NewMatchesButton({ onPress }: { onPress: () => void }) {
    const scale = useSharedValue(1);
    const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

    return (
        <Animated.View style={[animStyle, styles.matchButtonWrapper]}>
            <Pressable
                onPressIn={() => { scale.value = withTiming(0.98, { duration: 100 }); }}
                onPressOut={() => { scale.value = withTiming(1, { duration: 150 }); }}
                onPress={onPress}
                style={styles.matchButtonPressable}
            >
                {/* Gradient replaces: background: linear-gradient(120deg, ...) */}
                <LinearGradient
                    colors={['rgba(59,130,246,0.14)', 'rgba(139,92,246,0.14)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={StyleSheet.absoluteFillObject}
                />
                {/* Radial glow orb — approximated with a blurred View */}
                <View style={styles.matchButtonOrb} />

                {/* Left: icon + text */}
                <View className="flex-row items-center gap-3">
                    <LinearGradient
                        colors={['rgba(59,130,246,0.3)', 'rgba(139,92,246,0.3)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.matchButtonIconBox}
                    >
                        {/* Ionicons: sparkles (Sparkles) */}
                        <Ionicons name="sparkles" size={16} color="#d8b4fe" />
                    </LinearGradient>
                    <View>
                        <Text className="text-white text-sm font-bold">View New Matches ✨</Text>
                        <Text style={{ color: 'rgba(216,180,254,0.7)', fontSize: 10, marginTop: 2 }}>
                            7 people liked your profile
                        </Text>
                    </View>
                </View>

                {/* Right: stacked avatars + chevron */}
                <View className="flex-row items-center" style={{ gap: 6 }}>
                    <View className="flex-row">
                        {[A1, A3, A4].map((src, i) => (
                            <View
                                key={i}
                                style={[
                                    styles.stackedAvatar,
                                    i > 0 && { marginLeft: -6 },
                                    { zIndex: 3 - i },
                                ]}
                            >
                                <ImageWithFallback source={src} alt="" style={{ width: '100%', height: '100%' }} />
                            </View>
                        ))}
                    </View>
                    {/* Ionicons: chevron-forward (ChevronRight) */}
                    <Ionicons name="chevron-forward" size={16} color="#a78bfa" />
                </View>
            </Pressable>
        </Animated.View>
    );
}

// ─── Individual chat row ────────────────────────────────────────────────────────
function ChatRow({ chat, index, isActive, onPress }: {
    chat: Chat;
    index: number;
    isActive: boolean;
    onPress: () => void;
}) {
    const isOutgoing = chat.lastMessage.startsWith('You:');

    return (
        // FadeInDown replaces framer-motion initial/animate/exit with delay
        <Animated.View entering={FadeInDown.delay(index * 40).duration(300)} exiting={FadeOutUp.duration(200)}>
            <Pressable
                onPress={onPress}
                style={[
                    styles.chatRow,
                    isActive && styles.chatRowActive,
                ]}
            >
                {/* Avatar + online dot */}
                <View style={{ position: 'relative', flexShrink: 0 }}>
                    <View style={styles.avatarRing}>
                        <ImageWithFallback source={chat.avatar} alt={chat.name} style={{ width: '100%', height: '100%' }} />
                    </View>
                    {chat.online && <View style={styles.onlineDot} />}
                </View>

                {/* Name + last message */}
                <View style={{ flex: 1, minWidth: 0 }}>
                    <View className="flex-row items-baseline" style={{ gap: 6, marginBottom: 2 }}>
                        <Text className="text-white text-sm font-bold" numberOfLines={1}>{chat.name}</Text>
                        <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }} numberOfLines={1}>{chat.handle}</Text>
                    </View>
                    <View className="flex-row items-center" style={{ gap: 4 }}>
                        {/* Ionicons: checkmark-done (CheckCheck) for outgoing read */}
                        {chat.read && isOutgoing && (
                            <Ionicons name="checkmark-done" size={12} color="#60a5fa" />
                        )}
                        {/* Ionicons: checkmark (Check) for others' read, no unread */}
                        {chat.read && !isOutgoing && chat.unread === 0 && (
                            <Ionicons name="checkmark" size={12} color="rgba(255,255,255,0.3)" />
                        )}
                        <Text
                            numberOfLines={1}
                            style={{
                                fontSize: 12,
                                color: chat.unread > 0 ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.28)',
                                fontWeight: chat.unread > 0 ? '500' : '400',
                                flex: 1,
                            }}
                        >
                            {chat.lastMessage}
                        </Text>
                    </View>
                </View>

                {/* Time + unread badge */}
                <View className="items-end" style={{ gap: 6, flexShrink: 0 }}>
                    <Text style={{ fontSize: 10, color: chat.unread > 0 ? '#60a5fa' : 'rgba(255,255,255,0.22)' }}>
                        {chat.time}
                    </Text>
                    {chat.unread > 0 ? (
                        // LinearGradient replaces: background: linear-gradient(135deg, #3b82f6, #8b5cf6)
                        <LinearGradient
                            colors={['#3b82f6', '#8b5cf6']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.unreadBadge}
                        >
                            <Text style={{ color: '#fff', fontSize: 9, fontWeight: '700' }}>
                                {chat.unread}
                            </Text>
                        </LinearGradient>
                    ) : (
                        // Placeholder to keep row height consistent
                        <View style={{ width: 20, height: 20 }} />
                    )}
                </View>
            </Pressable>
        </Animated.View>
    );
}

// ─── Main screen ────────────────────────────────────────────────────────────────
export default function MessagesScreen() {
    const { isGuest } = useAuth();
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();

    const [query, setQuery] = useState('');
    const [activeChat, setActiveChat] = useState<number | null>(null);

    const tabBarReserve = 76 + insets.bottom;

    // DEV_ONLY: Temporary bypass for UI development.
    // if (isGuest) {
    //     return <LoginRequiredShield />;
    // }

    const filtered = chats.filter(
        (c) =>
            c.name.toLowerCase().includes(query.toLowerCase()) ||
            c.handle.toLowerCase().includes(query.toLowerCase()),
    );

    const onlineCount = chats.filter((c) => c.online).length;

    return (
        <SafeAreaView edges={['top']} className="flex-1 bg-[#0B0D17]">
            {/* ── Header ── */}
            <View style={{ paddingHorizontal: 20, paddingTop: 28, paddingBottom: 12 }}>
                {/* Title row */}
                <View className="flex-row items-center justify-between" style={{ marginBottom: 20 }}>
                    <Text style={{ color: '#fff', fontSize: 26, fontWeight: '800', letterSpacing: -0.5 }}>
                        Messages
                    </Text>
                    {/* Online pill */}
                    <View style={styles.onlinePill}>
                        <View style={styles.onlinePillDot} />
                        <Text style={{ color: '#93c5fd', fontSize: 12, fontWeight: '500' }}>
                            {onlineCount} online
                        </Text>
                    </View>
                </View>

                {/* Search bar */}
                <View style={styles.searchBar}>
                    {/* Ionicons: search (Search) */}
                    <Ionicons name="search" size={16} color="rgba(255,255,255,0.3)" style={{ flexShrink: 0 }} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search by @username..."
                        placeholderTextColor="rgba(255,255,255,0.2)"
                        value={query}
                        onChangeText={setQuery}
                    />
                    {query.length > 0 && (
                        <Pressable onPress={() => setQuery('')} hitSlop={8}>
                            <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>✕</Text>
                        </Pressable>
                    )}
                </View>

                {/* "View New Matches" button */}
                <NewMatchesButton onPress={() => navigation.navigate('NewMatches')} />
            </View>

            {/* ── Chat list ── */}
            <FlatList
                data={filtered}
                keyExtractor={(item) => String(item.id)}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: tabBarReserve + 16 }}
                ListHeaderComponent={
                    <Text style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 12, paddingHorizontal: 4 }}>
                        Recent Chats
                    </Text>
                }
                renderItem={({ item, index }) => (
                    <ChatRow
                        chat={item}
                        index={index}
                        isActive={activeChat === item.id}
                        onPress={() => navigation.navigate('ChatDetail', { 
                            chatId: String(item.id), 
                            user: { name: item.name, avatar: item.avatar, handle: item.handle } 
                        })}
                    />
                )}
                ListEmptyComponent={
                    <View className="items-center justify-center" style={{ paddingVertical: 64, gap: 12 }}>
                        <View style={styles.emptyIconBox}>
                            <Ionicons name="search" size={24} color="rgba(255,255,255,0.2)" />
                        </View>
                        <Text style={{ color: 'rgba(255,255,255,0.25)', fontSize: 14 }}>
                            No chats matching "{query}"
                        </Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

// ─── StyleSheet (only for values that can't be expressed as NativeWind classes) ─
// Rule: NativeWind-first; StyleSheet only for shadows, complex borders, and
// values that require runtime computation or are only supported via StyleSheet.
const styles = StyleSheet.create({
    // "View New Matches" button
    matchButtonWrapper: {
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(139,92,246,0.35)',
        shadowColor: '#8b5cf6',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    matchButtonPressable: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        overflow: 'hidden',
    },
    matchButtonOrb: {
        position: 'absolute',
        right: 32,
        top: '50%',
        marginTop: -40,
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(168,85,247,0.18)',
    },
    matchButtonIconBox: {
        width: 36,
        height: 36,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(139,92,246,0.4)',
    },
    stackedAvatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#0B0D17',
    },
    // Chat row
    chatRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        borderRadius: 24,
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginBottom: 8,
        borderWidth: 1,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderColor: 'rgba(255,255,255,0.06)',
    },
    chatRowActive: {
        backgroundColor: 'rgba(59,130,246,0.1)',
        borderColor: 'rgba(59,130,246,0.28)',
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.18,
        shadowRadius: 10,
        elevation: 4,
    },
    avatarRing: {
        width: 48,
        height: 48,
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    onlineDot: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#22c55e',
        borderWidth: 2,
        borderColor: '#0B0D17',
        shadowColor: '#22c55e',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
    },
    unreadBadge: {
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 5,
        elevation: 4,
    },
    // Online count pill
    onlinePill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
        backgroundColor: 'rgba(59,130,246,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(59,130,246,0.25)',
    },
    onlinePillDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#3b82f6',
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.9,
        shadowRadius: 4,
    },
    // Search bar
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: 1,
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderColor: 'rgba(255,255,255,0.08)',
        marginBottom: 16,
    },
    searchInput: {
        flex: 1,
        color: '#fff',
        fontSize: 14,
        padding: 0, // Remove default Android padding
    },
    // Empty state
    emptyIconBox: {
        width: 56,
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.07)',
    },
});
