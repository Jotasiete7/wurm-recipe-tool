import React, { useEffect, useState } from 'react';
import { Trophy, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { Recipe, Language } from '../types';

interface TopRecipesCardProps {
  onRecipeClick: (recipe: Recipe) => void;
  t: any;
  lang: Language;
}

interface RankedRecipe {
  id: string;
  name: string;
  skill: string;
  status: string;
  vote_count: number;
}

const TopRecipesCard: React.FC<TopRecipesCardProps> = ({ onRecipeClick, t, lang }) => {
  const [loading, setLoading] = useState(true);
  const [ranking, setRanking] = useState<RankedRecipe[]>([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('top_recipes_monthly')
          .select('*')
          .limit(10);

        if (!error && data) {
          setRanking(data as RankedRecipe[]);
        }
      } catch (err) {
        console.error('Error fetching monthly top recipes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, []);

  const handleItemClick = async (ranked: RankedRecipe) => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', ranked.id)
        .single();
      
      if (!error && data) {
        onRecipeClick(data as Recipe);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getMonthName = () => {
    const monthsPt = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    const monthsEn = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthsRu = [
      'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
      'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];

    const currentMonthIdx = new Date().getMonth();
    if (lang === 'pt') return monthsPt[currentMonthIdx];
    if (lang === 'ru') return monthsRu[currentMonthIdx];
    return monthsEn[currentMonthIdx];
  };

  const visibleRecipes = expanded ? ranking : ranking.slice(0, 3);

  return (
    <div className={`bg-wurm-panel rounded border border-wurm-border p-5 shadow-lg shadow-black/50 flex flex-col justify-between transition-all duration-300 ${
      expanded ? 'h-auto min-h-[160px]' : 'h-[160px] overflow-hidden'
    }`}>
      <div>
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-wurm-border/50">
          <Trophy size={16} className="text-yellow-500 animate-[pulse_2s_infinite]" />
          <div>
            <h3 className="text-xs font-bold text-wurm-accent uppercase tracking-widest font-serif">
              {t.ui.topRecipesTitle}
            </h3>
            <span className="text-[9px] text-wurm-muted font-mono uppercase">
              {getMonthName()} {new Date().getFullYear()}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-6">
            <Loader2 size={16} className="text-wurm-muted animate-spin" />
          </div>
        ) : ranking.length > 0 ? (
          <ul className="space-y-1.5">
            {visibleRecipes.map((item, idx) => (
              <li
                key={item.id}
                onClick={() => handleItemClick(item)}
                className="flex items-center justify-between text-xs hover:bg-white/5 px-2 py-1 rounded cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-wurm-muted font-mono w-3 text-right">
                    {idx + 1}.
                  </span>
                  <span className="text-wurm-text font-mono truncate group-hover:text-wurm-accent transition-colors">
                    {item.name}
                  </span>
                </div>
                <span className="text-[10px] text-yellow-500 font-mono font-bold flex items-center gap-1 flex-shrink-0">
                  👍 {item.vote_count}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[10px] text-wurm-muted italic text-center py-6 font-mono">
            {lang === 'pt' ? '// Nenhum voto registrado este mês' : '// No votes registered this month'}
          </p>
        )}
      </div>

      {ranking.length > 3 && (
        <button
          onClick={() => setExpanded(prev => !prev)}
          className="mt-4 text-[9px] text-wurm-accent hover:text-white transition-colors text-center w-full font-mono uppercase tracking-widest pt-2 border-t border-wurm-border/50"
        >
          {expanded 
            ? (lang === 'pt' ? '[ Recolher ]' : '[ Collapse ]') 
            : `[ ${t.ui.viewFullRanking} ]`}
        </button>
      )}
    </div>
  );
};

export default TopRecipesCard;
