// src/screens/SearchScreen.tsx
// Party Browsing Screen — Map + Draggable Bottom Sheet
// Transpiled from Web (framer-motion, lucide-react, SVG) → React Native
// Uses: NativeWind v4, Reanimated, react-native-gesture-handler, react-native-svg

import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Pressable,
    Dimensions,
    StyleSheet,
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    runOnJS,
    interpolate,
    Extrapolation,
} from 'react-native-reanimated';
import {
    GestureDetector,
    Gesture,
} from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    Svg,
    Rect,
    Path,
    Ellipse,
    Defs,
    RadialGradient,
    Stop,
    Pattern,
    Line,
    Circle,
    Text as SvgText,
} from 'react-native-svg';
import { ImageWithFallback } from '../components/ui/ImageWithFallback';

// ─── Theme constants ────────────────────────────────────────────────────────
const T = '#0DD3C5';
const T_GLOW = 'rgba(13,211,197,0.38)';
const T_BORDER = 'rgba(13,211,197,0.45)';
const T_BG = 'rgba(13,211,197,0.10)';
const T_DARK = 'rgba(13,211,197,0.07)';

// ─── Image URLs ─────────────────────────────────────────────────────────────
const IMG_CONCERT = 'https://images.unsplash.com/photo-1763854492868-a0679273ccfe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcm93ZGVkJTIwaW5kb29yJTIwY29uY2VydCUyMHZlbnVlJTIwc3RhZ2UlMjBsaWdodHMlMjByYXZlJTIwcGFydHl8ZW58MXx8fHwxNzc2ODA3NzEwfDA&ixlib=rb-4.1.0&q=80&w=1080';
const IMG_ROOFTOP = 'https://images.unsplash.com/photo-1684285746670-3d2eeed72192?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb29mdG9wJTIwYmFyJTIwb3V0ZG9vciUyMHRlcnJhY2UlMjBuaWdodCUyMGNpdHklMjBsaWdodHMlMjBwYXJ0eXxlbnwxfHx8fDE3NzY4MDc3MTF8MA&ixlib=rb-4.1.0&q=80&w=1080';
const IMG_COURTYARD = 'https://images.unsplash.com/photo-1773591015438-be9940ea7d28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdXRkb29yJTIwY291cnR5YXJkJTIwYmFyJTIwcGVvcGxlJTIwZHJpbmtpbmclMjBuaWdodCUyMHVyYmFufGVufDF8fHx8MTc3NjgwNzcxMnww&ixlib=rb-4.1.0&q=80&w=1080';
const IMG_CLUB = 'https://images.unsplash.com/photo-1768885514740-d64d25ac9a64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbHViJTIwZGFyayUyMG5lb24lMjBsaWdodCUyMGRhbmNlJTIwcGFydHklMjBjcm93ZCUyMGVsZWN0cm9uaWMlMjBtdXNpY3xlbnwxfHx8fDE3NzY4MDc3MTZ8MA&ixlib=rb-4.1.0&q=80&w=1080';
const IMG_BAR = 'https://images.unsplash.com/photo-1637082365288-3469a20499ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmVuZHklMjBiYXIlMjBkYXJrJTIwaW50ZXJpb3IlMjBuZW9uJTIwc2lnbnMlMjBjb2NrdGFpbCUyMG5pZ2h0fGVufDF8fHx8MTc3NjgwNzcxNnww&ixlib=rb-4.1.0&q=80&w=1080';

// ─── Panel dimensions ────────────────────────────────────────────────────────
const SCREEN_HEIGHT = Dimensions.get('window').height;
const PANEL_HEIGHT = 660;
const PANEL_PEEK = 320;
const PANEL_PEEK_Y = PANEL_HEIGHT - PANEL_PEEK; // collapsed offset = 340
const PANEL_EXPANDED_Y = 0;                      // fully expanded offset = 0

// ─── Data types & seed data ──────────────────────────────────────────────────
interface Party {
    id: number;
    name: string;
    fullName: string;
    interested: number;
    distance: string;
    time: string;
    tags: string[];
    image: string;
    mapX: number;
    mapY: number;
    highlight?: boolean;
}

const PARTIES: Party[] = [
    { id: 1, name: 'Akvárium', fullName: 'Akvárium Klub - Nagyterem', interested: 500, distance: '1.2 km', time: '22:00', tags: ['Techno', 'Live'], image: IMG_CONCERT, mapX: 146, mapY: 196, highlight: true },
    { id: 2, name: 'Ötkert', fullName: 'Ötkert', interested: 342, distance: '0.8 km', time: '20:00', tags: ['Bar', 'Open Air'], image: IMG_ROOFTOP, mapX: 104, mapY: 163 },
    { id: 3, name: 'Pontoon', fullName: 'Pontoon Club', interested: 218, distance: '2.1 km', time: '23:00', tags: ['House', 'Duna'], image: IMG_COURTYARD, mapX: 308, mapY: 262 },
    { id: 4, name: 'Gozsdurk', fullName: 'Gozsdu Udvar', interested: 156, distance: '0.5 km', time: '19:00', tags: ['Ruin Bar', 'Mix'], image: IMG_CLUB, mapX: 228, mapY: 186 },
    { id: 5, name: 'Lyina', fullName: 'Lyina Bar', interested: 89, distance: '1.5 km', time: '21:00', tags: ['Cocktails', 'DJ'], image: IMG_BAR, mapX: 268, mapY: 218 },
    { id: 6, name: 'Tütü', fullName: 'Tütü Bar', interested: 67, distance: '0.9 km', time: '22:30', tags: ['Indie', 'Terasz'], image: IMG_ROOFTOP, mapX: 181, mapY: 242 },
];

// ─── Budapest Map SVG (react-native-svg, no filters) ─────────────────────────
function BudapestMapSVG() {
    const hStripes = [96, 140, 176, 210, 241, 267, 328, 362, 402, 440];
    const vStripes = [97, 138, 177, 220, 261, 301, 340, 375];

    return (
        <Svg viewBox="0 0 390 480" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
            <Defs>
                <RadialGradient id="userGlow" cx="50%" cy="50%" r="50%">
                    <Stop offset="0%" stopColor={T} stopOpacity={0.45} />
                    <Stop offset="100%" stopColor={T} stopOpacity={0} />
                </RadialGradient>
                <RadialGradient id="akvGlow" cx="50%" cy="50%" r="50%">
                    <Stop offset="0%" stopColor={T} stopOpacity={0.12} />
                    <Stop offset="100%" stopColor={T} stopOpacity={0} />
                </RadialGradient>
                <Pattern id="blockPattern" x="0" y="0" width="42" height="42" patternUnits="userSpaceOnUse">
                    <Rect width="42" height="42" fill="#070B1E" />
                    <Rect width="40" height="40" fill="#080D20" />
                </Pattern>
            </Defs>

            {/* Base fill */}
            <Rect width="390" height="480" fill="#06091A" />
            <Rect width="390" height="480" fill="url(#blockPattern)" opacity={0.6} />

            {/* Edge columns */}
            <Rect x="358" y="0" width="32" height="480" fill="#060D22" />
            <Rect x="370" y="0" width="20" height="480" fill="#060A1E" />
            <Rect x="58" y="0" width="10" height="480" fill="#152844" />

            {/* River / tram line */}
            <Rect x="0" y="298" width="390" height="11" fill="#152844" />
            <Line x1="58" y1="204" x2="390" y2="16" stroke="#122038" strokeWidth="9" />
            <Path d="M132 0 Q128 55 126 110 Q122 165 121 204 Q120 250 127 298 Q132 335 135 370 L135 480" stroke="#122038" strokeWidth="7" fill="none" />

            {/* Horizontal street grid */}
            {hStripes.map((y) => (
                <Rect key={`h${y}`} x="0" y={y} width="390" height={y < 270 ? 5 : 4} fill="#0D1C35" />
            ))}
            {/* Vertical street grid */}
            {vStripes.map((x) => (
                <Rect key={`v${x}`} x={x} y="0" width={x < 260 ? 5 : 4} height="480" fill="#0D1C35" />
            ))}

            {/* Park / green zone */}
            <Ellipse cx="83" cy="201" rx="34" ry="27" fill="#091710" />
            <Ellipse cx="83" cy="201" rx="27" ry="21" fill="#0A1C12" />
            <Ellipse cx="83" cy="201" rx="18" ry="14" fill="#0B2015" />

            {/* Landmarks blocks */}
            <Rect x="160" y="250" width="28" height="20" rx="4" fill="#091710" />
            <Rect x="287" y="163" width="24" height="18" rx="4" fill="#091710" />
            <Rect x="232" y="365" width="30" height="22" rx="4" fill="#091710" />

            {/* Akvárium glow halo */}
            <Ellipse cx="146" cy="196" rx="55" ry="42" fill="url(#akvGlow)" />

            {/* Dashed overlays */}
            <Line x1="58" y1="204" x2="390" y2="16" stroke="#1A2A08" strokeWidth="2.5" strokeDasharray="5,7" opacity={0.55} />
            <Line x1="0" y1="303" x2="390" y2="303" stroke="#221808" strokeWidth="2.5" strokeDasharray="5,7" opacity={0.55} />
            <Line x1="63" y1="0" x2="63" y2="480" stroke="#08152A" strokeWidth="2.5" strokeDasharray="5,7" opacity={0.55} />

            {/* Metro dot */}
            <Circle cx="63" cy="204" r="6" fill="#0C1C36" stroke="#1E3A62" strokeWidth="1.5" />
            <Circle cx="63" cy="204" r="3" fill="#1E3A62" />

            {/* Street labels */}
            <SvgText x="30" y="170" fill="#132030" fontSize="7.5" fontFamily="sans-serif" letterSpacing="0.3">Deák</SvgText>
            <SvgText x="30" y="180" fill="#132030" fontSize="7.5" fontFamily="sans-serif" letterSpacing="0.3">Ferenc tér</SvgText>
            <SvgText x="195" y="253" fill="#0F1C2E" fontSize="7" fontFamily="sans-serif">Gozsdu Udvar</SvgText>
            <SvgText x="90" y="55" fill="#0D1A2C" fontSize="8.5" fontFamily="sans-serif" fontWeight="bold" letterSpacing="1.2">V. KER.</SvgText>
            <SvgText x="200" y="55" fill="#0D1A2C" fontSize="8.5" fontFamily="sans-serif" fontWeight="bold" letterSpacing="1.2">VII. KER.</SvgText>
            <SvgText x="72" y="440" fill="#0D1A2C" fontSize="8.5" fontFamily="sans-serif" fontWeight="bold" letterSpacing="1.2">VIII. KER.</SvgText>
            <SvgText fill="#0D1A2E" fontSize="7" fontFamily="sans-serif" letterSpacing="1" rotation="-18" originX="220" originY="115" x="120" y="115">ANDRÁSSY ÚT</SvgText>
            <SvgText fill="#0D1A2E" fontSize="7" fontFamily="sans-serif" letterSpacing="0.8" x="155" y="295">RÁKÓCZI ÚT</SvgText>

            {/* User location dot */}
            <Circle cx="130" cy="215" r="20" fill="url(#userGlow)" />
            <Circle cx="130" cy="215" r="7" fill={T} opacity={0.85} />
            <Circle cx="130" cy="215" r="3.5" fill="white" />
        </Svg>
    );
}

// ─── Venue Pin ───────────────────────────────────────────────────────────────
interface VenuePinProps { party: Party; selected: boolean; onPress: () => void; }

function VenuePin({ party, selected, onPress }: VenuePinProps) {
    const isHighlight = !!party.highlight;
    const isActive = selected || isHighlight;

    return (
        <Pressable
            onPress={onPress}
            style={[
                styles.venuePin,
                {
                    left: party.mapX,
                    top: party.mapY,
                    zIndex: isHighlight ? 10 : selected ? 8 : 5,
                    backgroundColor: isActive ? 'rgba(13,211,197,0.18)' : 'rgba(8,14,32,0.9)',
                    borderColor: isActive ? T_BORDER : 'rgba(255,255,255,0.18)',
                    // Native shadow replaces CSS box-shadow / feGaussianBlur
                    shadowColor: isHighlight ? T : selected ? T : '#000',
                    shadowOpacity: isHighlight ? 0.55 : selected ? 0.4 : 0.5,
                    shadowRadius: isHighlight ? 12 : selected ? 8 : 4,
                    shadowOffset: { width: 0, height: 0 },
                    elevation: isActive ? 8 : 4,
                },
            ]}
        >
            {isHighlight && (
                <View style={[styles.pinDot, { backgroundColor: T, shadowColor: T, shadowOpacity: 0.9, shadowRadius: 5 }]} />
            )}
            <Text style={[styles.pinLabel, { color: isActive ? T : 'rgba(255,255,255,0.85)' }]}>
                {party.name}
            </Text>
        </Pressable>
    );
}

// ─── Featured Card ───────────────────────────────────────────────────────────
function FeaturedCard({ party }: { party: Party }) {
    const [dot, setDot] = useState(0);
    const isHighlight = !!party.highlight;

    return (
        <View style={[
            styles.featuredCard,
            {
                borderColor: isHighlight ? T_BORDER : 'rgba(255,255,255,0.09)',
                shadowColor: isHighlight ? T : '#000',
                shadowOpacity: isHighlight ? 0.35 : 0.5,
                shadowRadius: isHighlight ? 20 : 12,
                elevation: isHighlight ? 10 : 5,
            },
        ]}>
            {/* Hero image */}
            <View style={styles.featuredImageContainer}>
                <ImageWithFallback source={party.image} alt={party.name} style={StyleSheet.absoluteFillObject} />
                <LinearGradient
                    colors={['rgba(0,0,0,0.1)', 'transparent', 'rgba(8,12,28,0.8)']}
                    locations={[0, 0.4, 1]}
                    style={StyleSheet.absoluteFillObject}
                />
                {/* TONIGHT badge */}
                <View style={styles.tonightBadge}>
                    <View style={styles.tonightDot} />
                    <Text style={styles.tonightText}>TONIGHT</Text>
                </View>
                {/* Distance badge */}
                <View style={styles.distanceBadge}>
                    <Ionicons name="navigate" size={10} color="#d1d5db" style={{ marginRight: 3 }} />
                    <Text style={styles.distanceText}>{party.distance}</Text>
                </View>
            </View>

            {/* Dot pager */}
            <View style={styles.dotRow}>
                {[0, 1, 2].map((i) => (
                    <Pressable key={i} onPress={() => setDot(i)}>
                        <View style={[
                            styles.pageDot,
                            {
                                width: i === dot ? 16 : 5,
                                backgroundColor: i === dot ? T : 'rgba(255,255,255,0.2)',
                                shadowColor: i === dot ? T : undefined,
                                shadowOpacity: i === dot ? 0.7 : 0,
                                shadowRadius: i === dot ? 5 : 0,
                            },
                        ]} />
                    </Pressable>
                ))}
            </View>

            {/* Info */}
            <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
                <View style={styles.featuredInfoRow}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.featuredName}>{party.fullName}</Text>
                        <View style={styles.metaRow}>
                            <View style={styles.metaChip}>
                                <Ionicons name="people" size={11} color="#6b7280" style={{ marginRight: 3 }} />
                                <Text style={styles.metaText}>({party.interested} érdeklődő)</Text>
                            </View>
                            <View style={styles.metaChip}>
                                <Ionicons name="time-outline" size={11} color="#6b7280" style={{ marginRight: 3 }} />
                                <Text style={styles.metaText}>{party.time}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ alignItems: 'flex-end', gap: 4 }}>
                        {party.tags.map((tag) => (
                            <View key={tag} style={styles.tagPill}>
                                <Text style={styles.tagText}>{tag}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* CTA button */}
                <View style={[styles.ctaBtn, { borderColor: T_BORDER, backgroundColor: 'rgba(13,211,197,0.12)', shadowColor: T, shadowOpacity: 0.35, shadowRadius: 16, elevation: 6 }]}>
                    <LinearGradient
                        colors={['rgba(13,211,197,0.22)', 'rgba(13,211,197,0.10)']}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                        style={StyleSheet.absoluteFillObject}
                    />
                    <Ionicons name="flame" size={15} color={T} style={{ marginRight: 7 }} />
                    <Text style={{ color: T, fontWeight: '700', fontSize: 14, letterSpacing: 0.5 }}>Kiválasztás</Text>
                </View>
            </View>
        </View>
    );
}

// ─── Compact Card ────────────────────────────────────────────────────────────
function CompactCard({ party, onPress }: { party: Party; onPress: () => void }) {
    const isHighlight = !!party.highlight;

    return (
        <Pressable
            onPress={onPress}
            style={[
                styles.compactCard,
                {
                    borderColor: isHighlight ? T_BORDER : 'rgba(255,255,255,0.07)',
                    shadowColor: isHighlight ? T : 'transparent',
                    shadowOpacity: isHighlight ? 0.3 : 0,
                    shadowRadius: 12,
                    elevation: isHighlight ? 5 : 0,
                },
            ]}
        >
            {/* Thumbnail */}
            <View style={styles.compactThumb}>
                <ImageWithFallback source={party.image} alt={party.name} style={{ width: '100%', height: '100%' }} />
            </View>

            {/* Info */}
            <View style={styles.compactInfo}>
                <View>
                    <Text style={styles.compactName} numberOfLines={1}>{party.fullName}</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
                        {party.tags.map((t) => (
                            <View key={t} style={styles.tagPillSm}>
                                <Text style={styles.tagTextSm}>{t}</Text>
                            </View>
                        ))}
                    </View>
                </View>
                <View style={styles.compactMeta}>
                    <View style={styles.metaChip}>
                        <Ionicons name="people" size={10} color="#4b5563" style={{ marginRight: 3 }} />
                        <Text style={styles.metaSmText}>{party.interested}</Text>
                    </View>
                    <View style={styles.metaChip}>
                        <Ionicons name="location" size={10} color="#4b5563" style={{ marginRight: 3 }} />
                        <Text style={styles.metaSmText}>{party.distance}</Text>
                    </View>
                    <View style={styles.metaChip}>
                        <Ionicons name="time-outline" size={10} color="#4b5563" style={{ marginRight: 3 }} />
                        <Text style={styles.metaSmText}>{party.time}</Text>
                    </View>
                </View>
            </View>

            {/* Save button */}
            <Pressable style={styles.saveBtn}>
                <Ionicons name="star-outline" size={16} color={T} />
            </Pressable>
        </Pressable>
    );
}

// ─── Draggable Bottom Sheet ───────────────────────────────────────────────────
interface DraggablePanelProps {
    searchActive: boolean;
    selectedParty: Party;
    onSelectParty: (p: Party) => void;
    bottomInset: number;
}

function DraggablePanel({ searchActive, selectedParty, onSelectParty, bottomInset }: DraggablePanelProps) {
    const translateY = useSharedValue(PANEL_PEEK_Y);
    const lastY = useSharedValue(PANEL_PEEK_Y);
    const [expanded, setExpanded] = useState(false);

    const snapTo = (target: number) => {
        'worklet';
        translateY.value = withSpring(target, { stiffness: 300, damping: 32 });
        lastY.value = target;
    };

    const setExpandedJS = (val: boolean) => setExpanded(val);

    // Respond to search active state changes
    useEffect(() => {
        if (searchActive) {
            translateY.value = withSpring(PANEL_EXPANDED_Y, { stiffness: 300, damping: 32 });
            lastY.value = PANEL_EXPANDED_Y;
            setExpanded(true);
        } else {
            translateY.value = withSpring(PANEL_PEEK_Y, { stiffness: 300, damping: 32 });
            lastY.value = PANEL_PEEK_Y;
            setExpanded(false);
        }
    }, [searchActive]);

    // Gesture: drag the handle
    const panGesture = Gesture.Pan()
        .onUpdate((e) => {
            const next = lastY.value + e.translationY;
            translateY.value = Math.max(PANEL_EXPANDED_Y, Math.min(PANEL_PEEK_Y, next));
        })
        .onEnd((e) => {
            const current = translateY.value;
            const threshold = PANEL_PEEK_Y * 0.45;
            if (current < threshold || e.velocityY < -600) {
                snapTo(PANEL_EXPANDED_Y);
                runOnJS(setExpandedJS)(true);
            } else {
                snapTo(PANEL_PEEK_Y);
                runOnJS(setExpandedJS)(false);
            }
        });

    const panelStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    const toggleExpanded = () => {
        if (expanded) {
            translateY.value = withSpring(PANEL_PEEK_Y, { stiffness: 300, damping: 32 });
            lastY.value = PANEL_PEEK_Y;
            setExpanded(false);
        } else {
            translateY.value = withSpring(PANEL_EXPANDED_Y, { stiffness: 300, damping: 32 });
            lastY.value = PANEL_EXPANDED_Y;
            setExpanded(true);
        }
    };

    return (
        <Animated.View style={[styles.panel, panelStyle]}>
            {/* Handle + header — drag zone only */}
            <GestureDetector gesture={panGesture}>
                <View style={styles.panelHandle}>
                    <View style={styles.handleBar} />
                    <View style={styles.panelHeaderRow}>
                        <View>
                            <Text style={styles.panelTitle}>
                                {searchActive ? 'Keresési eredmények' : 'Közelben ma este'}
                            </Text>
                            <Text style={styles.panelSubtitle}>{PARTIES.length} buli • Budapest</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <View style={styles.liveBadge}>
                                <View style={styles.liveDot} />
                                <Text style={styles.liveText}>Ma este</Text>
                            </View>
                            <Pressable onPress={toggleExpanded} style={styles.chevronBtn}>
                                <Ionicons
                                    name={expanded ? 'chevron-down' : 'chevron-up'}
                                    size={14}
                                    color="#6b7280"
                                />
                            </Pressable>
                        </View>
                    </View>
                </View>
            </GestureDetector>

            {/* Scrollable content */}
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 + bottomInset }}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
            >
                <FeaturedCard party={PARTIES[0]} />
                <Text style={styles.sectionLabel}>Egyéb bulik közelben</Text>
                {PARTIES.slice(1).map((p) => (
                    <CompactCard
                        key={p.id}
                        party={p}
                        onPress={() => onSelectParty(p)}
                    />
                ))}
                <View style={{ height: 8 }} />
            </ScrollView>
        </Animated.View>
    );
}

// ─── Root Screen ─────────────────────────────────────────────────────────────
export default function SearchScreen() {
    const insets = useSafeAreaInsets();
    const bottomInset = 76 + insets.bottom;

    const [searchText, setSearchText] = useState('');
    const [searchActive, setSearchActive] = useState(false);
    const [selectedParty, setSelectedParty] = useState<Party>(PARTIES[0]);

    // Animated values for search bar border glow & map fade
    const searchGlow = useSharedValue(0);
    const mapOpacity = useSharedValue(1);
    const mapScale = useSharedValue(1);

    const handleFocus = () => {
        setSearchActive(true);
        searchGlow.value = withTiming(1, { duration: 250 });
        mapOpacity.value = withTiming(0, { duration: 300 });
        mapScale.value = withTiming(1.04, { duration: 300 });
    };

    const handleBlur = () => {
        if (!searchText) {
            setSearchActive(false);
            searchGlow.value = withTiming(0, { duration: 250 });
            mapOpacity.value = withTiming(1, { duration: 300 });
            mapScale.value = withTiming(1, { duration: 300 });
        }
    };

    const clearSearch = () => {
        setSearchText('');
        setSearchActive(false);
        searchGlow.value = withTiming(0, { duration: 250 });
        mapOpacity.value = withTiming(1, { duration: 300 });
        mapScale.value = withTiming(1, { duration: 300 });
    };

    const searchBarStyle = useAnimatedStyle(() => ({
        borderColor: searchGlow.value === 1 ? T_BORDER : 'rgba(255,255,255,0.1)',
        shadowColor: T,
        shadowOpacity: searchGlow.value * 0.35,
        shadowRadius: interpolate(searchGlow.value, [0, 1], [0, 20], Extrapolation.CLAMP),
        elevation: searchGlow.value * 8,
    }));

    const mapContainerStyle = useAnimatedStyle(() => ({
        opacity: mapOpacity.value,
        transform: [{ scale: mapScale.value }],
    }));

    return (
        <View style={{ flex: 1, backgroundColor: '#06091A' }}>
                {/* Background gradient */}
                <LinearGradient
                    colors={['#050C20', '#070C1C', '#060915']}
                    locations={[0, 0.4, 1]}
                    style={StyleSheet.absoluteFillObject}
                />

                {/* ── Search Bar + Filters ── */}
                <View style={[styles.searchHeader, { paddingTop: insets.top + 20 }]}>
                    <Animated.View style={[styles.searchBar, searchBarStyle]}>
                        <Ionicons
                            name="search"
                            size={16}
                            color={searchActive ? T : 'rgba(255,255,255,0.35)'}
                            style={{ marginRight: 10 }}
                        />
                        <View style={{ flex: 1 }}>
                            <TextInput
                                placeholder="Helyszín keresés..."
                                placeholderTextColor="#4b5563"
                                value={searchText}
                                onChangeText={setSearchText}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                style={styles.searchInput}
                                returnKeyType="search"
                            />
                            <Text style={styles.searchSub}>Ma este • 2 fő</Text>
                        </View>
                        {searchActive ? (
                            <Pressable onPress={clearSearch} style={styles.clearBtn}>
                                <Ionicons name="close" size={13} color="#9ca3af" />
                            </Pressable>
                        ) : (
                            <Ionicons name="pencil" size={16} color="rgba(255,255,255,0.35)" />
                        )}
                    </Animated.View>

                    {/* Filter row */}
                    <View style={styles.filterRow}>
                        <Pressable style={styles.filterChip}>
                            <View style={[styles.filterDot, { backgroundColor: T, shadowColor: T, shadowOpacity: 0.8, shadowRadius: 5 }]} />
                            <Ionicons name="options-outline" size={13} color="#9ca3af" style={{ marginRight: 5 }} />
                            <Text style={styles.filterText}>Szűrők</Text>
                        </Pressable>

                        <Pressable style={styles.filterChip}>
                            <View style={[styles.filterDot, { backgroundColor: '#8b5cf6', shadowColor: '#8b5cf6', shadowOpacity: 0.8, shadowRadius: 5 }]} />
                            <Ionicons name="swap-vertical" size={13} color="#9ca3af" style={{ marginRight: 5 }} />
                            <Text style={styles.filterText}>Rendezés</Text>
                        </Pressable>

                        <View style={styles.countChip}>
                            <Ionicons name="flame" size={13} color={T} style={{ marginRight: 5 }} />
                            <Text style={[styles.filterText, { color: T, fontWeight: '700' }]}>{PARTIES.length}</Text>
                        </View>
                    </View>
                </View>

                {/* ── Map + Panel container ── */}
                <View style={{ flex: 1, position: 'relative' }}>
                    {/* Map */}
                    <Animated.View
                        style={[StyleSheet.absoluteFillObject, mapContainerStyle]}
                        pointerEvents={searchActive ? 'none' : 'box-none'}
                    >
                        <BudapestMapSVG />

                        {/* Venue Pins overlay */}
                        <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
                            {PARTIES.map((p) => (
                                <VenuePin
                                    key={p.id}
                                    party={p}
                                    selected={selectedParty.id === p.id}
                                    onPress={() => setSelectedParty(p)}
                                />
                            ))}
                        </View>

                        {/* Locate button */}
                        <Pressable style={styles.locateBtn}>
                            <Ionicons name="navigate" size={16} color={T} />
                        </Pressable>
                    </Animated.View>

                    {/* Draggable Panel */}
                    <DraggablePanel
                        searchActive={searchActive}
                        selectedParty={selectedParty}
                        onSelectParty={setSelectedParty}
                        bottomInset={bottomInset}
                    />
                </View>
            </View>
    );
}

// ─── StyleSheet ───────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    // Search header
    searchHeader: {
        position: 'relative',
        zIndex: 10,
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(8,13,28,0.92)',
        borderRadius: 16,
        borderWidth: 1,
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginBottom: 10,
    },
    searchInput: {
        color: '#fff',
        fontSize: 14,
        padding: 0,
        margin: 0,
    },
    searchSub: {
        color: '#4b5563',
        fontSize: 10,
        marginTop: 2,
    },
    clearBtn: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.07)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
    },
    filterRow: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        backgroundColor: 'rgba(8,13,28,0.88)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    filterDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 6,
    },
    filterText: {
        color: '#d1d5db',
        fontSize: 12,
        fontWeight: '500',
    },
    countChip: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 'auto',
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 12,
        backgroundColor: T_DARK,
        borderWidth: 1,
        borderColor: T_BORDER,
    },
    // Map / Pins
    venuePin: {
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        borderWidth: 1,
        transform: [{ translateX: -30 }, { translateY: -14 }],
    },
    pinDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 4,
    },
    pinLabel: {
        fontSize: 10,
        fontWeight: '700',
    },
    locateBtn: {
        position: 'absolute',
        top: 16,
        right: 16,
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: 'rgba(8,13,28,0.88)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 5,
    },
    // Panel
    panel: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: PANEL_HEIGHT,
        backgroundColor: 'rgba(7,10,22,0.97)',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -8 },
        shadowOpacity: 0.7,
        shadowRadius: 24,
        elevation: 20,
    },
    panelHandle: {
        paddingTop: 10,
        paddingBottom: 8,
        alignItems: 'center',
    },
    handleBar: {
        width: 38,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(255,255,255,0.18)',
        marginBottom: 10,
    },
    panelHeaderRow: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    panelTitle: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '700',
    },
    panelSubtitle: {
        color: '#4b5563',
        fontSize: 12,
        marginTop: 2,
    },
    liveBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        backgroundColor: T_DARK,
        borderWidth: 1,
        borderColor: T_BORDER,
    },
    liveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: T,
        shadowColor: T,
        shadowOpacity: 0.9,
        shadowRadius: 5,
    },
    liveText: {
        fontSize: 10,
        fontWeight: '600',
        color: T,
    },
    chevronBtn: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    sectionLabel: {
        color: '#4b5563',
        fontSize: 11,
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        marginBottom: 10,
        paddingHorizontal: 4,
    },
    // Featured Card
    featuredCard: {
        backgroundColor: 'rgba(8,12,28,0.95)',
        borderRadius: 24,
        borderWidth: 1,
        overflow: 'hidden',
        marginBottom: 12,
    },
    featuredImageContainer: {
        height: 160,
        position: 'relative',
        overflow: 'hidden',
    },
    tonightBadge: {
        position: 'absolute',
        top: 10,
        left: 12,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: 'rgba(239,68,68,0.22)',
        borderWidth: 1,
        borderColor: 'rgba(239,68,68,0.4)',
    },
    tonightDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#ef4444',
        marginRight: 5,
    },
    tonightText: {
        color: '#fca5a5',
        fontSize: 9,
        fontWeight: '700',
        letterSpacing: 0.8,
    },
    distanceBadge: {
        position: 'absolute',
        top: 10,
        right: 12,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: 'rgba(0,0,0,0.45)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
    },
    distanceText: {
        color: '#e5e7eb',
        fontSize: 9,
    },
    dotRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 8,
    },
    pageDot: {
        height: 5,
        borderRadius: 999,
    },
    featuredInfoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    featuredName: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '700',
    },
    metaRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 4,
        flexWrap: 'wrap',
    },
    metaChip: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaText: {
        color: '#9ca3af',
        fontSize: 11,
    },
    metaSmText: {
        color: '#6b7280',
        fontSize: 10,
    },
    tagPill: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 999,
        backgroundColor: T_BG,
        borderWidth: 1,
        borderColor: T_BORDER,
    },
    tagText: {
        color: T,
        fontSize: 9,
        fontWeight: '600',
    },
    tagPillSm: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 999,
        backgroundColor: T_BG,
        borderWidth: 1,
        borderColor: T_BORDER,
    },
    tagTextSm: {
        color: T,
        fontSize: 9,
        fontWeight: '500',
    },
    ctaBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        borderWidth: 1,
        paddingVertical: 12,
        overflow: 'hidden',
    },
    // Compact Card
    compactCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 20,
        borderWidth: 1,
        backgroundColor: 'rgba(8,12,28,0.92)',
        marginBottom: 10,
    },
    compactThumb: {
        width: 80,
        height: 80,
        borderRadius: 12,
        overflow: 'hidden',
        marginRight: 12,
        flexShrink: 0,
    },
    compactInfo: {
        flex: 1,
        justifyContent: 'space-between',
        paddingVertical: 2,
    },
    compactName: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '700',
    },
    compactMeta: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 6,
    },
    saveBtn: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: T_DARK,
        borderWidth: 1,
        borderColor: T_BORDER,
        marginLeft: 10,
        shadowColor: T,
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
});
