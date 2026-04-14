import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity, Image, TextInput, Modal, ScrollView, Alert } from 'react-native';
import { Event } from '../types/event';

const DISCOVERY_PROFILES = [
    { name: 'Alex', age: 24, bio: 'House zene rajongó. Dobjunk össze egy taxira hazafelé!', image: '👨‍🎤', color: 'bg-blue-900/40' },
    { name: 'Dóra', age: 22, bio: 'Mindenre nyitott vagyok, igyunk valamit!', image: '👩‍🎤', color: 'bg-purple-900/40' },
    { name: 'Balázs', age: 25, bio: 'Techno haver, keress meg a pultnál!', image: '😎', color: 'bg-green-900/40' },
];

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

export default function HomeScreen({ navigation }: any) {
    const [allEvents, setAllEvents] = useState<Event[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Navigáció szimuláció
    const [activeTab, setActiveTab] = useState('Home');

    // Keresés és szűrő állapotok
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    let searchTimeout: any = null;

    const [isFilterModalVisible, setFilterModalVisible] = useState(false);
    // Felfedezés oldal állapotok
    const [discoveryMode, setDiscoveryMode] = useState('event');
    const [currentProfileIndex, setCurrentProfileIndex] = useState(0);

    const [tempCity, setTempCity] = useState('');
    const [tempDate, setTempDate] = useState('');
    const [tempGenre, setTempGenre] = useState<string[]>([]);
    const [activeCity, setActiveCity] = useState('');
    const [activeDate, setActiveDate] = useState('');
    const [activeGenre, setActiveGenre] = useState<string[]>([]);

    // Barátkereső állapot
    const [isFindingFriends, setIsFindingFriends] = useState(false);

    // Profil oldal állapotok
    const [profileName, setProfileName] = useState('Test User');
    const [profileEmail, setProfileEmail] = useState('test@example.com');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [isLoggedIn, setIsLoggedIn] = useState(false);

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
            setAllEvents(DUMMY_EVENTS as any);
            setLoading(false);
            setRefreshing(false);
        }, 600);
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    // Dinamikus szűrés
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

    const renderEventItem = ({ item }: { item: Event }) => {
        const imageUrl = item.image_url;
        const eventDate = new Date(item.start_time);

        return (
            <TouchableOpacity
                className="bg-gray-800 rounded-2xl mb-5 border border-gray-700 overflow-hidden shadow-lg shadow-black/50"
                onPress={() => {
                    if (navigation && navigation.navigate) {
                        navigation.navigate('EventDetails', { event: item });
                    } else {
                        Alert.alert('Szimuláció', 'Esemény részletei megnyitva: ' + item.title);
                    }
                }}
                activeOpacity={0.8}
            >
                <Image source={{ uri: imageUrl }} className="w-full h-56" resizeMode="cover" />

                <View className="p-5">
                    <View className="flex-row justify-between items-start mb-2">
                        <View className="flex-1 mr-3">
                            <Text className="text-white text-xl font-bold mb-1" numberOfLines={2}>{item.title}</Text>
                            <Text className="text-blue-400 font-semibold mb-2">
                                {eventDate.toLocaleDateString('hu-HU', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </Text>
                        </View>
                        <View className="bg-blue-600/20 px-3 py-1.5 rounded-full border border-blue-500/30">
                            <Text className="text-blue-400 text-xs font-bold uppercase tracking-wider">{item.genre || 'Party'}</Text>
                        </View>
                    </View>

                    <View className="flex-row items-center mb-3 mt-1">
                        <Text className="text-gray-400 text-sm">
                            📍 {item.location?.name || 'Ismeretlen helyszín'}
                            {item.location?.city?.name ? `, ${item.location.city.name}` : ''}
                        </Text>
                    </View>

                    <View className="pt-3 border-t border-gray-700/50 flex-row items-center justify-between">
                        {isLoggedIn ? (
                            <View className="flex-row items-center">
                                <Text className="text-gray-400 text-sm">🔥 <Text className="text-white font-medium">{item.interested_count}</Text> érdeklődő</Text>
                            </View>
                        ) : (
                            <View className="flex-row items-center">
                                <Text className="text-gray-500 text-xs italic">Jelentkezz be a részletekért 🔒</Text>
                            </View>
                        )}
                        <Text className="text-blue-400 text-sm font-medium">Részletek →</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const renderHomeView = () => (
        <View className="flex-1">
            {/* Header Area */}
            <View className="pt-16 pb-4 px-6 bg-gray-900 border-b border-gray-800 z-10 shadow-lg shadow-black/30">
                <Text className="text-white text-3xl font-extrabold tracking-tight">PartyFinder</Text>
                <Text className="text-gray-400 text-sm mt-1">Fedezd fel a legjobb bulikat</Text>

                {/* Main Search Bar */}
                <View className="flex-row items-center mt-4 mb-2">
                    <View className="flex-1 bg-gray-800 rounded-xl flex-row items-center px-4 h-14 border border-gray-700 shadow-sm shadow-black/20">
                        <Text className="text-gray-400 mr-3 text-xl opacity-70">🔍</Text>
                        <TextInput
                            className="flex-1 text-white text-base py-0 h-full"
                            placeholder="Keress eseményt..."
                            placeholderTextColor="#9ca3af"
                            value={searchQuery}
                            onChangeText={handleSearchChange}
                        />
                    </View>
                </View>
            </View>

            <View className="flex-1 px-4 pt-4">
                <Text className="text-white text-2xl font-bold mb-4 ml-2">Legnépszerűbb Bulik</Text>
                
                {isSearching ? (
                    <View className="py-20 items-center justify-center">
                        <ActivityIndicator size="large" color="#3b82f6" />
                        <Text className="text-gray-400 mt-4">Keresés...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={events}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderEventItem}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 150 }}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchEvents(); }} tintColor="#3b82f6" />}
                        ListFooterComponent={
                            <View className="bg-gray-800 rounded-3xl p-6 border border-gray-700 mt-6 mb-8 shadow-xl shadow-black/50">
                                <Text className="text-white text-xl font-bold mb-2">Barátkereső - Közös bulizáshoz</Text>
                                <Text className="text-gray-400 text-sm mb-6">Közös bulizó havert keresel?</Text>
                                
                                <View className="flex-row justify-around mb-8">
                                    <TouchableOpacity className="items-center" onPress={() => Alert.alert('Profil Info', 'Név: Alex\nÉrdeklődés: House kedvelő')}>
                                        <View className="w-16 h-16 rounded-full bg-blue-900/40 border-2 border-blue-500/50 justify-center items-center mb-3">
                                            <Text className="text-3xl">👨‍🎤</Text>
                                        </View>
                                        <Text className="text-white font-bold text-sm">Alex</Text>
                                        <Text className="text-gray-500 text-xs mt-1">House kedvelő</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity className="items-center" onPress={() => Alert.alert('Profil Info', 'Név: Dóra\nÉrdeklődés: Mindenre nyitott')}>
                                        <View className="w-16 h-16 rounded-full bg-purple-900/40 border-2 border-purple-500/50 justify-center items-center mb-3">
                                            <Text className="text-3xl">👩‍🎤</Text>
                                        </View>
                                        <Text className="text-white font-bold text-sm">Dóra</Text>
                                        <Text className="text-gray-500 text-xs text-center mt-1 leading-tight">Mindenre{'\n'}nyitott</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity className="items-center" onPress={() => Alert.alert('Profil Info', 'Név: Balázs\nÉrdeklődés: Techno haver')}>
                                        <View className="w-16 h-16 rounded-full bg-green-900/40 border-2 border-green-500/50 justify-center items-center mb-3">
                                            <Text className="text-3xl">😎</Text>
                                        </View>
                                        <Text className="text-white font-bold text-sm">Balázs</Text>
                                        <Text className="text-gray-500 text-xs text-center mt-1 leading-tight">Techno{'\n'}haver</Text>
                                    </TouchableOpacity>
                                </View>

                                <TouchableOpacity 
                                    className="bg-blue-600 rounded-2xl py-4 items-center shadow-lg shadow-blue-600/40"
                                    activeOpacity={0.8}
                                    onPress={() => {
                                        setIsFindingFriends(true);
                                        setTimeout(() => {
                                            setIsFindingFriends(false);
                                            Alert.alert('Eredmény', 'Találtunk 3 megbízható partnert a környékeden, akik csatlakoznának!');
                                        }, 1500)
                                    }}
                                >
                                    {isFindingFriends ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <Text className="text-white font-bold text-lg tracking-wide">Keress barátokat</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        }
                        ListEmptyComponent={
                            <View className="items-center justify-center py-20 mt-4">
                                <Text className="text-5xl mb-4 opacity-50">🕵️‍♂️</Text>
                                <Text className="text-gray-300 text-lg font-medium text-center">Nincs a keresésnek megfelelő esemény.</Text>
                            </View>
                        }
                    />
                )}
            </View>
        </View>
    );

    const renderProfileView = () => (
        <ScrollView className="flex-1 pt-16" contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 150 }} showsVerticalScrollIndicator={false}>
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

    const renderDiscoveryView = () => {
        const currentProfile = DISCOVERY_PROFILES[currentProfileIndex % DISCOVERY_PROFILES.length];

        return (
            <ScrollView className="flex-1 pt-16" contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 150 }} showsVerticalScrollIndicator={false}>
                {/* Részletes Kereső */}
                <View className="mb-10">
                    <Text className="text-white text-3xl font-extrabold tracking-tight mb-6">Keresés és Szűrés</Text>
                    
                    <View className="bg-gray-800 rounded-3xl p-6 border border-gray-700 shadow-xl shadow-black/50">
                        <View className="mb-5">
                            <Text className="text-gray-400 text-sm font-bold mb-3 uppercase tracking-wider">Város</Text>
                            <View className="bg-gray-900 rounded-2xl border border-gray-700 px-4 h-14 justify-center">
                                <Text className="text-gray-300 font-medium">Minden város</Text>
                            </View>
                        </View>

                        <View className="mb-5">
                            <Text className="text-gray-400 text-sm font-bold mb-3 uppercase tracking-wider">Dátum</Text>
                            <View className="bg-gray-900 rounded-2xl border border-gray-700 flex-row items-center px-4 h-14">
                                <Text className="text-gray-400 mr-3 text-lg">📅</Text>
                                <Text className="text-gray-300 font-medium">Bármikor</Text>
                            </View>
                        </View>

                        <View className="mb-8">
                            <Text className="text-gray-400 text-sm font-bold mb-3 uppercase tracking-wider">Műfaj</Text>
                            <View className="flex-row flex-wrap">
                                {['EDM', 'Techno', 'House', 'Retro'].map(genre => (
                                    <View key={genre} className="px-4 py-2.5 rounded-full border border-gray-700 bg-gray-900 mr-2 mb-3">
                                        <Text className="text-gray-300 font-medium">{genre}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        <TouchableOpacity 
                            className="bg-blue-600 rounded-2xl py-4 items-center shadow-lg shadow-blue-600/40"
                            onPress={() => Alert.alert('Keresés', 'Szűrők alkalmazva.')}
                        >
                            <Text className="text-white font-bold text-lg tracking-wide">Keresés</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Barátkereső (Tinder-style Swipe Feature) */}
                <View className="mb-8">
                    <Text className="text-white text-3xl font-extrabold tracking-tight mb-6">Kivel bulizol ma?</Text>

                    {/* Mode Switcher */}
                    <View className="bg-gray-800 rounded-2xl flex-row p-1 mb-6 border border-gray-700">
                        <TouchableOpacity 
                            onPress={() => setDiscoveryMode('event')}
                            className={`flex-1 py-3 rounded-xl items-center ${discoveryMode === 'event' ? 'bg-gray-700 shadow-sm' : ''}`}
                        >
                            <Text className={`${discoveryMode === 'event' ? 'text-white font-bold' : 'text-gray-400 font-medium'}`}>Esemény alapján</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => setDiscoveryMode('random')}
                            className={`flex-1 py-3 rounded-xl items-center ${discoveryMode === 'random' ? 'bg-gray-700 shadow-sm' : ''}`}
                        >
                            <Text className={`${discoveryMode === 'random' ? 'text-white font-bold' : 'text-gray-400 font-medium'}`}>Random Profilok</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Context Text */}
                    <Text className="text-gray-400 text-sm mb-6 text-center px-4 leading-relaxed">
                        {discoveryMode === 'event' 
                            ? "Ők is a Nyárindító Mega Party-ra mennek! Keress társaságot a pulthoz vagy a taxihoz."
                            : "Fedezz fel új arcokat a közeledben!"}
                    </Text>

                    {/* Swipe Card UI */}
                    <View className="bg-gray-800 rounded-3xl overflow-hidden border border-gray-700 shadow-2xl shadow-black relative h-96 items-center justify-center mb-8">
                        <View className={`absolute inset-0 ${currentProfile.color} opacity-30`} />
                        <Text className="text-9xl mb-10">{currentProfile.image}</Text>

                        {/* Card Content Overlay */}
                        <View className="absolute bottom-0 left-0 right-0 p-6 bg-gray-900/90 pt-8 border-t border-gray-800">
                            <Text className="text-white text-2xl font-extrabold mb-1">{currentProfile.name}, {currentProfile.age}</Text>
                            <Text className="text-gray-300 text-base leading-relaxed">{currentProfile.bio}</Text>
                        </View>
                    </View>

                    {/* Swipe Controls */}
                    <View className="flex-row justify-center items-center">
                        <TouchableOpacity 
                            onPress={() => setCurrentProfileIndex(prev => prev + 1)}
                            className="bg-gray-800 w-16 h-16 rounded-full items-center justify-center border-2 border-red-500/50 shadow-lg shadow-red-500/20 mx-4"
                        >
                            <Text className="text-red-500 text-2xl font-bold">✕</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            onPress={() => {
                                Alert.alert('✨ Match!', 'Kölcsönös szimpátia! Írj neki egy üzenetet.');
                                setCurrentProfileIndex(prev => prev + 1);
                            }}
                            className="bg-gray-800 w-16 h-16 rounded-full items-center justify-center border-2 border-green-500/50 shadow-lg shadow-green-500/20 mx-4"
                        >
                            <Text className="text-green-500 text-2xl font-bold">❤️</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        );
    };

    if (loading && !refreshing) {
        return (
            <View className="flex-1 bg-gray-900 justify-center items-center">
                <ActivityIndicator size="large" color="#3b82f6" />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-900">
            {activeTab === 'Home' && renderHomeView()}
            {activeTab === 'Profile' && renderProfileView()}
            {activeTab === 'Felfedezés' && renderDiscoveryView()}

            {activeTab === 'Messages' && (
                <View className="flex-1 items-center justify-center pb-20">
                    <Text className="text-6xl mb-6">💬</Text>
                    <Text className="text-white text-2xl font-bold mb-2">Üzenetek</Text>
                    <Text className="text-gray-400 text-center px-8">Itt jelennek majd meg a beszélgetéseid a szervezőkkel és a barátaiddal.</Text>
                </View>
            )}

            {/* INTERACTIVE BOTTOM NAVIGATION SIMULATION */}
            <View className="absolute bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 flex-row justify-around items-center pt-3 pb-8 px-2 shadow-2xl">
                {/* Home Tab */}
                <TouchableOpacity
                    className="items-center justify-center p-2 flex-1"
                    onPress={() => setActiveTab('Home')}
                    activeOpacity={0.7}
                >
                    <View className={`w-12 h-10 rounded-xl items-center justify-center ${activeTab === 'Home' ? 'bg-blue-600/20' : ''}`}>
                        <Text className={`text-[22px] ${activeTab === 'Home' ? 'opacity-100' : 'opacity-50'}`}>🏠</Text>
                    </View>
                    <Text className={`text-[10px] font-bold mt-1 ${activeTab === 'Home' ? 'text-blue-500' : 'text-gray-500'}`}>Kezdőlap</Text>
                </TouchableOpacity>

                {/* Felfedezés Tab */}
                <TouchableOpacity
                    className="items-center justify-center p-2 flex-1"
                    onPress={() => setActiveTab('Felfedezés')}
                    activeOpacity={0.7}
                >
                    <View className={`w-12 h-10 rounded-xl items-center justify-center ${activeTab === 'Felfedezés' ? 'bg-blue-600/20' : ''}`}>
                        <Text className={`text-[22px] ${activeTab === 'Felfedezés' ? 'opacity-100' : 'opacity-50'}`}>🧭</Text>
                    </View>
                    <Text className={`text-[10px] font-bold mt-1 ${activeTab === 'Felfedezés' ? 'text-blue-500' : 'text-gray-500'}`}>Felfedezés</Text>
                </TouchableOpacity>

                {/* Messages Tab */}
                <TouchableOpacity
                    className="items-center justify-center p-2 flex-1"
                    onPress={() => setActiveTab('Messages')}
                    activeOpacity={0.7}
                >
                    <View className={`w-12 h-10 rounded-xl items-center justify-center ${activeTab === 'Messages' ? 'bg-blue-600/20' : ''}`}>
                        <Text className={`text-[22px] ${activeTab === 'Messages' ? 'opacity-100' : 'opacity-50'}`}>💬</Text>
                    </View>
                    <Text className={`text-[10px] font-bold mt-1 ${activeTab === 'Messages' ? 'text-blue-500' : 'text-gray-500'}`}>Üzenetek</Text>
                </TouchableOpacity>

                {/* Profile Tab */}
                <TouchableOpacity
                    className="items-center justify-center p-2 flex-1"
                    onPress={() => setActiveTab('Profile')}
                    activeOpacity={0.7}
                >
                    <View className={`w-12 h-10 rounded-xl items-center justify-center ${activeTab === 'Profile' ? 'bg-blue-600/20' : ''}`}>
                        <Text className={`text-[22px] ${activeTab === 'Profile' ? 'opacity-100' : 'opacity-50'}`}>👤</Text>
                    </View>
                    <Text className={`text-[10px] font-bold mt-1 ${activeTab === 'Profile' ? 'text-blue-500' : 'text-gray-500'}`}>Profil</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}