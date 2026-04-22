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
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
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
import { Svg } from 'react-native-svg';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { ImageWithFallback } from '../components/ui/ImageWithFallback';

// ─── Theme constants ────────────────────────────────────────────────────────
const T = '#3b82f6';
const T_GLOW = 'rgba(59,130,246,0.38)';
const T_BORDER = 'rgba(59,130,246,0.45)';
const T_BG = 'rgba(59,130,246,0.10)';
const T_DARK = 'rgba(59,130,246,0.07)';

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
    latitude: number;
    longitude: number;
    highlight?: boolean;
}

const PARTIES: Party[] = [
    { id: 1, name: 'Akvárium', fullName: 'Akvárium Klub - Nagyterem', interested: 500, distance: '1.2 km', time: '22:00', tags: ['Techno', 'Live'], image: IMG_CONCERT, latitude: 47.4980, longitude: 19.0540, highlight: true },
    { id: 2, name: 'Ötkert', fullName: 'Ötkert', interested: 342, distance: '0.8 km', time: '20:00', tags: ['Bar', 'Open Air'], image: IMG_ROOFTOP, latitude: 47.5008, longitude: 19.0494 },
    { id: 3, name: 'Pontoon', fullName: 'Pontoon Club', interested: 218, distance: '2.1 km', time: '23:00', tags: ['House', 'Duna'], image: IMG_COURTYARD, latitude: 47.4998, longitude: 19.0475 },
    { id: 4, name: 'Gozsdurk', fullName: 'Gozsdu Udvar', interested: 156, distance: '0.5 km', time: '19:00', tags: ['Ruin Bar', 'Mix'], image: IMG_CLUB, latitude: 47.4982, longitude: 19.0594 },
    { id: 5, name: 'Lyina', fullName: 'Lyina Bar', interested: 89, distance: '1.5 km', time: '21:00', tags: ['Cocktails', 'DJ'], image: IMG_BAR, latitude: 47.5015, longitude: 19.0620 },
    { id: 6, name: 'Tütü', fullName: 'Tütü Bar', interested: 67, distance: '0.9 km', time: '22:30', tags: ['Indie', 'Terasz'], image: IMG_ROOFTOP, latitude: 47.5029, longitude: 19.0583 },
];

// Dark mode premium map style
const MAP_STYLE = [
  { "elementType": "geometry", "stylers": [{ "color": "#0B0D17" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#8ec3b9" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#1a3646" }] },
  { "featureType": "administrative.country", "elementType": "geometry.stroke", "stylers": [{ "color": "#4b6878" }] },
  { "featureType": "administrative.land_parcel", "elementType": "labels.text.fill", "stylers": [{ "color": "#64779e" }] },
  { "featureType": "landscape.man_made", "elementType": "geometry.stroke", "stylers": [{ "color": "#334e87" }] },
  { "featureType": "landscape.natural", "elementType": "geometry", "stylers": [{ "color": "#023e58" }] },
  { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#283d6a" }] },
  { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#6f9ba5" }] },
  { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#172346" }] },
  { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#9ca5b3" }] },
  { "featureType": "road", "elementType": "labels.text.stroke", "stylers": [{ "color": "#1d2c4d" }] },
  { "featureType": "transit.line", "elementType": "geometry.fill", "stylers": [{ "color": "#283d6a" }] },
  { "featureType": "transit.station", "elementType": "geometry", "stylers": [{ "color": "#3a4762" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#050C20" }] },
  { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#4e6d70" }] }
];

// ─── Venue Pin ───────────────────────────────────────────────────────────────
interface VenuePinProps { party: Party; selected: boolean; onPress: () => void; }

function VenuePin({ party, selected, onPress }: VenuePinProps) {
    const isHighlight = !!party.highlight;
    const isActive = selected || isHighlight;

    return (
        <View
            style={[
                styles.venuePin,
                {
                    backgroundColor: isActive ? 'rgba(59,130,246,0.18)' : 'rgba(8,14,32,0.9)',
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
        </View>
    );
}

// ─── Premium Event Card (Matches HomeFeedScreen) ─────────────────────────
function PremiumEventCard({ party, onPress }: { party: Party; onPress: () => void }) {
    const isHighlight = !!party.highlight;

    return (
        <Pressable
            onPress={onPress}
            style={[
                styles.premiumCard,
                {
                    borderColor: isHighlight ? T_BORDER : 'rgba(255,255,255,0.09)',
                    shadowColor: isHighlight ? T : '#000',
                    shadowOpacity: isHighlight ? 0.45 : 0.45,
                    shadowRadius: isHighlight ? 20 : 16,
                    elevation: isHighlight ? 10 : 6,
                },
            ]}
        >
            <View style={styles.premiumImageContainer}>
                <ImageWithFallback source={party.image} alt={party.name} style={StyleSheet.absoluteFillObject} />
                <LinearGradient
                    colors={['rgba(0,0,0,0.15)', 'rgba(11,13,23,0.7)']}
                    style={StyleSheet.absoluteFillObject}
                />

                <View style={[styles.premiumGenreBadge, { backgroundColor: 'rgba(59,130,246,0.15)', borderColor: 'rgba(59,130,246,0.4)' }]}>
                    <Text style={[styles.premiumGenreText, { color: '#60a5fa' }]}>
                        {party.tags[0] || 'Mix'}
                    </Text>
                </View>

                {isHighlight ? (
                    <View style={styles.tonightBadge}>
                        <View style={styles.tonightDot} />
                        <Text style={styles.tonightText}>TONIGHT</Text>
                    </View>
                ) : (
                    <View style={styles.friendsBadge}>
                        <Ionicons name="people-outline" size={10} color="#d1d5db" />
                        <Text style={styles.friendsText}>+{Math.floor(Math.random() * 5) + 1} friends</Text>
                    </View>
                )}
            </View>

            <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                        <Text style={styles.premiumTitle}>{party.name}</Text>
                        <Text style={styles.premiumSubtitle}>{party.fullName}</Text>
                    </View>
                    <View style={styles.goingPill}>
                        <Ionicons name="star" size={12} color="#facc15" />
                        <Text style={styles.goingText}>{party.interested}</Text>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Ionicons name="time-outline" size={12} color="#6b7280" />
                        <Text style={{ color: '#9ca3af', fontSize: 12 }}>{party.time}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, minWidth: 120, gap: 6 }}>
                        <Ionicons name="location-outline" size={12} color="#6b7280" />
                        <Text style={{ color: '#9ca3af', fontSize: 12 }} numberOfLines={1}>{party.distance}</Text>
                    </View>
                </View>
            </View>
        </Pressable>
    );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function partyToApiEvent(p: Party): any {
    return {
        id: p.id,
        title: p.name,
        description: p.fullName,
        start_time: '2026-04-15T22:00:00.000Z',
        image_url: p.image,
        interested_count: p.interested,
        going_count: p.interested,
        genre: p.tags[0] || 'Mix',
        location: {
            name: p.name,
            city: { name: 'Budapest' }
        }
    };
}

// ─── Draggable Bottom Sheet ───────────────────────────────────────────────────
interface DraggablePanelProps {
    searchActive: boolean;
    selectedParty: Party;
    onSelectParty: (p: Party) => void;
    bottomInset: number;
    filteredParties: Party[];
}

function DraggablePanel({ searchActive, selectedParty, onSelectParty, bottomInset, filteredParties }: DraggablePanelProps) {
    const translateY = useSharedValue(PANEL_PEEK_Y);
    const lastY = useSharedValue(PANEL_PEEK_Y);
    const [expanded, setExpanded] = useState(false);
    const navigation = useNavigation<any>();

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
                            <Text style={styles.panelSubtitle}>{filteredParties.length} buli • Budapest</Text>
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
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: bottomInset + 80 }}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
            >
                {filteredParties.length > 0 && (
                    <Text style={styles.sectionLabel}>
                        {searchActive ? 'Keresési Találatok' : 'Kiemelt Bulik'}
                    </Text>
                )}

                {filteredParties.length === 0 ? (
                    <View style={{ padding: 20, alignItems: 'center' }}>
                        <Text style={{ color: '#9ca3af' }}>Nincs találat a keresésére.</Text>
                    </View>
                ) : (
                    filteredParties.map((p) => (
                        <PremiumEventCard
                            key={p.id}
                            party={p}
                            onPress={() => {
                                onSelectParty(p);
                                navigation.navigate('EventDetails', { event: partyToApiEvent(p) });
                            }}
                        />
                    ))
                )}
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
    const [sortDesc, setSortDesc] = useState(true);
    const [filterActive, setFilterActive] = useState(false);

    const filteredParties = React.useMemo(() => {
        let results = PARTIES;
        const q = searchText.toLowerCase().trim();
        if (q) {
            results = results.filter(p => 
                p.name.toLowerCase().includes(q) || 
                p.fullName.toLowerCase().includes(q) || 
                p.tags.some(t => t.toLowerCase().includes(q))
            );
        }

        if (filterActive) {
            // Apply "Techno" filter
            results = results.filter(p => p.tags.some(t => t.toLowerCase() === 'techno'));
        }
        
        return results.slice().sort((a, b) => {
            if (sortDesc) {
                return b.interested - a.interested;
            } else {
                return a.interested - b.interested;
            }
        });
    }, [searchText, sortDesc, filterActive]);

    // Animated values for search bar border glow
    const searchGlow = useSharedValue(0);

    const handleFocus = () => {
        setSearchActive(true);
        searchGlow.value = withTiming(1, { duration: 250 });
    };

    const handleBlur = () => {
        if (!searchText) {
            setSearchActive(false);
            searchGlow.value = withTiming(0, { duration: 250 });
        }
    };

    const clearSearch = () => {
        setSearchText('');
        setSearchActive(false);
        searchGlow.value = withTiming(0, { duration: 250 });
    };

    const searchBarStyle = useAnimatedStyle(() => ({
        borderColor: searchGlow.value === 1 ? T_BORDER : 'rgba(255,255,255,0.1)',
        shadowColor: T,
        shadowOpacity: searchGlow.value * 0.35,
        shadowRadius: interpolate(searchGlow.value, [0, 1], [0, 20], Extrapolation.CLAMP),
        elevation: searchGlow.value * 8,
    }));

    return (
        <View style={{ flex: 1, backgroundColor: '#0B0D17' }}>
                {/* Background gradient */}
                <LinearGradient
                    colors={['#0B0D17', '#080A12']}
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
                        <Pressable 
                            style={[styles.filterChip, filterActive && { borderColor: 'rgba(139,92,246,0.6)' }]}
                            onPress={() => setFilterActive(!filterActive)}
                        >
                            <View style={[styles.filterDot, { backgroundColor: T, shadowColor: T, shadowOpacity: 0.8, shadowRadius: 5 }]} />
                            <Ionicons name="options-outline" size={13} color="#9ca3af" style={{ marginRight: 5 }} />
                            <Text style={[styles.filterText, filterActive && { color: '#e5e7eb' }]}>
                                {filterActive ? 'Techno Csak' : 'Szűrők'}
                            </Text>
                        </Pressable>

                        <Pressable 
                           style={[styles.filterChip, !sortDesc && { borderColor: 'rgba(139,92,246,0.6)' }]} 
                           onPress={() => setSortDesc(!sortDesc)}
                        >
                            <View style={[styles.filterDot, { backgroundColor: '#8b5cf6', shadowColor: '#8b5cf6', shadowOpacity: 0.8, shadowRadius: 5 }]} />
                            <Ionicons name="swap-vertical" size={13} color="#9ca3af" style={{ marginRight: 5 }} />
                            <Text style={[styles.filterText, !sortDesc && { color: '#e5e7eb' }]}>
                                {sortDesc ? 'Népszerűek' : 'Kevésbé f.'}
                            </Text>
                        </Pressable>

                        <View style={styles.countChip}>
                            <Ionicons name="flame" size={13} color={T} style={{ marginRight: 5 }} />
                            <Text style={[styles.filterText, { color: T, fontWeight: '700' }]}>{filteredParties.length}</Text>
                        </View>
                    </View>
                </View>

                {/* ── Map + Panel container ── */}
                <View style={{ flex: 1, position: 'relative' }}>
                    {/* Map */}
                    <Animated.View
                        style={[StyleSheet.absoluteFillObject]}
                        pointerEvents={searchActive ? 'none' : 'box-none'}
                    >
                        <MapView
                            provider={PROVIDER_GOOGLE}
                            style={StyleSheet.absoluteFillObject}
                            customMapStyle={MAP_STYLE}
                            initialRegion={{
                                latitude: 47.4980,
                                longitude: 19.0540,
                                latitudeDelta: 0.02,
                                longitudeDelta: 0.02,
                            }}
                            showsUserLocation={true}
                            showsPointsOfInterest={false}
                        >
                            {filteredParties.map((p) => (
                                <Marker
                                    key={`marker-${p.id}`}
                                    coordinate={{ latitude: p.latitude, longitude: p.longitude }}
                                    onPress={() => setSelectedParty(p)}
                                    // Make sure pins appear above others when highlighted or selected
                                    zIndex={p.highlight ? 10 : (selectedParty?.id === p.id ? 8 : 5)}
                                >
                                    <VenuePin
                                        party={p}
                                        selected={selectedParty?.id === p.id}
                                        onPress={() => {}}
                                    />
                                </Marker>
                            ))}
                        </MapView>

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
                        filteredParties={filteredParties}
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
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        borderWidth: 1,
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
    // Premium Card
    premiumCard: {
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderRadius: 24,
        borderWidth: 1,
        overflow: 'hidden',
        marginBottom: 12,
    },
    premiumImageContainer: {
        height: 110,
        position: 'relative',
        overflow: 'hidden',
    },
    premiumGenreBadge: {
        position: 'absolute',
        top: 10,
        left: 12,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        borderWidth: 1,
    },
    premiumGenreText: {
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    tonightBadge: {
        position: 'absolute',
        top: 10,
        right: 12,
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
    friendsBadge: {
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
        borderColor: 'rgba(255,255,255,0.1)',
    },
    friendsText: {
        color: '#e5e7eb',
        fontSize: 9,
        fontWeight: '600',
        marginLeft: 4,
    },
    premiumTitle: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '700',
    },
    premiumSubtitle: {
        color: '#6b7280',
        fontSize: 12,
        marginTop: 2,
    },
    goingPill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    goingText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 4,
    },
});
