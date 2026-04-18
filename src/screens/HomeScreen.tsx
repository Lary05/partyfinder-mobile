import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    RefreshControl,
    TouchableOpacity,
    Image,
    TextInput,
    ScrollView,
    Alert,
    Pressable,
    Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Event } from '../types/event';
import ChatScreen from './ChatScreen';
import FelfedezesSimulator from './FelfedezesSimulator';

type MainTab = 'Home' | 'Search' | 'Match' | 'Messages' | 'Profile';

const DUMMY_EVENTS = [
    {
        id: 1,
        title: "Nyárindító Mega Party",
        start_time: "2024-06-15T22:00:00.000Z",
        genre: "EDM",
        interested_count: 156,
        image_url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1974&auto=format&fit=crop",
        location: { name: "Akvárium Klub", city: { name: "Budapest" } }
    },
    {
        id: 2,
        title: "Retro Disco Láz",
        start_time: "2024-06-20T21:00:00.000Z",
        genre: "Retro",
        interested_count: 89,
        image_url: "https://images.unsplash.com/photo-1544785349-c4a5301826fd?q=80&w=1974&auto=format&fit=crop",
        location: { name: "JATE Klub", city: { name: "Szeged" } }
    },
    {
        id: 3,
        title: "Rooftop Sunset Chills",
        start_time: "2024-06-25T19:00:00.000Z",
        genre: "House",
        interested_count: 210,
        image_url: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=1974&auto=format&fit=crop",
        location: { name: "360 Bar", city: { name: "Budapest" } }
    },
    {
        id: 4,
        title: "Campus Fesztivál After",
        start_time: "2024-07-28T23:00:00.000Z",
        genre: "Pop",
        interested_count: 340,
        image_url: "https://images.unsplash.com/photo-1533174000228-db32247fb428?q=80&w=1974&auto=format&fit=crop",
        location: { name: "Víztorony", city: { name: "Debrecen" } }
    }
];

/** Curated demo feed (visual reference design — April 2026) */
const FEATURED_IMAGE =
    "https://images.unsplash.com/photo-1765738042644-a290f0a4a29f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwbmlnaHRjbHViJTIwREolMjBjcm93ZCUyMGNvbmNlcnQlMjBuZW9uJTIwbGlnaHRzfGVufDF8fHx8MTc3NjI5MzIxNnww&ixlib=rb-4.1.0&q=80&w=1080";

const TECHNO_IMAGE =
    "https://images.unsplash.com/photo-1732682940642-4f14719d20ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm8lMjByYXZlJTIwd2FyZWhvdXNlJTIwcGFydHklMjBldmVudCUyMG5pZ2h0fGVufDF8fHx8MTc3NjI5MzIxNnww&ixlib=rb-4.1.0&q=80&w=1080";

const AFTERPARTY_IMAGE =
    "https://images.unsplash.com/photo-1757705270650-60989682e229?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3VzZSUyMG11c2ljJTIwYWZ0ZXJwYXJ0eSUyMHJvb2Z0b3AlMjBuaWdodCUyMGV2ZW50fGVufDF8fHx8MTc3NjI5MzIxNnww&ixlib=rb-4.1.0&q=80&w=1080";

const DJ_AVATAR =
    "https://images.unsplash.com/photo-1622631628339-58012229b743?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxESiUyMHBvcnRyYWl0JTIweW91bmclMjBtYWxlJTIwbXVzaWMlMjBwcm9kdWNlciUyMHN0dWRpb3xlbnwxfHx8fDE3NzYyOTMyMTl8MA&ixlib=rb-4.1.0&q=80&w=1080";

const AVATAR_F =
    "https://images.unsplash.com/photo-1595289766724-d0ff644f7bbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHdvbWFuJTIwYXNpYW4lMjBwcm9maWxlJTIwYXZhdGFyJTIwc21hbGwlMjBwaG90b3xlbnwxfHx8fDE3NzYyOTMyMTl8MA&ixlib=rb-4.1.0&q=80&w=1080";

const HOME_DAYS = [
    { day: "Sun", date: 12, month: "Apr" },
    { day: "Mon", date: 13, month: "Apr" },
    { day: "Tue", date: 14, month: "Apr" },
    { day: "Wed", date: 15, month: "Apr" },
    { day: "Thu", date: 16, month: "Apr" },
    { day: "Fri", date: 17, month: "Apr" },
    { day: "Sat", date: 18, month: "Apr" },
    { day: "Sun", date: 19, month: "Apr" },
    { day: "Mon", date: 20, month: "Apr" },
];

interface VisualEvent {
    id: number;
    name: string;
    subtitle: string;
    date: string;
    time: string;
    location: string;
    genre: string;
    genreColor: { bg: string; border: string; text: string };
    glow: string;
    image: string;
    djName: string;
    going: number;
    friends: number;
    isLarge: boolean;
}

const VISUAL_EVENTS: VisualEvent[] = [
    {
        id: 1,
        name: "Boiler Room",
        subtitle: "Underground Techno Night",
        date: "Wed, 15 Apr",
        time: "22:00 – 05:00",
        location: "A5 Room, Bandung",
        genre: "Techno",
        genreColor: { bg: "rgba(251,146,60,0.15)", border: "rgba(251,146,60,0.4)", text: "#fb923c" },
        glow: "rgba(251,146,60,0.18)",
        image: TECHNO_IMAGE,
        djName: "DJ Kontain",
        going: 142,
        friends: 4,
        isLarge: true,
    },
    {
        id: 2,
        name: "Solar Afterparty",
        subtitle: "House & Deep Vibes",
        date: "Wed, 15 Apr",
        time: "02:00 – 07:00",
        location: "Rooftop 88, Bandung",
        genre: "House",
        genreColor: { bg: "rgba(59,130,246,0.15)", border: "rgba(59,130,246,0.4)", text: "#60a5fa" },
        glow: "rgba(59,130,246,0.18)",
        image: AFTERPARTY_IMAGE,
        djName: "Nadia Sol",
        going: 87,
        friends: 2,
        isLarge: false,
    },
];

const AVATAR_GRADIENTS: [string, string][] = [
    ["#3b82f6", "#8b5cf6"],
    ["#ec4899", "#f43f5e"],
    ["#10b981", "#3b82f6"],
];

function parseEventCalendarDay(dateStr: string): number {
    const m = dateStr.match(/,\s*(\d+)/);
    return m ? parseInt(m[1], 10) : 15;
}

function visualEventToApiEvent(v: VisualEvent): Event {
    const locParts = v.location.split(',').map((s) => s.trim());
    const venue = locParts[0] || 'Venue';
    const cityName = locParts[1] || 'Bandung';
    return {
        id: v.id,
        facebook_event_id: '',
        title: v.name,
        description: v.subtitle,
        start_time: '2026-04-15T22:00:00.000Z',
        end_time: null,
        location_id: 0,
        facebook_url: '',
        ticket_url: null,
        image_url: v.image,
        interested_count: v.going,
        going_count: v.going,
        created_by: 0,
        genre: v.genre,
        location: {
            id: 0,
            city_id: 0,
            country_id: 0,
            name: venue,
            address: '',
            slug: '',
            lat: 0,
            lng: 0,
            city: { id: 0, country_id: 0, name: cityName, slug: '', lat: 0, lng: 0 },
        },
    };
}

export default function HomeScreen({ navigation }: any) {
    const [allEvents, setAllEvents] = useState<Event[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [activeTab, setActiveTab] = useState<MainTab>('Home');

    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    let searchTimeout: ReturnType<typeof setTimeout> | null = null;

    const [activeDay, setActiveDay] = useState(15);

    const [tempCity, setTempCity] = useState('');
    const [tempDate, setTempDate] = useState('');
    const [tempGenre, setTempGenre] = useState<string[]>([]);
    const [activeCity, setActiveCity] = useState('');
    const [activeDate, setActiveDate] = useState('');
    const [activeGenre, setActiveGenre] = useState<string[]>([]);

    const [profileName, setProfileName] = useState('Test User');
    const [profileEmail, setProfileEmail] = useState('test@example.com');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const insets = useSafeAreaInsets();
    /** Space reserved for the floating glass tab bar so scroll content and swipe UI are not obscured */
    const tabBarReserve = 76 + insets.bottom;

    const filteredVisualEvents = useMemo(() => {
        return VISUAL_EVENTS.filter((event) => {
            const eventDay = parseEventCalendarDay(event.date);
            if (activeDay !== eventDay) return false;
            const q = searchQuery.trim().toLowerCase();
            if (!q) return true;
            return (
                event.name.toLowerCase().includes(q) ||
                event.subtitle.toLowerCase().includes(q) ||
                event.location.toLowerCase().includes(q) ||
                event.djName.toLowerCase().includes(q) ||
                event.genre.toLowerCase().includes(q)
            );
        });
    }, [searchQuery, activeDay]);

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const token = await AsyncStorage.getItem('auth_token');
                setIsLoggedIn(!!token);
            } catch (error) {
                console.error("Hiba a token olvasásakor", error);
            }
        };

        checkLoginStatus();
        if (navigation && navigation.addListener) {
            const unsubscribe = navigation.addListener('focus', () => {
                checkLoginStatus();
            });
            return unsubscribe;
        }
    }, [navigation]);

    const fetchEvents = async () => {
        setTimeout(() => {
            setAllEvents(DUMMY_EVENTS as Event[]);
            setLoading(false);
            setRefreshing(false);
        }, 600);
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        let filtered = allEvents;

        if (searchQuery) {
            filtered = filtered.filter(e => e.title.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        if (activeCity) {
            filtered = filtered.filter(e => e.location?.city?.name === activeCity);
        }

        if (activeGenre.length > 0) {
            filtered = filtered.filter(e => activeGenre.includes(e.genre));
        }

        if (activeDate) {
            filtered = filtered.filter(e => e.start_time.includes(activeDate));
        }

        setEvents(filtered);
    }, [searchQuery, activeCity, activeGenre, activeDate, allEvents]);

    const handleSearchChange = (text: string) => {
        setSearchQuery(text);
        setIsSearching(true);
        if (searchTimeout) clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            setIsSearching(false);
        }, 800);
    };

    const handlePasswordSave = () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert("Hiba", "Kérjük, tölts ki minden jelszó mezőt!");
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert("Hiba", "Az új jelszavak nem egyeznek!");
            return;
        }
        Alert.alert("Siker", "A jelszó sikeresen frissítve a szimulációban.");
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    const openEventDetails = (visual: VisualEvent) => {
        const payload = visualEventToApiEvent(visual);
        if (navigation && navigation.navigate) {
            navigation.navigate('EventDetails', { event: payload });
        } else {
            Alert.alert(visual.name, visual.subtitle);
        }
    };

    const renderHomeView = () => (
        <View className="flex-1 bg-[#0B0D17]">
            <SafeAreaView edges={['top']} className="bg-[#0B0D17]">
                <View className="px-4 pb-3">
                    <View
                        className="flex-row items-center rounded-2xl border px-4 py-3.5"
                        style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.1)' }}
                    >
                        <Ionicons name="search" size={18} color="#9ca3af" style={{ marginRight: 10 }} />
                        <TextInput
                            className="flex-1 text-base text-white py-0"
                            placeholder="Search events, artists, venues..."
                            placeholderTextColor="rgba(255,255,255,0.35)"
                            value={searchQuery}
                            onChangeText={handleSearchChange}
                        />
                    </View>
                </View>
            </SafeAreaView>

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: tabBarReserve + 48 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => {
                            setRefreshing(true);
                            fetchEvents();
                        }}
                        tintColor="#3b82f6"
                    />
                }
            >
                {isSearching ? (
                    <View className="py-16 items-center justify-center">
                        <ActivityIndicator size="large" color="#3b82f6" />
                        <Text className="text-gray-400 mt-4">Searching...</Text>
                    </View>
                ) : (
                    <>
                        {/* Featured banner */}
                        <View className="mx-4 mb-4">
                            <View
                                className="relative overflow-hidden border"
                                style={{
                                    height: 192,
                                    borderRadius: 24,
                                    borderColor: 'rgba(255,255,255,0.08)',
                                }}
                            >
                                <Image
                                    source={{ uri: FEATURED_IMAGE }}
                                    className="w-full h-full"
                                    resizeMode="cover"
                                />
                                <LinearGradient
                                    colors={['rgba(11,13,23,0.15)', 'rgba(11,13,23,0.7)', '#0B0D17']}
                                    locations={[0, 0.45, 1]}
                                    style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
                                />

                                <View className="absolute bottom-0 left-0 right-0 p-4 flex-row items-end justify-between">
                                    <View className="flex-1 mr-2">
                                        <View className="flex-row items-center mb-1.5" style={{ gap: 6 }}>
                                            <Ionicons name="flame" size={12} color="#c084fc" />
                                            <Text
                                                className="text-xs font-semibold uppercase"
                                                style={{
                                                    color: '#c084fc',
                                                    letterSpacing: 1.2,
                                                    textShadowColor: 'rgba(192,132,252,0.6)',
                                                    textShadowOffset: { width: 0, height: 0 },
                                                    textShadowRadius: 12,
                                                }}
                                            >
                                                Tonight's Top Pick
                                            </Text>
                                        </View>
                                        <Text className="text-white text-xl font-bold leading-tight">
                                            Warehouse Techno Party
                                        </Text>
                                        <View className="flex-row items-center mt-1" style={{ gap: 4 }}>
                                            <Ionicons name="location-outline" size={12} color="#9ca3af" />
                                            <Text className="text-gray-400 text-xs">Gudang Sarinah, Bandung</Text>
                                        </View>
                                    </View>

                                    <View className="items-end" style={{ gap: 4 }}>
                                        <View className="flex-row items-center">
                                            {[AVATAR_F, null, null].map((src, i) => (
                                                <View
                                                    key={i}
                                                    className="w-7 h-7 rounded-full overflow-hidden border-2 flex-shrink-0"
                                                    style={{
                                                        marginLeft: i > 0 ? -8 : 0,
                                                        borderColor: '#0B0D17',
                                                        zIndex: 3 - i,
                                                    }}
                                                >
                                                    {src ? (
                                                        <Image
                                                            source={{ uri: src }}
                                                            className="w-full h-full"
                                                            resizeMode="cover"
                                                        />
                                                    ) : (
                                                        <LinearGradient
                                                            colors={AVATAR_GRADIENTS[i] ?? AVATAR_GRADIENTS[0]}
                                                            start={{ x: 0, y: 0 }}
                                                            end={{ x: 1, y: 1 }}
                                                            style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}
                                                        >
                                                            <Text className="text-white text-[8px] font-bold">R</Text>
                                                        </LinearGradient>
                                                    )}
                                                </View>
                                            ))}
                                            <View
                                                className="w-7 h-7 rounded-full items-center justify-center border-2 flex-shrink-0"
                                                style={{
                                                    marginLeft: -8,
                                                    backgroundColor: 'rgba(59,130,246,0.3)',
                                                    borderColor: '#0B0D17',
                                                    zIndex: 0,
                                                }}
                                            >
                                                <Text className="text-blue-300 text-[7px] font-bold">+4</Text>
                                            </View>
                                        </View>
                                        <Text className="text-gray-400" style={{ fontSize: 9 }}>
                                            friends going
                                        </Text>
                                    </View>
                                </View>

                                <View
                                    className="absolute top-3 right-3 flex-row items-center rounded-full border px-2.5 py-1"
                                    style={{
                                        backgroundColor: 'rgba(239,68,68,0.2)',
                                        borderColor: 'rgba(239,68,68,0.4)',
                                        gap: 4,
                                    }}
                                >
                                    <View
                                        className="w-1.5 h-1.5 rounded-full bg-red-400"
                                        style={{ opacity: 1 }}
                                    />
                                    <Text
                                        className="text-red-300 font-bold"
                                        style={{ fontSize: 9, letterSpacing: 1 }}
                                    >
                                        TONIGHT
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Date selector */}
                        <View className="mb-4">
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
                            >
                                {HOME_DAYS.map((d) => {
                                    const active = d.date === activeDay;
                                    return (
                                        <Pressable
                                            key={d.date}
                                            onPress={() => setActiveDay(d.date)}
                                            className="flex-shrink-0 flex-col items-center rounded-2xl border px-3 py-2.5"
                                            style={{
                                                backgroundColor: active ? '#2563eb' : 'rgba(255,255,255,0.04)',
                                                borderColor: active ? 'rgba(59,130,246,0.7)' : 'rgba(255,255,255,0.08)',
                                                minWidth: 52,
                                                shadowColor: active ? '#2563eb' : 'transparent',
                                                shadowOffset: { width: 0, height: 0 },
                                                shadowOpacity: active ? 0.6 : 0,
                                                shadowRadius: active ? 12 : 0,
                                                elevation: active ? 8 : 0,
                                            }}
                                        >
                                            <Text
                                                className="text-[10px] font-medium uppercase"
                                                style={{
                                                    color: active ? 'rgba(219,234,254,0.8)' : 'rgba(255,255,255,0.35)',
                                                    letterSpacing: 1,
                                                }}
                                            >
                                                {d.day}
                                            </Text>
                                            <Text
                                                className="text-base font-bold mt-0.5"
                                                style={{ color: active ? '#fff' : 'rgba(255,255,255,0.7)' }}
                                            >
                                                {d.date}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </ScrollView>
                        </View>

                        {/* Upcoming */}
                        <View className="mx-4 mb-6">
                            <View className="flex-row items-center justify-between mb-3">
                                <View className="flex-row items-center" style={{ gap: 8 }}>
                                    <Text className="text-white font-bold" style={{ fontSize: 17 }}>
                                        Upcoming Events
                                    </Text>
                                    <View
                                        className="w-2 h-2 rounded-full"
                                        style={{
                                            backgroundColor: '#3b82f6',
                                            shadowColor: '#3b82f6',
                                            shadowOffset: { width: 0, height: 0 },
                                            shadowOpacity: 0.9,
                                            shadowRadius: 6,
                                        }}
                                    />
                                </View>
                                <TouchableOpacity
                                    className="flex-row items-center"
                                    style={{ gap: 2 }}
                                    onPress={() => Alert.alert('Upcoming', 'See all events')}
                                    activeOpacity={0.7}
                                >
                                    <Text className="text-blue-400 text-xs font-medium">See all</Text>
                                    <Ionicons name="chevron-forward" size={14} color="#60a5fa" />
                                </TouchableOpacity>
                            </View>

                            <View style={{ gap: 12 }}>
                                {filteredVisualEvents.length === 0 ? (
                                    <View className="items-center py-12 rounded-3xl border border-white/10 bg-white/[0.04]">
                                        <Text className="text-gray-400 text-center px-6">
                                            No events for this day{searchQuery.trim() ? ' matching your search' : ''}.
                                        </Text>
                                    </View>
                                ) : (
                                    filteredVisualEvents.map((event) => (
                                        <Pressable
                                            key={event.id}
                                            onPress={() => openEventDetails(event)}
                                            className="relative overflow-hidden rounded-3xl border"
                                            style={{
                                                backgroundColor: 'rgba(255,255,255,0.04)',
                                                borderColor: 'rgba(255,255,255,0.09)',
                                                shadowColor: event.glow,
                                                shadowOffset: { width: 0, height: 0 },
                                                shadowOpacity: 0.45,
                                                shadowRadius: 16,
                                                elevation: 6,
                                            }}
                                        >
                                            <View
                                                className="relative overflow-hidden w-full"
                                                style={{ height: event.isLarge ? 140 : 110 }}
                                            >
                                                <Image
                                                    source={{ uri: event.image }}
                                                    className="w-full h-full"
                                                    resizeMode="cover"
                                                />
                                                <LinearGradient
                                                    colors={['rgba(0,0,0,0.15)', 'rgba(11,13,23,0.7)']}
                                                    style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
                                                />

                                                <View
                                                    className="absolute top-3 left-3 px-2.5 py-1 rounded-full border"
                                                    style={{
                                                        backgroundColor: event.genreColor.bg,
                                                        borderColor: event.genreColor.border,
                                                    }}
                                                >
                                                    <Text
                                                        className="text-[10px] font-bold uppercase"
                                                        style={{ color: event.genreColor.text, letterSpacing: 1 }}
                                                    >
                                                        {event.genre}
                                                    </Text>
                                                </View>

                                                <View
                                                    className="absolute top-3 right-3 flex-row items-center rounded-full border px-2 py-1"
                                                    style={{
                                                        backgroundColor: 'rgba(0,0,0,0.45)',
                                                        borderColor: 'rgba(255,255,255,0.1)',
                                                        gap: 4,
                                                    }}
                                                >
                                                    <Ionicons name="people-outline" size={10} color="#d1d5db" />
                                                    <Text className="text-gray-200 font-medium" style={{ fontSize: 9 }}>
                                                        +{event.friends} friends
                                                    </Text>
                                                </View>

                                                <View className="absolute bottom-2.5 left-3 flex-row items-center" style={{ gap: 8 }}>
                                                    <View
                                                        className="w-6 h-6 rounded-full overflow-hidden border"
                                                        style={{ borderColor: 'rgba(255,255,255,0.2)' }}
                                                    >
                                                        <Image
                                                            source={{ uri: DJ_AVATAR }}
                                                            className="w-full h-full"
                                                            resizeMode="cover"
                                                        />
                                                    </View>
                                                    <Text
                                                        className="text-white font-semibold"
                                                        style={{
                                                            fontSize: 10,
                                                            textShadowColor: 'rgba(0,0,0,0.5)',
                                                            textShadowOffset: { width: 0, height: 1 },
                                                            textShadowRadius: 4,
                                                        }}
                                                    >
                                                        {event.djName}
                                                    </Text>
                                                </View>
                                            </View>

                                            <View className="px-4 py-3">
                                                <View className="flex-row items-start justify-between mb-2">
                                                    <View className="flex-1 mr-2">
                                                        <Text className="text-white font-bold" style={{ fontSize: 15 }}>
                                                            {event.name}
                                                        </Text>
                                                        <Text className="text-gray-500 text-xs mt-0.5">{event.subtitle}</Text>
                                                    </View>
                                                    <View
                                                        className="flex-row items-center rounded-xl px-2.5 py-1.5 border"
                                                        style={{
                                                            backgroundColor: 'rgba(255,255,255,0.05)',
                                                            borderColor: 'rgba(255,255,255,0.08)',
                                                            gap: 4,
                                                        }}
                                                    >
                                                        <Ionicons name="star" size={12} color="#facc15" />
                                                        <Text className="text-white text-xs font-semibold">{event.going}</Text>
                                                    </View>
                                                </View>

                                                <View className="flex-row flex-wrap" style={{ gap: 16 }}>
                                                    <View className="flex-row items-center" style={{ gap: 6 }}>
                                                        <Ionicons name="calendar-outline" size={12} color="#6b7280" />
                                                        <Text className="text-gray-400 text-xs">{event.date}</Text>
                                                    </View>
                                                    <View className="flex-row items-center" style={{ gap: 6 }}>
                                                        <Ionicons name="time-outline" size={12} color="#6b7280" />
                                                        <Text className="text-gray-400 text-xs">{event.time}</Text>
                                                    </View>
                                                    <View className="flex-row items-center flex-1 min-w-[120px]" style={{ gap: 6 }}>
                                                        <Ionicons name="location-outline" size={12} color="#6b7280" />
                                                        <Text className="text-gray-400 text-xs" style={{ flexShrink: 1 }} numberOfLines={1}>
                                                            {event.location}
                                                        </Text>
                                                    </View>
                                                </View>

                                                <TouchableOpacity
                                                    className="mt-3 w-full py-2 rounded-2xl border"
                                                    style={{
                                                        backgroundColor: 'rgba(59,130,246,0.12)',
                                                        borderColor: 'rgba(59,130,246,0.3)',
                                                        shadowColor: '#3b82f6',
                                                        shadowOffset: { width: 0, height: 0 },
                                                        shadowOpacity: 0.15,
                                                        shadowRadius: 8,
                                                    }}
                                                    activeOpacity={0.85}
                                                    onPress={() =>
                                                        Alert.alert('RSVP', `You're going to ${event.name}`)
                                                    }
                                                >
                                                    <Text
                                                        className="text-center text-sm font-semibold"
                                                        style={{ color: '#93c5fd' }}
                                                    >
                                                        I&apos;m Going →
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </Pressable>
                                    ))
                                )}
                            </View>
                        </View>

                        <View className="h-2" />
                    </>
                )}
            </ScrollView>
        </View>
    );

    const renderSearchView = () => (
        <SafeAreaView edges={['top']} className="flex-1 bg-[#0B0D17]">
            <ScrollView
                className="flex-1 px-4"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: 16, paddingBottom: tabBarReserve + 32 }}
            >
                <Text className="mb-2 text-3xl font-extrabold tracking-tight text-white">Keresés</Text>
                <Text className="mb-6 text-sm leading-relaxed text-gray-400">
                    Események, előadók és helyszínek keresése — a találatok a Kezdőlapon jelennek meg.
                </Text>
                <View
                    className="mb-8 flex-row items-center rounded-2xl border px-4 py-3.5"
                    style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.1)' }}
                >
                    <Ionicons name="search" size={18} color="#9ca3af" style={{ marginRight: 10 }} />
                    <TextInput
                        className="flex-1 py-0 text-base text-white"
                        placeholder="Bulik, DJ-k, klubok..."
                        placeholderTextColor="rgba(255,255,255,0.35)"
                        value={searchQuery}
                        onChangeText={handleSearchChange}
                    />
                </View>
                <TouchableOpacity
                    onPress={() => setActiveTab('Home')}
                    className="items-center rounded-2xl border border-blue-500/40 bg-blue-600/20 py-4"
                    activeOpacity={0.85}
                >
                    <Text className="font-bold text-blue-300">Ugrás a Kezdőlapra a találatokhoz →</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );

    const renderProfileView = () => (
        <ScrollView
            className="flex-1 pt-16"
            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: tabBarReserve + 48 }}
            showsVerticalScrollIndicator={false}
        >
            {/* Profil Információk */}
            <View className="mb-12">
                <Text className="text-white text-3xl font-extrabold tracking-tight mb-2">Profil Információk</Text>
                <Text className="text-gray-400 text-sm mb-8 leading-relaxed">Frissítsd a fiókod adatait és a profilképedet.</Text>
                
                <View className="flex-row items-center mb-8 bg-gray-800/50 p-4 rounded-2xl border border-gray-700/50">
                    <View className="w-20 h-20 rounded-full bg-gray-700/80 justify-center items-center overflow-hidden border border-gray-600 mr-5 shadow-sm shadow-black">
                       <Text className="text-4xl">📸</Text>
                    </View>
                    <TouchableOpacity onPress={() => Alert.alert("Szimuláció", "Fájlfeltöltő ablak megnyitása...")} className="bg-gray-800 border border-gray-600 px-5 py-2.5 rounded-xl shadow-sm">
                        <Text className="text-gray-300 text-sm font-semibold tracking-wide">Choose File</Text>
                    </TouchableOpacity>
                </View>

                <View className="mb-5">
                    <Text className="text-gray-300 text-sm font-bold mb-2 ml-1 uppercase tracking-wider">Név</Text>
                    <TextInput 
                        className="bg-gray-800 text-white rounded-2xl px-5 py-4 border border-gray-700 text-base" 
                        placeholder="Név" 
                        placeholderTextColor="#6b7280"
                        value={profileName} 
                        onChangeText={setProfileName}
                    />
                </View>

                <View className="mb-8">
                    <Text className="text-gray-300 text-sm font-bold mb-2 ml-1 uppercase tracking-wider">Email</Text>
                    <TextInput 
                        className="bg-gray-800 text-white rounded-2xl px-5 py-4 border border-gray-700 text-base" 
                        placeholder="Email" 
                        placeholderTextColor="#6b7280"
                        value={profileEmail} 
                        onChangeText={setProfileEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                <TouchableOpacity 
                    onPress={() => Alert.alert("Siker!", "Az adataidat sikeresen frissítettük.")} 
                    className="bg-blue-600 rounded-2xl py-4 items-center shadow-lg shadow-blue-600/30 w-1/2"
                >
                    <Text className="text-white font-bold text-base tracking-widest">MENTÉS</Text>
                </TouchableOpacity>
            </View>

            {/* Jelszó Frissítése */}
            <View className="mb-12 pt-10 border-t border-gray-800">
                <Text className="text-white text-2xl font-bold mb-2">Jelszó Frissítése</Text>
                <Text className="text-gray-400 text-sm mb-8 leading-relaxed">
                    Győződj meg róla, hogy fiókod hosszú, véletlenszerű jelszót használ a biztonság érdekében.
                </Text>
                
                <View className="mb-5">
                    <Text className="text-gray-300 text-sm font-bold mb-2 ml-1 uppercase tracking-wider">Current Password</Text>
                    <TextInput 
                        className="bg-gray-800 text-white rounded-2xl px-5 py-4 border border-gray-700 text-base" 
                        placeholder="Current Password" 
                        placeholderTextColor="#6b7280"
                        secureTextEntry 
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                    />
                </View>

                <View className="mb-5">
                    <Text className="text-gray-300 text-sm font-bold mb-2 ml-1 uppercase tracking-wider">New Password</Text>
                    <TextInput 
                        className="bg-gray-800 text-white rounded-2xl px-5 py-4 border border-gray-700 text-base" 
                        placeholder="New Password" 
                        placeholderTextColor="#6b7280"
                        secureTextEntry 
                        value={newPassword}
                        onChangeText={setNewPassword}
                    />
                </View>

                <View className="mb-8">
                    <Text className="text-gray-300 text-sm font-bold mb-2 ml-1 uppercase tracking-wider">Confirm Password</Text>
                    <TextInput 
                        className="bg-gray-800 text-white rounded-2xl px-5 py-4 border border-gray-700 text-base" 
                        placeholder="Confirm Password" 
                        placeholderTextColor="#6b7280"
                        secureTextEntry 
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                </View>

                <TouchableOpacity onPress={handlePasswordSave} className="bg-blue-600 rounded-2xl py-4 items-center shadow-lg shadow-blue-600/30 w-1/2">
                    <Text className="text-white font-bold text-base tracking-widest">SAVE</Text>
                </TouchableOpacity>
            </View>

            {/* Fiók Törlése */}
            <View className="pt-10 border-t border-gray-800">
                <Text className="text-white text-2xl font-bold mb-2">Fiók Törlése</Text>
                <Text className="text-gray-400 text-sm mb-8 leading-relaxed">
                    Miután fiókodat törölted, minden erőforrása és adata véglegesen törlődik. Mielőtt törölnéd fiókodat, kérjük töltsd le az adatokat, amelyeket meg szeretnél tartani.
                </Text>
                
                <TouchableOpacity 
                    onPress={() => Alert.alert("Megerősítés", "Biztosan törölni szeretnéd a fiókodat? Ez a művelet végleges.", [
                        { text: 'Mégse', style: 'cancel' },
                        { text: 'Igen, törlöm', style: 'destructive', onPress: () => Alert.alert("Fiók törölve", "A fiókodat sikeresen töröltük a szimuláció szerint.") }
                    ])} 
                    className="bg-red-600 rounded-2xl py-4 items-center shadow-lg shadow-red-600/30 w-1/2"
                >
                    <Text className="text-white font-bold text-base tracking-widest">Fiók törlése</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );

    if (loading && !refreshing) {
        return (
            <View className="flex-1 bg-[#0B0D17] justify-center items-center">
                <ActivityIndicator size="large" color="#3b82f6" />
            </View>
        );
    }

    const tabActive = (t: MainTab) => activeTab === t;

    const glassNavShadow = Platform.select({
        ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.5,
            shadowRadius: 24,
        },
        android: { elevation: 18 },
        default: {},
    });

    const iconColor = (active: boolean) => (active ? '#60a5fa' : 'rgba(255,255,255,0.3)');

    return (
        <View className="flex-1 bg-gray-900">
            {activeTab === 'Home' && renderHomeView()}
            {activeTab === 'Search' && renderSearchView()}
            {activeTab === 'Match' && (
                <View className="flex-1" collapsable={false}>
                    <FelfedezesSimulator bottomInset={tabBarReserve} />
                </View>
            )}
            {activeTab === 'Profile' && renderProfileView()}

            {activeTab === 'Messages' && (
                <View className="flex-1" style={{ paddingBottom: tabBarReserve }}>
                    <ChatScreen />
                </View>
            )}

            {/* Premium glass tab bar — floats above content (Match swipe stack included) */}
            <View
                pointerEvents="box-none"
                className="absolute bottom-0 left-0 right-0 items-center"
                style={{ zIndex: 200, elevation: 200, paddingBottom: insets.bottom }}
            >
                <View className="mb-5 w-full px-4">
                    <View
                        className="flex-row items-center justify-between rounded-3xl border border-white/10 px-2 py-2.5"
                        style={{
                            backgroundColor: 'rgba(13,16,32,0.92)',
                            ...glassNavShadow,
                        }}
                    >
                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel="Kezdőlap"
                            hitSlop={8}
                            onPress={() => setActiveTab('Home')}
                            className="h-9 w-9 items-center justify-center rounded-full"
                            style={{
                                backgroundColor: tabActive('Home') ? 'rgba(59,130,246,0.15)' : 'transparent',
                                ...(tabActive('Home')
                                    ? Platform.select({
                                          ios: {
                                              shadowColor: '#3b82f6',
                                              shadowOffset: { width: 0, height: 0 },
                                              shadowOpacity: 0.35,
                                              shadowRadius: 12,
                                          },
                                          android: { elevation: 6 },
                                          default: {},
                                      })
                                    : {}),
                            }}
                        >
                            <Ionicons name="home" size={22} color={iconColor(tabActive('Home'))} />
                        </Pressable>

                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel="Keresés"
                            hitSlop={8}
                            onPress={() => setActiveTab('Search')}
                            className="h-9 w-9 items-center justify-center rounded-full"
                            style={{
                                backgroundColor: tabActive('Search') ? 'rgba(59,130,246,0.15)' : 'transparent',
                                ...(tabActive('Search')
                                    ? Platform.select({
                                          ios: {
                                              shadowColor: '#3b82f6',
                                              shadowOffset: { width: 0, height: 0 },
                                              shadowOpacity: 0.35,
                                              shadowRadius: 12,
                                          },
                                          android: { elevation: 6 },
                                          default: {},
                                      })
                                    : {}),
                            }}
                        >
                            <Ionicons name="search" size={22} color={iconColor(tabActive('Search'))} />
                        </Pressable>

                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel="Match"
                            onPress={() => setActiveTab('Match')}
                            className="flex-row items-center gap-1.5 rounded-full border px-4 py-2"
                            style={{
                                backgroundColor: tabActive('Match')
                                    ? 'rgba(59,130,246,0.22)'
                                    : 'rgba(59,130,246,0.1)',
                                borderColor: tabActive('Match')
                                    ? 'rgba(59,130,246,0.55)'
                                    : 'rgba(59,130,246,0.22)',
                                ...Platform.select({
                                    ios: {
                                        shadowColor: '#3b82f6',
                                        shadowOffset: { width: 0, height: 0 },
                                        shadowOpacity: tabActive('Match') ? 0.55 : 0.2,
                                        shadowRadius: tabActive('Match') ? 18 : 10,
                                    },
                                    android: { elevation: tabActive('Match') ? 10 : 4 },
                                    default: {},
                                }),
                            }}
                        >
                            <Ionicons
                                name="flash"
                                size={14}
                                color="#93c5fd"
                                style={{ opacity: tabActive('Match') ? 1 : 0.85 }}
                            />
                            <Text
                                className="text-xs font-bold uppercase tracking-widest"
                                style={{ color: '#93c5fd' }}
                            >
                                Match
                            </Text>
                        </Pressable>

                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel="Üzenetek"
                            hitSlop={8}
                            onPress={() => setActiveTab('Messages')}
                            className="h-9 w-9 items-center justify-center rounded-full"
                            style={{
                                backgroundColor: tabActive('Messages') ? 'rgba(59,130,246,0.15)' : 'transparent',
                                ...(tabActive('Messages')
                                    ? Platform.select({
                                          ios: {
                                              shadowColor: '#3b82f6',
                                              shadowOffset: { width: 0, height: 0 },
                                              shadowOpacity: 0.35,
                                              shadowRadius: 12,
                                          },
                                          android: { elevation: 6 },
                                          default: {},
                                      })
                                    : {}),
                            }}
                        >
                            <Ionicons
                                name="chatbubble-ellipses-outline"
                                size={22}
                                color={iconColor(tabActive('Messages'))}
                            />
                        </Pressable>

                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel="Profil"
                            hitSlop={8}
                            onPress={() => setActiveTab('Profile')}
                            className="h-9 w-9 items-center justify-center rounded-full"
                            style={{
                                backgroundColor: tabActive('Profile') ? 'rgba(59,130,246,0.15)' : 'transparent',
                                ...(tabActive('Profile')
                                    ? Platform.select({
                                          ios: {
                                              shadowColor: '#3b82f6',
                                              shadowOffset: { width: 0, height: 0 },
                                              shadowOpacity: 0.35,
                                              shadowRadius: 12,
                                          },
                                          android: { elevation: 6 },
                                          default: {},
                                      })
                                    : {}),
                            }}
                        >
                            <Ionicons name="person-outline" size={22} color={iconColor(tabActive('Profile'))} />
                        </Pressable>
                    </View>
                </View>
            </View>
        </View>
    );
}
