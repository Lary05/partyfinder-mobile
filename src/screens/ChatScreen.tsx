import React from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    StyleSheet,
    TouchableOpacity,
    type ListRenderItem,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export interface ChatListItem {
    id: string;
    name: string;
    time: string;
    message: string;
    unread: boolean;
    avatar: string;
}

// Dummy data based on the wireframe image
const MOCK_CHATS: ChatListItem[] = [
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

    const renderItem: ListRenderItem<ChatListItem> = ({ item }) => (
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
            <FlatList<ChatListItem>
                data={MOCK_CHATS}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
            />

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
        paddingBottom: 24,
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
});