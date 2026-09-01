import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  ExternalLink, 
  Play, 
  MoreVertical, 
  Pin, 
  Trash2, 
  Edit3, 
  QrCode,
  Eye,
  ArrowUpRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AssetItem, AdminUser } from '../types';
import { trackCopyClick } from '../lib/firebase';

interface AssetTableProps {
  assets: AssetItem[];
  user: AdminUser;
  onEdit: (asset: AssetItem) => void;
  onDelete: (id: string) => void;
  onOpenPreview: (asset: AssetItem) => void;
  onOpenQr: (link: string, title: string) => void;
}

export const AssetTable: React.FC<AssetTableProps> = ({
  assets,
  user,
  onEdit,
  onDelete,
  onOpenPreview,
  onOpenQr,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const triggerConfetti = (e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    confetti({
      particleCount: 20,
      spread: 40,
      origin: { x, y },
      colors: ['#6366f1', '#10b981'],
      disableForReducedMotion: true,
      zIndex: 9999,
    });
  };

  const handleCopy = (e: React.MouseEvent, text: string, id: string, team: 'CS' | 'Growth') => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(`${id}-${team}`);
    triggerConfetti(e);
    trackCopyClick(id, team);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-950 text-xs font-bold text-zinc-400 border-b border-zinc-800 uppercase tracking-wider">
            <tr>
              <th className="py-4 px-5">Asset / Campaign</th>
              <th className="py-4 px-3">Type & Channel</th>
              <th className="py-4 px-4 min-w-[220px]">
                <div className="flex items-center gap-1.5 text-zinc-300 font-bold">
                  <span>CS Team Link</span>
                </div>
              </th>
              <th className="py-4 px-4 min-w-[260px]">
                <div className="flex items-center gap-1.5 text-blue-400 font-bold">
                  <span>Growth Team Link (UTM)</span>
                </div>
              </th>
              <th className="py-4 px-3 text-center">Preview</th>
              {user.role === 'admin' && (
                <th className="py-4 px-3 text-right">Admin</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800 font-sans">
            {assets.map((asset) => {
              const isCopiedCS = copiedId === `${asset.id}-CS`;
              const isCopiedGrowth = copiedId === `${asset.id}-Growth`;

              return (
                <tr
                  key={asset.id}
                  className="hover:bg-zinc-800/50 transition-colors group"
                >
                  {/* Asset Title & Campaign */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2.5">
                      {asset.pinned && (
                        <Pin className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                      )}
                      <div>
                        <div className="font-bold text-zinc-100 group-hover:text-blue-400 transition-colors">
                          {asset.title}
                        </div>
                        {asset.campaignName && (
                          <div className="text-xs text-blue-400/80">
                            {asset.campaignName}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Type & Channel badge */}
                  <td className="py-4 px-3 whitespace-nowrap">
                    <div className="flex flex-col gap-1 items-start">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300">
                        {asset.category.replace('_', ' ')}
                      </span>
                      {asset.type !== 'links_only' && (
                        <span className="text-[10px] text-purple-400 font-medium">
                          {asset.type === 'video_image' ? 'Video/Media' : 'Campaign'}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* CS Team Link with 1-Click Copy */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleCopy(e, asset.csLink, asset.id, 'CS')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border shrink-0 ${
                          isCopiedCS
                            ? 'bg-emerald-600 text-white border-emerald-500'
                            : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700 shadow-sm'
                        }`}
                        title="Copy CS Link"
                      >
                        {isCopiedCS ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{isCopiedCS ? 'Copied' : 'Copy CS'}</span>
                      </button>
                      <a
                        href={asset.csLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-mono text-zinc-300 hover:text-blue-400 hover:underline truncate max-w-[200px]"
                        title={asset.csLink}
                      >
                        {asset.csLink}
                      </a>
                    </div>
                  </td>

                  {/* Growth Team Link with 1-Click Copy */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleCopy(e, asset.growthLink, asset.id, 'Growth')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border shrink-0 ${
                          isCopiedGrowth
                            ? 'bg-emerald-600 text-white border-emerald-500'
                            : 'bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border-blue-500/20'
                        }`}
                        title="Copy Growth UTM Link"
                      >
                        {isCopiedGrowth ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{isCopiedGrowth ? 'Copied' : 'Copy Growth'}</span>
                      </button>
                      <a
                        href={asset.growthLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-mono text-zinc-300 hover:text-blue-400 hover:underline truncate max-w-[220px]"
                        title={asset.growthLink}
                      >
                        {asset.growthLink}
                      </a>
                    </div>
                  </td>

                  {/* Preview / QR */}
                  <td className="py-4 px-3 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onOpenPreview(asset)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                        title="Open Preview"
                      >
                        <Eye className="w-4 h-4 text-blue-400" />
                      </button>
                      <button
                        onClick={() => onOpenQr(asset.growthLink || asset.csLink, asset.title)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-blue-400 hover:bg-zinc-800"
                        title="Show QR Code"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>
                    </div>
                  </td>

                  {/* Admin actions */}
                  {user.role === 'admin' && (
                    <td className="py-4 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onEdit(asset)}
                          className="p-1.5 rounded-lg text-amber-400 hover:bg-amber-500/10"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete "${asset.title}"?`)) {
                              onDelete(asset.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
