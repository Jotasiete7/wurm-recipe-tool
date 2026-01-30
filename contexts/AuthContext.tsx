import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';

interface AuthContextType {
    session: Session | null;
    user: User | null;
    loading: boolean;
    isAdmin: boolean;
    signIn: (email: string, pass: string) => Promise<{ error: any }>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                checkAdminRole(session.user.id);
            } else {
                setLoading(false);
            }
        });

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

    const signIn = async (email: string, pass: string) => {
        return await supabase.auth.signInWithPassword({ email, password: pass });
    }

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
