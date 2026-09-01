import React from 'react';
import { 
  Layers, 
  Link2, 
  Video, 
  Megaphone, 
  Sparkles, 
  FileText, 
  BarChart3, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  MessageSquare, 
  Smartphone, 
  Star, 
  HelpCircle, 
  BookOpen, 
  Zap, 
  Users, 
  Flame,
  Plus
} from 'lucide-react';
import { FilterState, AssetType, AdminUser } from '../types';

interface SidebarProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  counts: {
    all: number;
    links_only: number;
    video_image: number;
    campaign_asset: number;
  };
  campaigns: string[];
  user: AdminUser;
  onOpenAdminLogin: () => void;
  onOpenUtmBuilder: () => void;
  onOpenCheatSheet: () => void;
  onOpenStats: () => void;
  onOpenNewAsset: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  filters,
  onFilterChange,
  counts,
  campaigns,
  user,
  onOpenAdminLogin,
  onOpenUtmBuilder,
  onOpenCheatSheet,
  onOpenStats,
  onOpenNewAsset,
}) => {
  const navItems: { label: string; type: 'all' | AssetType; icon: React.ReactNode; count: number }[] = [
    { label: 'All Assets', type: 'all', icon: <Layers className="w-4 h-4" />, count: counts.all },
    { label: 'Links Only', type: 'links_only', icon: <Link2 className="w-4 h-4" />, count: counts.links_only },
    { label: 'Videos & Media', type: 'video_image', icon: <Video className="w-4 h-4" />, count: counts.video_image },
    { label: 'Campaign Kits', type: 'campaign_asset', icon: <Megaphone className="w-4 h-4" />, count: counts.campaign_asset },
  ];

  const channelFilters = [
    { id: 'all', label: 'All Channels', icon: <Zap className="w-3.5 h-3.5" /> },
    { id: 'discord', label: 'Discord Reroutes', icon: <MessageSquare className="w-3.5 h-3.5 text-blue-400" /> },
    { id: 'intercom', label: 'Intercom / Support', icon: <MessageSquare className="w-3.5 h-3.5 text-blue-400" /> },
    { id: 'google_play', label: 'Google Play Store', icon: <Smartphone className="w-3.5 h-3.5 text-emerald-400" /> },
    { id: 'app_store', label: 'Apple App Store', icon: <Smartphone className="w-3.5 h-3.5 text-sky-400" /> },
    { id: 'trustpilot', label: 'Trustpilot Reviews', icon: <Star className="w-3.5 h-3.5 text-emerald-400" /> },
    { id: 'help_center', label: 'Help Center', icon: <HelpCircle className="w-3.5 h-3.5 text-amber-400" /> },
    { id: 'blog', label: 'Blogs & Guides', icon: <BookOpen className="w-3.5 h-3.5 text-purple-400" /> },
    { id: 'influencer', label: 'Influencer / VIP', icon: <Users className="w-3.5 h-3.5 text-pink-400" /> },
  ];

  const userInitials = user.displayName 
    ? user.displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : user.role === 'admin' ? 'AD' : 'CS';

  return (
    <aside className="w-full lg:w-64 bg-zinc-900 lg:min-h-[calc(100vh-61px)] border-r border-zinc-800 p-4 flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        
        {/* Core Asset Type Navigation */}
        <div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = filters.selectedType === item.type;
              return (
                <button
                  key={item.type}
                  id={`nav-type-${item.type}`}
                  onClick={() => onFilterChange({ selectedType: item.type })}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-sm'
                      : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={active ? 'text-blue-400' : 'text-zinc-400'}>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium ${
                      active ? 'bg-blue-500/20 text-blue-300' : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {item.count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Channels / Source Categories */}
        <div>
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2 px-2.5">
            <span>Filter Channel</span>
            {filters.selectedCategory !== 'all' && (
              <button
                onClick={() => onFilterChange({ selectedCategory: 'all' })}
                className="text-[10px] text-blue-400 hover:underline capitalize"
              >
                Reset
              </button>
            )}
          </div>
          <div className="space-y-0.5">
            {channelFilters.map((channel) => {
              const active = filters.selectedCategory === channel.id;
              return (
                <button
                  key={channel.id}
                  id={`filter-cat-${channel.id}`}
                  onClick={() => onFilterChange({ selectedCategory: channel.id })}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors text-left ${
                    active
                      ? 'bg-zinc-800 text-blue-400 font-semibold border-l-2 border-blue-500'
                      : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
                  }`}
                >
                  {channel.icon}
                  <span className="truncate">{channel.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Marketing Campaigns dropdown */}
        {campaigns.length > 0 && (
          <div>
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2 px-2.5">
              <span>Campaigns</span>
              {filters.selectedCampaign !== 'all' && (
                <button
                  onClick={() => onFilterChange({ selectedCampaign: 'all' })}
                  className="text-[10px] text-blue-400 hover:underline"
                >
                  Clear
                </button>
              )}
            </div>
            <select
              value={filters.selectedCampaign}
              onChange={(e) => onFilterChange({ selectedCampaign: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-xs text-zinc-200 focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Campaigns</option>
              {campaigns.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Quick Tools */}
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2 px-2.5">
            Team Tools
          </div>
          <div className="space-y-1">
            <button
              onClick={onOpenUtmBuilder}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-blue-300 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>UTM Link Builder</span>
            </button>
            <button
              onClick={onOpenCheatSheet}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-emerald-300 transition-colors"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>CS Cheat Sheet (2-Col)</span>
            </button>
            {user.role === 'admin' && (
              <button
                onClick={onOpenStats}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-amber-300 transition-colors"
              >
                <BarChart3 className="w-4 h-4 text-amber-400" />
                <span>Usage & Copy Analytics</span>
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Role & Admin Footer matching Elegant Dark theme */}
      <div className="pt-4 mt-6 border-t border-zinc-800">
        <div 
          onClick={onOpenAdminLogin}
          className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/60 cursor-pointer transition-all mb-3"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-emerald-500 flex items-center justify-center text-xs font-bold text-white shadow-sm">
            {userInitials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-zinc-200 truncate">
              {user.displayName || (user.role === 'admin' ? 'Admin User' : 'CS / Growth Agent')}
            </p>
            <p className="text-[10px] text-zinc-400 uppercase tracking-wider">
              {user.role === 'admin' ? 'Admin Role' : 'Viewer Role'}
            </p>
          </div>
        </div>

        {user.role === 'admin' ? (
          <button
            onClick={onOpenNewAsset}
            className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Asset</span>
          </button>
        ) : (
          <button
            onClick={onOpenAdminLogin}
            className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 flex items-center justify-center gap-1.5 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Admin Settings</span>
          </button>
        )}
      </div>
    </aside>
  );
};
