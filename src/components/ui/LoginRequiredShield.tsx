import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlassCard } from './GlassCard';

export function LoginRequiredShield() {
    const { promptLogin } = useAuth();

    return (
        <SafeAreaView edges={['top']} className="flex-1 bg-neutral-950 items-center justify-center px-6">
            <View className="mb-8 w-24 h-24 items-center justify-center rounded-3xl border border-white/10" style={{ backgroundColor: 'rgba(59,130,246,0.1)' }}>
                <Ionicons name="lock-closed" size={48} color="#60a5fa" style={{ opacity: 0.9 }} />
            </View>

            <View className="items-center mb-8">
                <Text className="text-2xl font-extrabold text-white mb-3 text-center">Megoldás szükséges</Text>
                <Text className="text-gray-400 text-center leading-relaxed text-sm px-4">
                    Ezt a funkciót bejelentkezés nélkül nem tudod használni. Lépj be vagy regisztrálj a teljes hozzáféréshez!
                </Text>
            </View>

            <TouchableOpacity
                onPress={promptLogin}
                className="w-full h-14 rounded-2xl items-center justify-center"
                style={{
                    backgroundColor: '#2563eb',
                    shadowColor: '#3b82f6',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.35,
                    shadowRadius: 14,
                    elevation: 8,
                }}
            >
                <Text className="text-white font-bold text-base tracking-widest uppercase">Bejelentkezés</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={promptLogin}
                className="w-full mt-4 h-14 rounded-2xl items-center justify-center border border-white/10"
                style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
            >
                <Text className="text-gray-300 font-semibold text-base">Regisztráció</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}
