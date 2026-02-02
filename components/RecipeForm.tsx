import React, { useRef } from 'react';
import { Upload, Plus, Trash2, AlertCircle } from 'lucide-react';
import { SKILLS, CONTAINERS, COOKERS } from '../constants';
import { useRecipeForm } from '../hooks/useRecipeForm';
import { Recipe, Language } from '../types';
import { translateSkill } from '../utils/translations';

interface RecipeFormProps {
    initialRecipe?: Recipe;
    onSubmit: (data: {
        name: string;
        skill: string;
        container: string;
        cooker: string;
        mandatory: string;
        screenshot: File | null;
        hint_en: string;
        hint_pt: string;
        hint_ru: string;
    }) => Promise<void>;
    submitLabel: string;
    requireScreenshot?: boolean;
    showSubmitterName?: boolean;
    submitterName?: string;
    onSubmitterNameChange?: (name: string) => void;
    t: any;
    lang: Language;
}

export default function RecipeForm({
    initialRecipe,
    onSubmit,
    submitLabel,
    requireScreenshot = false,
    showSubmitterName = false,
    submitterName = '',
    onSubmitterNameChange,
    t,
    lang
}: RecipeFormProps) {
    const {
        formData,
        errors,
        updateField,
        updateIngredient,
        addIngredient,
        removeIngredient,
        validate,
        getMandatoryString,
    } = useRecipeForm(initialRecipe);

    const [loading, setLoading] = React.useState(false);
    const [submitError, setSubmitError] = React.useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError(null);

        if (!validate()) {
            return;
        }

        if (requireScreenshot && !formData.screenshot) {
            setSubmitError(t.forms.proofScreenshot + ' required');
            return;
        }

        setLoading(true);

        try {
            await onSubmit({
                name: formData.name,
                skill: formData.skill,
                container: formData.container,
                cooker: formData.cooker,
                mandatory: getMandatoryString(),
                screenshot: formData.screenshot,
                hint_en: formData.hintEn || '',
                hint_pt: formData.hintPt || '',
                hint_ru: formData.hintRu || '',
            });
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Display */}
            {submitError && (
                <div className="bg-red-500/10 border border-red-500/30 rounded p-3 flex items-start gap-2">
                    <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-300">{submitError}</p>
                </div>
            )}

            {/* Recipe Name */}
            <div>
                <label className="block text-xs font-bold text-wurm-muted uppercase tracking-wider mb-2">
                    {t.forms.recipeName}
                </label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    className={`w-full px-4 py-2.5 rounded bg-black/50 border ${errors.name ? 'border-red-500' : 'border-wurm-border'
                        } text-sm text-wurm-text focus:border-wurm-accent focus:outline-none transition-all`}
                    placeholder={t.forms.recipeNamePlaceholder}
                />
                {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
            </div>

            {/* Skill */}
            <div>
                <label className="block text-xs font-bold text-wurm-muted uppercase tracking-wider mb-2">
                    {t.forms.skill}
                </label>
                <select
                    value={formData.skill}
                    onChange={(e) => updateField('skill', e.target.value)}
                    className={`w-full px-4 py-2.5 rounded bg-black/50 border ${errors.skill ? 'border-red-500' : 'border-wurm-border'
                        } text-sm text-wurm-text focus:border-wurm-accent focus:outline-none transition-all`}
                >
                    <option value="">{t.forms.selectSkill}</option>
                    {SKILLS.map((s) => (
                        <option key={s} value={s}>
                            {translateSkill(s, lang)}
                        </option>
                    ))}
                </select>
                {errors.skill && <p className="text-xs text-red-400 mt-1">{errors.skill}</p>}
            </div>

            {/* Container */}
            <div>
                <label className="block text-xs font-bold text-wurm-muted uppercase tracking-wider mb-2">
                    {t.forms.container}
                </label>
                <select
                    value={formData.container}
                    onChange={(e) => updateField('container', e.target.value)}
                    className={`w-full px-4 py-2.5 rounded bg-black/50 border ${errors.container ? 'border-red-500' : 'border-wurm-border'
                        } text-sm text-wurm-text focus:border-wurm-accent focus:outline-none transition-all`}
                >
                    <option value="">{t.forms.selectContainer}</option>
                    {CONTAINERS.map((c) => (
                        <option key={c} value={c}>
                            {c}
                        </option>
                    ))}
                </select>
                {errors.container && <p className="text-xs text-red-400 mt-1">{errors.container}</p>}
            </div>

            {/* Cooker */}
            <div>
                <label className="block text-xs font-bold text-wurm-muted uppercase tracking-wider mb-2">
                    {t.forms.cooker}
                </label>
                <select
                    value={formData.cooker}
                    onChange={(e) => updateField('cooker', e.target.value)}
                    className={`w-full px-4 py-2.5 rounded bg-black/50 border ${errors.cooker ? 'border-red-500' : 'border-wurm-border'
                        } text-sm text-wurm-text focus:border-wurm-accent focus:outline-none transition-all`}
                >
                    <option value="">{t.forms.selectCooker}</option>
                    {COOKERS.map((c) => (
                        <option key={c} value={c}>
                            {c}
                        </option>
                    ))}
                </select>
                {errors.cooker && <p className="text-xs text-red-400 mt-1">{errors.cooker}</p>}
            </div>

            {/* Ingredients */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-wurm-muted uppercase tracking-wider">
                        {t.forms.ingredients}
                    </label>
                    <button
                        type="button"
                        onClick={addIngredient}
                        className="text-xs text-wurm-accent hover:text-white transition-colors flex items-center gap-1"
                    >
                        <Plus size={14} /> {t.forms.addIngredient}
                    </button>
                </div>

                <div className="space-y-2">
                    {formData.ingredients.map((ing, idx) => (
                        <div key={idx} className="flex gap-2">
                            <input
                                type="text"
                                value={ing.name}
                                onChange={(e) => updateIngredient(idx, 'name', e.target.value)}
                                placeholder={t.forms.ingredientNamePlaceholder}
                                className="flex-1 px-3 py-2 rounded bg-black/50 border border-wurm-border text-sm text-wurm-text focus:border-wurm-accent focus:outline-none"
                            />
                            <input
                                type="text"
                                value={ing.qty}
                                onChange={(e) => updateIngredient(idx, 'qty', e.target.value)}
                                placeholder={t.forms.qtyPlaceholder}
                                className="w-24 px-3 py-2 rounded bg-black/50 border border-wurm-border text-sm text-wurm-text focus:border-wurm-accent focus:outline-none"
                            />
                            {formData.ingredients.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeIngredient(idx)}
                                    className="p-2 text-wurm-muted hover:text-red-400 transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                {errors.ingredients && <p className="text-xs text-red-400 mt-1">{errors.ingredients}</p>}
            </div>

            {/* Hints Section */}
            <div className="border-t border-wurm-border pt-6">
                <h3 className="text-sm font-bold text-wurm-text mb-4">{t.forms.hintsTitle}</h3>

                <div className="space-y-3">
                    <div>
                        <label className="block text-xs text-wurm-muted mb-1">{t.forms.hintEn}</label>
                        <input
                            type="text"
                            value={formData.hintEn}
                            onChange={(e) => updateField('hintEn', e.target.value)}
                            placeholder={t.forms.hintPlaceholderEn}
                            className="w-full px-3 py-2 rounded bg-black/50 border border-wurm-border text-sm text-wurm-text focus:border-wurm-accent focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-wurm-muted mb-1">{t.forms.hintPt}</label>
                        <input
                            type="text"
                            value={formData.hintPt}
                            onChange={(e) => updateField('hintPt', e.target.value)}
                            placeholder={t.forms.hintPlaceholderPt}
                            className="w-full px-3 py-2 rounded bg-black/50 border border-wurm-border text-sm text-wurm-text focus:border-wurm-accent focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-wurm-muted mb-1">{t.forms.hintRu}</label>
                        <input
                            type="text"
                            value={formData.hintRu}
                            onChange={(e) => updateField('hintRu', e.target.value)}
                            placeholder={t.forms.hintPlaceholderRu}
                            className="w-full px-3 py-2 rounded bg-black/50 border border-wurm-border text-sm text-wurm-text focus:border-wurm-accent focus:outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Screenshot Upload */}
            {requireScreenshot && (
                <div>
                    <label className="block text-xs font-bold text-wurm-muted uppercase tracking-wider mb-2">
                        {t.forms.proofScreenshot}
                    </label>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                updateField('screenshot', e.target.files[0]);
                            }
                        }}
                        className="hidden"
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full px-4 py-3 rounded bg-wurm-panel border border-wurm-border text-sm text-wurm-text hover:border-wurm-accent transition-all flex items-center justify-center gap-2"
                    >
                        <Upload size={16} />
                        {formData.screenshot ? formData.screenshot.name : t.forms.chooseFile}
                    </button>
                    <p className="text-xs text-wurm-muted mt-1">
                        {t.forms.screenshotHelp}
                    </p>
                </div>
            )}

            {/* Submitter Name (for create mode) */}
            {showSubmitterName && (
                <div>
                    <label className="block text-xs font-bold text-wurm-muted uppercase tracking-wider mb-2">
                        {t.forms.submitterName}
                    </label>
                    <input
                        type="text"
                        value={submitterName}
                        onChange={(e) => onSubmitterNameChange?.(e.target.value)}
                        placeholder={t.forms.submitterNamePlaceholder}
                        className="w-full px-4 py-2.5 rounded bg-black/50 border border-wurm-border text-sm text-wurm-text focus:border-wurm-accent focus:outline-none"
                    />
                    <p className="text-xs text-wurm-muted mt-1">
                        {t.forms.submitterNameHelp}
                    </p>
                </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-wurm-accent text-black font-bold text-sm uppercase tracking-widest rounded hover:bg-wurm-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? t.forms.processing : submitLabel}
                </button>
            </div>
        </form>
    );
}
