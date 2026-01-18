import React from 'react';
import { Recipe, Language } from '../types';
import { getEmoji } from '../utils/dataUtils';
import { translateSkill } from '../utils/translations';
import { BookOpen, Box, Flame } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: (recipe: Recipe) => void;
  lang: Language;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick, lang }) => {
  const ingredients = recipe.mandatory
    ? recipe.mandatory.split(';').map(i => i.trim()).join(' • ')
    : 'No mandatory ingredients'; // This specific string might be worth translating if it comes from empty string logic in render, but strictly the request said "ingredients... keep in english". 

  return (
    <div 
      onClick={() => onClick(recipe)}
      className="group relative bg-wurm-panel rounded border border-wurm-border hover:border-wurm-accent/40 transition-all duration-300 cursor-pointer overflow-hidden shadow-black shadow-lg"
    >
      <div className="absolute inset-y-0 left-0 w-0.5 bg-wurm-accent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-black/40 rounded border border-wurm-border text-2xl group-hover:scale-105 transition-transform group-hover:border-wurm-accent/30">
            {getEmoji(recipe.name)}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold font-serif text-wurm-text group-hover:text-wurm-accent transition-colors truncate">
              {recipe.name}
            </h3>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {recipe.skill && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-900/10 border border-blue-900/30 text-blue-400 text-[10px] font-mono uppercase tracking-wide">
                  <BookOpen size={10} />
                  {translateSkill(recipe.skill, lang)}
                </span>
              )}
              {recipe.container && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-orange-900/10 border border-orange-900/30 text-orange-400 text-[10px] font-mono uppercase tracking-wide">
                  <Box size={10} />
                  {recipe.container}
                </span>
              )}
              {recipe.cooker && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-900/10 border border-red-900/30 text-red-400 text-[10px] font-mono uppercase tracking-wide">
                  <Flame size={10} />
                  {recipe.cooker}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 pl-16">
          <p className="text-xs text-wurm-muted font-mono line-clamp-2 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
            {ingredients}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
