import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    Pressable,
    StyleSheet,
    Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSpring,
    FadeInUp,
    FadeOutUp,
    FadeIn,
    FadeOut,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { ImageWithFallback } from '../components/ui/ImageWithFallback';

/* ── Images ─────────────────────────────────────────────────── */
const HERO = 'https://images.unsplash.com/photo-1585362606685-c35cd0cc4d4b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVubmluZyUyMGFzaWFuJTIwd29tYW4lMjBwb3J0cmFpdCUyMGRhcmslMjBtb29keSUyMGVkaXRvcmlhbCUyMGhpZ2glMjBmYXNoaW9ufGVufDF8fHx8MTc3NjYzODY1NXww&ixlib=rb-4.1.0&q=80&w=1080';
const ALBUM = 'https://images.unsplash.com/photo-1744908135320-94654608a753?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwbXVzaWMlMjBhbGJ1bSUyMGNvdmVyJTIwdmlueWwlMjBuZW9uJTIwYWJzdHJhY3R8ZW58MXx8fHwxNzc2NjM4NjU2fDA&ixlib=rb-4.1.0&q=80&w=1080';
const EVENT_IMG = 'https://images.unsplash.com/photo-1765738042644-a290f0a4a29f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdodGNsdWIlMjBldmVudCUyMHZlbnVlJTIwZGFyayUyMG1vb2R5JTIwYXRtb3NwaGVyaWMlMjBsaWdodHN8ZW58MXx8fHwxNzc2NjM4NjU3fDA&ixlib=rb-4.1.0&q=80&w=1080';
const PHOTO_1 = 'https://images.unsplash.com/photo-1758764340872-7c07d883227f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHdvbWFuJTIwY2FzdWFsJTIwc3RyZWV0JTIwc3R5bGUlMjB1cmJhbiUyMHBvcnRyYWl0JTIwY2FuZGlkfGVufDF8fHx8MTc3NjYzODY2MHww&ixlib=rb-4.1.0&q=80&w=1080';
const PHOTO_2 = 'https://images.unsplash.com/photo-1766038803021-88d7cccfa5a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyM29tYW4lMjBsYXVnaGluZyUyMGpveWZ1bCUyMG91dGRvb3IlMjByb29mdG9wJTIwZ29sZGVuJTIwaG91cnxlbnwwfHwwfDE3NzY2Mzg2NjB8MA&ixlib=rb-4.1.0&q=80&w=1080';
const PHOTO_3 = 'https://images.unsplash.com/photo-1643325299951-7bdb4de5843b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHRlY2hubyUyMHJhdmUlMjBjbHViJTIwbmVvbiUyMGxpZ2h0cyUyMGRhbmNlfGVufDF8fHx8MTc3NjYzODY2MHww&ixlib=rb-4.1.0&q=80&w=1080';

/* ── Vibe tags ────────────────────────────────────────────────── */
const tags = [
    { label: 'Techno', glow: true, color: 'purple' },
    { label: 'Night Owl', glow: false, color: 'blue' },
    { label: 'Raves', glow: true, color: 'purple' },
    { label: 'Drinks 🍸', glow: false, color: 'none' },
    { label: 'House Music', glow: true, color: 'blue' },
    { label: 'Early Mornings 🌅', glow: false, color: 'none' },
    { label: 'DJ Culture', glow: true, color: 'purple' },
    { label: 'Berlin', glow: false, color: 'none' },
    { label: 'Photography 📷', glow: false, color: 'none' },
    { label: 'Festivals', glow: true, color: 'blue' },
];

const tagStyles: Record<string, { bg: string; border: string; text: string; shadowColor?: string; shadowOpacity?: number; shadowRadius?: number; elevation?: number }> = {
    purple: { bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.45)', text: '#c4b5fd', shadowColor: '#8b5cf6', shadowOpacity: 0.25, shadowRadius: 10, elevation: 4 },
    blue: { bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.45)', text: '#93c5fd', shadowColor: '#3b82f6', shadowOpacity: 0.25, shadowRadius: 10, elevation: 4 },
    none: { bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)', text: 'rgba(255,255,255,0.65)' },
};

/* ── Animated Button Primitive ──────────────────────────── */
function AnimatedBtn({ onPress, style, children, scaleDownTo = 0.9 }: { onPress?: () => void; style?: any; children: React.ReactNode; scaleDownTo?: number }) {
    const scale = useSharedValue(1);
    const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

    return (
        <Animated.View style={animStyle}>
            <Pressable
                onPressIn={() => { scale.value = withTiming(scaleDownTo, { duration: 100 }); }}
                onPressOut={() => { scale.value = withTiming(1, { duration: 150 }); }}
                onPress={onPress}
                style={style}
            >
                {children}
            </Pressable>
        </Animated.View>
    );
}

/* ── Spotify track ──────────────────────────────────────────── */
function SpotifyCard() {
    const [playing, setPlaying] = useState(true);
    const progress = 38; // Static UI percentage in React Native version

    return (
        <View style={styles.spotifyCard}>
            <View className="flex-row items-center mb-3" style={{ gap: 12 }}>
                <View style={styles.spotifyAlbum}>
                    <ImageWithFallback source={ALBUM} alt="Album" style={{ width: '100%', height: '100%' }} />
                </View>
                <View className="flex-1 min-w-0">
                    <Text className="text-white text-sm font-semibold" numberOfLines={1}>Closer (Remastered)</Text>
                    <Text className="text-gray-500 text-xs mt-0.5" numberOfLines={1}>Nine Inch Nails</Text>
                </View>
                <View className="flex-row items-center flex-shrink-0" style={{ gap: 8 }}>
                    <AnimatedBtn
                        onPress={() => setPlaying(!playing)}
                        style={[
                            styles.spotifyPlayBtn,
                            playing ? styles.spotifyPlayBtnActive : styles.spotifyPlayBtnInactive,
                        ]}
                    >
                        {playing ? (
                            <View className="flex-row items-center" style={{ gap: 2 }}>
                                <View style={styles.equalizerBar1} />
                                <View style={styles.equalizerBar2} />
                            </View>
                        ) : (
                            <View style={styles.playArrow} />
                        )}
                    </AnimatedBtn>
                    <View style={styles.spotifyIconBox}>
                        <Ionicons name="musical-notes" size={14} color="#000" />
                    </View>
                </View>
            </View>
            <View className="flex-row items-center" style={{ gap: 8 }}>
                <Text style={styles.timeText}>1:43</Text>
                <View style={styles.progressBarBg}>
                    {/* Linear Gradient via expo */}
                    <LinearGradient
                        colors={['#1DB954', '#16a34a']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[StyleSheet.absoluteFillObject, { width: `${progress}%`, borderRadius: 999 }]}
                    />
                </View>
                <Text style={styles.timeText}>4:29</Text>
            </View>
        </View>
    );
}

/* ── Event ticket card ──────────────────────────────────────── */
function EventTicketCard() {
    return (
        <View style={styles.ticketCard}>
            <View style={{ height: 112, overflow: 'hidden' }}>
                <ImageWithFallback source={EVENT_IMG} alt="Boiler Room" style={{ width: '100%', height: '100%' }} />
                {/* Horizontal Gradient Overlay */}
                <LinearGradient
                    colors={['rgba(11,13,23,0.55)', 'rgba(11,13,23,0.1)', 'rgba(11,13,23,0.55)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={StyleSheet.absoluteFillObject}
                />
                {/* Bottom Shadow Gradient */}
                <LinearGradient
                    colors={['transparent', 'rgba(11,13,23,0.95)']}
                    style={StyleSheet.absoluteFillObject}
                />
                {/* LIVE badge */}
                <View style={styles.liveBadge}>
                    <Ionicons name="wifi" size={12} color="#60a5fa" />
                    <Text style={{ color: '#93c5fd', fontSize: 10, fontWeight: 'bold', letterSpacing: 0.8, marginLeft: 4 }}>LIVE</Text>
                </View>
            </View>
            {/* Cutout line */}
            <View className="flex-row items-center mx-4" style={{ height: 24, position: 'relative' }}>
                <View style={styles.dashedLine} />
                <View style={styles.ticketHole} />
                <View style={styles.dashedLine} />
            </View>
            <View className="px-4 pb-4">
                <View className="flex-row items-start justify-between mb-2">
                    <View>
                        <Text style={{ color: '#fff', fontSize: 15, fontWeight: 'bold' }}>Boiler Room Budapest</Text>
                        <Text style={{ color: '#6b7280', fontSize: 12, marginTop: 2 }}>Turbina Arts Center, Budapest</Text>
                    </View>
                    <View style={styles.goingBadge}>
                        <Text style={{ color: '#93c5fd', fontSize: 10, fontWeight: 'bold' }}>Going ✓</Text>
                    </View>
                </View>
                <View className="flex-row items-center" style={{ gap: 16 }}>
                    <View className="flex-row items-center" style={{ gap: 6 }}>
                        <Ionicons name="time" size={12} color="#4b5563" />
                        <Text style={{ color: '#9ca3af', fontSize: 12 }}>Friday, Apr 18</Text>
                    </View>
                    <View className="flex-row items-center" style={{ gap: 6 }}>
                        <Ionicons name="people" size={12} color="#4b5563" />
                        <Text style={{ color: '#9ca3af', fontSize: 12 }}>340 going</Text>
                    </View>
                    <View className="flex-row items-center" style={{ gap: 6 }}>
                        <Ionicons name="ticket" size={12} color="#4b5563" />
                        <Text style={{ color: '#9ca3af', fontSize: 12 }}>Free entry</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

/* ── 3-dot options menu ─────────────────────────────────────── */
function OptionsMenu({ onClose }: { onClose: () => void }) {
    const items = ['Report Profile', 'Block User', 'Share Profile', 'Unmatch'];
    const insets = useSafeAreaInsets();
    
    return (
        <Modal transparent animationType="fade">
            <View style={{ flex: 1 }}>
                <Pressable onPress={onClose} style={StyleSheet.absoluteFillObject} />
                <Animated.View
                    entering={FadeInUp.springify().stiffness(320).damping(25)}
                    exiting={FadeOutUp}
                    style={[styles.menuDropdown, { top: insets.top + 60 }]}
                >
                    {items.map((item, i) => (
                        <Pressable
                            key={item}
                            onPress={onClose}
                            style={[
                                styles.menuItem,
                                i < items.length - 1 && { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },
                            ]}
                        >
                            <Text style={{ 
                                fontSize: 15,
                                color: item === 'Report Profile' || item === 'Block User' ? '#f87171' : 'rgba(255,255,255,0.75)' 
                            }}>
                                {item}
                            </Text>
                        </Pressable>
                    ))}
                </Animated.View>
            </View>
        </Modal>
    );
}

/* ── Like Action Flash Overlay ─────────────────────────────────────── */
function ActionFlashOverlay({ type }: { type: 'pass' | 'like' | 'super' }) {
    // Generate different simulated radial glows using LinearGradients
    let colors = ['transparent', 'transparent'];
    if (type === 'pass') colors = ['rgba(239,68,68,0.4)', 'rgba(239,68,68,0.0)'];
    if (type === 'like') colors = ['rgba(34,197,94,0.4)', 'rgba(34,197,94,0.0)'];
    if (type === 'super') colors = ['rgba(168,85,247,0.4)', 'rgba(168,85,247,0.0)'];

    return (
        <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(550)}
            pointerEvents="none"
            style={StyleSheet.absoluteFillObject}
        >
            <LinearGradient
                colors={colors}
                start={{ x: type === 'pass' ? 0 : type === 'like' ? 1 : 0.5, y: 0.5 }}
                end={{ x: 0.5, y: 1 }}
                style={StyleSheet.absoluteFillObject}
            />
        </Animated.View>
    );
}


/* ── Main component ─────────────────────────────────────────── */
export default function ExpandedProfileScreen() {
    const navigation = useNavigation<any>();
    const insets = useSafeAreaInsets();
    
    const [menuOpen, setMenuOpen] = useState(false);
    const [liked, setLiked] = useState<null | 'pass' | 'like' | 'super'>(null);

    const handleAction = (action: 'pass' | 'like' | 'super') => {
        setLiked(action);
        setTimeout(() => navigation.goBack(), 600);
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#0B0D17' }}>
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 + insets.bottom }}>
                
                {/* Hero Section */}
                <View style={{ height: 520, position: 'relative' }}>
                    <ImageWithFallback source={HERO} alt="Citra" style={{ width: '100%', height: '100%' }} />
                    <LinearGradient
                        colors={['rgba(11,13,23,0.55)', 'transparent', 'transparent', 'rgba(11,13,23,0.6)', 'rgba(11,13,23,0.98)']}
                        locations={[0, 0.28, 0.5, 0.72, 1]}
                        style={StyleSheet.absoluteFillObject}
                        pointerEvents="none"
                    />

                    {/* Top Buttons */}
                    <View style={[styles.heroTopBar, { top: Math.max(insets.top, 20) }]}>
                        <AnimatedBtn onPress={() => navigation.goBack()} style={styles.iconBtn}>
                            <Ionicons name="arrow-back" size={20} color="#fff" />
                        </AnimatedBtn>
                        <AnimatedBtn onPress={() => setMenuOpen(true)} style={styles.iconBtn}>
                            <Ionicons name="ellipsis-horizontal" size={20} color="#fff" />
                        </AnimatedBtn>
                    </View>

                    {/* User Info Overlay */}
                    <View style={styles.heroInfoBlock}>
                        <View className="flex-row items-center mb-1" style={{ gap: 10 }}>
                            <Text style={styles.heroName}>Citra, 23</Text>
                            <View style={styles.verifiedBadgeContainer}>
                                <LinearGradient
                                    colors={['#2563eb', '#60a5fa']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={StyleSheet.absoluteFillObject}
                                />
                                <Text style={{ color: '#fff', fontSize: 10, fontWeight: '900' }}>✓</Text>
                            </View>
                        </View>
                        <View className="flex-row items-center">
                            <Ionicons name="location" size={14} color="#9ca3af" />
                            <Text style={{ color: '#d1d5db', fontSize: 14, marginLeft: 4 }}>2.5 km away</Text>
                            <Text style={{ color: '#4b5563', marginHorizontal: 6 }}>·</Text>
                            <View style={styles.onlineDotIndicator} />
                            <Text style={{ color: '#4ade80', fontSize: 14, marginLeft: 6 }}>Online now</Text>
                        </View>
                    </View>

                    {/* Action Buttons (Pass, Super, Like) */}
                    <View style={styles.actionButtonsRow}>
                        <AnimatedBtn 
                            onPress={() => handleAction('pass')}
                            style={[
                                styles.actionBtn,
                                { width: 64, height: 64, borderRadius: 32 },
                                { backgroundColor: liked === 'pass' ? 'rgba(239,68,68,0.4)' : 'rgba(239,68,68,0.12)', borderColor: 'rgba(239,68,68,0.45)' }
                            ]}
                        >
                            <Ionicons name="close" size={32} color="#f87171" />
                        </AnimatedBtn>
                        <AnimatedBtn 
                            onPress={() => handleAction('super')}
                            style={[
                                styles.actionBtn,
                                { width: 48, height: 48, borderRadius: 24, marginTop: 12 },
                                { backgroundColor: liked === 'super' ? 'rgba(168,85,247,0.5)' : 'rgba(168,85,247,0.15)', borderColor: 'rgba(168,85,247,0.5)' }
                            ]}
                        >
                            <Ionicons name="star" size={22} color="#d8b4fe" />
                        </AnimatedBtn>
                        <AnimatedBtn 
                            onPress={() => handleAction('like')}
                            style={[
                                styles.actionBtn,
                                { width: 64, height: 64, borderRadius: 32 },
                                { backgroundColor: liked === 'like' ? 'rgba(34,197,94,0.4)' : 'rgba(34,197,94,0.12)', borderColor: 'rgba(34,197,94,0.45)' }
                            ]}
                        >
                            <Ionicons name="heart" size={32} color="#4ade80" />
                        </AnimatedBtn>
                    </View>
                </View>

                {/* Content Sections */}
                <View style={{ paddingHorizontal: 20, paddingTop: 56, paddingBottom: 32 }}>
                    
                    {/* About Me */}
                    <View style={styles.sectionMb}>
                        <Text style={styles.sectionTitle}>About Me</Text>
                        <Text style={styles.bodyText}>
                            Chasing the 4AM feeling in basements, warehouses & rooftops. Into deep kicks, sharp hi-hats, and cold drinks. If you know Boiler Room, you already know me. Always down to discover new sounds, new cities, and new people who dance with their eyes closed. 🖤
                        </Text>
                    </View>

                    {/* My Vibe */}
                    <View style={styles.sectionMb}>
                        <Text style={styles.sectionTitle}>My Vibe</Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                            {tags.map((tag) => {
                                const styleDef = tagStyles[tag.glow ? tag.color : 'none'];
                                return (
                                    <View 
                                        key={tag.label} 
                                        style={[
                                            styles.tagPill, 
                                            { 
                                                backgroundColor: styleDef.bg, 
                                                borderColor: styleDef.border,
                                                shadowColor: styleDef.shadowColor,
                                                shadowOpacity: styleDef.shadowOpacity,
                                                shadowRadius: styleDef.shadowRadius,
                                                elevation: styleDef.elevation
                                            }
                                        ]}
                                    >
                                        <Text style={{ color: styleDef.text, fontSize: 12, fontWeight: '500' }}>{tag.label}</Text>
                                    </View>
                                );
                            })}
                        </View>
                    </View>

                    {/* Spotify Anthem */}
                    <View style={styles.sectionMb}>
                        <View className="flex-row items-center mb-3">
                            <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>Spotify Anthem</Text>
                            <Text style={{ fontSize: 12, color: '#4b5563', marginLeft: 8 }}>— Citra's vibe rn</Text>
                        </View>
                        <SpotifyCard />
                    </View>

                    {/* Going to... */}
                    <View style={styles.sectionMb}>
                        <View className="flex-row items-center mb-3">
                            <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>Going to...</Text>
                            <View style={styles.eventCountBadge}>
                                <Text style={{ color: '#60a5fa', fontSize: 10, fontWeight: '600' }}>1 event</Text>
                            </View>
                        </View>
                        <EventTicketCard />
                    </View>

                    {/* More Photos */}
                    <View>
                        <Text style={styles.sectionTitle}>More Photos</Text>
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            {[PHOTO_1, PHOTO_2, PHOTO_3].map((src, i) => (
                                <View key={i} style={styles.photoGridItem}>
                                    <ImageWithFallback source={src} alt={`Photo ${i + 1}`} style={{ width: '100%', height: '100%' }} />
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
            </ScrollView>

            {menuOpen && <OptionsMenu onClose={() => setMenuOpen(false)} />}
            {liked && <ActionFlashOverlay type={liked} />}
        </View>
    );
}

/* ── Styles ─────────────────────────────────────────────────── */
const styles = StyleSheet.create({
    heroTopBar: {
        position: 'absolute',
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        zIndex: 10,
    },
    iconBtn: {
        width: 40,
        height: 40,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.35)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
    },
    heroInfoBlock: {
        position: 'absolute',
        bottom: 56, // above action buttons
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        zIndex: 10,
    },
    heroName: {
        color: '#fff',
        fontSize: 32,
        fontWeight: '800',
        lineHeight: 38,
        textShadowColor: 'rgba(0,0,0,0.6)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 8,
    },
    verifiedBadgeContainer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.7,
        shadowRadius: 10,
        elevation: 5,
    },
    onlineDotIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#22c55e',
        shadowColor: '#22c55e',
        shadowOpacity: 0.9,
        shadowRadius: 6,
        elevation: 3,
    },
    actionButtonsRow: {
        position: 'absolute',
        bottom: -28, // Offset out of the hero box
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 24,
        zIndex: 20,
    },
    actionBtn: {
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sectionMb: {
        marginBottom: 24,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    bodyText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 13.5,
        lineHeight: 22,
    },
    tagPill: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
        borderWidth: 1,
    },
    // Spotify Card
    spotifyCard: {
        borderRadius: 24,
        padding: 16,
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    spotifyAlbum: {
        width: 48,
        height: 48,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    spotifyPlayBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    spotifyPlayBtnActive: {
        backgroundColor: 'rgba(30,215,96,0.2)',
        borderColor: 'rgba(30,215,96,0.4)',
        shadowColor: '#1DB954',
        shadowOpacity: 0.35,
        shadowRadius: 10,
    },
    spotifyPlayBtnInactive: {
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderColor: 'rgba(255,255,255,0.1)',
    },
    playArrow: {
        width: 0,
        height: 0,
        marginLeft: 2,
        borderTopWidth: 5,
        borderBottomWidth: 5,
        borderLeftWidth: 8,
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
        borderLeftColor: 'rgba(255,255,255,0.7)',
    },
    equalizerBar1: {
        width: 3,
        height: 10,
        borderRadius: 2,
        backgroundColor: '#4ade80',
    },
    equalizerBar2: {
        width: 3,
        height: 8,
        borderRadius: 2,
        backgroundColor: '#4ade80',
    },
    spotifyIconBox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#1DB954',
        alignItems: 'center',
        justifyContent: 'center',
    },
    timeText: {
        color: '#4b5563',
        fontSize: 9,
    },
    progressBarBg: {
        flex: 1,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(255,255,255,0.1)',
        position: 'relative',
    },
    // Event Ticket Card
    eventCountBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 999,
        backgroundColor: 'rgba(59,130,246,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(59,130,246,0.25)',
        marginLeft: 8,
    },
    ticketCard: {
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        shadowColor: '#3b82f6',
        shadowOpacity: 0.1,
        shadowRadius: 28,
        elevation: 3,
        overflow: 'hidden',
    },
    liveBadge: {
        position: 'absolute',
        top: 10,
        right: 12,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: 'rgba(59,130,246,0.2)',
        borderWidth: 1,
        borderColor: 'rgba(59,130,246,0.4)',
    },
    dashedLine: {
        flex: 1,
        height: 1,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        borderStyle: 'dashed',
    },
    ticketHole: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#0B0D17',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        marginHorizontal: 8,
    },
    goingBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: 'rgba(59,130,246,0.12)',
        borderWidth: 1,
        borderColor: 'rgba(59,130,246,0.3)',
    },
    // More Photos
    photoGridItem: {
        flex: 1,
        height: 110,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    // Menu Dropdown
    menuDropdown: {
        position: 'absolute',
        right: 16,
        width: 160,
        borderRadius: 16,
        backgroundColor: 'rgba(18,22,40,0.95)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.6,
        shadowRadius: 32,
        elevation: 10,
    },
    menuItem: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
});
