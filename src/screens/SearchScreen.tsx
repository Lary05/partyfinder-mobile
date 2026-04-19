// src/screens/SearchScreen.tsx
// Search tab — extracted from HomeScreen monolith.
// Users enter queries here; results surface on the HomeFeed tab.

import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SearchScreen() {
    const insets = useSafeAreaInsets();
    const tabBarReserve = 76 + insets.bottom;

    const [searchQuery, setSearchQuery] = useState('');

    return (
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
                        onChangeText={setSearchQuery}
                    />
                </View>

                <TouchableOpacity
                    className="items-center rounded-2xl border border-blue-500/40 bg-blue-600/20 py-4"
                    activeOpacity={0.85}
                >
                    <Text className="font-bold text-blue-300">Ugrás a Kezdőlapra a találatokhoz →</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
