import React, { useEffect, useState } from 'react';
import { fetchUsageStats } from '../../utils/analytics';
import { UsageStats } from '../../types';
import { Database, Server } from 'lucide-react';

interface UsageWidgetProps {
    onManageUsers?: () => void;
}

const UsageWidget: React.FC<UsageWidgetProps> = ({ onManageUsers }) => {
    const [stats, setStats] = useState<UsageStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const data = await fetchUsageStats();
            setStats(data);
            setLoading(false);
        };
        load();
    }, []);

    if (loading) return null;
    if (!stats) return null;

    const usagePercent = (stats.db_size_mb / stats.limit_db_size_mb) * 100;
    const isWarning = usagePercent > 70;
    const isCritical = usagePercent > 90;

    const barColor = isCritical ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-green-500';

    return (
        <div className="bg-wurm-panel border border-wurm-border rounded p-4 mb-6 shadow-lg">
            <h3 className="text-xs font-bold text-wurm-muted uppercase tracking-widest flex items-center gap-2 mb-3">
                <Server size={12} /> System Status (Free Tier)
            </h3>

            <div className="space-y-3">
                {/* Storage Usage */}
                <div>
                    <div className="flex justify-between text-[10px] font-mono mb-1 text-wurm-text">
                        <span>Database Size</span>
                        <span className={isCritical ? 'text-red-400' : 'text-wurm-accent'}>
                            {stats.db_size_mb}MB / {stats.limit_db_size_mb}MB
                        </span>
                    </div>
                    <div className="h-1.5 w-full bg-black/50 rounded-full overflow-hidden border border-wurm-border/30">
                        <div
                            className={`h-full ${barColor} transition-all duration-500`}
                            style={{ width: `${Math.min(usagePercent, 100)}%` }}
                        />
                    </div>
                </div>

                {/* Recipe Count */}
                <div className="flex items-center gap-2 text-[10px] font-mono text-wurm-muted">
                    <Database size={10} />
                    <span>Total Recipes: <span className="text-white">{stats.recipes_count}</span></span>
                </div>

                {/* Admin Actions */}
                {onManageUsers && (
                    <div className="pt-3 border-t border-wurm-border/30 mt-2">
                        <button
                            onClick={onManageUsers}
                            className="w-full py-1.5 bg-wurm-accent/10 border border-wurm-accent/20 text-wurm-accent text-[10px] font-bold uppercase tracking-widest hover:bg-wurm-accent hover:text-black transition-colors rounded"
                        >
                            Manage Users
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UsageWidget;
