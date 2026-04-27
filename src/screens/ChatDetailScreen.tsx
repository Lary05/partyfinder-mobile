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
    Modal,
    Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, SlideInDown } from 'react-native-reanimated';

import { ImageWithFallback } from '../components/ui/ImageWithFallback';
import { messagesSeed } from '../data/chatData';
import { Message } from '../types/chat';

export default function ChatDetailScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();
    const route = useRoute<any>();

    const { chatId, user, isGroup, members } = route.params || {};

    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [safetyModalVisible, setSafetyModalVisible] = useState(false);
    const [showGroupInfo, setShowGroupInfo] = useState(false);

    const handleSafetyAction = (action: string) => {
        Alert.alert(
            `Confirm ${action}`,
            `Are you sure you want to ${action.toLowerCase()} ${user?.name}?`,
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Yes", 
                    style: "destructive",
                    onPress: () => {
                        setSafetyModalVisible(false);
                        navigation.goBack();
                    }
                }
            ]
        );
    };

    const renderEmptyComponent = () => {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 100, transform: [{ scaleY: -1 }] }}>
                <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 4 }}>
                    You matched with {user?.name}
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 32 }}>
                    Just now
                </Text>

                <Pressable
                    onPress={() => {
                        navigation.navigate('ExpandedProfile', {
                            user: {
                                displayName: user?.name,
                                avatarUrl: user?.avatar,
                                age: 24,
                                distance: 'Nearby'
                            }
                        });
                    }}
                    style={{
                        width: 160,
                        height: 160,
                        borderRadius: 80,
                        borderWidth: 3,
                        borderColor: '#8b5cf6',
                        overflow: 'hidden',
                        shadowColor: '#8b5cf6',
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.5,
                        shadowRadius: 20,
                        elevation: 10,
                    }}
                >
                    <ImageWithFallback source={user?.avatar} alt={user?.name} style={{ width: '100%', height: '100%' }} />
                </Pressable>
            </View>
        );
    };

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

                <Pressable 
                    onPress={() => {
                        if (isGroup) {
                            setShowGroupInfo(true);
                        } else {
                            navigation.navigate('ExpandedProfile', { user: { displayName: user?.name, avatarUrl: user?.avatar, handle: user?.handle, age: 24, distance: 'Nearby' } });
                        }
                    }} 
                    style={styles.headerProfile}
                >
                    <View style={styles.headerAvatar}>
                        <ImageWithFallback source={user?.avatar} alt={user?.name} style={{ width: '100%', height: '100%' }} />
                    </View>
                    <View>
                        <Text style={styles.headerName}>{user?.name}</Text>
                        <Text style={styles.headerHandle}>{isGroup ? `${members?.length || 0} tagok` : user?.handle}</Text>
                    </View>
                </Pressable>

                {/* Safety Toolkit Button */}
                <Pressable onPress={() => setSafetyModalVisible(true)} style={{ width: 40, alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
                </Pressable>
            </View>

            {/* Message List */}
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                inverted
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    { paddingHorizontal: 16, paddingBottom: 16, paddingTop: 16 },
                    messages.length === 0 && { flex: 1 }
                ]}
                renderItem={renderMessage}
                ListEmptyComponent={renderEmptyComponent}
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

            {/* Safety Toolkit Modal */}
            <Modal
                visible={safetyModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setSafetyModalVisible(false)}
            >
                <Pressable 
                    style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }} 
                    onPress={() => setSafetyModalVisible(false)}
                >
                    <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Safety Toolkit</Text>
                            <Pressable hitSlop={10} onPress={() => setSafetyModalVisible(false)}>
                                <Ionicons name="close" size={24} color="rgba(255,255,255,0.5)" />
                            </Pressable>
                        </View>

                        <Pressable style={styles.modalOption} onPress={() => handleSafetyAction('Unmatch')}>
                            <View style={[styles.modalOptionIcon, { backgroundColor: 'rgba(239,68,68,0.1)' }]}>
                                <Ionicons name="person-remove-outline" size={20} color="#ef4444" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.modalOptionTitle}>Unmatch {user?.name}</Text>
                                <Text style={styles.modalOptionSub}>No longer interested? Remove them from your matches.</Text>
                            </View>
                        </Pressable>

                        <Pressable style={styles.modalOption} onPress={() => handleSafetyAction('Block')}>
                            <View style={[styles.modalOptionIcon, { backgroundColor: 'rgba(239,68,68,0.1)' }]}>
                                <Ionicons name="ban-outline" size={20} color="#ef4444" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.modalOptionTitle}>Block {user?.name}</Text>
                                <Text style={styles.modalOptionSub}>You won't see each other and they won't be able to contact you.</Text>
                            </View>
                        </Pressable>

                        <Pressable style={styles.modalOption} onPress={() => handleSafetyAction('Report')}>
                            <View style={[styles.modalOptionIcon, { backgroundColor: 'rgba(239,68,68,0.1)' }]}>
                                <Ionicons name="warning-outline" size={20} color="#ef4444" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.modalOptionTitle}>Report {user?.name}</Text>
                                <Text style={styles.modalOptionSub}>Report inappropriate behavior or policy violations.</Text>
                            </View>
                        </Pressable>
                    </Pressable>
                </Pressable>
            </Modal>

            {/* Group Info Modal */}
            <Modal
                visible={showGroupInfo}
                transparent={true}
                animationType="none"
                onRequestClose={() => setShowGroupInfo(false)}
            >
                <Pressable 
                    style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }} 
                    onPress={() => setShowGroupInfo(false)}
                >
                    <Animated.View 
                        entering={SlideInDown.springify().damping(20)}
                        style={[styles.modalContent, { backgroundColor: 'rgba(18,22,40,0.95)' }]} 
                        onStartShouldSetResponder={() => true}
                    >
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Group Info</Text>
                            <Pressable hitSlop={10} onPress={() => setShowGroupInfo(false)}>
                                <Ionicons name="close" size={24} color="rgba(255,255,255,0.5)" />
                            </Pressable>
                        </View>
                        <TextInput
                            style={styles.groupNameInput}
                            placeholder="Group Name"
                            placeholderTextColor="rgba(255,255,255,0.3)"
                            defaultValue={user?.name}
                        />
                        <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 24, marginBottom: 12, textTransform: 'uppercase', fontWeight: 'bold' }}>
                            {members?.length || 0} Members
                        </Text>
                        <FlatList
                            data={members}
                            keyExtractor={(item) => String(item.id)}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <View style={styles.modalOption}>
                                    <View style={[styles.avatarRing, { width: 36, height: 36, borderRadius: 18, marginRight: 0 }]}>
                                        <ImageWithFallback source={item.avatar} alt={item.name} style={{ width: '100%', height: '100%' }} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.modalOptionTitle, { color: '#fff', fontSize: 16, marginBottom: 2 }]}>{item.name}</Text>
                                        <Text style={[styles.modalOptionSub, { color: 'rgba(255,255,255,0.5)' }]}>{item.handle}</Text>
                                    </View>
                                </View>
                            )}
                            style={{ maxHeight: 300 }}
                        />
                    </Animated.View>
                </Pressable>
            </Modal>
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
    modalContent: {
        backgroundColor: 'rgba(15,23,42,0.95)',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 40,
        borderTopWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
        gap: 16,
    },
    modalOptionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalOptionTitle: {
        color: '#f87171',
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 4,
    },
    modalOptionSub: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 12,
        lineHeight: 16,
    },
    groupNameInput: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        borderRadius: 16,
        color: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
    },
});
