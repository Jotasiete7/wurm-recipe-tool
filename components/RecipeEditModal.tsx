import React, { useState } from 'react';
import { X, Save, Loader } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { Recipe } from '../types';

interface RecipeEditModalProps {
    recipe: Recipe;
    onClose: () => void;
    onSave: () => void;
}

export default function RecipeEditModal({ recipe, onClose, onSave }: RecipeEditModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [hintEn, setHintEn] = useState(recipe.hint_en || '');
    const [hintPt, setHintPt] = useState(recipe.hint_pt || '');
    const [hintRu, setHintRu] = useState(recipe.hint_ru || '');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const { error: updateError } = await supabase
                .from('recipes')
                .update({
                    hint_en: hintEn || null,
                    hint_pt: hintPt || null,
                    hint_ru: hintRu || null,
                })
                .eq('id', recipe.id);

            if (updateError) throw updateError;

            onSave();
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to update recipe');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-lg bg-wurm-panel border border-wurm-border rounded-lg shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-wurm-border bg-black/20">
                    <h3 className="text-wurm-accent font-serif text-xl border-l-2 border-wurm-accent pl-3">
                        Edit Recipe Hints
                    </h3>
                    <button onClick={onClose} className="text-wurm-muted hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">

                    <div className="bg-wurm-accent/5 border border-wurm-accent/20 rounded p-3 mb-4">
                        <p className="text-xs text-wurm-muted font-mono">
                            Editing: <span className="text-wurm-accent font-bold">{recipe.name}</span>
                        </p>
                    </div>

                    {/* Hint EN */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-wurm-muted uppercase tracking-wider">
                            Hint (English)
                        </label>
                        <input
                            type="text"
                            value={hintEn}
                            onChange={(e) => setHintEn(e.target.value)}
                            placeholder="Hint in English"
                            className="w-full bg-black/50 border border-wurm-border rounded px-3 py-2 text-sm text-white focus:border-wurm-accent outline-none font-mono"
                        />
                    </div>

                    {/* Hint PT */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-wurm-muted uppercase tracking-wider">
                            Dica (Português)
                        </label>
                        <input
                            type="text"
                            value={hintPt}
                            onChange={(e) => setHintPt(e.target.value)}
                            placeholder="Dica em Português"
                            className="w-full bg-black/50 border border-wurm-border rounded px-3 py-2 text-sm text-white focus:border-wurm-accent outline-none font-mono"
                        />
                    </div>

                    {/* Hint RU */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-wurm-muted uppercase tracking-wider">
                            Подсказка (Русский)
                        </label>
                        <input
                            type="text"
                            value={hintRu}
                            onChange={(e) => setHintRu(e.target.value)}
                            placeholder="Подсказка на русском"
                            className="w-full bg-black/50 border border-wurm-border rounded px-3 py-2 text-sm text-white focus:border-wurm-accent outline-none font-mono"
                        />
                    </div>

                    {error && (
                        <p className="text-red-400 text-xs font-mono bg-red-400/10 p-2 rounded border border-red-400/20">
                            {error}
                        </p>
                    )}

                    {/* Footer */}
                    <div className="flex justify-end gap-2 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-wurm-muted hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-wurm-accent text-black font-bold uppercase text-xs px-6 py-2 rounded tracking-widest hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader size={14} className="animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={14} />
                                    Save
                                </>
                            )}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
}
