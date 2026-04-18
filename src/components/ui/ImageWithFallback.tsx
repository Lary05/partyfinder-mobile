// src/components/ui/ImageWithFallback.tsx
// Image component that gracefully falls back to a placeholder on load error.

import React, { useState } from 'react';
import { Image, ImageErrorEventData, NativeSyntheticEvent } from 'react-native';

const FALLBACK_URI = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80';

interface ImageWithFallbackProps {
    source: string;
    alt: string;
    className?: string;
    style?: object;
}

export function ImageWithFallback({ source, alt, className, style }: ImageWithFallbackProps) {
    const [failed, setFailed] = useState(false);
    const uri = failed ? FALLBACK_URI : source;

    return (
        <Image
            accessibilityLabel={alt}
            source={{ uri }}
            className={className}
            style={style}
            resizeMode="cover"
            onError={(_e: NativeSyntheticEvent<ImageErrorEventData>) => setFailed(true)}
        />
    );
}
