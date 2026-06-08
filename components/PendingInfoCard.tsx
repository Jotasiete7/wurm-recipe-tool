import React from 'react';
import { Info } from 'lucide-react';
import { Language } from '../types';

interface PendingInfoCardProps {
  lang: Language;
}

const PendingInfoCard: React.FC<PendingInfoCardProps> = ({ lang }) => {
  const content = {
    en: {
      title: "Pending Recipes",
      desc: "These recipes were auto-parsed from screenshots submitted by the community. You can confirm them by dragging or pasting another screenshot of the same recipe, or checking them in-game and voting to approve."
    },
    pt: {
      title: "Receitas Pendentes",
      desc: "Estas receitas foram lidas automaticamente a partir de prints enviados pela comunidade. Você pode confirmá-las enviando/colando outro print da mesma receita, ou validando no jogo e votando para aprovar."
    },
    ru: {
      title: "Рецепты на проверке",
      desc: "Эти рецепты были автоматически распознаны по скриншотам сообщества. Вы можете подтвердить их, перетащив или вставив другой скриншот этого же рецепта, или проверив в игре и проголосовав за одобрение."
    }
  };

  const { title, desc } = content[lang] || content.en;

  return (
    <div className="bg-amber-950/10 border border-amber-500/30 rounded p-4 sm:p-5 shadow-lg shadow-black/50 h-[170px] flex flex-col justify-between overflow-hidden">
      <div>
        <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-amber-500/20">
          <Info size={16} className="text-amber-500 animate-[pulse_2s_infinite]" />
          <h3 className="text-xs font-bold text-amber-500 uppercase tracking-widest font-serif">
            {title}
          </h3>
        </div>
        <p className="text-[10px] text-wurm-muted font-mono leading-relaxed">
          // {desc}
        </p>
      </div>
    </div>
  );
};

export default PendingInfoCard;
