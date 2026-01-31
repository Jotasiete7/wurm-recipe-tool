
import React from 'react';
import { X, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LoginModalProps {
    onClose: () => void;
}

export default function LoginModal({ onClose }: LoginModalProps) {
    const { signIn } = useAuth();

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-sm bg-wurm-panel border border-wurm-border rounded-lg shadow-2xl p-6 text-center">

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

                <h2 className="text-xl font-serif font-bold text-white mb-2">Member Access</h2>
                <p className="text-wurm-muted text-xs font-mono mb-8">
                    Log in with your Guild ID to submit recipes and access VIP content.
                </p>

                <button
                    onClick={() => signIn()}
                    className="w-full bg-wurm-accent text-black font-bold uppercase text-xs py-3 rounded tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-2"
                >
                    <Shield size={14} /> Log in with A Guilda
                </button>

                <p className="mt-4 text-[10px] text-wurm-muted/50 font-mono uppercase">
                    Secured by A Guilda ID
                </p>
            </div>
        </div>
    );
}
