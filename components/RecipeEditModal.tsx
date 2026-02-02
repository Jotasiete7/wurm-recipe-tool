import React from 'react';
import { X } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { Recipe } from '../types';
import RecipeForm from './RecipeForm';

interface RecipeEditModalProps {
    recipe: Recipe;
    onClose: () => void;
    onSave: () => void;
}

export default function RecipeEditModal({ recipe, onClose, onSave }: RecipeEditModalProps) {
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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-wurm-panel border border-wurm-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-wurm-border">
                    <div>
                        <h2 className="text-xl font-serif font-bold text-white">Edit Recipe</h2>
                        <p className="text-xs text-wurm-muted mt-1 font-mono">
                            Editing: {recipe.name}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-wurm-accent/10 rounded-full transition-colors text-wurm-muted hover:text-wurm-accent"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <RecipeForm
                        initialRecipe={recipe}
                        onSubmit={handleSubmit}
                        submitLabel="Save Changes"
                        requireScreenshot={false}
                        showSubmitterName={false}
                    />
                </div>
            </div>
        </div>
    );
}
