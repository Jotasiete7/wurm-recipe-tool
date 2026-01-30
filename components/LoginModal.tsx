import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { X } from 'lucide-react';

interface LoginModalProps {
    onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { signIn } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await signIn(email, password);

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            // Success, close modal
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-wurm-panel border border-wurm-border rounded-lg shadow-2xl max-w-md w-full relative overflow-hidden">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-wurm-muted hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="p-8">
                    <h2 className="text-2xl font-serif font-bold text-white mb-2 text-center">
                        A Guilda Access
                    </h2>
                    <p className="text-wurm-muted text-xs text-center mb-6 font-mono">
                        Faça login para gerenciar receitas
                    </p>

                    {error && (
                        <div className="bg-red-900/20 border border-red-900/50 text-red-200 text-xs p-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-[10px] uppercase font-bold text-wurm-muted tracking-widest block mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full bg-black/50 border border-wurm-border rounded p-2 text-sm text-wurm-text focus:border-wurm-accent outline-none font-mono"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-[10px] uppercase font-bold text-wurm-muted tracking-widest block mb-1">Senha</label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full bg-black/50 border border-wurm-border rounded p-2 text-sm text-wurm-text focus:border-wurm-accent outline-none font-mono"
                                required
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-wurm-accent text-black font-bold uppercase tracking-widest text-xs py-3 rounded hover:bg-white transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Verificando...' : 'Autenticar'}
                            </button>
                            <p className="text-center mt-4 text-[10px] text-wurm-muted">
                                Sem conta? Crie uma no painel principal da Guilda.
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
