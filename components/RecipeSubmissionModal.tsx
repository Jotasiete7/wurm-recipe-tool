import { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import RecipeForm from './RecipeForm';
import { Language } from '../types';

interface RecipeSubmissionModalProps {
    onClose: () => void;
    t: any;
    lang: Language;
}

export default function RecipeSubmissionModal({ onClose, t, lang }: RecipeSubmissionModalProps) {
    const { user } = useAuth();
    const [submitterName, setSubmitterName] = useState('');

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
        if (!data.screenshot) {
            throw new Error(t.forms.proofScreenshot + ' required');
        }

        // 1. Upload Screenshot
        const fileExt = data.screenshot.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `recipe-proofs/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('images')
            .upload(filePath, data.screenshot);

        if (uploadError) {
            console.error('Upload error:', uploadError);
            throw new Error('Failed to upload screenshot. Please try again.');
        }

        const {
            data: { publicUrl },
        } = supabase.storage.from('images').getPublicUrl(filePath);

        // 2. Insert into Database
        const { error: insertError } = await supabase.from('recipes').insert({
            name: data.name,
            skill: data.skill,
            container: data.container,
            cooker: data.cooker,
            mandatory: data.mandatory,
            hint_en: data.hint_en || null,
            hint_pt: data.hint_pt || null,
            hint_ru: data.hint_ru || null,
            screenshot_url: publicUrl,
            status: 'pending',
            submitted_by: user?.id || null,
            source: submitterName || null,
        });

        if (insertError) {
            console.error('Insert error:', insertError);
            throw new Error('Failed to submit recipe. Please try again.');
        }

        // Success!
        alert(t.forms.successMessage);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-wurm-panel border border-wurm-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-wurm-border">
                    <div>
                        <h2 className="text-xl font-serif font-bold text-white">{t.forms.submitTitle}</h2>
                        <p className="text-xs text-wurm-muted mt-1 font-mono">
                            {t.forms.submitSubtitle}
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
                        onSubmit={handleSubmit}
                        submitLabel={t.forms.submitRecipe}
                        requireScreenshot={true}
                        showSubmitterName={true}
                        submitterName={submitterName}
                        onSubmitterNameChange={setSubmitterName}
                        t={t}
                        lang={lang}
                    />
                </div>
            </div>
        </div>
    );
}
