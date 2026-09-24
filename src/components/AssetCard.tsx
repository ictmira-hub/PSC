import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  ExternalLink, 
  Play, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  MoreVertical, 
  Pin, 
  Trash2, 
  Edit3, 
  QrCode,
  Tag,
  Eye
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AssetItem, AdminUser } from '../types';
import { trackCopyClick } from '../lib/api';

interface AssetCardProps {
  asset: AssetItem;
  user: AdminUser;
  onEdit: (asset: AssetItem) => void;
  onDelete: (id: string) => void;
  onOpenPreview: (asset: AssetItem) => void;
  onOpenQr: (link: string, title: string) => void;
}

export const AssetCard: React.FC<AssetCardProps> = ({
  asset,
  user,
  onEdit,
  onDelete,
  onOpenPreview,
  onOpenQr,
}) => {
  const [copiedCS, setCopiedCS] = useState(false);
  const [copiedGrowth, setCopiedGrowth] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showUtmDetails, setShowUtmDetails] = useState(false);

  const triggerConfetti = (e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    confetti({
      particleCount: 28,
      spread: 45,
      origin: { x, y },
      colors: ['#6366f1', '#3b82f6', '#10b981', '#f59e0b'],
      disableForReducedMotion: true,
      zIndex: 9999,
    });
  };

  const handleCopyCS = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(asset.csLink);
    setCopiedCS(true);
    triggerConfetti(e);
    trackCopyClick(asset.id, 'CS');
    setTimeout(() => setCopiedCS(false), 2000);
  };

  const handleCopyGrowth = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(asset.growthLink);
    setCopiedGrowth(true);
    triggerConfetti(e);
    trackCopyClick(asset.id, 'Growth');
    setTimeout(() => setCopiedGrowth(false), 2000);
  };

  // Helper for category badge styling in Elegant Dark theme
  const getCategoryBadge = (cat: string) => {
    const map: Record<string, { label: string; color: string }> = {
      discord: { label: 'Discord Reroute', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
      intercom: { label: 'Intercom / CS', color: 'bg-sky-500/20 text-sky-400 border-sky-500/30' },
      google_play: { label: 'Google Play Store', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
      app_store: { label: 'Apple App Store', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
      trustpilot: { label: 'Trustpilot Reviews', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
      help_center: { label: 'Help Center', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
      blog: { label: 'Blog & Content', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
      influencer: { label: 'Influencer / VIP', color: 'bg-pink-500/20 text-pink-400 border-pink-500/30' },
      social_ads: { label: 'Social & Ads', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
    };
    return map[cat] || { label: cat.replace('_', ' '), color: 'bg-zinc-800 text-zinc-400 border-zinc-700' };
  };

  const catInfo = getCategoryBadge(asset.category);

  return (
    <div
      id={`asset-card-${asset.id}`}
      className="group relative flex flex-col justify-between rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all duration-200 shadow-xl overflow-hidden"
    >
      {/* Top Bar / Meta info */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Category / Channel Badge */}
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${catInfo.color}`}>
              {catInfo.label}
            </span>

            {/* Asset Type Badge */}
            {asset.type === 'video_image' && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                <Play className="w-2.5 h-2.5" /> Video/Media
              </span>
            )}
            {asset.type === 'campaign_asset' && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                <Tag className="w-2.5 h-2.5" /> Campaign
              </span>
            )}
            {asset.pinned && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Pin className="w-2.5 h-2.5 fill-amber-300" /> Pinned
              </span>
            )}
          </div>

          {/* Actions Menu */}
          <div className="relative">
            <button
              id={`asset-menu-btn-${asset.id}`}
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
              title="Options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-7 z-30 w-48 rounded-xl bg-zinc-800 border border-zinc-700 shadow-2xl py-1 text-xs">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onOpenQr(asset.growthLink || asset.csLink, asset.title);
                    }}
                    className="w-full flex items-center gap-2 px-3.5 py-2 text-zinc-200 hover:bg-zinc-700/70"
                  >
                    <QrCode className="w-3.5 h-3.5 text-blue-400" /> Generate QR Code
                  </button>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onOpenPreview(asset);
                    }}
                    className="w-full flex items-center gap-2 px-3.5 py-2 text-zinc-200 hover:bg-zinc-700/70"
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-400" /> View Full Preview
                  </button>
                  <a
                    href={asset.growthLink || asset.csLink}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center gap-2 px-3.5 py-2 text-zinc-200 hover:bg-zinc-700/70"
                    onClick={() => setShowMenu(false)}
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-400" /> Open Destination
                  </a>

                  {user.role === 'admin' && (
                    <>
                      <div className="my-1 border-t border-zinc-700" />
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          onEdit(asset);
                        }}
                        className="w-full flex items-center gap-2 px-3.5 py-2 text-zinc-200 hover:bg-zinc-700/70"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-amber-400" /> Edit Asset
                      </button>
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          if (confirm(`Delete asset "${asset.title}"?`)) {
                            onDelete(asset.id);
                          }
                        }}
                        className="w-full flex items-center gap-2 px-3.5 py-2 text-rose-400 hover:bg-rose-500/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete Asset
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-zinc-100 group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
          {asset.title}
        </h3>

        {/* Campaign subtitle if present */}
        {asset.campaignName && (
          <p className="text-xs text-blue-400/90 font-medium mt-1">
            Campaign: {asset.campaignName}
          </p>
        )}
      </div>

      {/* Visual Preview Section */}
      <div 
        onClick={() => onOpenPreview(asset)}
        className="px-5 py-1 cursor-pointer"
      >
        {asset.previewUrl ? (
          <div className="relative w-full h-36 rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 group-hover:border-zinc-700 transition-all">
            <img
              src={asset.previewUrl}
              alt={asset.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {asset.type === 'video_image' && (
              <div className="absolute inset-0 bg-zinc-950/40 flex items-center justify-center backdrop-blur-[1px]">
                <div className="w-10 h-10 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-lg shadow-blue-600/30 group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 fill-white ml-0.5" />
                </div>
              </div>
            )}
            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-zinc-950/80 backdrop-blur-sm text-[10px] font-mono text-zinc-300 flex items-center gap-1 border border-zinc-800">
              <Eye className="w-3 h-3 text-blue-400" /> Preview
            </div>
          </div>
        ) : (
          <div className="w-full h-20 rounded-xl bg-zinc-950/60 border border-zinc-800 flex items-center justify-between px-4 py-2 text-zinc-400 group-hover:border-zinc-700 transition-colors">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                <LinkIcon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-mono text-zinc-300 truncate">
                  {asset.csLink ? new URL(asset.csLink).hostname : 'packsify.com'}
                </div>
                <div className="text-[11px] text-zinc-500 truncate">
                  {asset.description || 'Attributed shortlink'}
                </div>
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-500 shrink-0 ml-2" />
          </div>
        )}
      </div>

      {/* Description Snippet */}
      {asset.description && asset.previewUrl && (
        <p className="px-5 text-xs text-zinc-400 line-clamp-1 mt-2">
          {asset.description}
        </p>
      )}

      {/* 2 Dedicated Copy Buttons (CS Team & Growth Team) */}
      <div className="p-5 pt-3 mt-auto flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {/* Button 1: CS Team */}
          <button
            id={`copy-cs-btn-${asset.id}`}
            onClick={handleCopyCS}
            className={`flex-1 relative flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-150 border ${
              copiedCS
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/20'
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700 active:scale-[0.99]'
            }`}
          >
            {copiedCS ? (
              <Check className="w-3.5 h-3.5 text-white" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-zinc-400" />
            )}
            <span>{copiedCS ? 'Copied CS!' : 'COPY CS'}</span>
          </button>

          {/* Button 2: Growth Team */}
          <button
            id={`copy-growth-btn-${asset.id}`}
            onClick={handleCopyGrowth}
            className={`flex-1 relative flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-150 border ${
              copiedGrowth
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/20'
                : 'bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border-blue-500/20 active:scale-[0.99]'
            }`}
          >
            {copiedGrowth ? (
              <Check className="w-3.5 h-3.5 text-white" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-blue-400" />
            )}
            <span>{copiedGrowth ? 'Copied Growth!' : 'COPY GROWTH'}</span>
          </button>
        </div>

        {/* Bottom micro stats & inspect toggle */}
        <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1 px-0.5">
          <button 
            onClick={() => setShowUtmDetails(!showUtmDetails)}
            className="hover:text-zinc-300 transition-colors text-[10px] underline underline-offset-2"
          >
            {showUtmDetails ? 'Hide UTM params' : 'Inspect UTM params'}
          </button>
          {user.role === 'admin' && (
            <span className="text-[10px]">
              Copies: CS <strong className="text-zinc-300">{asset.copyCountCS || 0}</strong> • Growth <strong className="text-zinc-300">{asset.copyCountGrowth || 0}</strong>
            </span>
          )}
        </div>

        {/* Collapsible UTM Breakdown */}
        {showUtmDetails && (
          <div className="mt-1 p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] font-mono text-zinc-300 space-y-1">
            <div className="text-[10px] font-sans font-bold text-zinc-400 uppercase tracking-wider mb-1">
              UTM Parameters
            </div>
            <div className="truncate text-zinc-400">
              <span className="text-zinc-300 font-semibold">CS:</span> {asset.csLink}
            </div>
            <div className="truncate text-zinc-400">
              <span className="text-blue-400 font-semibold">Growth:</span> {asset.growthLink}
            </div>
            {asset.growthUtmParams && (
              <div className="grid grid-cols-2 gap-1 pt-1 text-[10px]">
                {asset.growthUtmParams.source && (
                  <div><span className="text-zinc-500">source:</span> {asset.growthUtmParams.source}</div>
                )}
                {asset.growthUtmParams.medium && (
                  <div><span className="text-zinc-500">medium:</span> {asset.growthUtmParams.medium}</div>
                )}
                {asset.growthUtmParams.campaign && (
                  <div><span className="text-zinc-500">campaign:</span> {asset.growthUtmParams.campaign}</div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
