import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AuthContextType {
    userToken: string | null;
    isGuest: boolean;
    isLoading: boolean;
    signIn: (token: string) => Promise<void>;
    signOut: () => Promise<void>;
    continueAsGuest: () => void;
    promptLogin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);
    const [userToken, setUserToken] = useState<string | null>(null);
    const [isGuest, setIsGuest] = useState(false);

    useEffect(() => {
        const bootstrapAsync = async () => {
            let token;
            try {
                token = await AsyncStorage.getItem('auth_token');
            } catch (e) {
                console.error('Restoring token failed', e);
            }
            setUserToken(token || null);
            setIsLoading(false);
        };

        bootstrapAsync();
    }, []);

    const signIn = async (token: string) => {
        setIsLoading(true);
        try {
            await AsyncStorage.setItem('auth_token', token);
            setUserToken(token);
            setIsGuest(false);
        } catch (e) {
            console.error('Storing token failed', e);
        } finally {
            setIsLoading(false);
        }
    };

    const signOut = async () => {
        setIsLoading(true);
        try {
            await AsyncStorage.removeItem('auth_token');
            setUserToken(null);
            setIsGuest(false);
        } catch (e) {
            console.error('Removing token failed', e);
        } finally {
            setIsLoading(false);
        }
    };

    const continueAsGuest = () => {
        setIsGuest(true);
    };

    const promptLogin = () => {
        setIsGuest(false);
    };

    return (
        <AuthContext.Provider
            value={{
                userToken,
                isGuest,
                isLoading,
                signIn,
                signOut,
                continueAsGuest,
                promptLogin,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
