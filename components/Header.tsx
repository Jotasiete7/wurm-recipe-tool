import React, { useState } from 'react';
import { Network, ArrowLeft } from 'lucide-react';
import { Language } from '../types';

interface HeaderProps {
  t: any;
  lang: Language;
}

const Header: React.FC<HeaderProps> = ({ t }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-wurm-bg/90 backdrop-blur-md border-b border-wurm-border shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          <div className="flex items-center gap-4">
            <a
              href="https://wurm-aguild-site.pages.dev"
              className="flex items-center gap-2 text-sm font-medium text-wurm-muted hover:text-wurm-accent transition-colors font-mono uppercase tracking-wider"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">{t.ui.portal}</span>
            </a>
            <div className="h-6 w-px bg-wurm-border hidden sm:block"></div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
              A Guilda <span className="text-wurm-accent">{t.ui.recipes}</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-full transition-colors ${isMenuOpen ? 'text-wurm-accent bg-wurm-panel' : 'text-wurm-muted hover:text-wurm-text hover:bg-wurm-panel'}`}
                title="Wurm Ecosystem"
              >
                <Network size={20} />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-wurm-panel rounded border border-wurm-border shadow-xl py-2 animate-in fade-in slide-in-from-top-2 z-50">
                  <div className="px-4 py-2 text-[10px] font-bold text-wurm-muted uppercase tracking-widest border-b border-wurm-border mb-1">
                    {t.ui.ecosystem}
                  </div>
                  <a href="https://wurm-aguild-site.pages.dev" className="block px-4 py-2 text-sm text-wurm-text hover:bg-white/5 hover:text-wurm-accent transition-colors font-mono">
                    🏠 {t.ui.mainSite}
                  </a>
                  <a href="https://wurm-mining-tool.pages.dev" className="block px-4 py-2 text-sm text-wurm-text hover:bg-white/5 hover:text-wurm-accent transition-colors font-mono">
                    ⛏️ {t.ui.miningTool}
                  </a>
                  <div className="block px-4 py-2 text-sm font-medium text-wurm-accent bg-wurm-accent/10 font-mono border-l-2 border-wurm-accent">
                    🍳 {t.ui.recipeGuide}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Mobile Backdrop for menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[-1]" onClick={() => setIsMenuOpen(false)}></div>
      )}
    </header>
  );
};

export default Header;
