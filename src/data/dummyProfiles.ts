// src/data/dummyProfiles.ts
// Dummy profile data for the FelfedezesSimulator (Barátkereső / Party Buddy swipe feature)

export interface Profile {
    id: number;
    name: string;
    age: number;
    distance: string;
    education: string;
    likesYou: boolean;
    image: string;
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
        id: 1,
        name: 'Citra',
        age: 23,
        distance: '2.5 km away',
        education: 'Master of Information Technology, 2025',
        likesYou: true,
        image: CITRA_IMAGE,
        event: { name: 'Boiler Room', date: '25 Nov' },
        mutuals: 3,
    },
    {
        id: 2,
        name: 'Alya',
        age: 24,
        distance: '3.1 km away',
        education: 'Bachelor of Fine Arts, 2024',
        likesYou: false,
        image: PROFILE_2,
        event: { name: 'Djakarta Warehouse', date: '02 Dec' },
        mutuals: 5,
    },
    {
        id: 3,
        name: 'Dano',
        age: 27,
        distance: '1.8 km away',
        education: 'MBA Business Design, 2023',
        likesYou: false,
        image: PROFILE_3,
        event: { name: 'We The Fest', date: '14 Dec' },
        mutuals: 2,
    },
];
