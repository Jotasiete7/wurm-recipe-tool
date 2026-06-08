import { useState, useEffect } from 'react';
import { X, Loader2, AlertTriangle, Upload } from 'lucide-react';
import { supabase } from '../supabaseClient';
import RecipeForm from './RecipeForm';
import { Language, Recipe } from '../types';
import { parseOcrText, mergeParses } from '../utils/ocrParser';
import { findBestRecipeMatch } from '../utils/recipeMatcher';

interface RecipeSubmissionModalProps {
    onClose: () => void;
    t: any;
    lang: Language;
    initialFiles?: File[] | null;
}

export default function RecipeSubmissionModal({ onClose, t, lang, initialFiles = null }: RecipeSubmissionModalProps) {
    const [submitterName, setSubmitterName] = useState(() => {
        return localStorage.getItem('wurm_contributor_nick') || '';
    });
    
    const [ocrLoading, setOcrLoading] = useState(false);
    const [ocrProgress, setOcrProgress] = useState(0);
    const [ocrError, setOcrError] = useState<string | null>(null);
    const [initialRecipe, setInitialRecipe] = useState<Recipe | undefined>(undefined);
    const [matchDetails, setMatchDetails] = useState<{ name: string; score: number } | null>(null);

    // Persist nick changes
    const handleNickChange = (name: string) => {
        setSubmitterName(name);
        localStorage.setItem('wurm_contributor_nick', name);
    };

    const handleFilesIngested = async (files: File[]) => {
        if (!files || files.length === 0) return;
        setOcrLoading(true);
        setOcrProgress(0);
        setOcrError(null);
        setMatchDetails(null);
        
        try {
            const { createWorker } = await import('tesseract.js');
            const parsedResults: Partial<Recipe>[] = [];

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const worker = await createWorker('eng', 1, {
                    logger: (m: any) => {
                        if (m.status === 'recognizing text') {
                            const progressPct = Math.round(((i + m.progress) / files.length) * 100);
                            setOcrProgress(progressPct);
                        }
                    }
                });
                const { data: { text } } = await worker.recognize(file);
                await worker.terminate();

                const parsed = parseOcrText(text);
                parsedResults.push(parsed);
            }

            let newParsed = parsedResults[0];
            if (parsedResults.length > 1) {
                newParsed = mergeParses(parsedResults[0], parsedResults[1]);
            }

            // Merge with existing state if already populated
            let mergedRecipe: Recipe = {
                name: newParsed.name || initialRecipe?.name || '',
                skill: newParsed.skill || initialRecipe?.skill || '',
                container: newParsed.container || initialRecipe?.container || '',
                cooker: newParsed.cooker || initialRecipe?.cooker || '',
                mandatory: initialRecipe?.mandatory || '',
            };

            if (newParsed.mandatory) {
                const existingList = initialRecipe?.mandatory ? initialRecipe.mandatory.split(';').map(x => x.trim()) : [];
                const newList = newParsed.mandatory.split(';').map(x => x.trim());
                
                const ingredientMap = new Map<string, string>();
                [...existingList, ...newList].forEach(item => {
                    const name = item.split(',')[0]?.trim();
                    if (name) {
                        const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, '');
                        ingredientMap.set(normalized, item);
                    }
                });
                
                mergedRecipe.mandatory = Array.from(ingredientMap.values()).join('; ');
            }

            setInitialRecipe(mergedRecipe);

            // Check similarity against existing database recipes
            const { data: dbRecipes } = await supabase
                .from('recipes')
                .select('*')
                .in('status', ['verified', 'legacy_verified', 'pending']);

            if (dbRecipes && dbRecipes.length > 0) {
                const bestMatch = findBestRecipeMatch(mergedRecipe, dbRecipes, 0.75);
                if (bestMatch) {
                    setMatchDetails({
                        name: bestMatch.recipe.name,
                        score: bestMatch.score
                    });
                }
            }

        } catch (err) {
            console.error('OCR run error:', err);
            setOcrError(lang === 'pt' 
                ? 'Falha ao ler imagem. Por favor preencha manualmente.' 
                : 'Failed to read image. Please fill in the fields manually.');
        } finally {
            setOcrLoading(false);
        }
    };

    // Run OCR on mount if files are provided
    useEffect(() => {
        if (initialFiles && initialFiles.length > 0) {
            handleFilesIngested(initialFiles);
        }
    }, [initialFiles]);

    // Handle global paste events when the modal is open
    useEffect(() => {
        const handlePaste = (e: ClipboardEvent) => {
            if (e.clipboardData && e.clipboardData.files.length > 0) {
                const filesArray = Array.from(e.clipboardData.files).filter(f => f.type.startsWith('image/'));
                if (filesArray.length > 0) {
                    handleFilesIngested(filesArray.slice(0, 2));
                }
            }
        };

        window.addEventListener('paste', handlePaste);
        return () => {
            window.removeEventListener('paste', handlePaste);
        };
    }, [initialRecipe]);

    // Drag-and-drop state & handlers
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const filesArray = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
            if (filesArray.length > 0) {
                handleFilesIngested(filesArray.slice(0, 2));
            }
        }
    };

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
        is_unique: boolean;
        creator_name: string;
        server_name: string;
    }) => {
        // Call RPC submit_recipe_proof to handle rate limits, auto-verifications, and corrections
        const { data: rpcData, error: rpcError } = await supabase.rpc('submit_recipe_proof', {
            p_name: data.name,
            p_skill: data.skill,
            p_cooker: data.cooker,
            p_container: data.container,
            p_mandatory: data.mandatory,
            p_source: submitterName || null,
            p_is_unique: data.is_unique || false,
            p_creator_name: data.creator_name || null,
            p_server_name: data.server_name || null,
            p_hint_en: data.hint_en || null,
            p_hint_pt: data.hint_pt || null,
            p_hint_ru: data.hint_ru || null
        });

        if (rpcError) {
            console.error('RPC Error:', rpcError);
            throw new Error(rpcError.message || 'Failed to submit recipe.');
        }

        if (rpcData && !rpcData.success) {
            if (rpcData.message === 'rate_limit_exceeded') {
                throw new Error(lang === 'pt'
                    ? 'Você já enviou várias receitas essa hora — obrigado pela contribuição! ⚗️ Dê uma pausa e volte em breve.'
                    : 'You have sent several recipes this hour — thank you for the contribution! ⚗️ Take a break and return shortly.');
            }
            throw new Error(rpcData.message || 'Failed to submit recipe.');
        }

        // Show result-specific success alerts
        const resultType = rpcData?.result;
        let alertMessage = t.forms.successMessage;

        if (lang === 'pt') {
            if (resultType === 'corrected') {
                alertMessage = `✅ Correção aplicada! Obrigado por melhorar o livro de receitas, ${submitterName || 'Cozinheiro'}!`;
            } else if (resultType === 'auto_verified' || resultType === 'created_verified') {
                alertMessage = `✅ Receita verificada pela comunidade! Obrigado, ${submitterName || 'Cozinheiro'}!`;
            } else if (resultType === 'created_pending') {
                alertMessage = `⏳ Receita enviada! Quando outra pessoa confirmar, ela entrará no livro.`;
            } else if (resultType === 'confirmed' || resultType === 'proof_recorded') {
                alertMessage = `👍 Prova registrada com sucesso! Obrigado pela confirmação.`;
            }
        } else {
            if (resultType === 'corrected') {
                alertMessage = `✅ Correction applied! Thank you for improving the cookbook, ${submitterName || 'Chef'}!`;
            } else if (resultType === 'auto_verified' || resultType === 'created_verified') {
                alertMessage = `✅ Recipe verified by the community! Thank you, ${submitterName || 'Chef'}!`;
            } else if (resultType === 'created_pending') {
                alertMessage = `⏳ Recipe submitted! Once another person confirms, it will be added to the book.`;
            } else if (resultType === 'confirmed' || resultType === 'proof_recorded') {
                alertMessage = `👍 Proof recorded successfully! Thank you for the confirmation.`;
            }
        }

        alert(alertMessage);
        onClose();
    };

    return (
        <div 
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200"
        >
            <div className="relative bg-wurm-panel border border-wurm-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                
                {/* Drag Overlay */}
                {dragActive && (
                    <div className="absolute inset-0 bg-wurm-accent/15 border-2 border-dashed border-wurm-accent z-50 rounded-lg flex items-center justify-center pointer-events-none animate-in fade-in duration-200">
                        <div className="bg-black/80 px-6 py-4 rounded border border-wurm-accent text-wurm-accent font-serif font-bold text-sm tracking-wider uppercase">
                            {lang === 'pt' ? 'Solte o Print Aqui' : 'Drop Screenshot Here'}
                        </div>
                    </div>
                )}
                
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-wurm-border bg-gradient-to-r from-wurm-panel to-black">
                    <div>
                        <h2 className="text-xl font-serif font-bold text-white">{t.forms.submitTitle}</h2>
                        <p className="text-xs text-wurm-muted mt-1 font-mono">
                            {t.forms.submitSubtitle}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 bg-black/30 hover:bg-wurm-accent/20 rounded-full transition-colors text-wurm-muted hover:text-wurm-accent"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form Content */}
                <div className="flex-1 overflow-y-auto p-6 relative">
                    
                    {/* Match Warning */}
                    {matchDetails && (
                        <div className="bg-wurm-accent/5 border border-wurm-accent/20 rounded-lg p-4 mb-6 flex items-start gap-3 animate-in fade-in duration-200">
                            <AlertTriangle size={18} className="text-wurm-accent flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-xs font-bold text-wurm-accent uppercase tracking-wider mb-1">
                                    {lang === 'pt' ? 'Receita Semelhante Detectada' : 'Similar Recipe Detected'}
                                </h4>
                                <p className="text-xs text-wurm-text leading-relaxed font-mono">
                                    {lang === 'pt' 
                                        ? `Encontramos "${matchDetails.name}" (${(matchDetails.score * 100).toFixed(0)}% de similaridade). Se houver diferenças em ingredientes ou panelas, enviar esse formulário criará uma CORREÇÃO imediata.` 
                                        : `We found "${matchDetails.name}" (${(matchDetails.score * 100).toFixed(0)}% similarity). If there are differences in ingredients or cookers, submitting this form will apply a CORRECTION immediately.`}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* OCR Error Notification */}
                    {ocrError && (
                        <div className="bg-amber-500/10 border border-amber-500/25 rounded p-3 mb-6 flex items-start gap-2 animate-in fade-in duration-200">
                            <AlertTriangle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-amber-300">{ocrError}</p>
                        </div>
                    )}

                    {!initialRecipe ? (
                        <div className="flex flex-col items-center justify-center py-12 px-6 border border-dashed border-wurm-border rounded-lg text-center bg-black/10">
                            <Upload className="w-10 h-10 text-wurm-accent mb-3 animate-[pulse_2s_infinite]" />
                            <h3 className="text-xs font-bold text-wurm-accent uppercase tracking-widest font-serif mb-2">
                                {lang === 'pt' ? 'Arraste ou Cole o Print da Receita' : 'Drag or Paste Recipe Screenshot'}
                            </h3>
                            <p className="text-[10px] text-wurm-muted font-mono max-w-sm leading-relaxed mb-5">
                                {lang === 'pt' 
                                    ? '// Abra a receita expandida no jogo, tire o print (F12) e arraste-o aqui ou simplesmente use Ctrl+V.' 
                                    : '// Open the expanded recipe in-game, take a screenshot (F12) and drag it here or simply press Ctrl+V.'}
                            </p>
                            <label className="px-5 py-2 bg-wurm-accent/15 border border-wurm-accent text-wurm-accent text-[10px] font-bold uppercase tracking-widest rounded hover:bg-wurm-accent hover:text-black cursor-pointer transition-all">
                                {t.forms.chooseFile}
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files.length > 0) {
                                            handleFilesIngested(Array.from(e.target.files));
                                        }
                                    }}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    ) : (
                        <RecipeForm
                            initialRecipe={initialRecipe}
                            onSubmit={handleSubmit}
                            submitLabel={t.forms.submitRecipe}
                            requireScreenshot={false}
                            showSubmitterName={true}
                            submitterName={submitterName}
                            onSubmitterNameChange={handleNickChange}
                            t={t}
                            lang={lang}
                            readOnly={true} // Safe & tamper-proof
                        />
                    )}

                    {/* OCR Loading Overlay */}
                    {ocrLoading && (
                        <div className="absolute inset-0 bg-black/85 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200">
                            <Loader2 className="w-12 h-12 text-wurm-accent animate-spin mb-4" />
                            <div className="text-lg font-serif font-bold text-white mb-2">
                                {lang === 'pt' ? 'Escaneando Print do Wurm...' : 'Scanning Wurm Screenshot...'}
                            </div>
                            <div className="w-64 bg-wurm-border rounded-full h-2 mb-2 overflow-hidden relative border border-white/5">
                                <div 
                                    className="bg-wurm-accent h-full transition-all duration-300 shadow-[0_0_8px_#d4b483]"
                                    style={{ width: `${ocrProgress}%` }}
                                />
                            </div>
                            <div className="text-[10px] text-wurm-muted font-mono">{ocrProgress}% {lang === 'pt' ? 'completo' : 'complete'}</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
