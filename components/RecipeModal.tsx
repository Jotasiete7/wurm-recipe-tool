import React, { useEffect, useState } from 'react';
import { Recipe, Language } from '../types';
import { getEmoji, findRecipeMatch } from '../utils/dataUtils';
import { translateSkill } from '../utils/translations';
import { X, ChefHat, Box, Flame, Utensils, Edit3, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import RecipeEditModal from './RecipeEditModal';
import { supabase } from '../supabaseClient';
import { useNotification } from '../contexts/NotificationContext';

interface RecipeModalProps {
  recipe: Recipe | null;
  onClose: () => void;
  onBack?: () => void;
  onRefresh?: () => void;
  lang: Language;
  t: any;
  allRecipeNames?: Set<string>;
  onIngredientClick?: (name: string) => void;
}

const RecipeModal: React.FC<RecipeModalProps> = ({
  recipe,
  onClose,
  onBack,
  onRefresh,
  lang,
  t,
  allRecipeNames,
  onIngredientClick
}) => {
  const { isAdmin } = useAuth();
  const { showNotification } = useNotification();
  const [showEditModal, setShowEditModal] = useState(false);

  const [timeLeft, setTimeLeft] = useState(5);
  const [voteCount, setVoteCount] = useState(0);
  const [votedToday, setVotedToday] = useState(false);
  const [voting, setVoting] = useState(false);

  // Load vote state and run time gate
  useEffect(() => {
    if (!recipe || !recipe.id) return;

    // Check if voted today in localStorage
    const votedList = JSON.parse(localStorage.getItem('wurm_voted_recipes') || '{}');
    const todayStr = new Date().toISOString().split('T')[0];
    if (votedList[recipe.id] === todayStr) {
      setVotedToday(true);
    } else {
      setVotedToday(false);
    }

    // Fetch monthly vote count
    const fetchVotes = async () => {
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
      const { count, error } = await supabase
        .from('recipe_votes')
        .select('*', { count: 'exact', head: true })
        .eq('recipe_id', recipe.id)
        .gte('voted_at', startOfMonth);
      
      if (!error && count !== null) {
        setVoteCount(count);
      }
    };
    fetchVotes();

    // Start time gate countdown
    setTimeLeft(5);
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [recipe]);

  const handleVote = async () => {
    if (timeLeft > 0 || votedToday || !recipe || !recipe.id || voting) return;
    setVoting(true);

    try {
      const { data, error } = await supabase.rpc('vote_recipe', { p_recipe_id: recipe.id });
      if (error) throw error;

      if (data && !data.success) {
        if (data.message === 'already_voted_today') {
          showNotification(t.ui.alreadyVoted, 'info');
          setVotedToday(true);
        } else if (data.message === 'cannot_confirm_own_recipe') {
          showNotification(t.ui.cannotConfirmOwnRecipe, 'error');
        } else {
          showNotification(data.message, 'info');
        }
        return;
      }

      setVoteCount(prev => prev + 1);
      setVotedToday(true);

      const votedList = JSON.parse(localStorage.getItem('wurm_voted_recipes') || '{}');
      votedList[recipe.id] = new Date().toISOString().split('T')[0];
      localStorage.setItem('wurm_voted_recipes', JSON.stringify(votedList));

      if (data && data.message === 'recipe_confirmed') {
        showNotification(lang === 'pt' ? 'Receita confirmada com sucesso! Ela agora faz parte do livro.' : 'Recipe confirmed successfully! It is now part of the book.', 'success');
      } else {
        showNotification(t.ui.voteSuccess, 'success');
      }
      
      if (onRefresh) onRefresh(); // Trigger refresh to show the updated status in the ui!
    } catch (err) {
      console.error(err);
      showNotification('Failed to cast vote.', 'error');
    } finally {
      setVoting(false);
    }
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (recipe) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [recipe]);

  if (!recipe) return null;

  const ingredients = recipe.mandatory ? recipe.mandatory.split(';').map(i => i.trim()) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-wurm-panel border border-wurm-border rounded shadow-2xl transform transition-all animate-in fade-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className={`relative bg-gradient-to-r from-wurm-panel to-black p-6 sm:p-8 border-b border-wurm-border ${onBack ? 'pt-14' : ''}`}>
          {onBack && (
            <button
              onClick={onBack}
              className="absolute top-4 left-4 p-2 bg-black/40 hover:bg-wurm-accent/20 rounded-full text-wurm-muted hover:text-wurm-accent transition-colors flex items-center gap-1.5 shadow-md shadow-black/30"
              title="Back to previous recipe"
            >
              <ArrowLeft size={16} />
              <span className="text-xs font-mono font-bold uppercase tracking-wider pr-1 hidden sm:inline">{t.ui.back || 'Back'}</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-wurm-accent/20 rounded-full text-wurm-muted hover:text-wurm-accent transition-colors"
          >
            <X size={20} />
          </button>

          {/* Edit Button (Admin Only) */}
          {isAdmin && recipe.id && (
            <button
              onClick={() => setShowEditModal(true)}
              className="absolute top-4 right-16 p-2 bg-black/40 hover:bg-wurm-accent/20 rounded-full text-wurm-muted hover:text-wurm-accent transition-colors"
              title="Edit hints"
            >
              <Edit3 size={16} />
            </button>
          )}

          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-end">
            <div className="w-24 h-24 bg-black/40 rounded border border-wurm-border flex items-center justify-center text-5xl shadow-[0_0_15px_rgba(0,0,0,0.5)]">
              {getEmoji(recipe.name)}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-3xl font-bold font-serif text-wurm-accent mb-2 tracking-tight">{recipe.name}</h2>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start opacity-90 mt-2">
                {recipe.skill && (
                  <span className="px-3 py-1 bg-wurm-accent/10 border border-wurm-accent/20 rounded text-xs font-mono font-bold text-wurm-accent uppercase tracking-wider">
                    {translateSkill(recipe.skill, lang)}
                  </span>
                )}
                {recipe.status === 'pending' && (
                  <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded text-xs font-mono font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
                    <span>⏳</span>
                    <span>{lang === 'pt' ? 'Pendente' : (lang === 'ru' ? 'В ожидании' : 'Pending')}</span>
                  </span>
                )}
                {recipe.status !== 'pending' && (
                  <>
                    {(recipe.verification_level === 1 || (!recipe.verification_level && recipe.status === 'legacy_verified')) && (
                      <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded text-xs font-mono font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                        <span>📜</span>
                        <span>{lang === 'pt' ? 'Legada (Nível 1)' : (lang === 'ru' ? 'Архивный (Ур. 1)' : 'Legacy (Level 1)')}</span>
                      </span>
                    )}
                    {(recipe.verification_level === 2 || (!recipe.verification_level && recipe.status === 'verified' && !recipe.is_unique)) && (
                      <span className="px-3 py-1 bg-wurm-success/10 border border-wurm-success/30 rounded text-xs font-mono font-bold text-wurm-success uppercase tracking-wider flex items-center gap-1.5">
                        <span>✓</span>
                        <span>{lang === 'pt' ? 'Confirmada (Nível 2)' : (lang === 'ru' ? 'Подтверждено (Ур. 2)' : 'Confirmed (Level 2)')}</span>
                      </span>
                    )}
                    {(recipe.verification_level === 3 || recipe.is_unique) && (
                      <span className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded text-xs font-mono font-bold text-yellow-500 uppercase tracking-wider flex items-center gap-1.5 animate-[pulse_3s_infinite]">
                        <span>⭐</span>
                        <span>{lang === 'pt' ? 'Alta Confiança (Nível 3)' : (lang === 'ru' ? 'Высокое доверие (Ур. 3)' : 'Trusted (Level 3)')}</span>
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 bg-wurm-bg/50">

          {/* Unique Recipe Credits */}
          {recipe.is_unique && (
            <div className="bg-yellow-950/20 border border-yellow-500/30 rounded p-4 flex items-center gap-3 animate-in fade-in duration-200">
              <span className="text-xl">⭐</span>
              <div>
                <h4 className="text-xs font-bold text-yellow-500 uppercase tracking-wider mb-0.5">
                  {t.ui.uniqueRecipe}
                </h4>
                <p className="text-sm text-wurm-text font-mono">
                  {t.ui.uniqueRecipeBy
                    .replace('{creator}', recipe.creator_name || 'Anonymous')
                    .replace('{server}', recipe.server_name || 'Unknown')}
                </p>
              </div>
            </div>
          )}

          {/* Main Attributes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recipe.container && (
              <div className="bg-wurm-panel p-4 rounded border border-wurm-border hover:border-wurm-border/80 transition-colors">
                <div className="flex items-center gap-3 text-wurm-accentDim mb-2">
                  <Box size={18} />
                  <span className="font-bold text-[10px] font-mono uppercase tracking-widest">{t.ui.containerLabel}</span>
                </div>
                <p className="text-wurm-text font-serif text-lg">{recipe.container}</p>
              </div>
            )}

            {recipe.cooker && (
              <div className="bg-wurm-panel p-4 rounded border border-wurm-border hover:border-wurm-border/80 transition-colors">
                <div className="flex items-center gap-3 text-wurm-accentDim mb-2">
                  <Flame size={18} />
                  <span className="font-bold text-[10px] font-mono uppercase tracking-widest">{t.ui.cookerLabel}</span>
                </div>
                <p className="text-wurm-text font-serif text-lg">{recipe.cooker}</p>
              </div>
            )}
            {recipe.skill && (
              <div className="bg-wurm-panel p-4 rounded border border-wurm-border col-span-1 sm:col-span-2 hover:border-wurm-border/80 transition-colors">
                <div className="flex items-center gap-3 text-wurm-accentDim mb-2">
                  <ChefHat size={18} />
                  <span className="font-bold text-[10px] font-mono uppercase tracking-widest">{t.ui.skillCategory}</span>
                </div>
                <p className="text-wurm-text font-serif text-lg">{translateSkill(recipe.skill, lang)}</p>
              </div>
            )}
          </div>

          {/* Ingredients Section */}
          <div className="border-t border-wurm-border pt-6">
            <h3 className="flex items-center gap-3 text-lg font-bold font-serif text-wurm-text mb-4">
              <span className="text-wurm-accent"><Utensils size={20} /></span>
              {t.ui.ingredients}
            </h3>

            {ingredients.length > 0 ? (
              <div className="bg-black/20 rounded border border-wurm-border/50">
                <ul className="divide-y divide-wurm-border/50">
                  {ingredients.map((item, idx) => {
                    // Find if this ingredient component is actually a recipe itself
                    const matchedRecipeName = allRecipeNames && findRecipeMatch(item, allRecipeNames);

                    return (
                      <li key={idx} className="p-3 sm:p-4 flex items-center gap-3 hover:bg-white/5 transition-colors">
                        <div className="w-1.5 h-1.5 rounded-full bg-wurm-accent flex-shrink-0" />
                        {matchedRecipeName && onIngredientClick ? (
                          <button
                            onClick={() => onIngredientClick(matchedRecipeName)}
                            className="text-wurm-accent font-mono text-sm hover:underline text-left"
                            title={`View Recipe: ${matchedRecipeName}`}
                          >
                            {item}
                          </button>
                        ) : (
                          <span className="text-wurm-text font-mono text-sm">{item}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : (
              <p className="text-wurm-muted italic text-center py-4 text-sm font-mono border border-dashed border-wurm-border rounded">
                {t.ui.noIngredients}
              </p>
            )}
          </div>

          {/* Hint Section */}
          {(recipe.hint_en || recipe.hint_pt || recipe.hint_ru) && (
            <div className="border-t border-wurm-border pt-6">
              <div className="bg-wurm-accent/5 border border-wurm-accent/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <span className="text-wurm-accent text-xl">💡</span>
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-wurm-accent uppercase tracking-wider mb-2">Hint</h4>
                    <p className="text-sm text-wurm-text font-mono leading-relaxed">
                      {lang === 'en' && recipe.hint_en}
                      {lang === 'pt' && (recipe.hint_pt || recipe.hint_en)}
                      {lang === 'ru' && (recipe.hint_ru || recipe.hint_en)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer with Thumbs Up */}
        {recipe.id && (recipe.status === 'verified' || recipe.status === 'legacy_verified' || recipe.status === 'pending') && (
          <div className="border-t border-wurm-border bg-black/40 px-6 py-4 flex items-center justify-between">
            <span className="text-[10px] text-wurm-muted font-mono uppercase tracking-wider">
              {votedToday 
                ? t.ui.alreadyVoted 
                : (timeLeft > 0 
                  ? `${lang === 'pt' ? 'Mantenha aberto por' : 'Keep open for'} ${timeLeft}s` 
                  : (lang === 'pt' ? 'Vote nesta receita' : 'Vote for this recipe'))}
            </span>
            <button
              onClick={handleVote}
              disabled={timeLeft > 0 || voting}
              className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-bold font-mono uppercase tracking-widest border transition-all duration-300 relative overflow-hidden ${
                votedToday
                  ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500 cursor-not-allowed'
                  : (timeLeft > 0
                    ? 'bg-black/20 border-wurm-border text-wurm-muted cursor-not-allowed'
                    : 'bg-wurm-accent/10 border-wurm-accent text-wurm-accent hover:bg-wurm-accent hover:text-black hover:shadow-[0_0_10px_#d4b483]')
              }`}
            >
              {timeLeft > 0 && (
                <div 
                  className="absolute inset-0 bg-wurm-accent/10 transition-all duration-1000 origin-left"
                  style={{ width: `${(5 - timeLeft) * 20}%` }}
                />
              )}
              <span className="relative z-10">👍 {voteCount}</span>
            </button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && recipe && (
        <RecipeEditModal
          recipe={recipe}
          onClose={() => setShowEditModal(false)}
          onSave={() => {
            setShowEditModal(false);
            if (onRefresh) onRefresh();
          }}
          onDelete={() => {
            setShowEditModal(false);
            onClose();
            if (onRefresh) onRefresh();
          }}
          t={t}
          lang={lang}
        />
      )}
    </div>
  );
};

export default RecipeModal;
