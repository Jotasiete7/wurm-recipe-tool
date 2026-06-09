import React from 'react';
import { BarChart2, ArrowRight } from 'lucide-react';
import { Language } from '../types';

interface StatsLinkCardProps {
  onNavigate: () => void;
  t: any;
  lang: Language;
}

/**
 * Replaces the old TopRecipesCard.
 * A full-card button that navigates to the Statistics & Rankings page.
 */
const StatsLinkCard: React.FC<StatsLinkCardProps> = ({ onNavigate, t }) => (
  <button
    id="stats-link-card"
    onClick={onNavigate}
    className="group bg-wurm-panel rounded border border-wurm-border h-[170px] w-full
               flex flex-col items-center justify-center gap-3
               shadow-lg shadow-black/50
               hover:border-wurm-accent/60 hover:shadow-wurm-accent/10
               transition-all duration-300 cursor-pointer relative overflow-hidden"
  >
    {/* Ambient glow on hover */}
    <div className="absolute inset-0 bg-gradient-to-br from-wurm-accent/0 to-wurm-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

    {/* Icon */}
    <div className="relative">
      <BarChart2
        size={30}
        className="text-wurm-accent group-hover:scale-110 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-wurm-accent/30 rounded-full blur-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-500 scale-150" />
    </div>

    {/* Labels */}
    <div className="text-center px-4 relative z-10">
      <p className="text-sm font-bold text-wurm-accent font-serif uppercase tracking-widest leading-tight">
        {t.ui.statsLinkLabel}
      </p>
      <p className="text-[9px] text-wurm-muted font-mono mt-1 uppercase tracking-wider">
        {t.ui.statsLinkSub}
      </p>
    </div>

    {/* CTA */}
    <div className="flex items-center gap-1 text-[9px] text-wurm-muted font-mono uppercase tracking-widest group-hover:text-wurm-accent transition-colors relative z-10">
      <span>{t.ui.statsExplore}</span>
      <ArrowRight size={9} className="group-hover:translate-x-0.5 transition-transform duration-200" />
    </div>
  </button>
);

export default StatsLinkCard;
