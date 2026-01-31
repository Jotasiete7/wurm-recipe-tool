import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import RecipeCard from './components/RecipeCard';
import RecipeModal from './components/RecipeModal';
import Stats from './components/Stats';
import LoginModal from './components/LoginModal';
import RecipeSubmissionModal from './components/RecipeSubmissionModal'; // New Import
import { AuthProvider, useAuth } from './contexts/AuthContext';
import UsageWidget from './components/Admin/UsageWidget';
import { getUniqueValues } from './utils/dataUtils';
import { TRANSLATIONS, translateSkill } from './utils/translations';
import { Recipe, FilterState, Language } from './types';
import { Search, RotateCcw, User, LogOut, Plus, Shield, Crown } from 'lucide-react';
import { supabase } from './supabaseClient'; // Import supabase

const AppContent: React.FC = () => {
  // --- State ---
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false); // New State
  const { user, signOut, isAdmin } = useAuth();

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    skill: '',
    container: '',
    cooker: ''
  });

  const [lang, setLang] = useState<Language>('en');
  const t = TRANSLATIONS[lang];

  // --- Initialization ---
  useEffect(() => {
    // Fetch Supabase Data (Legacy + New)
    const fetchDynamicRecipes = async () => {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .in('status', ['verified', 'legacy_verified']);

      if (!error && data) {
        const dynamicRecipes: Recipe[] = data.map(d => ({
          name: d.name,
          skill: d.skill || undefined,
          container: d.container || undefined,
          cooker: d.cooker || undefined,
          mandatory: d.mandatory || undefined
        }));

        setRecipes(dynamicRecipes);
      } else {
        console.error('Error fetching recipes:', error);
        setRecipes([]);
      }
    };

    fetchDynamicRecipes();
  }, []);

  // --- Derived State (Options for Dropdowns) ---
  const skillOptions = useMemo(() => getUniqueValues(recipes, 'skill'), [recipes]);
  const containerOptions = useMemo(() => getUniqueValues(recipes, 'container'), [recipes]);
  const cookerOptions = useMemo(() => getUniqueValues(recipes, 'cooker'), [recipes]);

  // --- Filtering Logic ---
  const filteredRecipes = useMemo(() => {
    return recipes.filter(r => {
      const matchSearch =
        r.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        r.mandatory?.toLowerCase().includes(filters.search.toLowerCase());

      const matchSkill = !filters.skill || r.skill === filters.skill;
      const matchContainer = !filters.container || (r.container && r.container.includes(filters.container));
      const matchCooker = !filters.cooker || (r.cooker && r.cooker.includes(filters.cooker));

      return matchSearch && matchSkill && matchContainer && matchCooker;
    });
  }, [recipes, filters]);

  // --- Handlers ---
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({ search: '', skill: '', container: '', cooker: '' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-wurm-bg text-wurm-text selection:bg-wurm-accent selection:text-black">
      {/* Top Bar for Auth & Lang */}
      <div className="fixed top-4 right-4 z-50 flex gap-3 text-[10px] font-mono tracking-widest text-wurm-muted uppercase bg-black/80 p-1.5 rounded-full border border-wurm-border backdrop-blur-sm shadow-xl">
        {/* Language Switcher */}
        <div className="flex bg-wurm-panel rounded-full px-1 border border-wurm-border/50">
          <button onClick={() => setLang('en')} className={`px-2 py-1 rounded-full transition-all ${lang === 'en' ? 'text-white font-bold' : 'hover:text-wurm-accent'}`}>EN</button>
          <button onClick={() => setLang('pt')} className={`px-2 py-1 rounded-full transition-all ${lang === 'pt' ? 'text-white font-bold' : 'hover:text-wurm-accent'}`}>PT</button>
          <button onClick={() => setLang('ru')} className={`px-2 py-1 rounded-full transition-all ${lang === 'ru' ? 'text-white font-bold' : 'hover:text-wurm-accent'}`}>RU</button>
        </div>

        {/* Auth Actions */}
        <div className="flex items-center pl-2 border-l border-wurm-border/50 gap-2">
          {/* Submit Button (Only Verified Users) */}
          {user && (
            <button
              onClick={() => setShowSubmitModal(true)}
              className="flex items-center gap-1 hover:text-wurm-accent transition-colors px-2 border-r border-wurm-border/50 pr-3"
              title="Submit New Recipe"
            >
              <Plus size={14} />
              <span className="hidden sm:inline">Add Recipe</span>
            </button>
          )}

          {user ? (
            <div className="flex items-center gap-2">
              {/* Role Badge - Links to Main Site VIP Area */}
              <a
                href="https://wurm-aguild-site.pages.dev"
                target="_blank"
                rel="noreferrer"
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full font-bold transition-transform hover:scale-105
                    ${isAdmin ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'text-wurm-accent hover:bg-wurm-accent/10'}
                `}
                title="Go to Guild VIP Area"
              >
                {isAdmin ? <Crown size={12} /> : <Shield size={12} />}
                <span className="hidden sm:inline">{isAdmin ? 'Super Admin' : 'Member'}</span>
              </a>

              <button onClick={() => signOut()} className="p-1 hover:text-red-400 transition-colors" title="Sair">
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button onClick={() => setShowLoginModal(true)} className="flex items-center gap-1 hover:text-wurm-accent transition-colors px-2">
              <User size={14} />
              <span className="hidden sm:inline">LOGIN</span>
            </button>
          )}
        </div>
      </div>

      <Header t={t} lang={lang} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Intro Banner */}
        <div className="relative bg-wurm-panel border border-wurm-border rounded p-8 mb-8 overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-wurm-accent opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:opacity-10 transition-opacity duration-1000"></div>
          <div className="relative z-10 flex flex-col gap-2">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              Wurm <span className="text-wurm-accent">{t.ui.introTitle}</span>
            </h2>
            <p className="text-wurm-muted max-w-2xl text-sm font-mono leading-relaxed">
              // {recipes.length} {t.ui.introSubtitle}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar Filters */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-wurm-panel rounded border border-wurm-border p-5 sticky top-24 shadow-xl shadow-black">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-wurm-border">
                <h3 className="text-xs font-bold text-wurm-accent uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-wurm-accent animate-pulse"></span>
                  {t.ui.filters}
                </h3>
                <button
                  onClick={resetFilters}
                  className="text-[10px] text-wurm-muted hover:text-white transition-colors flex items-center gap-1 font-mono uppercase"
                >
                  <RotateCcw size={10} /> {t.ui.reset}
                </button>
              </div>

              <div className="space-y-5">
                {/* Search */}
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-wurm-muted group-focus-within:text-wurm-accent transition-colors" size={14} />
                  <input
                    type="text"
                    placeholder={t.ui.searchPlaceholder}
                    className="w-full pl-9 pr-4 py-2.5 rounded bg-black/50 border border-wurm-border text-xs font-mono text-wurm-text focus:border-wurm-accent focus:outline-none transition-all placeholder:text-wurm-muted/50"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                </div>

                {/* Selects */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-wurm-muted uppercase tracking-wider font-mono">{t.ui.skillLabel}</label>
                  <select
                    className="w-full px-3 py-2 rounded bg-black/50 border border-wurm-border text-xs text-wurm-text focus:border-wurm-accent outline-none font-mono"
                    value={filters.skill}
                    onChange={(e) => handleFilterChange('skill', e.target.value)}
                  >
                    <option value="">{t.ui.allSkills}</option>
                    {skillOptions.map(opt => <option key={opt} value={opt}>{translateSkill(opt, lang)}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-wurm-muted uppercase tracking-wider font-mono">{t.ui.containerLabel}</label>
                  <select
                    className="w-full px-3 py-2 rounded bg-black/50 border border-wurm-border text-xs text-wurm-text focus:border-wurm-accent outline-none font-mono"
                    value={filters.container}
                    onChange={(e) => handleFilterChange('container', e.target.value)}
                  >
                    <option value="">{t.ui.allContainers}</option>
                    {containerOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-wurm-muted uppercase tracking-wider font-mono">{t.ui.cookerLabel}</label>
                  <select
                    className="w-full px-3 py-2 rounded bg-black/50 border border-wurm-border text-xs text-wurm-text focus:border-wurm-accent outline-none font-mono"
                    value={filters.cooker}
                    onChange={(e) => handleFilterChange('cooker', e.target.value)}
                  >
                    <option value="">{t.ui.allCookers}</option>
                    {cookerOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Admin Stats Widget */}
            {isAdmin && (
              <div className="hidden lg:block sticky top-24 mt-6 z-10">
                <UsageWidget />
              </div>
            )}

            {/* Stats Component - Show only on larger screens in sidebar */}
            <div className="hidden lg:block sticky top-[450px]">
              <Stats recipes={filteredRecipes} t={t} lang={lang} />
            </div>
          </div>

          {/* Main Grid */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-xs text-wurm-muted font-mono uppercase tracking-widest">
                {t.ui.foundRecipes} {filteredRecipes.length}
              </span>
            </div>

            {filteredRecipes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredRecipes.map((recipe, idx) => (
                  <RecipeCard
                    key={`${recipe.name}-${idx}`}
                    recipe={recipe}
                    onClick={setSelectedRecipe}
                    lang={lang}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-wurm-panel rounded border border-dashed border-wurm-border">
                <div className="text-4xl mb-4 grayscale opacity-50">🥘</div>
                <h3 className="text-lg font-serif font-bold text-wurm-text">{t.ui.noRecipes}</h3>
                <p className="text-wurm-muted mt-2 text-sm font-mono">{t.ui.tryAdjust}</p>
                <button
                  onClick={resetFilters}
                  className="mt-6 px-6 py-2 bg-wurm-accent/10 border border-wurm-accent text-wurm-accent text-xs font-bold uppercase tracking-widest hover:bg-wurm-accent hover:text-black transition-all"
                >
                  {t.ui.clearFilters}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-wurm-border bg-wurm-panel py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-wurm-muted text-[10px] font-mono uppercase tracking-widest">
            © {new Date().getFullYear()} A Guilda. Data based on Wurm Online.
          </p>
          <div className="mt-4 flex justify-center gap-6 text-xs font-mono">
            <a href="https://www.wurmpedia.com/index.php/Cooking" target="_blank" rel="noreferrer" className="text-wurm-accent hover:text-white transition-colors">Wurmpedia</a>
            <a href="https://forum.wurmonline.com" target="_blank" rel="noreferrer" className="text-wurm-accent hover:text-white transition-colors">Official Forum</a>
          </div>
        </div>
      </footer>

      <RecipeModal
        recipe={selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
        lang={lang}
        t={t}
      />

      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}

      {showSubmitModal && (
        <RecipeSubmissionModal onClose={() => setShowSubmitModal(false)} />
      )}
    </div>
  );
};

const App: React.FC = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
