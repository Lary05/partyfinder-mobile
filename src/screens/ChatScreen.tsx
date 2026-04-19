import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
// You'll need to install vector icons if you don't already have them,
// e.g., npm install @expo/vector-icons
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { LoginRequiredShield } from '../components/ui/LoginRequiredShield';

// Dummy data based on the wireframe image
const MOCK_CHATS = [
    { id: '1', name: 'starryskies23', time: '1d', message: 'Started following you', unread: true, avatar: 'https://i.pravatar.cc/150?img=1' },
    { id: '2', name: 'nebulanomad', time: '1d', message: 'Liked your post', unread: true, avatar: 'https://i.pravatar.cc/150?img=11' },
    { id: '3', name: 'emberecho', time: '2d', message: '| Happy birthday!!! 🎉', unread: true, avatar: 'https://i.pravatar.cc/150?img=5' },
    { id: '4', name: 'lunavoyager', time: '3d', message: 'Saved your post', unread: true, avatar: 'https://i.pravatar.cc/150?img=3' },
    { id: '5', name: 'shadowlynx', time: '4d', message: "I'm going in september. what about you?", unread: true, avatar: 'https://i.pravatar.cc/150?img=8' },
    { id: '6', name: 'nebulanomad', time: '5d', message: 'Shared a post you might like', unread: false, avatar: 'https://i.pravatar.cc/150?img=11' },
    { id: '7', name: 'lunavoyager', time: '5d', message: 'Liked your message!', unread: false, avatar: 'https://i.pravatar.cc/150?img=3' },
    { id: '8', name: 'lunavoyager', time: '5d', message: 'This is so adorable!!!', unread: false, avatar: 'https://i.pravatar.cc/150?img=3' },
];

export default function ChatScreen() {
    const { isGuest } = useAuth();

    if (isGuest) {
        return <LoginRequiredShield />;
    }

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.chatItem}>
            {/* Container for unread indicator to maintain alignment */}
            <View style={styles.unreadIndicatorContainer}>
                {item.unread && <View style={styles.unreadDot} />}
            </View>

            <Image source={{ uri: item.avatar }} style={styles.avatar} />

            <View style={styles.textContainer}>
                <View style={styles.headerRow}>
                    <Text style={styles.nameText}>{item.name}</Text>
                    <Text style={styles.timeText}>{item.time}</Text>
                </View>
                <Text style={styles.messageText} numberOfLines={1}>{item.message}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Top Header Bar */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Chat</Text>
                <Image
                    source={require('../../assets/icons/search_icon.png')} // Replace with your path
                    style={styles.headerIcon}
                    tintColor="#FFFFFF" // White color
                />
            </View>

            {/* Main Chat List */}
            <FlatList
                data={MOCK_CHATS}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
            />

            {/* Bottom Navigation Bar */}
            <View style={styles.bottomNav}>
                <Image
                    source={require('../../assets/icons/home_icon.png')} // Replace with your path
                    style={styles.navIcon}
                    tintColor="#FFFFFF" // White color
                />
                <Image
                    source={require('../../assets/icons/search_icon.png')} // Replace with your path
                    style={styles.navIcon}
                    tintColor="#FFFFFF" // White color
                />

                {/* Using a vector icon for Plus for simplicity */}
                <Ionicons name="add-circle-outline" size={32} color="#FFFFFF" />

                {/* Chat icon with badge */}
                <View style={styles.navIconContainer}>
                    <Image
                        source={require('../../assets/icons/chat_icon.png')} // Replace with your path
                        style={styles.navIcon}
                        tintColor="#FFFFFF" // White color
                    />
                    <View style={styles.badgeContainer}>
                        <Text style={styles.badgeText}>5</Text>
                    </View>
                </View>

                <Image
                    source={require('../../assets/icons/profile_icon.png')} // Replace with your path
                    style={styles.navIcon}
                    tintColor="#FFFFFF" // White color
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0B0D17', // Dark blue background
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 15,
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 28,
        fontWeight: 'bold',
    },
    headerIcon: {
        width: 28,
        height: 28,
    },
    listContainer: {
        paddingBottom: 80, // Space for bottom nav
    },
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingRight: 20,
    },
    unreadIndicatorContainer: {
        width: 20, // To center the dot properly
        alignItems: 'center',
        justifyContent: 'center',
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FF3B30', // Notification red
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: '#1A1E30', // Very faint separator line
        paddingBottom: 12,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    nameText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        marginRight: 8,
    },
    timeText: {
        color: '#A0A4B8', // Light gray subtext
        fontSize: 14,
    },
    messageText: {
        color: '#B0B4C8', // Sightly lighter subtext
        fontSize: 15,
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#15192B', // Slightly lighter dark blue
        paddingVertical: 15,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTopWidth: 1,
        borderTopColor: '#2A2E43',
    },
    navIconContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    navIcon: {
        width: 24,
        height: 24,
    },
    badgeContainer: {
        position: 'absolute',
        top: -5,
        right: -8,
        backgroundColor: '#FF3B30', // Notification red
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#15192B', // Match bottom nav background
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
});