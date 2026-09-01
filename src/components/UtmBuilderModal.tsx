import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Copy, 
  Check, 
  Link as LinkIcon, 
  Zap, 
  RefreshCw, 
  ExternalLink,
  Plus
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface UtmBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveAsAsset?: (title: string, csLink: string, growthLink: string, campaign: string) => void;
}

export const UtmBuilderModal: React.FC<UtmBuilderModalProps> = ({
  isOpen,
  onClose,
  onSaveAsAsset,
}) => {
  const [baseUrl, setBaseUrl] = useState('https://packsify.com');
  const [source, setSource] = useState('intercom');
  const [medium, setMedium] = useState('customer-support');
  const [campaign, setCampaign] = useState('cs-support-ticket');
  const [content, setContent] = useState('');
  const [term, setTerm] = useState('');
  const [copiedGrowth, setCopiedGrowth] = useState(false);
  const [copiedCS, setCopiedCS] = useState(false);

  if (!isOpen) return null;

  // Preset channels
  const presetTemplates = [
    { label: 'Discord Community', s: 'discord', m: 'community', c: 'discord-general' },
    { label: 'Intercom CS Support', s: 'intercom', m: 'customer-support', c: 'ticket-resolution' },
    { label: 'Trustpilot Invite', s: 'intercom', m: 'review-invite', c: 'trustpilot-5star' },
    { label: 'Summer Influencer', s: 'influencer', m: 'affiliate-partner', c: 'creator-summer-2026' },
    { label: 'Help Center FAQ', s: 'intercom', m: 'kb-reroute', c: 'faq-helpcenter' },
  ];

  // Generated Growth Link
  const getGrowthLink = () => {
    try {
      const raw = baseUrl.trim() || 'https://packsify.com';
      const url = new URL(raw.startsWith('http') ? raw : `https://${raw}`);
      if (source.trim()) url.searchParams.set('utm_source', source.trim());
      if (medium.trim()) url.searchParams.set('utm_medium', medium.trim());
      if (campaign.trim()) url.searchParams.set('utm_campaign', campaign.trim());
      if (content.trim()) url.searchParams.set('utm_content', content.trim());
      if (term.trim()) url.searchParams.set('utm_term', term.trim());
      return url.toString();
    } catch {
      return baseUrl;
    }
  };

  // Generated CS Shortlink pattern
  const getCsShortlink = () => {
    try {
      const parsed = new URL(baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`);
      const slug = (campaign || source || 'go').toLowerCase().replace(/[^a-z0-9]/g, '-');
      return `https://join.packsify.com/psc-${slug}`;
    } catch {
      return `https://join.packsify.com/psc-link`;
    }
  };

  const growthLink = getGrowthLink();
  const csLink = getCsShortlink();

  const handleCopyGrowth = () => {
    navigator.clipboard.writeText(growthLink);
    setCopiedGrowth(true);
    confetti({ particleCount: 20, spread: 35 });
    setTimeout(() => setCopiedGrowth(false), 2000);
  };

  const handleCopyCS = () => {
    navigator.clipboard.writeText(csLink);
    setCopiedCS(true);
    confetti({ particleCount: 20, spread: 35 });
    setTimeout(() => setCopiedCS(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden p-6 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-100">
                Attributed UTM Link Generator
              </h2>
              <p className="text-xs text-zinc-400">
                Create standardized CS shortlinks and Growth UTM tracking links
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

        {/* Quick presets */}
        <div className="py-4">
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-2">
            Quick Presets
          </label>
          <div className="flex flex-wrap gap-1.5">
            {presetTemplates.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSource(p.s);
                  setMedium(p.m);
                  setCampaign(p.c);
                }}
                className="px-2.5 py-1 rounded-lg text-xs bg-zinc-800 hover:bg-blue-600/20 hover:text-blue-300 text-zinc-300 border border-zinc-700 transition-colors flex items-center gap-1"
              >
                <Zap className="w-3 h-3 text-amber-400" />
                <span>{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Parameters Form */}
        <div className="space-y-3.5 text-xs">
          <div>
            <label className="block text-xs font-semibold text-zinc-200 mb-1">
              Destination URL
            </label>
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://packsify.com/pricing"
              className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 font-mono text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                utm_source <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="e.g. intercom, discord, instagram"
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                utm_medium <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={medium}
                onChange={(e) => setMedium(e.target.value)}
                placeholder="e.g. customer-support, banner, social"
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                utm_campaign
              </label>
              <input
                type="text"
                value={campaign}
                onChange={(e) => setCampaign(e.target.value)}
                placeholder="e.g. q3-summer-promo"
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                utm_content (Optional)
              </label>
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="e.g. chat-macro-top"
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* Output Previews with 1-Click Copy */}
        <div className="mt-5 space-y-3 pt-4 border-t border-zinc-800">
          
          {/* CS Output */}
          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-0.5">
                CS Team Format (Clean Shortlink)
              </div>
              <div className="text-xs font-mono text-zinc-200 truncate">
                {csLink}
              </div>
            </div>
            <button
              onClick={handleCopyCS}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                copiedCS
                  ? 'bg-emerald-600 text-white'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 shadow-sm'
              }`}
            >
              {copiedCS ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCS ? 'Copied!' : 'Copy CS'}</span>
            </button>
          </div>

          {/* Growth Output */}
          <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/20 flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-0.5">
                Growth Team Format (Attributed UTM Link)
              </div>
              <div className="text-xs font-mono text-zinc-200 truncate">
                {growthLink}
              </div>
            </div>
            <button
              onClick={handleCopyGrowth}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                copiedGrowth
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm'
              }`}
            >
              {copiedGrowth ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedGrowth ? 'Copied!' : 'Copy Growth'}</span>
            </button>
          </div>

        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-5 mt-2">
          {onSaveAsAsset && (
            <button
              type="button"
              onClick={() => {
                onSaveAsAsset(
                  `${campaign || 'Custom UTM Link'} (${source})`,
                  csLink,
                  growthLink,
                  campaign
                );
                onClose();
              }}
              className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Save as Repository Asset</span>
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="ml-auto px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-800 text-zinc-200 hover:bg-zinc-700 transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
