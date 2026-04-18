// src/components/ui/GlassCard.tsx
// Reusable glassmorphism card wrapper with iOS BlurView and Android fallback.

import { BlurView } from 'expo-blur';
import React from 'react';
import { Platform, View } from 'react-native';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
}

export function GlassCard({ children, className }: GlassCardProps) {
    if (Platform.OS === 'ios') {
        return (
            <View className={className} style={{ position: 'relative', overflow: 'hidden' }}>
                <BlurView
                    intensity={48}
                    tint="dark"
                    style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
                />
                <View className="relative z-10">{children}</View>
            </View>
        );
    }
    return (
        <View className={className} style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
            {children}
        </View>
    );
}
