import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import {
  ArrowLeft, TrendingUp, Heart, Package, Users, SearchX,
  Loader2, BarChart2, Clock
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import { Language, Recipe } from '../types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SearchedRecipe {
  recipe_id: string;
  recipe_name: string;
  search_count: number;
}

interface VotedRecipe {
  id: string;
  name: string;
  vote_count: number;
}

interface DemandIngredient {
  ingredient: string;
  demand_score: number;
  recipe_count: number;
}

interface Contributor {
  source: string;
  recipe_count: number;
}

interface ZeroResult {
  term: string;
  search_count: number;
}

type Period = '7' | '30' | 'all';

interface StatsPageProps {
  onBack: () => void;
  lang: Language;
  t: any;
  onRecipeClick: (recipe: Recipe) => void;
}

// ─── Colour palette (consistent with Wurm theme) ──────────────────────────────

const GOLD = '#d4b483';
const GOLD_DIM = '#8a7453';
const MUTED = '#3d3d3d';

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Simple ranked list card */
const RankingCard: React.FC<{
  title: string;
  icon: React.ReactNode;
  data: Array<{ label: string; value: number; id?: string }>;
  valueSuffix: string;
  loading: boolean;
  noDataText: string;
  onItemClick?: (id: string, label: string) => void;
}> = ({ title, icon, data, valueSuffix, loading, noDataText, onItemClick }) => (
  <div className="bg-wurm-panel rounded border border-wurm-border p-5 shadow-lg shadow-black/40 flex flex-col">
    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-wurm-border/50">
      <span className="text-wurm-accent">{icon}</span>
      <h2 className="text-xs font-bold text-wurm-accent uppercase tracking-widest font-mono">{title}</h2>
    </div>

    {loading ? (
      <div className="flex-1 flex items-center justify-center py-8">
        <Loader2 size={20} className="text-wurm-muted animate-spin" />
      </div>
    ) : data.length === 0 ? (
      <p className="text-[10px] text-wurm-muted font-mono italic py-6 text-center">{noDataText}</p>
    ) : (
      <ul className="space-y-1.5 flex-1">
        {data.map((item, idx) => (
          <li
            key={item.label}
            onClick={() => onItemClick && item.id && onItemClick(item.id, item.label)}
            className={`flex items-center justify-between text-xs px-2 py-1 rounded transition-colors group ${
              onItemClick && item.id
                ? 'hover:bg-white/5 cursor-pointer'
                : ''
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className={`font-mono w-4 text-right flex-shrink-0 ${
                idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-gray-400' : idx === 2 ? 'text-amber-700' : 'text-wurm-muted'
              }`}>
                {idx + 1}.
              </span>
              <span className={`font-mono truncate ${onItemClick && item.id ? 'group-hover:text-wurm-accent' : ''} text-wurm-text transition-colors`}>
                {item.label}
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold text-wurm-accent flex-shrink-0 ml-2">
              {item.value.toLocaleString()} <span className="text-wurm-muted font-normal">{valueSuffix}</span>
            </span>
          </li>
        ))}
      </ul>
    )}
  </div>
);

/** Horizontal bar chart for ingredient demand */
const IngredientDemandChart: React.FC<{
  data: DemandIngredient[];
  loading: boolean;
  t: any;
}> = ({ data, loading, t }) => (
  <div className="bg-wurm-panel rounded border border-wurm-border p-5 shadow-lg shadow-black/40">
    <div className="flex items-center gap-2 mb-2 pb-3 border-b border-wurm-border/50">
      <Package size={16} className="text-wurm-accent" />
      <h2 className="text-xs font-bold text-wurm-accent uppercase tracking-widest font-mono">
        {t.ui.ingredientDemandTitle}
      </h2>
    </div>
    <p className="text-[10px] text-wurm-muted font-mono mb-5 leading-relaxed">
      {t.ui.ingredientDemandSub}
    </p>

    {loading ? (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={20} className="text-wurm-muted animate-spin" />
      </div>
    ) : data.length === 0 ? (
      <p className="text-[10px] text-wurm-muted font-mono italic py-8 text-center">{t.ui.statsNoData}</p>
    ) : (
      <ResponsiveContainer width="100%" height={Math.max(300, data.length * 28)}>
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 50, top: 0, bottom: 0 }}>
          <XAxis
            type="number"
            tick={{ fontSize: 9, fill: '#737373', fontFamily: 'JetBrains Mono' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="ingredient"
            width={130}
            tick={{ fontSize: 10, fill: '#e5e5e5', fontFamily: 'JetBrains Mono' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
            contentStyle={{
              backgroundColor: '#0a0a0a',
              borderColor: GOLD,
              color: '#e5e5e5',
              fontFamily: 'JetBrains Mono',
              fontSize: '11px',
              borderRadius: '4px',
            }}
            formatter={((val: number | undefined) => [
              `${(val ?? 0).toLocaleString()} ${t.ui.statsDemandScore}`,
            ]) as any}
            labelStyle={{ color: GOLD, fontWeight: 'bold', marginBottom: '4px' }}
          />
          <Bar dataKey="demand_score" radius={[0, 3, 3, 0]} maxBarSize={18}>
            {data.map((_, i) => (
              <Cell
                key={i}
                fill={i < 3 ? GOLD : i < 8 ? GOLD_DIM : MUTED}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    )}
  </div>
);

/** Zero results card */
const ZeroResultsCard: React.FC<{
  data: ZeroResult[];
  loading: boolean;
  t: any;
}> = ({ data, loading, t }) => (
  <div className="bg-wurm-panel rounded border border-wurm-border p-5 shadow-lg shadow-black/40 flex flex-col">
    <div className="flex items-center gap-2 mb-2 pb-3 border-b border-wurm-border/50">
      <SearchX size={16} className="text-red-400" />
      <h2 className="text-xs font-bold text-red-400 uppercase tracking-widest font-mono">
        {t.ui.zeroResultsTitle}
      </h2>
    </div>
    <p className="text-[10px] text-wurm-muted font-mono mb-4 leading-relaxed">
      {t.ui.zeroResultsSub}
    </p>

    {loading ? (
      <div className="flex-1 flex items-center justify-center py-8">
        <Loader2 size={20} className="text-wurm-muted animate-spin" />
      </div>
    ) : data.length === 0 ? (
      <p className="text-[10px] text-wurm-muted font-mono italic py-6 text-center">{t.ui.statsNoData}</p>
    ) : (
      <ul className="space-y-1.5 flex-1">
        {data.map((item, idx) => (
          <li key={item.term} className="flex items-center justify-between text-xs px-2 py-1">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-wurm-muted font-mono w-4 text-right flex-shrink-0">{idx + 1}.</span>
              <span className="font-mono text-red-300/80 truncate">"{item.term}"</span>
            </div>
            <span className="text-[10px] font-mono text-red-400 flex-shrink-0 ml-2">
              {item.search_count}×
            </span>
          </li>
        ))}
      </ul>
    )}
  </div>
);

// ─── Period selector button ───────────────────────────────────────────────────

const PeriodBtn: React.FC<{
  active: boolean;
  label: string;
  onClick: () => void;
}> = ({ active, label, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 text-[10px] font-mono uppercase tracking-widest rounded transition-all ${
      active
        ? 'bg-wurm-accent text-black font-bold'
        : 'text-wurm-muted hover:text-wurm-accent border border-wurm-border/60 hover:border-wurm-accent/40'
    }`}
  >
    {label}
  </button>
);

// ─── Main StatsPage ───────────────────────────────────────────────────────────

const StatsPage: React.FC<StatsPageProps> = ({ onBack, lang: _lang, t, onRecipeClick }) => {
  const [period, setPeriod] = useState<Period>('30');
  const [loading, setLoading] = useState(true);

  const [topSearched, setTopSearched]   = useState<SearchedRecipe[]>([]);
  const [topVoted, setTopVoted]         = useState<VotedRecipe[]>([]);
  const [ingredients, setIngredients]   = useState<DemandIngredient[]>([]);
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [zeroResults, setZeroResults]   = useState<ZeroResult[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);

      // Build date filter for search_logs queries
      const now = new Date();
      let sinceDate: string | null = null;
      if (period === '7') {
        const d = new Date(now); d.setDate(d.getDate() - 7);
        sinceDate = d.toISOString();
      } else if (period === '30') {
        const d = new Date(now); d.setDate(d.getDate() - 30);
        sinceDate = d.toISOString();
      }

      // Fetch all in parallel
      const [searchedRes, votedRes, ingrRes, contribRes, zeroRes] = await Promise.all([
        // Top searched — raw aggregation from view (already built for all time),
        // we apply period filter via a separate query when not all-time
        sinceDate
          ? supabase.rpc('get_top_searched', { since: sinceDate, lim: 10 })
              .then((r: any) => r.error ? supabase.from('top_searched_recipes').select('*').limit(10) : r)
          : supabase.from('top_searched_recipes').select('*').limit(10),

        // Top voted (all-time by design, period doesn't apply to love)
        supabase.from('top_recipes_monthly').select('*').limit(10),

        // Ingredient demand
        sinceDate
          ? supabase.rpc('get_top_ingredients', { since: sinceDate, lim: 25 })
              .then((r: any) => r.error ? supabase.from('top_demanded_ingredients').select('*').limit(25) : r)
          : supabase.from('top_demanded_ingredients').select('*').limit(25),

        // Contributors (all-time)
        supabase.from('contributor_stats').select('*').limit(10),

        // Zero results
        sinceDate
          ? supabase.rpc('get_zero_results', { since: sinceDate, lim: 10 })
              .then((r: any) => r.error ? supabase.from('zero_result_searches').select('*').limit(10) : r)
          : supabase.from('zero_result_searches').select('*').limit(10),
      ]);

      setTopSearched((searchedRes.data ?? []) as SearchedRecipe[]);
      setTopVoted((votedRes.data ?? []) as VotedRecipe[]);
      setIngredients((ingrRes.data ?? []) as DemandIngredient[]);
      setContributors((contribRes.data ?? []) as Contributor[]);
      setZeroResults((zeroRes.data ?? []) as ZeroResult[]);
      setLoading(false);
    };

    fetchAll();
  }, [period]);

  // Click a searched/voted recipe to open its modal
  const handleRecipeItemClick = async (id: string) => {
    const { data } = await supabase.from('recipes').select('*').eq('id', id).single();
    if (data) onRecipeClick(data as Recipe);
  };

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-wurm-muted hover:text-wurm-accent mb-4 font-mono text-[10px] uppercase tracking-widest transition-colors group"
          >
            <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
            {t.ui.statsBackToDashboard}
          </button>

          <div className="flex items-center gap-3">
            <BarChart2 size={28} className="text-wurm-accent" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">{t.ui.statsTitle}</h1>
              <p className="text-[10px] text-wurm-muted font-mono mt-0.5">{t.ui.statsSubtitle}</p>
            </div>
          </div>
        </div>

        {/* Period selector */}
        <div className="flex items-center gap-2">
          <Clock size={12} className="text-wurm-muted" />
          <PeriodBtn active={period === '7'}   label={t.ui.statsPeriod7}   onClick={() => setPeriod('7')} />
          <PeriodBtn active={period === '30'}  label={t.ui.statsPeriod30}  onClick={() => setPeriod('30')} />
          <PeriodBtn active={period === 'all'} label={t.ui.statsPeriodAll} onClick={() => setPeriod('all')} />
        </div>
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 🔥 Most Searched */}
        <RankingCard
          title={t.ui.topSearchedTitle}
          icon={<TrendingUp size={15} />}
          data={topSearched.map(r => ({ label: r.recipe_name, value: r.search_count, id: r.recipe_id }))}
          valueSuffix={t.ui.statsSearchCount}
          loading={loading}
          noDataText={t.ui.statsNoData}
          onItemClick={handleRecipeItemClick}
        />

        {/* ❤️ Most Voted */}
        <RankingCard
          title={t.ui.topVotedTitle}
          icon={<Heart size={15} />}
          data={topVoted.map(r => ({ label: r.name, value: r.vote_count, id: r.id }))}
          valueSuffix={t.ui.statsVoteCount}
          loading={loading}
          noDataText={t.ui.statsNoData}
          onItemClick={handleRecipeItemClick}
        />

        {/* 📦 Ingredient Demand — full width */}
        <div className="lg:col-span-2">
          <IngredientDemandChart data={ingredients} loading={loading} t={t} />
        </div>

        {/* 👨‍🍳 Top Contributors */}
        <RankingCard
          title={t.ui.topContributorsTitle}
          icon={<Users size={15} />}
          data={contributors.map(c => ({ label: c.source, value: c.recipe_count }))}
          valueSuffix={t.ui.statsRecipesCount}
          loading={loading}
          noDataText={t.ui.statsNoData}
        />

        {/* 📉 Zero Results */}
        <ZeroResultsCard data={zeroResults} loading={loading} t={t} />

      </div>
    </main>
  );
};

export default StatsPage;
