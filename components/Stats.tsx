import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Recipe, Language } from '../types';
import { translateSkill } from '../utils/translations';

interface StatsProps {
  recipes: Recipe[];
  t: any;
  lang: Language;
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

const Stats: React.FC<StatsProps> = ({ recipes, t, lang }) => {
  const data = useMemo(() => {
    const counts: Record<string, number> = {};
    recipes.forEach(r => {
      if (r.skill) {
        // Translate the key for the chart
        const translatedSkill = translateSkill(r.skill, lang);
        counts[translatedSkill] = (counts[translatedSkill] || 0) + 1;
      }
    });

    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8); // Top 8 skills
  }, [recipes, lang]);

  return (
    <div className="bg-wurm-panel rounded border border-wurm-border p-6 shadow-lg">
      <h3 className="text-sm font-bold font-mono text-wurm-text mb-4 text-center uppercase tracking-widest border-b border-wurm-border pb-2">{t.ui.skillDist}</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
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
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: '10px', fontFamily: 'JetBrains Mono', paddingTop: '10px', color: '#737373' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-center">
        <span className="text-4xl font-serif font-bold text-wurm-accent block">
          {recipes.length}
        </span>
        <p className="text-wurm-muted text-[10px] font-mono uppercase tracking-widest">{t.ui.totalRecipes}</p>
      </div>
    </div>
  );
};

export default Stats;
