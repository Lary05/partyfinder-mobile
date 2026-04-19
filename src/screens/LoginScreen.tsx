import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axios';

export default function LoginScreen() {
    const { signIn, continueAsGuest } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Hiba', 'Kérjük töltsön ki minden mezőt!');
            return;
        }

        try {
            setLoading(true);
            const response = await axiosInstance.post('/login', {
                email,
                password,
            });

            if (response.data && response.data.token) {
                await signIn(response.data.token);
            } else {
                Alert.alert('Hiba', 'Váratlan válasz a szervertől.');
            }
        } catch (error: any) {
            console.error('Login Error:', error);
            if (error.response && error.response.status === 401) {
                Alert.alert('Bejelentkezés sikertelen', 'Hibás email vagy jelszó.');
            } else {
                Alert.alert('Hiba', 'Valami hiba történt. Kérjük próbálkozzon később.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 justify-center px-6 bg-gray-900 relative">
            <TouchableOpacity 
                onPress={continueAsGuest}
                className="absolute top-16 right-6 w-10 h-10 items-center justify-center rounded-full bg-gray-800/80 border border-white/10 z-10"
            >
                <Ionicons name="close" size={24} color="#9ca3af" />
            </TouchableOpacity>

            <View className="mb-10 items-center">
                <Text className="text-white text-4xl font-bold mb-2">PartyFinder</Text>
                <Text className="text-gray-400 text-base">Jelentkezzen be a fiókjába</Text>
            </View>

            <View className="mb-4">
                <Text className="text-gray-300 mb-2 font-medium">Email cím</Text>
                <TextInput
                    className="bg-gray-800 text-white rounded-xl px-4 py-4"
                    placeholder="email@pelda.hu"
                    placeholderTextColor="#9ca3af"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                />
            </View>

            <View className="mb-8">
                <Text className="text-gray-300 mb-2 font-medium">Jelszó</Text>
                <TextInput
                    className="bg-gray-800 text-white rounded-xl px-4 py-4"
                    placeholder="********"
                    placeholderTextColor="#9ca3af"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
            </View>

            <TouchableOpacity
                className={`bg-blue-600 rounded-xl py-4 items-center ${loading ? 'opacity-70' : ''}`}
                onPress={handleLogin}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text className="text-white font-bold text-lg">Bejelentkezés</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}
