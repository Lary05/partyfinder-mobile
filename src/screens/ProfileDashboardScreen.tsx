// src/screens/ProfileDashboardScreen.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    Pressable,
    StyleSheet,
    Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Svg, Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    SlideInRight,
    SlideOutRight,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { ImageWithFallback } from '../components/ui/ImageWithFallback';

const RAMA_AVATAR = "https://images.unsplash.com/photo-1769142899668-5816cf1d920a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMG1hbiUyMGF2YXRhciUyMHByb2ZpbGUlMjBwaG90b3xlbnwxfHx8fDE3NzYyOTI0NzR8MA&ixlib=rb-4.1.0&q=80&w=1080";

/* ── Animated Button Primitive ──────────────────────────── */
function AnimatedBtn({ onPress, style, children, scaleDownTo = 0.92, ...rest }: any) {
    const scale = useSharedValue(1);
    const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

    return (
        <Animated.View style={animStyle}>
            <Pressable
                onPressIn={() => { scale.value = withTiming(scaleDownTo, { duration: 100 }); }}
                onPressOut={() => { scale.value = withTiming(1, { duration: 150 }); }}
                onPress={onPress}
                style={style}
                {...rest}
            >
                {children}
            </Pressable>
        </Animated.View>
    );
}

/* ── Progress Ring ──────────────────────────── */
function ProgressRing({ percent, radius = 52, stroke = 3.5 }: { percent: number; radius?: number; stroke?: number }) {
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - percent / 100);
    const size = (radius + stroke + 4) * 2;

    return (
        <View style={[StyleSheet.absoluteFillObject, { alignItems: 'center', justifyContent: 'center' }]}>
            <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
                <Defs>
                    <SvgLinearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <Stop offset="0%" stopColor="#3b82f6" />
                        <Stop offset="50%" stopColor="#8b5cf6" />
                        <Stop offset="100%" stopColor="#f59e0b" />
                    </SvgLinearGradient>
                </Defs>
                <Circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={stroke} />
                <Circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="url(#ringGrad)" strokeWidth={stroke} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
            </Svg>
        </View>
    );
}

/* ── Stat Pill ──────────────────────────── */
function StatPill({ icon, value, label, color }: { icon: any; value: string; label: string; color: string }) {
    return (
        <View style={styles.statPill}>
            <Ionicons name={icon} size={16} color={color} />
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', marginTop: 4 }}>{value}</Text>
            <Text style={{ color: '#4b5563', fontSize: 10, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 2 }}>{label}</Text>
        </View>
    );
}

/* ── Settings Drawer ──────────────────────────── */
function SettingsDrawer({ onClose }: { onClose: () => void }) {
    const insets = useSafeAreaInsets();
    const [notifications, setNotifications] = useState(true);
    const [hideStatus, setHideStatus] = useState(false);
    const [discoverable, setDiscoverable] = useState(true);

    const items = [
        { label: "Push Notifications", desc: "Matches, messages, events", value: notifications, toggle: () => setNotifications((v) => !v) },
        { label: "Hide Active Status", desc: "Others won't see you online", value: hideStatus, toggle: () => setHideStatus((v) => !v) },
        { label: "Discoverable", desc: "Appear in other users' feeds", value: discoverable, toggle: () => setDiscoverable((v) => !v) },
    ];

    return (
        <Animated.View
            entering={SlideInRight.springify().stiffness(320).damping(30)}
            exiting={SlideOutRight}
            style={[StyleSheet.absoluteFillObject, { backgroundColor: '#0B0D17', zIndex: 100, paddingTop: insets.top, paddingBottom: insets.bottom }]}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 28, paddingBottom: 16 }}>
                <Text style={{ color: '#fff', fontSize: 22, fontWeight: 'bold' }}>Settings</Text>
                <AnimatedBtn onPress={onClose} style={styles.iconBtn}>
                    <Ionicons name="close" size={16} color="#9ca3af" />
                </AnimatedBtn>
            </View>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}>
                <View style={styles.settingsGroup}>
                    {items.map((item, i) => (
                        <View key={item.label} style={[styles.settingsRow, i < items.length - 1 && { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' }]}>
                            <View>
                                <Text style={{ color: '#fff', fontSize: 14, fontWeight: '500' }}>{item.label}</Text>
                                <Text style={{ color: '#6b7280', fontSize: 12, marginTop: 2 }}>{item.desc}</Text>
                            </View>
                            <Switch value={item.value} onValueChange={item.toggle} trackColor={{ false: 'rgba(255,255,255,0.1)', true: '#3b82f6' }} />
                        </View>
                    ))}
                </View>
                {['Account & Security', 'Blocked Users', 'Delete Account'].map((label) => (
                    <Pressable key={label} style={[styles.settingsListBtn, { marginTop: 10 }]}>
                        <Text style={{ fontSize: 14, fontWeight: '500', color: label === 'Delete Account' ? '#f87171' : 'rgba(255,255,255,0.75)' }}>{label}</Text>
                        <Ionicons name="chevron-forward" size={16} color="#4b5563" />
                    </Pressable>
                ))}
            </ScrollView>
        </Animated.View>
    );
}

/* ── List Item (Tags, Anthem, etc.) ──────────────────────────── */
function ListItem({ icon, iconColor, iconBg, label, right, glow, onClick }: { icon: any; iconColor: string; iconBg: string; label: string; right: React.ReactNode; glow?: string; onClick?: () => void }) {
    return (
        <AnimatedBtn
            onPress={onClick}
            scaleDownTo={0.985}
            style={[
                styles.listItem,
                glow ? { borderColor: glow, shadowColor: glow, shadowOpacity: 0.25, shadowRadius: 16, elevation: 4 } : {}
            ]}
        >
            <View style={[styles.listItemIconBox, { backgroundColor: iconBg }]}>
                <Ionicons name={icon} size={16} color={iconColor} />
            </View>
            <Text style={{ flex: 1, color: '#fff', fontSize: 14, fontWeight: '500' }}>{label}</Text>
            {right}
        </AnimatedBtn>
    );
}

/* ── Main Dashboard Screen ──────────────────────────── */
export default function ProfileDashboardScreen() {
    const navigation = useNavigation<any>();
    const insets = useSafeAreaInsets();
    const [showSettings, setShowSettings] = useState(false);

    const completeness = 85;
    const vibeTagColors = [
        { label: 'Techno', color: '#c084fc' },
        { label: 'Night Owl', color: '#60a5fa' },
        { label: 'Raves', color: '#a78bfa' },
    ];

    // Mock payload to navigate to ExpandedProfile with
    const handlePreview = () => {
        navigation.navigate('ExpandedProfile', { 
            user: { 
                name: 'Rama', 
                age: 24, 
                avatar: RAMA_AVATAR, 
                distance: 'Bandung, Indonesia' 
            } 
        });
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#0B0D17' }}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingTop: insets.top + 28, paddingBottom: 10 + insets.bottom + 76 }}>
                
                {/* Header Row */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <Text style={{ color: '#fff', fontSize: 24, fontWeight: '800', letterSpacing: -0.5 }}>My Profile</Text>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                        <AnimatedBtn style={styles.iconBtn}>
                            <Ionicons name="notifications-outline" size={16} color="#9ca3af" />
                        </AnimatedBtn>
                        <AnimatedBtn onPress={() => setShowSettings(true)} style={styles.iconBtn}>
                            <Ionicons name="settings-outline" size={16} color="#9ca3af" />
                        </AnimatedBtn>
                    </View>
                </View>

                {/* Avatar & Progress Info */}
                <View style={{ alignItems: 'center', marginBottom: 20 }}>
                    <View style={{ position: 'relative', width: 120, height: 120, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                        <ProgressRing percent={completeness} radius={52} stroke={3.5} />
                        <View style={styles.avatarContainer}>
                            <ImageWithFallback source={RAMA_AVATAR} alt="Rama" style={{ width: '100%', height: '100%' }} />
                        </View>
                        <View style={styles.percentBadge}>
                            <View style={styles.percentDot} />
                            <Text style={{ color: '#fbbf24', fontSize: 9, fontWeight: 'bold' }}>{completeness}% Complete</Text>
                        </View>
                    </View>
                    <Text style={{ color: '#fff', fontSize: 22, fontWeight: '800', letterSpacing: -0.4 }}>Rama, 24</Text>
                    <Text style={{ color: '#4b5563', fontSize: 14, marginTop: 2 }}>@rama.beats</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 6 }}>
                        <Ionicons name="location" size={12} color="#60a5fa" />
                        <Text style={{ color: '#6b7280', fontSize: 12 }}>Bandung, Indonesia</Text>
                    </View>
                </View>

                {/* Stat Pills */}
                <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
                    <StatPill icon="heart" value="142" label="Likes" color="#f87171" />
                    <StatPill icon="flash-outline" value="38" label="Matches" color="#60a5fa" />
                    <StatPill icon="star" value="7" label="Super Likes" color="#c084fc" />
                </View>

                {/* Action Row */}
                <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
                    <AnimatedBtn onPress={() => setShowSettings(true)} style={[styles.actionBtnBlock, { flex: 1 }]} scaleDownTo={0.94}>
                        <Ionicons name="options-outline" size={20} color="#9ca3af" />
                        <Text style={{ color: '#9ca3af', fontSize: 12, fontWeight: '500', marginTop: 8 }}>Settings</Text>
                    </AnimatedBtn>

                    {/* Edit Profile (Gradient) */}
                    <AnimatedBtn style={[styles.actionBtnBlockGlow, { flex: 1.6 }]} scaleDownTo={0.94}>
                        <LinearGradient
                            colors={['rgba(59,130,246,0.18)', 'rgba(139,92,246,0.18)']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={StyleSheet.absoluteFillObject}
                        />
                        <View style={styles.editIconBox}>
                            <LinearGradient
                                colors={['#3b82f6', '#8b5cf6']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={StyleSheet.absoluteFillObject}
                            />
                            <Ionicons name="pencil" size={16} color="#fff" />
                        </View>
                        <Text style={{ color: '#93c5fd', fontSize: 12, fontWeight: 'bold' }}>Edit Profile</Text>
                    </AnimatedBtn>

                    <AnimatedBtn onPress={handlePreview} style={[styles.actionBtnBlock, { flex: 1 }]} scaleDownTo={0.94}>
                        <Ionicons name="eye-outline" size={20} color="#9ca3af" />
                        <Text style={{ color: '#9ca3af', fontSize: 12, fontWeight: '500', marginTop: 8 }}>Preview</Text>
                    </AnimatedBtn>
                </View>

                {/* PRO Upgrade Card */}
                <AnimatedBtn style={styles.proUpgradeCard} scaleDownTo={0.98}>
                    <LinearGradient
                        colors={['rgba(245,158,11,0.08)', 'rgba(168,85,247,0.1)', 'rgba(59,130,246,0.08)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={StyleSheet.absoluteFillObject}
                    />
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
                            <View style={styles.proCrownBox}>
                                <LinearGradient
                                    colors={['rgba(245,158,11,0.25)', 'rgba(168,85,247,0.2)']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={StyleSheet.absoluteFillObject}
                                />
                                <Ionicons name="star" size={20} color="#fbbf24" />
                            </View>
                            <View>
                                <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>Get PartyFinder PRO ✨</Text>
                                <Text style={{ color: '#9ca3af', fontSize: 12, marginTop: 2, maxWidth: 180, lineHeight: 18 }}>See who liked you, unlimited swipes & hide active status.</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.proUpgradeBtn}>
                        <LinearGradient
                            colors={['rgba(245,158,11,0.25)', 'rgba(168,85,247,0.25)']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={StyleSheet.absoluteFillObject}
                        />
                        <Ionicons name="star" size={16} color="#fbbf24" />
                        <Text style={{ color: '#fde68a', fontSize: 14, fontWeight: 'bold', marginLeft: 8 }}>Upgrade Now — $9.99/mo</Text>
                    </View>
                </AnimatedBtn>

                {/* Quick Edit List */}
                <Text style={{ color: '#4b5563', fontSize: 12, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 1, paddingHorizontal: 4, marginBottom: 8 }}>Quick Edit</Text>
                
                <View style={{ gap: 10, marginBottom: 12 }}>
                    <ListItem 
                        icon="pricetag-outline" iconColor="#c084fc" iconBg="rgba(192,132,252,0.15)" label="My Vibe Tags" 
                        right={
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                {vibeTagColors.map((t) => (
                                    <View key={t.label} style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999, borderWidth: 1, borderColor: `${t.color}50`, backgroundColor: `${t.color}15` }}>
                                        <Text style={{ color: t.color, fontSize: 9, fontWeight: '600' }}>{t.label}</Text>
                                    </View>
                                ))}
                                <Ionicons name="chevron-forward" size={16} color="#374151" />
                            </View>
                        } 
                    />
                    <ListItem 
                        icon="musical-notes" iconColor="#1DB954" iconBg="rgba(29,185,84,0.12)" label="Spotify Anthem" glow="rgba(29,185,84,0.25)"
                        right={
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                <View style={{ alignItems: 'flex-end' }}>
                                    <Text style={{ color: '#9ca3af', fontSize: 10, fontWeight: '500' }}>Closer</Text>
                                    <Text style={{ color: '#4b5563', fontSize: 9 }}>NIN</Text>
                                </View>
                                <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#1DB954', alignItems: 'center', justifyContent: 'center' }}>
                                    <Ionicons name="musical-notes" size={10} color="#000" />
                                </View>
                                <Ionicons name="chevron-forward" size={16} color="#374151" />
                            </View>
                        } 
                    />
                    <ListItem 
                        icon="shield-checkmark-outline" iconColor="#60a5fa" iconBg="rgba(96,165,250,0.12)" label="Safety & Privacy" 
                        right={
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                <View style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(34,197,94,0.3)', backgroundColor: 'rgba(34,197,94,0.1)' }}>
                                    <Text style={{ color: '#4ade80', fontSize: 9, fontWeight: '600' }}>Secure</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={16} color="#374151" />
                            </View>
                        } 
                    />
                    <ListItem 
                        icon="notifications-outline" iconColor="#f59e0b" iconBg="rgba(245,158,11,0.12)" label="Notifications" 
                        right={
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#f59e0b', shadowColor: '#f59e0b', shadowOpacity: 0.8, shadowRadius: 6, elevation: 2 }} />
                                <Text style={{ color: '#fbbf24', fontSize: 10, fontWeight: '500' }}>3 new</Text>
                                <Ionicons name="chevron-forward" size={16} color="#374151" />
                            </View>
                        } 
                    />
                </View>

                {/* Log Out */}
                <AnimatedBtn style={styles.logoutBtn}>
                    <Ionicons name="close" size={16} color="rgba(248,113,113,0.85)" />
                    <Text style={{ color: 'rgba(248,113,113,0.85)', fontSize: 14, fontWeight: '600', marginLeft: 8 }}>Log Out</Text>
                </AnimatedBtn>

            </ScrollView>

            {/* Settings Drawer overlay */}
            {showSettings && <SettingsDrawer onClose={() => setShowSettings(false)} />}
        </View>
    );
}

const styles = StyleSheet.create({
    iconBtn: {
        width: 36,
        height: 36,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.09)',
    },
    avatarContainer: {
        width: 104,
        height: 104,
        borderRadius: 52,
        overflow: 'hidden',
        borderWidth: 3,
        borderColor: 'rgba(255,255,255,0.08)',
        zIndex: 10,
        backgroundColor: '#1f2937',
    },
    percentBadge: {
        position: 'absolute',
        bottom: -4,
        zIndex: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 999,
        backgroundColor: 'rgba(11,13,23,0.9)',
        borderWidth: 1,
        borderColor: 'rgba(245,158,11,0.45)',
        shadowColor: '#f59e0b',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 4,
    },
    percentDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#f59e0b',
        shadowColor: '#f59e0b',
        shadowOpacity: 0.9,
        shadowRadius: 5,
    },
    statPill: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 12,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.07)',
    },
    actionBtnBlock: {
        alignItems: 'center',
        paddingVertical: 14,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.09)',
    },
    actionBtnBlockGlow: {
        alignItems: 'center',
        paddingVertical: 14,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(99,102,241,0.4)',
        overflow: 'hidden',
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 24,
        elevation: 6,
    },
    editIconBox: {
        width: 32,
        height: 32,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        marginBottom: 8,
    },
    proUpgradeCard: {
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(245,158,11,0.35)',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 16,
        marginBottom: 16,
        shadowColor: '#f59e0b',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 32,
        elevation: 5,
    },
    proCrownBox: {
        width: 44,
        height: 44,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(245,158,11,0.4)',
    },
    proUpgradeBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 14,
        paddingVertical: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(245,158,11,0.45)',
        overflow: 'hidden',
        shadowColor: '#f59e0b',
        shadowOpacity: 0.2,
        shadowRadius: 20,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 24,
        borderWidth: 1,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderColor: 'rgba(255,255,255,0.07)',
    },
    listItemIconBox: {
        width: 36,
        height: 36,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingVertical: 14,
        borderRadius: 24,
        borderWidth: 1,
        backgroundColor: 'rgba(239,68,68,0.06)',
        borderColor: 'rgba(239,68,68,0.2)',
        marginTop: 4,
    },
    // Settings Drawer styles
    settingsGroup: {
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.07)',
        backgroundColor: 'rgba(255,255,255,0.03)',
        overflow: 'hidden',
        marginBottom: 16,
    },
    settingsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    settingsListBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.07)',
        backgroundColor: 'rgba(255,255,255,0.03)',
    },
});
