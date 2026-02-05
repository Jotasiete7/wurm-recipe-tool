import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { KeyRound, ShieldCheck, X } from 'lucide-react';

export default function ResetPasswordModal() {
    const { setRecoveryMode } = useAuth();
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { error } = await supabase.auth.updateUser({ password: password });

            if (error) {
                setError(error.message);
            } else {
                setSuccess(true);
                // Auto close after 3 seconds
                setTimeout(() => {
                    setRecoveryMode(false);
                }, 3000);
            }
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setRecoveryMode(false);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />

            <div className="relative w-full max-w-sm bg-wurm-panel border border-wurm-border rounded-lg shadow-2xl p-6">
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-wurm-muted hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="mb-6 flex justify-center">
                    <div className="bg-wurm-accent/10 p-4 rounded-full border border-wurm-accent/20">
                        <KeyRound className="text-wurm-accent" size={32} />
                    </div>
                </div>

                <h2 className="text-xl font-serif font-bold text-white mb-2 text-center">Set New Password</h2>
                <p className="text-wurm-muted text-xs font-mono mb-6 text-center">
                    Enter your new password below.
                </p>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-xs text-center">
                        {error}
                    </div>
                )}

                {success ? (
                    <div className="flex flex-col items-center justify-center py-4 space-y-2 animate-in fade-in">
                        <ShieldCheck size={48} className="text-green-500 mb-2" />
                        <p className="text-green-400 font-bold text-sm">Password Updated!</p>
                        <p className="text-wurm-muted text-xs">Closing window...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-mono text-wurm-muted mb-1.5">New Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full bg-black/30 border border-wurm-border rounded px-3 py-2.5 text-white text-sm focus:outline-none focus:border-wurm-accent transition-colors"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || password.length < 6}
                            className="w-full bg-wurm-accent text-black font-bold uppercase text-xs py-3 rounded tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
