import React from 'react';
import { 
  Search, 
  LayoutGrid, 
  List, 
  Plus, 
  ShieldCheck, 
  LogIn, 
  Moon, 
  Sun, 
  X, 
  SlidersHorizontal, 
  Sparkles,
  Link2,
  Share2
} from 'lucide-react';
import { FilterState, AdminUser, AssetType } from '../types';

interface NavbarProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  user: AdminUser;
  onOpenAdminLogin: () => void;
  onOpenNewAsset: () => void;
  onOpenUtmBuilder: () => void;
  onOpenCheatSheet: () => void;
  darkMode: boolean;
  onToggleTheme: () => void;
  totalAssetsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  filters,
  onFilterChange,
  user,
  onOpenAdminLogin,
  onOpenNewAsset,
  onOpenUtmBuilder,
  onOpenCheatSheet,
  darkMode,
  onToggleTheme,
  totalAssetsCount,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-md px-4 lg:px-8 py-3">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 max-w-7xl mx-auto">
        
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center justify-between md:justify-start gap-3">
          <div className="flex items-center gap-3 text-blue-400">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-bold text-blue-400 text-base shadow-sm">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-zinc-100 text-lg tracking-tight">PACKSIFY</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  LINKS VAULT
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 hidden sm:block">
                Central Repository for CS & Growth Attributed Links
              </p>
            </div>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-400" />}
            </button>
            <button
              onClick={user.role === 'admin' ? onOpenNewAsset : onOpenAdminLogin}
              className="p-2 rounded-lg bg-blue-600 text-white shadow-sm"
              title={user.role === 'admin' ? 'Add Asset' : 'Admin Login'}
            >
              {user.role === 'admin' ? <Plus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Center: Robust Global Search Bar (Elegant Dark Pill Search) */}
        <div className="relative flex-1 max-w-lg mx-auto w-full">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-zinc-500 pointer-events-none" />
            <input
              id="global-search-input"
              type="text"
              value={filters.searchQuery}
              onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
              placeholder="Search by asset title, campaign, or UTM..."
              className="w-full bg-zinc-800 border-none rounded-full py-2 pl-10 pr-20 text-sm focus:ring-1 focus:ring-blue-500 outline-none text-zinc-200 placeholder-zinc-500 transition-all shadow-inner"
            />
            {filters.searchQuery ? (
              <button
                onClick={() => onFilterChange({ searchQuery: '' })}
                className="absolute right-3 p-1 rounded-full text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="absolute right-3 hidden sm:flex items-center gap-1 text-[10px] font-mono text-zinc-500 bg-zinc-700/60 px-1.5 py-0.5 rounded border border-zinc-600/40">
                <span>⌘K</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Quick actions, View Switcher & Admin Auth */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Quick UTM Builder Button */}
          <button
            id="utm-builder-nav-btn"
            onClick={onOpenUtmBuilder}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors"
            title="Create Custom UTM Link"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>UTM Builder</span>
          </button>

          {/* Quick Cheat Sheet Button */}
          <button
            id="cheat-sheet-nav-btn"
            onClick={onOpenCheatSheet}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors"
            title="CS Reference Cheat Sheet"
          >
            <Link2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>CS Cheat Sheet</span>
          </button>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-zinc-800 p-0.5 rounded-lg border border-zinc-700">
            <button
              onClick={() => onFilterChange({ viewMode: 'grid' })}
              className={`p-1.5 rounded-md transition-colors ${
                filters.viewMode === 'grid'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onFilterChange({ viewMode: 'table' })}
              className={`p-1.5 rounded-md transition-colors ${
                filters.viewMode === 'table'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Table View (CS Format)"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Add Asset (Admin Only) */}
          {user.role === 'admin' ? (
            <button
              id="add-new-asset-btn"
              onClick={onOpenNewAsset}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Asset</span>
            </button>
          ) : null}

          {/* Admin User Badge / Login Trigger */}
          <button
            id="admin-auth-trigger-btn"
            onClick={onOpenAdminLogin}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all border ${
              user.role === 'admin'
                ? 'bg-blue-600/10 text-blue-400 border-blue-500/30'
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
            }`}
          >
            {user.role === 'admin' ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>Admin</span>
              </>
            ) : (
              <>
                <LogIn className="w-3.5 h-3.5 text-zinc-400" />
                <span>Admin Login</span>
              </>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
