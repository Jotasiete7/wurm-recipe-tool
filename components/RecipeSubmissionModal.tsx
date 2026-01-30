import React, { useState, useRef } from 'react';
import { X, Upload, Plus, Trash2, AlertCircle } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';

interface RecipeSubmissionModalProps {
    onClose: () => void;
}

interface IngredientRow {
    name: string;
    qty: string;
}

export default function RecipeSubmissionModal({ onClose }: RecipeSubmissionModalProps) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [name, setName] = useState('');
    const [ingredients, setIngredients] = useState<IngredientRow[]>([{ name: '', qty: '' }]);
    const [screenshot, setScreenshot] = useState<File | null>(null);
    const [submitterName, setSubmitterName] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAddIngredient = () => {
        setIngredients([...ingredients, { name: '', qty: '' }]);
    };

    const handleRemoveIngredient = (index: number) => {
        const newIngredients = [...ingredients];
        newIngredients.splice(index, 1);
        setIngredients(newIngredients);
    };

    const handleIngredientChange = (index: number, field: keyof IngredientRow, value: string) => {
        const newIngredients = [...ingredients];
        newIngredients[index][field] = value;
        setIngredients(newIngredients);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setScreenshot(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (!name) throw new Error("Recipe name is required.");
            if (ingredients.some(i => !i.name)) throw new Error("All ingredients must have a name.");
            if (!screenshot) throw new Error("Proof screenshot is required.");

            // 1. Upload Screenshot
            const fileExt = screenshot.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `recipe-proofs/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('images') // Assumes an 'images' bucket exists or catch error
                .upload(filePath, screenshot);

            if (uploadError) {
                // Fallback or specific error handling if bucket missing
                console.error("Upload error:", uploadError);
                throw new Error("Failed to upload screenshot. Please try again.");
            }

            const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath);

            // 2. Format Ingredients
            // Format: "Ingredient (Qty); Ingredient 2"
            const mandatoryString = ingredients
                .map(i => i.qty ? `${i.name} (${i.qty})` : i.name)
                .join('; ');

            // 3. Insert into Database
            const { error: insertError } = await supabase
                .from('recipes')
                .insert({
                    name,
                    mandatory: mandatoryString,
                    status: 'pending', // Pending approval
                    submitted_by: user?.id,
                    screenshot_url: publicUrl
                });

            if (insertError) throw insertError;

            alert("Receita enviada para análise! 🛡️");
            onClose();

        } catch (err: any) {
            setError(err.message || 'Error submitting recipe');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-lg bg-wurm-panel border border-wurm-border rounded-lg shadow-2xl flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-wurm-border bg-black/20">
                    <h3 className="text-wurm-accent font-serif text-xl border-l-2 border-wurm-accent pl-3">
                        Submit New Recipe
                    </h3>
                    <button onClick={onClose} className="text-wurm-muted hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    <div className="bg-wurm-accent/5 border border-wurm-accent/20 rounded p-3 flex items-start gap-3">
                        <AlertCircle className="text-wurm-accent shrink-0 mt-0.5" size={16} />
                        <p className="text-xs text-wurm-muted font-mono leading-relaxed">
                            Please use exact English names from game. Your recipe will be reviewed by the Guild Council before appearing on the site.
                        </p>
                    </div>

                    <form id="submit-recipe-form" onSubmit={handleSubmit} className="space-y-5">

                        {/* Name */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-wurm-muted uppercase tracking-wider flex items-center gap-1">
                                Recipe Name (English) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Bacon and eggs"
                                className="w-full bg-black/50 border border-wurm-border rounded px-3 py-2 text-sm text-white focus:border-wurm-accent outline-none font-mono"
                            />
                        </div>

                        {/* Ingredients */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-bold text-wurm-muted uppercase tracking-wider">
                                    Ingredients
                                </label>
                                <button
                                    type="button"
                                    onClick={handleAddIngredient}
                                    className="text-[10px] text-wurm-accent hover:text-white flex items-center gap-1 uppercase font-bold"
                                >
                                    <Plus size={10} /> Add Ingredient
                                </button>
                            </div>

                            <div className="space-y-2">
                                {ingredients.map((ing, idx) => (
                                    <div key={idx} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={ing.name}
                                            onChange={(e) => handleIngredientChange(idx, 'name', e.target.value)}
                                            placeholder="Item (e.g. egg)"
                                            className="flex-1 bg-black/50 border border-wurm-border rounded px-3 py-2 text-xs text-white focus:border-wurm-accent outline-none font-mono"
                                        />
                                        <input
                                            type="text"
                                            value={ing.qty}
                                            onChange={(e) => handleIngredientChange(idx, 'qty', e.target.value)}
                                            placeholder="Qty/Ratio"
                                            className="w-20 bg-black/50 border border-wurm-border rounded px-3 py-2 text-xs text-white focus:border-wurm-accent outline-none font-mono text-center"
                                        />
                                        {ingredients.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveIngredient(idx)}
                                                className="text-red-500 hover:text-red-400 px-1"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Screenshot */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-wurm-muted uppercase tracking-wider flex items-center gap-1">
                                Proof Screenshot <span className="text-red-500">*</span>
                            </label>
                            <div
                                className="border border-dashed border-wurm-border rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/5 transition-colors group"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Upload className="text-wurm-muted group-hover:text-wurm-accent transition-colors" size={24} />
                                <span className="text-xs text-wurm-muted font-mono">
                                    {screenshot ? screenshot.name : 'Upload Screenshot'}
                                </span>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </div>
                        </div>

                        {/* Submitter Name */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-wurm-muted uppercase tracking-wider">
                                Your Name (Optional)
                            </label>
                            <input
                                type="text"
                                value={submitterName}
                                onChange={(e) => setSubmitterName(e.target.value)}
                                className="w-full bg-black/50 border border-wurm-border rounded px-3 py-2 text-sm text-white focus:border-wurm-accent outline-none font-mono"
                            />
                        </div>

                        {error && (
                            <p className="text-red-400 text-xs font-mono bg-red-400/10 p-2 rounded border border-red-400/20">
                                {error}
                            </p>
                        )}

                    </form>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-wurm-border bg-black/20 flex justify-end">
                    <button
                        type="submit"
                        form="submit-recipe-form"
                        disabled={loading}
                        className="bg-wurm-accent text-black font-bold uppercase text-xs px-6 py-3 rounded tracking-widest hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading ? 'Sending...' : 'Submit Recipe'}
                    </button>
                </div>

            </div>
        </div>
    );
}
