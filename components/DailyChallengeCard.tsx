
import React from 'react';
import { Sparkles } from 'lucide-react';

interface DailyChallengeCardProps {
    onChallenge: () => void;
    t: any;
}

const DailyChallengeCard: React.FC<DailyChallengeCardProps> = ({ onChallenge, t }) => {
    return (
        <div
            onClick={onChallenge}
            className="group relative bg-black/20 rounded border border-wurm-accent/30 hover:border-wurm-accent hover:bg-wurm-accent/5 transition-all duration-300 cursor-pointer overflow-hidden shadow-lg shadow-black/50 h-full min-h-[160px] flex flex-col items-center justify-center text-center p-6"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-wurm-accent/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10 flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-wurm-accent/10 border border-wurm-accent/30 flex items-center justify-center text-wurm-accent group-hover:scale-110 group-hover:bg-wurm-accent group-hover:text-black transition-all duration-300">
                    <Sparkles size={22} strokeWidth={1.5} />
                </div>

                <div className="space-y-1">
                    <h3 className="text-sm font-bold font-serif text-wurm-accent uppercase tracking-widest group-hover:text-wurm-accentLight transition-colors">
                        {t.ui.dailyChallenge}
                    </h3>
                    <p className="text-[10px] text-wurm-muted font-mono group-hover:text-wurm-text transition-colors">
            // {t.ui.randomRecipe}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DailyChallengeCard;
