// src/data/chatData.ts
import { Message } from '../types/chat';

export const messagesSeed: Record<string, Message[]> = {
    // chatId 1: Citra
    '1': [
        {
            id: 'm1_1',
            senderId: 'them',
            text: 'omg the lineup is insane 🔥 you going?',
            timestamp: '2m',
            status: 'delivered'
        },
        {
            id: 'm1_2',
            senderId: 'me',
            text: 'I know right!! Thinking about it',
            timestamp: '5m',
            status: 'read'
        }
    ],
    // chatId 2: Rafi
    '2': [
        {
            id: 'm2_1',
            senderId: 'them',
            text: 'Saved you a spot near the stage 👀',
            timestamp: '14m',
            status: 'delivered'
        }
    ],
    // chatId 3: Mira
    '3': [
        {
            id: 'm3_1',
            senderId: 'them',
            text: 'haha yes let\'s go early this time',
            timestamp: '1h',
            status: 'read'
        }
    ]
};
