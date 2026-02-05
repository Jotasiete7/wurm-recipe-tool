import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { Trash2, KeyRound, Search, ShieldAlert, CheckCircle, AlertTriangle } from 'lucide-react';

interface Profile {
    id: string;
    email?: string; // We hope profiles has this, if not we show ID or Name
    username?: string;
    full_name?: string;
    global_role?: string;
    created_at?: string;
}

export default function AdminUserManagement() {
    const { isAdmin, user: currentUser } = useAuth();
    const [users, setUsers] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Role check (client-side visual only, real security is RLS/Edge Function)
    const [currentUserRole, setCurrentUserRole] = useState<string>('');

    useEffect(() => {
        fetchUsers();
        if (currentUser) fetchCurrentUserRole();
    }, [currentUser]);

    const fetchCurrentUserRole = async () => {
        if (!currentUser) return;
        const { data } = await supabase
            .from('profiles')
            .select('global_role')
            .eq('id', currentUser.id)
            .single();
        if (data) setCurrentUserRole(data.global_role);
    };

    const fetchUsers = async () => {
        setLoading(true);
        // Note: 'profiles' usually is public or readable by authenticated.
        // If 'email' is in profiles, great. If not, we might only show names.
        // Assuming a standard updated profiles schema for now.
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching users:', error);
            setMessage({ type: 'error', text: 'Failed to fetch users: ' + error.message });
        } else {
            setUsers(data || []);
        }
        setLoading(false);
    };

    const handleResetPassword = async (email: string) => {
        if (!confirm(`Send password reset email to ${email}?`)) return;

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/reset-password', // Adjust if needed
        });

        if (error) {
            setMessage({ type: 'error', text: 'Error sending reset email: ' + error.message });
        } else {
            setMessage({ type: 'success', text: `Password reset email sent to ${email}` });
        }
    };

    const handleDeleteUser = async (userId: string) => {
        // DELETE requires generic Admin API or Edge Function usually.
        // We will try a direct delete on 'profiles' first (if cascading deletes user),
        // BUT usually auth.users delete triggers profile delete, not vice versa.
        // Without an Edge Function for "deleteUser", we might be limited.
        // For now, let's implement the UI and a placeholder action or try a direct RPC call if it existed.

        // Since user asked for it, they might expect it to work. 
        // We'll warn if we can't do it directly.

        if (!confirm("DANGER: Are you sure you want to delete this user? This action CANNOT be undone.")) return;

        // Placeholder for Delete Logic - this is likely to fail RLS on auth.users from client
        setMessage({ type: 'error', text: "Deleting users requires a Superadmin Edge Function (not yet configured). Please contact developer to add 'delete-user' function." });

        /* 
        // Future Implementation with Edge Function:
        const { error } = await supabase.functions.invoke('delete-user', { body: { userId } });
        if (error) ...
        */
    };

    const filteredUsers = users.filter(u =>
        (u.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (u.username?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (u.id || '').includes(searchTerm.toLowerCase())
    );

    const isSuperAdmin = currentUserRole === 'superadmin';

    return (
        <div className="bg-wurm-panel border border-wurm-border rounded p-6">
            <h2 className="text-xl font-serif font-bold text-white mb-4 flex items-center gap-2">
                <ShieldAlert className="text-wurm-accent" /> User Management
            </h2>

            {message && (
                <div className={`mb-4 p-3 rounded border text-sm flex items-center gap-2 ${message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                    {message.type === 'success' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                    {message.text}
                    <button onClick={() => setMessage(null)} className="ml-auto hover:text-white"><XIcon /></button>
                </div>
            )}

            <div className="mb-4 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-wurm-muted" size={16} />
                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-black/30 border border-wurm-border rounded pl-10 pr-4 py-2 text-sm text-white focus:border-wurm-accent focus:outline-none"
                />
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-wurm-border text-xs font-mono text-wurm-muted uppercase tracking-wider">
                            <th className="p-3">User</th>
                            <th className="p-3">Role</th>
                            <th className="p-3">Created</th>
                            <th className="p-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-wurm-border/30">
                        {loading ? (
                            <tr><td colSpan={4} className="p-8 text-center text-wurm-muted">Loading profiles...</td></tr>
                        ) : filteredUsers.length === 0 ? (
                            <tr><td colSpan={4} className="p-8 text-center text-wurm-muted">No users found.</td></tr>
                        ) : filteredUsers.map(profile => (
                            <tr key={profile.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-3">
                                    <div className="text-sm font-bold text-wurm-text">{profile.username || 'Unknown'}</div>
                                    <div className="text-xs text-wurm-muted font-mono">{profile.email || profile.id}</div>
                                </td>
                                <td className="p-3">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${profile.global_role === 'superadmin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                            profile.global_role === 'admin' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                                'bg-wurm-border/50 text-wurm-muted border-wurm-border'
                                        }`}>
                                        {profile.global_role || 'member'}
                                    </span>
                                </td>
                                <td className="p-3 text-xs text-wurm-muted font-mono">
                                    {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : '-'}
                                </td>
                                <td className="p-3 text-right space-x-2">
                                    {/* Reset Password - Admin & Superadmin */}
                                    {(isSuperAdmin || currentUserRole === 'admin') && (
                                        <button
                                            onClick={() => profile.email && handleResetPassword(profile.email)}
                                            disabled={!profile.email}
                                            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded hover:bg-blue-500/20 transition-colors text-xs disabled:opacity-50"
                                            title="Send Password Reset Email"
                                        >
                                            <KeyRound size={12} /> Reset
                                        </button>
                                    )}

                                    {/* Delete - Superadmin Only */}
                                    {isSuperAdmin && (
                                        <button
                                            onClick={() => handleDeleteUser(profile.id)}
                                            className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded hover:bg-red-500/20 transition-colors text-xs"
                                            title="Delete User"
                                        >
                                            <Trash2 size={12} /> Delete
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 p-3 bg-wurm-bg/50 border border-wurm-border rounded text-[10px] text-wurm-muted font-mono">
                <p><strong>Note:</strong> Passwords are hashed and cannot be viewed directly. Use "Reset" to help users recover access.</p>
            </div>
        </div>
    );
}

const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);
