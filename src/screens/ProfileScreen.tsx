// src/screens/ProfileScreen.tsx
// Profile management tab — extracted from HomeScreen monolith.
// Covers: profile info, password update, account deletion.

import React, { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
    const insets = useSafeAreaInsets();
    const tabBarReserve = 76 + insets.bottom;

    const [profileName, setProfileName] = useState('Test User');
    const [profileEmail, setProfileEmail] = useState('test@example.com');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handlePasswordSave = () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert('Hiba', 'Kérjük, tölts ki minden jelszó mezőt!');
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert('Hiba', 'Az új jelszavak nem egyeznek!');
            return;
        }
        Alert.alert('Siker', 'A jelszó sikeresen frissítve a szimulációban.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    return (
        <ScrollView
            className="flex-1 pt-16"
            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: tabBarReserve + 48 }}
            showsVerticalScrollIndicator={false}
        >
            {/* Profil Információk */}
            <View className="mb-12">
                <Text className="text-white text-3xl font-extrabold tracking-tight mb-2">Profil Információk</Text>
                <Text className="text-gray-400 text-sm mb-8 leading-relaxed">
                    Frissítsd a fiókod adatait és a profilképedet.
                </Text>

                <View className="flex-row items-center mb-8 bg-gray-800/50 p-4 rounded-2xl border border-gray-700/50">
                    <View className="w-20 h-20 rounded-full bg-gray-700/80 justify-center items-center overflow-hidden border border-gray-600 mr-5 shadow-sm shadow-black">
                        <Text className="text-4xl">📸</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => Alert.alert('Szimuláció', 'Fájlfeltöltő ablak megnyitása...')}
                        className="bg-gray-800 border border-gray-600 px-5 py-2.5 rounded-xl shadow-sm"
                    >
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
                    onPress={() => Alert.alert('Siker!', 'Az adataidat sikeresen frissítettük.')}
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

                <TouchableOpacity
                    onPress={handlePasswordSave}
                    className="bg-blue-600 rounded-2xl py-4 items-center shadow-lg shadow-blue-600/30 w-1/2"
                >
                    <Text className="text-white font-bold text-base tracking-widest">SAVE</Text>
                </TouchableOpacity>
            </View>

            {/* Fiók Törlése */}
            <View className="pt-10 border-t border-gray-800">
                <Text className="text-white text-2xl font-bold mb-2">Fiók Törlése</Text>
                <Text className="text-gray-400 text-sm mb-8 leading-relaxed">
                    Miután fiókodat törölted, minden erőforrása és adata véglegesen törlődik. Mielőtt törölnéd
                    fiókodat, kérjük töltsd le az adatokat, amelyeket meg szeretnél tartani.
                </Text>

                <TouchableOpacity
                    onPress={() =>
                        Alert.alert(
                            'Megerősítés',
                            'Biztosan törölni szeretnéd a fiókodat? Ez a művelet végleges.',
                            [
                                { text: 'Mégse', style: 'cancel' },
                                {
                                    text: 'Igen, törlöm',
                                    style: 'destructive',
                                    onPress: () =>
                                        Alert.alert('Fiók törölve', 'A fiókodat sikeresen töröltük a szimuláció szerint.'),
                                },
                            ]
                        )
                    }
                    className="bg-red-600 rounded-2xl py-4 items-center shadow-lg shadow-red-600/30 w-1/2"
                >
                    <Text className="text-white font-bold text-base tracking-widests">Fiók törlése</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
