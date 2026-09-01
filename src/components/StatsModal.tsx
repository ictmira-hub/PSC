import React from 'react';
import { X, BarChart3, TrendingUp, Users, Sparkles, Layers, Link2 } from 'lucide-react';
import { AssetItem } from '../types';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  assets: AssetItem[];
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  assets,
}) => {
  if (!isOpen) return null;

  const totalCS = assets.reduce((acc, a) => acc + (a.copyCountCS || 0), 0);
  const totalGrowth = assets.reduce((acc, a) => acc + (a.copyCountGrowth || 0), 0);
  const grandTotal = totalCS + totalGrowth;

  // Sort top copied
  const topCopied = [...assets]
    .sort((a, b) => ((b.copyCountCS || 0) + (b.copyCountGrowth || 0)) - ((a.copyCountCS || 0) + (a.copyCountGrowth || 0)))
    .slice(0, 5);

  // Group by channel
  const channelCounts: Record<string, number> = {};
  assets.forEach((a) => {
    const cat = a.category;
    channelCounts[cat] = (channelCounts[cat] || 0) + 1;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden p-6 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-100">
                Team Copy & Attribution Analytics
              </h2>
              <p className="text-xs text-zinc-400">
                Real-time usage metrics across CS and Growth teams
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-3 py-5">
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">
              Total Links Copied
            </div>
            <div className="text-2xl font-extrabold text-zinc-100 font-mono">
              {grandTotal.toLocaleString()}
            </div>
            <div className="text-[10px] text-zinc-500 mt-1">Across all campaigns</div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">
              CS Team Copies
            </div>
            <div className="text-2xl font-extrabold text-zinc-200 font-mono">
              {totalCS.toLocaleString()}
            </div>
            <div className="text-[10px] text-zinc-500 mt-1">
              {grandTotal > 0 ? Math.round((totalCS / grandTotal) * 100) : 0}% of all link usage
            </div>
          </div>

          <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-blue-400 mb-1">
              Growth Team Copies
            </div>
            <div className="text-2xl font-extrabold text-blue-400 font-mono">
              {totalGrowth.toLocaleString()}
            </div>
            <div className="text-[10px] text-blue-400/80 mt-1">
              {grandTotal > 0 ? Math.round((totalGrowth / grandTotal) * 100) : 0}% of all link usage
            </div>
          </div>
        </div>

        {/* Most Frequently Copied Assets */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
            <span>Top Performing Attributed Links</span>
          </h3>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950 divide-y divide-zinc-800 overflow-hidden text-xs">
            {topCopied.map((item, idx) => (
              <div key={item.id} className="p-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-300 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="font-semibold text-zinc-200 truncate">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-zinc-500 truncate">
                      {item.category.replace('_', ' ')} {item.campaignName ? `• ${item.campaignName}` : ''}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 font-mono text-xs">
                  <span className="text-zinc-400">CS: <strong>{item.copyCountCS || 0}</strong></span>
                  <span className="text-zinc-700">|</span>
                  <span className="text-blue-400">Growth: <strong>{item.copyCountGrowth || 0}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-5 mt-4 border-t border-zinc-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-800 text-zinc-200 hover:bg-zinc-700 transition-colors"
          >
            Close Analytics
          </button>
        </div>

      </div>
    </div>
  );
};
