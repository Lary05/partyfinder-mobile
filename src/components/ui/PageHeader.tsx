// src/components/ui/PageHeader.tsx
// Shared header bar showing user avatar, greeting, location, and action buttons.

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { RAMA_AVATAR } from '../../data/dummyProfiles';
import { GlassCard } from './GlassCard';
import { ImageWithFallback } from './ImageWithFallback';

interface PageHeaderProps {
    searchPlaceholder?: string;
}

export function PageHeader({ searchPlaceholder = 'Enter what you are looking for...' }: PageHeaderProps) {
    return (
        <>
            <View className="mx-4 mt-2 mb-2 overflow-hidden rounded-3xl border border-white/10">
                <GlassCard className="px-4 py-3">
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center gap-3">
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
                        </View>

                        <View className="flex-row items-center gap-2">
                            <Pressable
                                className="h-8 w-8 items-center justify-center rounded-full border border-white/10"
                                style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
                            >
                                <Ionicons name="notifications-outline" size={16} color="#9ca3af" />
                            </Pressable>
                            <Pressable
                                className="h-8 w-8 items-center justify-center rounded-full border border-white/10"
                                style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
                            >
                                <Ionicons name="options-outline" size={16} color="#9ca3af" />
                            </Pressable>
                        </View>
                    </View>
                </GlassCard>
            </View>

            <View className="mx-4 mb-3 overflow-hidden rounded-2xl border border-white/10">
                <GlassCard className="flex-row items-center gap-2.5 px-3.5 py-2.5">
                    <Ionicons name="search" size={16} color="#52525b" />
                    <TextInput
                        placeholder={searchPlaceholder}
                        placeholderTextColor="#52525b"
                        className="flex-1 bg-transparent text-xs text-gray-400"
                    />
                    <Pressable
                        className="h-6 w-6 items-center justify-center rounded-lg border"
                        style={{
                            backgroundColor: 'rgba(59,130,246,0.18)',
                            borderColor: 'rgba(59,130,246,0.3)',
                        }}
                    >
                        <Ionicons name="options-outline" size={12} color="#60a5fa" />
                    </Pressable>
                </GlassCard>
            </View>
        </>
    );
}
