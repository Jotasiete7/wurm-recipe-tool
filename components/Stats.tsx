import React, { useMemo, useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Recipe, Language } from '../types';
import { translateSkill } from '../utils/translations';
import { supabase } from '../supabaseClient';

interface StatsProps {
  recipes: Recipe[]; // Fallback / Local data
  t: any;
  lang: Language;
  totalCount?: number; // Global count passed from parent
}

// Guild Theme Colors for Charts
const COLORS = [
  '#d4b483', // Accent
  '#8a7453', // Accent Dim
  '#3e6b46', // Success
  '#b45309', // Warning
  '#737373', // Muted
  '#525252', // Dark Grey
  '#262626', // Border
  '#171717'  // Neutral
];

const Stats: React.FC<StatsProps> = ({ recipes, t, lang, totalCount }) => {
  const [globalSkills, setGlobalSkills] = useState<string[]>([]);

  // Fetch global stats to ensure chart represents the WHOLE database, not just the current page
  useEffect(() => {
    const fetchGlobalStats = async () => {
      const { data, error } = await supabase
        .from('recipes')
        .select('skill');

      if (data && !error) {
        setGlobalSkills(data.map((r: any) => r.skill).filter(Boolean));
      }
    };

    fetchGlobalStats();
  }, []); // Run once on mount

  const data = useMemo(() => {
    const counts: Record<string, number> = {};

    // Use global data if available, otherwise fallback to prop data (current page)
    const sourceSkills = globalSkills.length > 0
      ? globalSkills
      : recipes.map(r => r.skill).filter(Boolean);

    sourceSkills.forEach(skill => {
      // Translate the key for the chart
      const translatedSkill = translateSkill(skill, lang);
      counts[translatedSkill] = (counts[translatedSkill] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8); // Top 8 skills
  }, [recipes, globalSkills, lang]);

  // Display count: Prefer totalCount prop, then global fetch length, then current page length
  const displayCount = totalCount || (globalSkills.length > 0 ? globalSkills.length : recipes.length);

  return (
    <div className="bg-wurm-panel rounded border border-wurm-border p-6 shadow-lg">
      <h3 className="text-sm font-bold font-mono text-wurm-text mb-4 text-center uppercase tracking-widest border-b border-wurm-border pb-2">{t.ui.skillDist}</h3>
      <div className="h-64 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={55}
              outerRadius={75}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#262626', color: '#e5e5e5', fontFamily: 'JetBrains Mono', fontSize: '12px' }}
              itemStyle={{ color: '#d4b483' }}
            />
            <Legend
              verticalAlign="bottom"
              height={45}
              iconType="circle"
              wrapperStyle={{ fontSize: '9px', fontFamily: 'JetBrains Mono', paddingTop: '5px', color: '#737373', lineHeight: '14px' }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Centered Donut Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ transform: 'translateY(-22px)' }}>
          <span className="text-2xl font-serif font-bold text-wurm-accent block">
            {displayCount}
          </span>
          <span className="text-wurm-muted text-[8px] font-mono uppercase tracking-widest block mt-0.5">
            {t.ui.totalRecipes}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Stats;
