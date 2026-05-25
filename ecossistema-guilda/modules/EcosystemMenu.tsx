import React, { useState, useRef, useEffect } from 'react';
import { Network, Home, BookOpen, Pickaxe, LineChart, BookMarked, Hammer, Shield, Gavel, Hourglass, Map } from 'lucide-react';

// Common types to avoid dependencies
interface EcosystemTool {
    id: string;
    label: string;
    href: string;
    icon: any;
}

const ECOSYSTEM_TOOLS: EcosystemTool[] = [
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
        label: 'Recipes',
        href: 'https://wurm-recipe-tool.pages.dev',
        icon: BookOpen,
    },
    {
        id: 'mining',
        label: 'Mining',
        href: 'https://wurm-mining-tool.pages.dev',
        icon: Pickaxe,
    },
    {
        id: 'liturgy',
        label: 'Liturgy',
        href: 'https://wurm-liturgy.pages.dev',
        icon: BookMarked,
    },
    {
        id: 'carpentry',
        label: 'Carpentry',
        href: 'https://wurm-carpentry-tool.pages.dev',
        icon: Hammer,
    },
    {
        id: 'wall-decay',
        label: 'Wall Decay',
        href: 'https://wurm-wall-decay-calculator.pages.dev',
        icon: Hourglass,
    },
    {
        id: 'auction',
        label: 'Auction',
        href: 'https://wurm-auction-helper.pages.dev',
        icon: Gavel,
    },
    {
        id: 'badges',
        label: 'Guilda Badges',
        href: 'https://wurm-aguilda-badges.pages.dev',
        icon: Shield,
    },
    {
        id: 'prospect',
        label: 'Prospect',
        href: 'https://wurm-prospect-tool.pages.dev',
        icon: Map,
    },
];

interface EcosystemMenuProps {
    currentId?: string;
    lang?: 'en' | 'pt';
    styles: any; // CSS Module styles
}

export const EcosystemMenu: React.FC<EcosystemMenuProps> = ({ currentId, lang = 'en', styles }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

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
        <div ref={ref} className={styles.dropdownContainer}>
            <button
                onClick={() => setIsOpen(prev => !prev)}
                title={lang === 'pt' ? 'Ecossistema A Guilda' : 'A Guilda Ecosystem'}
                className={`${styles.trigger} ${isOpen ? styles.triggerOpen : ''}`}
            >
                <Network size={18} />
            </button>

            {isOpen && (
                <div className={styles.menu}>
                    <div className={styles.menuHeader}>
                        A Guilda
                    </div>
                    {ECOSYSTEM_TOOLS.map((tool) => {
                        const isCurrent = tool.id === currentId;
                        const Icon = tool.icon;
                        const label = tool.label;

                        return isCurrent ? (
                            <div key={tool.id} className={styles.menuItemCurrent}>
                                <Icon size={14} />
                                <span>{label}</span>
                                <span className={styles.currentBadge}>
                                    here
                                </span>
                            </div>
                        ) : (
                            <a key={tool.id} href={tool.href} className={styles.menuItem}>
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