import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Linking, Platform } from 'react-native';
import { Event } from '../types/event';
import axiosInstance from '../api/axios';

export default function EventDetailsScreen({ route, navigation }: any) {
    const { event } = route.params as { event: Event };

    const getImageUrl = (url: string) => {
        if (!url) return 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1974&auto=format&fit=crop';
        if (url.startsWith('http')) return url;
        const baseUrl = axiosInstance.defaults.baseURL?.replace('/api', '') || 'http://192.168.1.71:8000';
        return `${baseUrl}${url}`;
    };

    const imageUrl = getImageUrl(event.image_url);
    const eventDate = new Date(event.start_time);

    const handleOpenFacebook = () => {
        if (event.facebook_url) {
            Linking.openURL(event.facebook_url).catch(() => {
                console.warn('Cannot open Facebook URL');
            });
        }
    };

    const handleOpenTickets = () => {
        if (event.ticket_url) {
            Linking.openURL(event.ticket_url).catch(() => {
                console.warn('Cannot open Tickets URL');
            });
        }
    };

    return (
        <View className="flex-1 bg-gray-900">
            {/* Header Image with Back Button Overlay */}
            <View className="relative w-full h-72 bg-gray-800">
                <Image
                    source={{ uri: imageUrl }}
                    className="w-full h-full"
                    resizeMode="cover"
                />
                {/* Dark Gradient Overlay */}
                <View className="absolute inset-0 bg-black/40" />

                {/* Back Button */}
                <TouchableOpacity
                    className={`absolute ${Platform.OS === 'ios' ? 'top-14' : 'top-12'} left-4 w-10 h-10 bg-black/50 rounded-full items-center justify-center`}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <Text className="text-white font-bold text-lg">←</Text>
                </TouchableOpacity>

                {/* Event Category Badge */}
                <View className="absolute bottom-6 left-6 bg-blue-600 px-4 py-1.5 rounded-full shadow-lg border border-blue-500/50">
                    <Text className="text-white text-xs font-bold uppercase tracking-wider">{event.genre || 'Party'}</Text>
                </View>
            </View>

            {/* Content Body */}
            <ScrollView className="flex-1 -mt-4 bg-gray-900 rounded-t-3xl shadow-xl shadow-black h-full" showsVerticalScrollIndicator={false}>
                <View className="p-6">
                    {/* Title */}
                    <Text className="text-white text-3xl font-extrabold mb-5 leading-tight">{event.title}</Text>

                    {/* Date */}
                    <View className="flex-row items-center mb-6">
                        <View className="w-12 h-12 bg-blue-600/20 rounded-xl items-center justify-center mr-4 border border-blue-500/30">
                            <Text className="text-blue-400 text-xl">📅</Text>
                        </View>
                        <View>
                            <Text className="text-white font-bold text-lg">
                                {eventDate.toLocaleDateString('hu-HU', { weekday: 'long', month: 'long', day: 'numeric' })}
                            </Text>
                            <Text className="text-gray-400 text-sm font-medium mt-0.5">
                                {eventDate.toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                        </View>
                    </View>

                    {/* Location Info */}
                    <View className="flex-row items-center mb-8">
                        <View className="w-12 h-12 bg-gray-800 rounded-xl items-center justify-center mr-4 border border-gray-700">
                            <Text className="text-gray-400 text-xl">📍</Text>
                        </View>
                        <View className="flex-1">
                            <Text className="text-white font-bold text-lg">{event.location?.name || 'Ismeretlen helyszín'}</Text>
                            <Text className="text-gray-400 text-sm font-medium mt-0.5">
                                {event.location?.address || 'Nincsenek címadatok'}
                                {event.location?.city?.name ? `, ${event.location.city.name}` : ''}
                            </Text>
                        </View>
                    </View>

                    {/* Attendance Stats */}
                    <View className="flex-row items-center mb-8 px-4 py-4 bg-gray-800/80 rounded-2xl border border-gray-700">
                        <View className="flex-1 items-center justify-center">
                            <Text className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Érdeklődő</Text>
                            <Text className="text-white text-xl font-bold">🔥 {event.interested_count}</Text>
                        </View>
                        <View className="w-[1px] h-10 bg-gray-700" />
                        <View className="flex-1 items-center justify-center">
                            <Text className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Résztvevő</Text>
                            <Text className="text-white text-xl font-bold">✅ {event.going_count || 0}</Text>
                        </View>
                    </View>

                    {/* Description */}
                    <Text className="text-white text-xl font-bold mb-3">Az eseményről</Text>
                    <Text className="text-gray-300 text-base leading-relaxed mb-8">
                        {event.description || 'Nincs részletes leírás az eseményhez.'}
                    </Text>
                </View>
            </ScrollView>

            {/* Action Buttons Footer */}
            <View className="p-5 bg-gray-900 border-t border-gray-800 flex-row justify-between items-center pb-8 pt-4">
                {event.ticket_url ? (
                    <>
                        <TouchableOpacity
                            className="bg-gray-800 border border-gray-700 py-4 px-2 rounded-xl flex-1 mr-3 items-center justify-center"
                            onPress={handleOpenFacebook}
                            activeOpacity={0.8}
                        >
                            <Text className="text-white font-bold text-base">Facebook</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="bg-blue-600 py-4 px-2 rounded-xl flex-1 ml-3 items-center justify-center shadow-lg shadow-blue-600/30"
                            onPress={handleOpenTickets}
                            activeOpacity={0.8}
                        >
                            <Text className="text-white font-bold text-base">Jegyvásárlás</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <TouchableOpacity
                        className="bg-blue-600 py-4 px-6 rounded-xl w-full items-center justify-center shadow-lg shadow-blue-600/30"
                        onPress={handleOpenFacebook}
                        activeOpacity={0.8}
                    >
                        <Text className="text-white font-bold text-lg tracking-wide">Megtekintés Facebookon</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}
