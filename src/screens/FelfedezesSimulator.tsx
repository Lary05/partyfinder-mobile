import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet } from 'react-native';

const DISCOVERY_PROFILES = [
    { name: 'Alex, 24', bio: 'House kedvelő. Dobjunk össze taxira!', image: '👨‍🎤', color: 'bg-blue-900/40' },
    { name: 'Dóra, 22', bio: 'Mindenre nyitott vagyok.', image: '👩‍🎤', color: 'bg-purple-900/40' },
    { name: 'Balázs, 26', bio: 'Techno hajnalig.', image: '😎', color: 'bg-green-900/40' }
];

export default function FelfedezesSimulator() {
    const [currentView, setCurrentView] = useState<'search' | 'swipe'>('search');
    const [profileIndex, setProfileIndex] = useState(0);

    const activeProfile = DISCOVERY_PROFILES[profileIndex % DISCOVERY_PROFILES.length];

    const nextProfile = () => setProfileIndex(prev => prev + 1);

    if (currentView === 'swipe') {
        return (
            <View className="flex-1 bg-gray-900 pt-16">
                {/* View B */}
                <View className="px-6 mb-8 flex-row items-center border-b border-gray-800 pb-4 shadow-sm">
                    <TouchableOpacity 
                        onPress={() => setCurrentView('search')}
                        className="bg-gray-800 px-4 py-2 rounded-xl flex-row items-center shadow-lg shadow-black/20"
                    >
                        <Text className="text-white text-base font-bold tracking-wide">⬅ Vissza a kereséshez</Text>
                    </TouchableOpacity>
                </View>

                <View className="flex-1 px-6 items-center">
                    <Text className="text-gray-400 text-lg mb-8 font-medium text-center">Találj társaságot a ma esti bulihoz!</Text>

                    {/* Profile Card */}
                    <View className="w-full bg-gray-800 rounded-[32px] overflow-hidden border border-gray-700 shadow-2xl shadow-black relative h-[450px] items-center justify-center mb-10">
                        <View className={`absolute inset-0 ${activeProfile.color} opacity-40`} />
                        <Text className="text-[120px] mb-12 shadow-sm">{activeProfile.image}</Text>

                        {/* Card Content Overlay */}
                        <View className="absolute bottom-0 left-0 right-0 p-8 pt-10 bg-gray-900/95 border-t border-gray-800/80">
                            <Text className="text-white text-3xl font-extrabold mb-2 tracking-tight">{activeProfile.name}</Text>
                            <Text className="text-gray-300 text-lg leading-relaxed font-medium">{activeProfile.bio}</Text>
                        </View>
                    </View>

                    {/* Swipe Controls */}
                    <View className="flex-row justify-center items-center w-full max-w-[280px] justify-between">
                        <TouchableOpacity 
                            onPress={nextProfile}
                            className="bg-gray-800 w-20 h-20 rounded-full items-center justify-center border-2 border-red-500/50 shadow-xl shadow-red-500/20 active:scale-95 transition-transform"
                        >
                            <Text className="text-red-500 text-3xl font-bold">✕</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            onPress={nextProfile}
                            className="bg-gray-800 w-20 h-20 rounded-full items-center justify-center border-2 border-green-500/50 shadow-xl shadow-green-500/20 active:scale-95 transition-transform"
                        >
                            <Text className="text-green-500 text-4xl font-bold">♥</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-900">
            {/* View A */}
            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120 }}>
                {/* Header */}
                <View className="pt-20 px-6 pb-6 bg-gray-900 border-b border-gray-800 shadow-md">
                    <Text className="text-white text-4xl font-extrabold tracking-tight">Felfedezés</Text>
                </View>

                {/* Filter Controls */}
                <View className="px-6 pt-8">
                    <View className="bg-gray-800 rounded-[28px] p-7 border border-gray-700 shadow-xl shadow-black/40">
                        
                        <View className="mb-6">
                            <Text className="text-gray-400 text-sm font-bold mb-3 uppercase tracking-widest text-indigo-300">Város</Text>
                            <View className="bg-gray-950 rounded-2xl border border-gray-700 px-5 h-16 justify-center shadow-inner">
                                <Text className="text-gray-300 font-semibold text-base">Budapest ▼</Text>
                            </View>
                        </View>

                        <View className="mb-6">
                            <Text className="text-gray-400 text-sm font-bold mb-3 uppercase tracking-widest text-indigo-300">Dátum</Text>
                            <View className="bg-gray-950 rounded-2xl border border-gray-700 px-5 h-16 justify-center shadow-inner">
                                <Text className="text-gray-300 font-semibold text-base">Válassz dátumot 📅</Text>
                            </View>
                        </View>

                        <View className="mb-10">
                            <Text className="text-gray-400 text-sm font-bold mb-3 uppercase tracking-widest text-indigo-300">Műfajok</Text>
                            <View className="flex-row flex-wrap gap-3 mt-1">
                                {['EDM', 'Techno', 'Retro'].map(genre => (
                                    <View key={genre} className="px-5 py-3 rounded-full border border-gray-600 bg-gray-800 shadow-sm">
                                        <Text className="text-gray-200 font-bold tracking-wide">{genre}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        <TouchableOpacity 
                            onPress={() => setCurrentView('swipe')}
                            className="bg-indigo-600 rounded-2xl py-5 items-center shadow-lg shadow-indigo-600/40 active:bg-indigo-500"
                        >
                            <Text className="text-white font-extrabold text-lg tracking-widest">Kivel bulizol ma? -> Barátkereső indítása</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* Simulated Bottom Bar */}
            <View className="absolute bottom-0 left-0 right-0 bg-gray-950 border-t border-gray-800 flex-row justify-around items-center pt-4 pb-8 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                <View className="items-center justify-center p-2 flex-1 opacity-50">
                    <Text className="text-2xl mb-1">🏠</Text>
                    <Text className="text-[11px] font-bold text-gray-500">Kezdőlap</Text>
                </View>

                {/* Highlighted */}
                <View className="items-center justify-center p-2 flex-1">
                    <View className="bg-indigo-500/20 w-16 h-10 rounded-2xl items-center justify-center mb-1">
                        <Text className="text-2xl">🧭</Text>
                    </View>
                    <Text className="text-[11px] font-bold text-indigo-400">Felfedezés</Text>
                </View>

                <View className="items-center justify-center p-2 flex-1 opacity-50">
                    <Text className="text-2xl mb-1">💬</Text>
                    <Text className="text-[11px] font-bold text-gray-500">Üzenetek</Text>
                </View>

                <View className="items-center justify-center p-2 flex-1 opacity-50">
                    <Text className="text-2xl mb-1">👤</Text>
                    <Text className="text-[11px] font-bold text-gray-500">Profil</Text>
                </View>
            </View>
        </View>
    );
}
