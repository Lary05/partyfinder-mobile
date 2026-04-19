// src/data/dummyProfiles.ts
// Dummy profile data for the FelfedezesSimulator (Barátkereső / Party Buddy swipe feature)

import { User } from '../types/user';

export interface Profile extends User {
    age: number;
    distance: string;
    education: string;
    likesYou: boolean;
    event: { name: string; date: string };
    mutuals: number;
}

export const CITRA_IMAGE =
    'https://images.unsplash.com/photo-1759853900346-8d1ee0af7ca8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMGFzaWFuJTIwd29tYW4lMjBwb3J0cmFpdCUyMGRhcmslMjBqYWNrZXQlMjBmYXNoaW9ufGVufDF8fHx8MTc3NjI5MjQ3NHww&ixlib=rb-4.1.0&q=80&w=1080';

export const PROFILE_2 =
    'https://images.unsplash.com/photo-1588072719654-9a95b5bb42d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHdvbWFuJTIwcG9ydHJhaXQlMjBtdXNpYyUyMGZlc3RpdmFsJTIwbmlnaHR8ZW58MXx8fHwxNzc2MjkyNTE0fDA&ixlib=rb-4.1.0&q=80&w=1080';

export const PROFILE_3 =
    'https://images.unsplash.com/photo-1724118135600-35009a8d6a89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMG1hbiUyMHBvcnRyYWl0JTIwdXJiYW4lMjBzdHlsZXxlbnwxfHx8fDE3NzYyOTI1MTR8MA&ixlib=rb-4.1.0&q=80&w=1080';

export const RAMA_AVATAR =
    'https://images.unsplash.com/photo-1769142899668-5816cf1d920a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMG1hbiUyMGF2YXRhciUyMHByb2ZpbGUlMjBwaG90b3xlbnwxfHx8fDE3NzYyOTI0NzR8MA&ixlib=rb-4.1.0&q=80&w=1080';

export const profilesSeed: Profile[] = [
    {
        id: 'p1',
        displayName: 'Citra',
        uniqueHandle: '@citra_techno',
        avatarUrl: CITRA_IMAGE,
        age: 23,
        distance: '2.5 km away',
        education: 'Master of Information Technology, 2025',
        likesYou: true,
        event: { name: 'Boiler Room', date: '25 Nov' },
        mutuals: 3,
    },
    {
        id: 'p2',
        displayName: 'Alya',
        uniqueHandle: '@alya_vibes',
        avatarUrl: PROFILE_2,
        age: 24,
        distance: '3.1 km away',
        education: 'Bachelor of Fine Arts, 2024',
        likesYou: false,
        event: { name: 'Djakarta Warehouse', date: '02 Dec' },
        mutuals: 5,
    },
    {
        id: 'p3',
        displayName: 'Dano',
        uniqueHandle: '@dano_beats',
        avatarUrl: PROFILE_3,
        age: 27,
        distance: '1.8 km away',
        education: 'MBA Business Design, 2023',
        likesYou: false,
        event: { name: 'We The Fest', date: '14 Dec' },
        mutuals: 2,
    },
];

export interface ChatMessage {
    id: string;
    sender: User;
    content: string;
    timestamp: string;
    isUnread: boolean;
}

export const chatsSeed: ChatMessage[] = [
    {
        id: 'msg_1',
        sender: profilesSeed[0],
        content: 'Hey! Are you going to Boiler Room?',
        timestamp: '1h ago',
        isUnread: true,
    },
    {
        id: 'msg_2',
        sender: profilesSeed[1],
        content: 'Loved your playlist!',
        timestamp: '3h ago',
        isUnread: false,
    }
];
