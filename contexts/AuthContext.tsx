
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

                    // Note: Since Functions are on Hub, we need to call Hub's function URL?
                    // Recipes Tool is separate project usually?
                    // Context said "The user has 1 active workspaces... [URI] -> [CorpusName]".
                    // If they share the Supabase Project, `supabase.functions.invoke` calls the function on THAT project.
                    // Yes, they share `wurm-guild` project. So this works!

                    if (error) throw error;
                    if (data?.error) throw new Error(data.error);

                    if (data?.session) {
                        // Set Session!
                        const { error: sessionError } = await supabase.auth.setSession({
                            access_token: data.session.access_token,
                            refresh_token: data.session.refresh_token
                        });
                        if (sessionError) throw sessionError;
                    }

                } catch (e) {
                    console.error("SSO Exchange Error:", e);
                    alert("Authentication Failed");
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
