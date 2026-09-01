import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Link as LinkIcon, 
  Video, 
  Image as ImageIcon, 
  Megaphone, 
  Check, 
  Pin,
  ExternalLink,
  HelpCircle
} from 'lucide-react';
import { AssetItem, AssetType, ChannelCategory, UtmParameters } from '../types';

interface AssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (asset: AssetItem) => void;
  initialAsset?: AssetItem | null;
}

export const AssetModal: React.FC<AssetModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialAsset,
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<AssetType>('links_only');
  const [category, setCategory] = useState<ChannelCategory | string>('discord');
  const [campaignName, setCampaignName] = useState('');
  const [csLink, setCsLink] = useState('');
  const [csLinkDescription, setCsLinkDescription] = useState('');
  const [growthBaseUrl, setGrowthBaseUrl] = useState('');
  const [growthLink, setGrowthLink] = useState('');
  const [utmSource, setUtmSource] = useState('intercom');
  const [utmMedium, setUtmMedium] = useState('customer-support');
  const [utmCampaign, setUtmCampaign] = useState('');
  const [utmContent, setUtmContent] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [videoEmbedUrl, setVideoEmbedUrl] = useState('');
  const [previewType, setPreviewType] = useState<'image' | 'video' | 'link_meta' | 'none'>('link_meta');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    if (initialAsset) {
      setTitle(initialAsset.title);
      setType(initialAsset.type);
      setCategory(initialAsset.category);
      setCampaignName(initialAsset.campaignName || '');
      setCsLink(initialAsset.csLink);
      setCsLinkDescription(initialAsset.csLinkDescription || '');
      setGrowthLink(initialAsset.growthLink);
      setGrowthBaseUrl(initialAsset.growthLink.split('?')[0] || '');
      setUtmSource(initialAsset.growthUtmParams?.source || 'intercom');
      setUtmMedium(initialAsset.growthUtmParams?.medium || 'customer-support');
      setUtmCampaign(initialAsset.growthUtmParams?.campaign || '');
      setUtmContent(initialAsset.growthUtmParams?.content || '');
      setPreviewUrl(initialAsset.previewUrl || '');
      setVideoEmbedUrl(initialAsset.videoEmbedUrl || '');
      setPreviewType(initialAsset.previewType || 'link_meta');
      setDescription(initialAsset.description || '');
      setTagsInput(initialAsset.tags.join(', '));
      setPinned(!!initialAsset.pinned);
    } else {
      // Reset defaults
      setTitle('');
      setType('links_only');
      setCategory('discord');
      setCampaignName('');
      setCsLink('');
      setCsLinkDescription('Discord & Community Reroute Link');
      setGrowthBaseUrl('https://packsify.com');
      setGrowthLink('');
      setUtmSource('intercom');
      setUtmMedium('customer-support');
      setUtmCampaign('');
      setUtmContent('');
      setPreviewUrl('');
      setVideoEmbedUrl('');
      setPreviewType('link_meta');
      setDescription('');
      setTagsInput('');
      setPinned(false);
    }
  }, [initialAsset, isOpen]);

  // Helper to auto-generate Growth UTM link when params change
  const buildGrowthUtmUrl = () => {
    try {
      const base = growthBaseUrl.trim() || 'https://packsify.com';
      const url = new URL(base.startsWith('http') ? base : `https://${base}`);
      if (utmSource.trim()) url.searchParams.set('utm_source', utmSource.trim());
      if (utmMedium.trim()) url.searchParams.set('utm_medium', utmMedium.trim());
      if (utmCampaign.trim()) url.searchParams.set('utm_campaign', utmCampaign.trim());
      if (utmContent.trim()) url.searchParams.set('utm_content', utmContent.trim());
      return url.toString();
    } catch {
      return growthBaseUrl;
    }
  };

  const handleAutoBuildGrowthLink = () => {
    const generated = buildGrowthUtmUrl();
    setGrowthLink(generated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !csLink.trim()) {
      alert('Please provide at least an Asset Title and a CS Team Link.');
      return;
    }

    const finalGrowthLink = growthLink.trim() || buildGrowthUtmUrl();
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const assetItem: AssetItem = {
      id: initialAsset ? initialAsset.id : `asset-${Date.now()}`,
      title: title.trim(),
      type,
      category,
      campaignName: campaignName.trim() || undefined,
      csLink: csLink.trim(),
      csLinkDescription: csLinkDescription.trim() || undefined,
      growthLink: finalGrowthLink,
      growthUtmParams: {
        source: utmSource.trim() || undefined,
        medium: utmMedium.trim() || undefined,
        campaign: utmCampaign.trim() || undefined,
        content: utmContent.trim() || undefined,
      },
      previewUrl: previewUrl.trim() || undefined,
      videoEmbedUrl: videoEmbedUrl.trim() || undefined,
      previewType: previewUrl.trim() ? (videoEmbedUrl.trim() ? 'video' : 'image') : 'link_meta',
      description: description.trim() || undefined,
      tags,
      pinned,
      copyCountCS: initialAsset ? initialAsset.copyCountCS : 0,
      copyCountGrowth: initialAsset ? initialAsset.copyCountGrowth : 0,
      createdAt: initialAsset ? initialAsset.createdAt : Date.now(),
      updatedAt: Date.now(),
      createdBy: initialAsset?.createdBy || 'Admin',
    };

    onSave(assetItem);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-100">
                {initialAsset ? 'Edit Repository Asset' : 'Add New UTM & Marketing Asset'}
              </h2>
              <p className="text-xs text-zinc-400">
                Configure CS Team reroute link and Growth Team UTM parameters
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
          
          {/* Asset Title */}
          <div>
            <label className="block text-xs font-semibold text-zinc-200 mb-1.5">
              Asset Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Android App (Google Play Store) or Discord Tournament Banner"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
            />
          </div>

          {/* Asset Type & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-200 mb-1.5">
                Asset Classification <span className="text-rose-400">*</span>
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as AssetType)}
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 focus:border-blue-500 text-xs"
              >
                <option value="links_only">Links Only (App, Website, Discord)</option>
                <option value="video_image">Video & Image Assets (Walkthroughs, Creatives)</option>
                <option value="campaign_asset">Campaign Asset (Marketing, Blitz, Affiliate)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-200 mb-1.5">
                Channel / Source Category <span className="text-rose-400">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 focus:border-blue-500 text-xs"
              >
                <option value="discord">Discord Reroutes</option>
                <option value="intercom">Intercom / Support Chat</option>
                <option value="google_play">Google Play Store</option>
                <option value="app_store">Apple App Store</option>
                <option value="trustpilot">Trustpilot Reviews</option>
                <option value="help_center">Help Center / FAQ</option>
                <option value="blog">Blogs & Content</option>
                <option value="influencer">Influencer / Affiliate</option>
                <option value="social_ads">Social Media & Ads</option>
                <option value="general">General / Direct</option>
              </select>
            </div>
          </div>

          {/* Campaign Name */}
          <div>
            <label className="block text-xs font-semibold text-zinc-200 mb-1.5">
              Marketing Campaign (Optional)
            </label>
            <input
              type="text"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              placeholder="e.g. Discord Community Blitz 2026, Q3 App Launch, Summer VIP"
              className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:border-blue-500 text-xs"
            />
          </div>

          {/* 1. CS Team Link Configuration */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-zinc-200 flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-blue-400" />
                Button 1: CS Team Link (Shortlink / Discord Reroute)
              </span>
              <span className="text-[10px] text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
                Required
              </span>
            </div>
            <input
              type="url"
              required
              value={csLink}
              onChange={(e) => setCsLink(e.target.value)}
              placeholder="https://join.packsify.com/psc-app-android"
              className="w-full px-3.5 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100 font-mono text-xs focus:border-blue-400"
            />
            <input
              type="text"
              value={csLinkDescription}
              onChange={(e) => setCsLinkDescription(e.target.value)}
              placeholder="Label context (e.g. Discord & Community Reroute Link)"
              className="w-full px-3 py-1.5 rounded-lg bg-zinc-900/80 border border-zinc-800 text-zinc-300 text-[11px]"
            />
          </div>

          {/* 2. Growth Team Link & UTM Builder */}
          <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Button 2: Growth Team Attributed Link (Full UTM)
              </span>
              <button
                type="button"
                onClick={handleAutoBuildGrowthLink}
                className="text-[10px] font-semibold text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 px-2.5 py-1 rounded transition-colors"
              >
                Auto-Generate UTM
              </button>
            </div>

            <div>
              <label className="block text-[11px] text-zinc-300 mb-1">
                Full Attributed URL (Copied when clicking "Copy Growth Link"):
              </label>
              <input
                type="url"
                value={growthLink}
                onChange={(e) => setGrowthLink(e.target.value)}
                placeholder="https://packsify.com/?utm_source=intercom&utm_medium=customer-support"
                className="w-full px-3.5 py-2 rounded-lg bg-zinc-950 border border-blue-500/40 text-zinc-100 font-mono text-xs focus:border-blue-400"
              />
            </div>

            {/* Quick UTM Parameter Configurator */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <div>
                <label className="block text-[10px] text-zinc-400 mb-0.5">utm_source</label>
                <input
                  type="text"
                  value={utmSource}
                  onChange={(e) => setUtmSource(e.target.value)}
                  placeholder="intercom"
                  className="w-full px-2 py-1 rounded bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] text-zinc-400 mb-0.5">utm_medium</label>
                <input
                  type="text"
                  value={utmMedium}
                  onChange={(e) => setUtmMedium(e.target.value)}
                  placeholder="customer-support"
                  className="w-full px-2 py-1 rounded bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] text-zinc-400 mb-0.5">utm_campaign</label>
                <input
                  type="text"
                  value={utmCampaign}
                  onChange={(e) => setUtmCampaign(e.target.value)}
                  placeholder="q3-blitz"
                  className="w-full px-2 py-1 rounded bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] text-zinc-400 mb-0.5">utm_content</label>
                <input
                  type="text"
                  value={utmContent}
                  onChange={(e) => setUtmContent(e.target.value)}
                  placeholder="hero-button"
                  className="w-full px-2 py-1 rounded bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Visual Preview Image / Video URL */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-200 mb-1">
                Visual Preview Image URL (Optional)
              </label>
              <input
                type="url"
                value={previewUrl}
                onChange={(e) => setPreviewUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... or https://yourcdn.com/asset.png"
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-200 mb-1">
                Video Embed URL (Optional for Walkthroughs)
              </label>
              <input
                type="url"
                value={videoEmbedUrl}
                onChange={(e) => setVideoEmbedUrl(e.target.value)}
                placeholder="https://www.youtube.com/embed/... or https://player.vimeo.com/..."
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs font-mono"
              />
            </div>
          </div>

          {/* Description & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-200 mb-1">
                Notes for Agents / Team Context
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="When to use this link, instructions for ticket replies..."
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-200 mb-1">
                Tags (Comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Android, Play Store, Mobile, Discord"
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs"
              />
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pin-checkbox"
                  checked={pinned}
                  onChange={(e) => setPinned(e.target.checked)}
                  className="rounded bg-zinc-950 border-zinc-700 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="pin-checkbox" className="text-xs text-zinc-300 cursor-pointer">
                  Pin to top of repository
                </label>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 transition-all active:scale-95"
            >
              {initialAsset ? 'Save Changes' : 'Publish Asset to Cloud'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
