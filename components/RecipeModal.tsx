import React, { useEffect, useState } from 'react';
import { Recipe, Language } from '../types';
import { getEmoji } from '../utils/dataUtils';
import { translateSkill } from '../utils/translations';
import { X, ChefHat, Box, Flame, Utensils, Edit3 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import RecipeEditModal from './RecipeEditModal';

interface RecipeModalProps {
  recipe: Recipe | null;
  onClose: () => void;
  onRefresh?: () => void;
  lang: Language;
  t: any;
  allRecipeNames?: Set<string>;
  onIngredientClick?: (name: string) => void;
}

const RecipeModal: React.FC<RecipeModalProps> = ({
  recipe,
  onClose,
  onRefresh,
  lang,
  t,
  allRecipeNames,
  onIngredientClick
}) => {
  const { isAdmin } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
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
        <div className="relative bg-gradient-to-r from-wurm-panel to-black p-6 sm:p-8 border-b border-wurm-border">
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
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start opacity-90">
                {recipe.skill && (
                  <span className="px-3 py-1 bg-wurm-accent/10 border border-wurm-accent/20 rounded text-xs font-mono font-bold text-wurm-accent uppercase tracking-wider">
                    {translateSkill(recipe.skill, lang)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 bg-wurm-bg/50">

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
                  {ingredients.map((item, idx) => (
                    <li key={idx} className="p-3 sm:p-4 flex items-center gap-3 hover:bg-white/5 transition-colors">
                      <div className="w-1.5 h-1.5 rounded-full bg-wurm-accent flex-shrink-0" />
                      {allRecipeNames?.has(item.toLowerCase()) && onIngredientClick ? (
                        <button
                          onClick={() => onIngredientClick(item)}
                          className="text-wurm-accent font-mono text-sm hover:underline text-left"
                          title="View Recipe"
                        >
                          {item}
                        </button>
                      ) : (
                        <span className="text-wurm-text font-mono text-sm">{item}</span>
                      )}
                    </li>
                  ))}
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
          t={t}
          lang={lang}
        />
      )}
    </div>
  );
};

export default RecipeModal;
