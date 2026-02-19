import { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { Recipe, Language } from '../types';
import RecipeForm from './RecipeForm';

interface RecipeEditModalProps {
    recipe: Recipe;
    onClose: () => void;
    onSave: () => void;
    onDelete: () => void;
    t: any;
    lang: Language;
}

export default function RecipeEditModal({ recipe, onClose, onSave, onDelete, t, lang }: RecipeEditModalProps) {
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleSubmit = async (data: {
        name: string;
        skill: string;
        container: string;
        cooker: string;
        mandatory: string;
        screenshot: File | null;
        hint_en: string;
        hint_pt: string;
        hint_ru: string;
    }) => {
        if (!recipe.id) {
            throw new Error('Recipe ID is missing');
        }

        // Update recipe in database
        const { error } = await supabase
            .from('recipes')
            .update({
                name: data.name,
                skill: data.skill,
                container: data.container,
                cooker: data.cooker,
                mandatory: data.mandatory,
                hint_en: data.hint_en || null,
                hint_pt: data.hint_pt || null,
                hint_ru: data.hint_ru || null,
            })
            .eq('id', recipe.id);

        if (error) {
            console.error('Update error:', error);
            throw new Error('Failed to update recipe. Please try again.');
        }

        // Call onSave callback (triggers refresh)
        onSave();
        onClose();
    };

    const handleDelete = async () => {
        if (!recipe.id) return;
        setDeleting(true);
        try {
            const { error } = await supabase
                .from('recipes')
                .delete()
                .eq('id', recipe.id);

            if (error) {
                console.error('Delete error:', error);
                setDeleting(false);
                setConfirmDelete(false);
                return;
            }

            onDelete();
        } catch (err) {
            console.error('Delete failed:', err);
            setDeleting(false);
            setConfirmDelete(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-wurm-panel border border-wurm-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-wurm-border">
                    <div>
                        <h2 className="text-xl font-serif font-bold text-white">{t.forms.editTitle}</h2>
                        <p className="text-xs text-wurm-muted mt-1 font-mono">
                            {t.forms.editing} {recipe.name}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Delete Button */}
                        {!confirmDelete ? (
                            <button
                                onClick={() => setConfirmDelete(true)}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider text-red-400 border border-red-400/30 rounded hover:bg-red-500/10 hover:border-red-400 transition-all"
                                title="Delete this recipe"
                            >
                                <Trash2 size={13} />
                                Delete
                            </button>
                        ) : (
                            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/40 rounded px-3 py-1.5">
                                <span className="text-xs text-red-300 font-mono">Sure?</span>
                                <button
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors font-mono uppercase disabled:opacity-50"
                                >
                                    {deleting ? '...' : 'Yes'}
                                </button>
                                <span className="text-red-500/50 text-xs">|</span>
                                <button
                                    onClick={() => setConfirmDelete(false)}
                                    className="text-xs text-wurm-muted hover:text-white transition-colors font-mono uppercase"
                                >
                                    No
                                </button>
                            </div>
                        )}

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-wurm-accent/10 rounded-full transition-colors text-wurm-muted hover:text-wurm-accent"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Form Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <RecipeForm
                        initialRecipe={recipe}
                        onSubmit={handleSubmit}
                        submitLabel={t.forms.saveChanges}
                        requireScreenshot={false}
                        showSubmitterName={false}
                        t={t}
                        lang={lang}
                    />
                </div>
            </div>
        </div>
    );
}
