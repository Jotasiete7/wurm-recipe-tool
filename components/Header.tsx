import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Language } from '../types';
import EcosystemDropdown from './EcosystemDropdown';

interface HeaderProps {
  t: any;
  lang: Language;
}

const Header: React.FC<HeaderProps> = ({ t }) => {
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
            <EcosystemDropdown />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

