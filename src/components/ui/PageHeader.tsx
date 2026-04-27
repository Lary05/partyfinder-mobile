// src/components/ui/PageHeader.tsx
// Shared header bar showing user avatar, greeting, location, and action buttons.

import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Pressable, Text, TextInput, View, Modal, Switch } from 'react-native';
import { RAMA_AVATAR } from '../../data/dummyProfiles';
import { GlassCard } from './GlassCard';
import { ImageWithFallback } from './ImageWithFallback';

interface PageHeaderProps {
    searchPlaceholder?: string;
}

export function PageHeader({ searchPlaceholder = 'Enter what you are looking for...' }: PageHeaderProps) {
    const navigation = useNavigation<any>();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    return (
        <>
            <View className="mx-4 mt-2 mb-2 overflow-hidden rounded-3xl border border-white/10">
                <GlassCard className="px-4 py-3">
                    <View className="flex-row items-center justify-between">
                        <Pressable className="flex-row items-center gap-3" onPress={() => navigation.navigate('Profile')}>
                            <View
                                className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full"
                                style={{ borderWidth: 2, borderColor: 'rgba(255,255,255,0.18)' }}
                            >
                                <ImageWithFallback source={RAMA_AVATAR} alt="Rama" className="h-full w-full" />
                            </View>
                            <View>
                                <View className="flex-row items-center gap-1.5">
                                    <Text className="text-xs text-gray-400">Hi,</Text>
                                    <Text className="text-sm font-semibold text-white">Rama</Text>
                                    <Text className="text-sm">👋</Text>
                                </View>
                                <View className="mt-0.5 flex-row items-center gap-1">
                                    <Ionicons name="location" size={10} color="#60a5fa" />
                                    <Text className="text-[10px] text-gray-500">Bandung, Indonesia</Text>
                                </View>
                            </View>
                        </Pressable>

                        <View className="flex-row items-center gap-2">
                            <Pressable
                                className="h-8 w-8 items-center justify-center rounded-full border border-white/10"
                                style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
                                onPress={() => setShowNotifications(true)}
                            >
                                <Ionicons name="notifications-outline" size={16} color="#9ca3af" />
                            </Pressable>
                            <Pressable
                                className="h-8 w-8 items-center justify-center rounded-full border border-white/10"
                                style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
                                onPress={() => setShowSettings(true)}
                            >
                                <Ionicons name="options-outline" size={16} color="#9ca3af" />
                            </Pressable>
                        </View>
                    </View>
                </GlassCard>
            </View>

            {/* Notifications Modal */}
            <Modal transparent visible={showNotifications} animationType="slide">
                <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <View className="rounded-t-3xl p-6 border-t" style={{ backgroundColor: '#121628', borderColor: 'rgba(255,255,255,0.1)' }}>
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-white text-lg font-bold">Notifications</Text>
                            <Pressable onPress={() => setShowNotifications(false)}>
                                <Ionicons name="close" size={24} color="#9ca3af" />
                            </Pressable>
                        </View>
                        <View className="gap-4 mb-4">
                            <View className="flex-row items-center gap-3">
                                <View className="h-10 w-10 rounded-full items-center justify-center" style={{ backgroundColor: 'rgba(59,130,246,0.1)' }}>
                                    <Ionicons name="location" size={20} color="#60a5fa" />
                                </View>
                                <View>
                                    <Text className="text-white font-semibold">New event nearby</Text>
                                    <Text className="text-gray-400 text-xs">Boiler Room Budapest is 2km away</Text>
                                </View>
                            </View>
                            <View className="flex-row items-center gap-3">
                                <View className="h-10 w-10 rounded-full items-center justify-center" style={{ backgroundColor: 'rgba(236,72,153,0.1)' }}>
                                    <Ionicons name="heart" size={20} color="#ec4899" />
                                </View>
                                <View>
                                    <Text className="text-white font-semibold">Someone liked your profile</Text>
                                    <Text className="text-gray-400 text-xs">A new person swiped right on you</Text>
                                </View>
                            </View>
                            <View className="flex-row items-center gap-3">
                                <View className="h-10 w-10 rounded-full items-center justify-center" style={{ backgroundColor: 'rgba(168,85,247,0.1)' }}>
                                    <Ionicons name="ticket" size={20} color="#a855f7" />
                                </View>
                                <View>
                                    <Text className="text-white font-semibold">Ticket confirmed</Text>
                                    <Text className="text-gray-400 text-xs">Your ticket for Techno Rave is ready</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Settings Modal */}
            <Modal transparent visible={showSettings} animationType="slide">
                <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <View className="rounded-t-3xl p-6 border-t" style={{ backgroundColor: '#121628', borderColor: 'rgba(255,255,255,0.1)' }}>
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-white text-lg font-bold">Settings</Text>
                            <Pressable onPress={() => setShowSettings(false)}>
                                <Ionicons name="close" size={24} color="#9ca3af" />
                            </Pressable>
                        </View>
                        <View className="gap-6 mb-4">
                            <View className="flex-row justify-between items-center">
                                <View>
                                    <Text className="text-white font-semibold">Push Notifications</Text>
                                    <Text className="text-gray-400 text-xs mt-1">Get alerts for new matches and messages</Text>
                                </View>
                                <Switch value={true} trackColor={{ false: '#374151', true: '#3b82f6' }} />
                            </View>
                            <View className="flex-row justify-between items-center">
                                <View>
                                    <Text className="text-white font-semibold">Hide Active Status</Text>
                                    <Text className="text-gray-400 text-xs mt-1">Don't show when you are online</Text>
                                </View>
                                <Switch value={false} trackColor={{ false: '#374151', true: '#3b82f6' }} />
                            </View>
                            <View className="flex-row justify-between items-center">
                                <View>
                                    <Text className="text-white font-semibold">Discoverable</Text>
                                    <Text className="text-gray-400 text-xs mt-1">Show my profile in the discovery feed</Text>
                                </View>
                                <Switch value={true} trackColor={{ false: '#374151', true: '#3b82f6' }} />
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
}
