import React, { useState, useRef, useEffect } from 'react';
import { Network, Home, BookOpen, Pickaxe, LineChart, BookMarked } from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// CANONICAL ECOSYSTEM DROPDOWN — A Guilda (Recipes Version)
// Template de referência para todos os projetos do ecossistema.
// Ao replicar em outro projeto, altere apenas `CURRENT_TOOL`.
// ─────────────────────────────────────────────────────────────

const ECOSYSTEM_TOOLS = [
    {
        id: 'portal',
        label: 'Portal',
        href: 'https://wurm-aguild-site.pages.dev',
        icon: Home,
    },
    {
        id: 'analytics',
        label: 'Analytics',
        href: 'https://wurm-analytics-journal.pages.dev',
        icon: LineChart,
    },
    {
        id: 'recipes',
        label: 'Receitas',
        href: 'https://wurm-recipe-tool.pages.dev',
        icon: BookOpen,
    },
    {
        id: 'mining',
        label: 'Mineração',
        href: 'https://wurm-mining-tool.pages.dev',
        icon: Pickaxe,
    },
    {
        id: 'liturgy',
        label: 'Liturgy',
        href: 'https://wurm-liturgy.pages.dev',
        icon: BookMarked,
    },
] as const;

// ← Change this to the id of the current project
const CURRENT_TOOL = 'recipes';

const EcosystemDropdown: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setIsOpen(prev => !prev)}
                title="Ecossistema A Guilda"
                className={`p-2 rounded-full transition-colors ${isOpen
                        ? 'text-wurm-accent bg-wurm-panel'
                        : 'text-wurm-muted hover:text-wurm-text hover:bg-wurm-panel'
                    }`}
            >
                <Network size={20} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-wurm-panel rounded border border-wurm-border shadow-xl py-2 animate-in fade-in slide-in-from-top-2 z-50">
                    <div className="px-4 py-2 text-[10px] font-bold text-wurm-muted uppercase tracking-widest border-b border-wurm-border mb-1">
                        A Guilda
                    </div>
                    {ECOSYSTEM_TOOLS.map(({ id, label, href, icon: Icon }) => {
                        const isCurrent = id === CURRENT_TOOL;
                        return isCurrent ? (
                            <div
                                key={id}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-wurm-accent bg-wurm-accent/10 font-mono border-l-2 border-wurm-accent cursor-default"
                            >
                                <Icon size={14} />
                                <span>{label}</span>
                                <span className="ml-auto text-[9px] opacity-60">aqui</span>
                            </div>
                        ) : (
                            <a
                                key={id}
                                href={href}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-wurm-text hover:bg-white/5 hover:text-wurm-accent transition-colors font-mono"
                            >
                                <Icon size={14} />
                                <span>{label}</span>
                            </a>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default EcosystemDropdown;
