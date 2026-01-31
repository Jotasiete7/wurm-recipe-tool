
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';

interface AuthContextType {
    session: Session | null;
    user: User | null;
    loading: boolean;
    isAdmin: boolean;
    signIn: () => void; // Replaces email/pass
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// HUB URL (In production this should be env var)
const HUB_URL = import.meta.env.VITE_HUB_URL || 'https://wurm-aguild-site.pages.dev';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    // Initial Load & SSO Check
    useEffect(() => {
        const handleAuth = async () => {
            // 1. Check for Code in URL (Callback)
            const params = new URLSearchParams(window.location.search);
            const code = params.get('code');

            if (code) {
                // Remove code from URL to clean up
                window.history.replaceState({}, document.title, window.location.pathname);

                try {
                    // Exchange Code
                    const { data, error } = await supabase.functions.invoke('sso-exchange', {
                        body: { code, client_id: 'recipes_tool' }
                    });

                    if (error) {
                        console.error('SSO Function Error:', error);
                        throw error;
                    }
                    if (data?.error) {
                        console.error('SSO Data Error:', data.error);
                        throw new Error(data.error);
                    }

                    if (data?.session) {
                        // Set Session!
                        const { error: sessionError } = await supabase.auth.setSession({
                            access_token: data.session.access_token,
                            refresh_token: data.session.refresh_token
                        });

                        if (sessionError) {
                            console.error('Set Session Error:', sessionError);
                            throw sessionError;
                        }
                    } else {
                        console.error('No session data returned from SSO');
                        throw new Error('No session data returned');
                    }

                } catch (e: any) {
                    console.error('SSO Exchange Error:', e);
                    // Silent fail - user will see they're not logged in
                }
            }

            // 2. Check Active Session
            const { data: { session: existingSession } } = await supabase.auth.getSession();
            setSession(existingSession);
            setUser(existingSession?.user ?? null);

            if (existingSession?.user) {
                checkAdminRole(existingSession.user.id);
            } else {
                setLoading(false);
            }
        };

        handleAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                checkAdminRole(session.user.id);
            } else {
                setIsAdmin(false);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const checkAdminRole = async (userId: string) => {
        try {
            const { data } = await supabase
                .from('profiles')
                .select('global_role')
                .eq('id', userId)
                .single();

            if (data && (data.global_role === 'admin' || data.global_role === 'superadmin')) {
                setIsAdmin(true);
            } else {
                setIsAdmin(false);
            }
        } catch (e) {
            setIsAdmin(false);
        } finally {
            setLoading(false);
        }
    };

    const signIn = () => {
        // Redirect to Hub SSO
        const redirectUri = window.location.origin; // Always redirect to root
        const authUrl = `${HUB_URL}/sso/authorize?client_id=recipes_tool&redirect_uri=${encodeURIComponent(redirectUri)}`;
        window.location.href = authUrl;
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setIsAdmin(false);
    };

    const value = {
        session,
        user,
        loading,
        isAdmin,
        signIn,
        signOut,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
