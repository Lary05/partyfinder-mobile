// src/screens/ChatDetailScreen.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ImageWithFallback } from '../components/ui/ImageWithFallback';
import { messagesSeed } from '../data/chatData';
import { Message } from '../types/chat';

export default function ChatDetailScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const route = useRoute<any>();

    const { chatId, user } = route.params || {};

    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');

    useEffect(() => {
        if (chatId && messagesSeed[chatId]) {
            // Reverse so flatlist 'inverted' shows newest at bottom naturally,
            // though our mockup data is assumed chronological top to bottom.
            setMessages([...messagesSeed[chatId]].reverse());
        }
    }, [chatId]);

    const handleSend = () => {
        if (!inputText.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            senderId: 'me',
            text: inputText,
            timestamp: 'Just now',
            status: 'sent',
        };

        // Prepend because the list is inverted
        setMessages([newMessage, ...messages]);
        setInputText('');
    };

    const renderMessage = ({ item, index }: { item: Message; index: number }) => {
        const isMe = item.senderId === 'me';

        return (
            <Animated.View
                // Animate entry upwards
                entering={FadeInDown.delay(index * 50).springify().damping(18)}
                style={[
                    styles.bubbleContainer,
                    isMe ? styles.bubbleContainerRight : styles.bubbleContainerLeft,
                ]}
            >
                {/* For Their messages, bubble has glass overlay; for My messages, it has a gradient */}
                <View
                    style={[
                        styles.bubbleWrapper,
                        isMe ? styles.bubbleRight : styles.bubbleLeft,
                    ]}
                >
                    {isMe ? (
                        <LinearGradient
                            colors={['#3b82f6', '#8b5cf6']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={StyleSheet.absoluteFillObject}
                        />
                    ) : (
                        <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(255,255,255,0.1)' }]} />
                    )}

                    <Text style={{ color: '#fff', fontSize: 15, lineHeight: 22, position: 'relative' }}>
                        {item.text}
                    </Text>
                </View>

                {/* Status/Time indicator */}
                <View style={[styles.statusRow, isMe ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' }]}>
                    <Text style={styles.timeText}>{item.timestamp}</Text>
                    {isMe && (
                        <Ionicons
                            name={item.status === 'read' ? 'checkmark-done' : 'checkmark'}
                            size={12}
                            color={item.status === 'read' ? '#60a5fa' : 'rgba(255,255,255,0.3)'}
                        />
                    )}
                </View>
            </Animated.View>
        );
    };

    return (
        <SafeAreaView edges={['top']} className="flex-1 bg-[#0B0D17]">
            {/* Header */}
            <View style={[styles.header, { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' }]}>
                <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={20} color="#fff" />
                </Pressable>

                <View style={styles.headerProfile}>
                    <View style={styles.headerAvatar}>
                        <ImageWithFallback source={user?.avatar} alt={user?.name} style={{ width: '100%', height: '100%' }} />
                    </View>
                    <View>
                        <Text style={styles.headerName}>{user?.name}</Text>
                        <Text style={styles.headerHandle}>{user?.handle}</Text>
                    </View>
                </View>

                {/* Placeholder for video/call icons */}
                <View style={{ width: 40 }} />
            </View>

            {/* Message List */}
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                inverted
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16, paddingTop: 16 }}
                renderItem={renderMessage}
            />

            {/* Input Area */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <View style={[styles.inputContainer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
                    <Pressable style={styles.attachButton}>
                        <Ionicons name="add" size={24} color="#a1a1aa" />
                    </Pressable>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Type a message..."
                        placeholderTextColor="rgba(255,255,255,0.3)"
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                    />
                    <Pressable
                        style={[styles.sendButton, !inputText.trim() && { opacity: 0.5 }]}
                        onPress={handleSend}
                        disabled={!inputText.trim()}
                    >
                        <LinearGradient
                            colors={['#3b82f6', '#8b5cf6']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={StyleSheet.absoluteFillObject}
                        />
                        <Ionicons name="send" size={14} color="#fff" style={{ marginLeft: 2 }} />
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: 'rgba(255,255,255,0.02)',
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        marginRight: 8,
    },
    headerProfile: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        overflow: 'hidden',
        marginRight: 10,
        backgroundColor: '#1f2937',
    },
    headerName: {
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold',
    },
    headerHandle: {
        color: '#9ca3af',
        fontSize: 11,
    },
    bubbleContainer: {
        marginBottom: 20,
        maxWidth: '80%',
    },
    bubbleContainerLeft: {
        alignSelf: 'flex-start',
    },
    bubbleContainerRight: {
        alignSelf: 'flex-end',
    },
    bubbleWrapper: {
        overflow: 'hidden',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderWidth: 1,
    },
    bubbleLeft: {
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        borderBottomRightRadius: 18,
        borderBottomLeftRadius: 4,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    bubbleRight: {
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        borderBottomLeftRadius: 18,
        borderBottomRightRadius: 4,
        borderColor: 'transparent',
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        gap: 4,
    },
    timeText: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.3)',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 12,
        paddingTop: 12,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)',
    },
    attachButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        marginRight: 12,
        marginBottom: 2,
    },
    textInput: {
        flex: 1,
        minHeight: 40,
        maxHeight: 120,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        borderRadius: 20,
        color: '#fff',
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 12,
        marginRight: 12,
        marginBottom: 2,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        marginBottom: 2,
    },
});
