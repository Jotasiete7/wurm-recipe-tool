
import { X, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

import { isFallbackClient } from '../supabaseClient';

interface LoginModalProps {
    onClose: () => void;
}

export default function LoginModal({ onClose }: LoginModalProps) {
    const { signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await signIn(email, password);

        if (result.error) {
            if (result.error.includes("Failed to fetch")) {
                setError("Network Error: Unable to reach authentication server. Please check your connection or Env Vars.");
            } else {
                setError(result.error);
            }
            setLoading(false);
        } else {
            onClose(); // Close modal on success
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-sm bg-wurm-panel border border-wurm-border rounded-lg shadow-2xl p-6">

                {isFallbackClient && (
                    <div className="absolute -top-12 left-0 right-0 bg-amber-500/90 text-black text-[10px] font-mono font-bold px-4 py-2 rounded shadow-lg text-center">
                        ⚠️ RUNNING IN FALLBACK MODE <br />
                        Check your network or Cloudflare Environment Variables.
                    </div>
                )}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-wurm-muted hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="mb-6 flex justify-center">
                    <div className="bg-wurm-accent/10 p-4 rounded-full border border-wurm-accent/20">
                        <Shield className="text-wurm-accent" size={32} />
                    </div>
                </div>

                <h2 className="text-xl font-serif font-bold text-white mb-2 text-center">Member Access</h2>
                <p className="text-wurm-muted text-xs font-mono mb-6 text-center">
                    Log in with your Guild credentials
                </p>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-xs">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-mono text-wurm-muted mb-1.5">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-black/30 border border-wurm-border rounded px-3 py-2.5 text-white text-sm focus:outline-none focus:border-wurm-accent transition-colors"
                            placeholder="your@email.com"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-mono text-wurm-muted mb-1.5">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-black/30 border border-wurm-border rounded px-3 py-2.5 text-white text-sm focus:outline-none focus:border-wurm-accent transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-wurm-accent text-black font-bold uppercase text-xs py-3 rounded tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Shield size={14} />
                        {loading ? 'Logging in...' : 'Log In'}
                    </button>
                </form>

                <p className="mt-4 text-[10px] text-wurm-muted/50 font-mono uppercase text-center">
                    Same credentials as A Guilda Hub
                </p>
            </div>
        </div >
    );
}
