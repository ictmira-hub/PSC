/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Layers, 
  Link2, 
  Video, 
  Megaphone, 
  Filter, 
  Sparkles, 
  FileText, 
  BarChart3, 
  RotateCcw, 
  SlidersHorizontal,
  FolderOpen,
  ArrowUpDown,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  LogIn
} from 'lucide-react';
import { AssetItem, FilterState, AdminUser, AssetType } from './types';
import { 
  subscribeToAssets, 
  createAssetDoc, 
  updateAssetDoc, 
  deleteAssetDoc, 
  getLocalCachedAssets,
  loginAdmin,
  logoutAdmin,
  fetchSession
} from './lib/api';
import { INITIAL_ASSETS } from './data/seedData';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { AssetCard } from './components/AssetCard';
import { AssetTable } from './components/AssetTable';
import { AssetModal } from './components/AssetModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { UtmBuilderModal } from './components/UtmBuilderModal';
import { QuickCheatSheetModal } from './components/QuickCheatSheetModal';
import { PreviewModal } from './components/PreviewModal';
import { QrModal } from './components/QrModal';
import { StatsModal } from './components/StatsModal';

export default function App() {
  // Application Data State
  const [assets, setAssets] = useState<AssetItem[]>(getLocalCachedAssets());
  const [loading, setLoading] = useState(true);

  // Admin User Role State. Defaults to viewer; the actual admin state is
  // confirmed against the server's signed session cookie on mount (see
  // effect below) rather than trusted from localStorage.
  const [user, setUser] = useState<AdminUser>({
    isAuthenticated: false,
    role: 'viewer',
  });

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    selectedType: 'all',
    selectedCategory: 'all',
    selectedCampaign: 'all',
    viewMode: 'grid',
    sortBy: 'recent',
  });

  // Dark Mode State
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return true; // Default to sleek dark mode matching the screenshots
  });

  // Modals State
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<AssetItem | null>(null);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isUtmBuilderOpen, setIsUtmBuilderOpen] = useState(false);
  const [isCheatSheetOpen, setIsCheatSheetOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [previewAsset, setPreviewAsset] = useState<AssetItem | null>(null);
  const [qrInfo, setQrInfo] = useState<{ url: string; title: string } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Show quick toast notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync Dark Mode with DOM
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Restore admin state from the server's signed session cookie (if any).
  useEffect(() => {
    fetchSession().then(setUser);
  }, []);

  // Subscribe to asset data (polled from the Postgres-backed API)
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToAssets(
      (data) => {
        setAssets(data);
        setLoading(false);
      },
      (error) => {
        console.warn('Firestore subscription notice:', error);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  // Keyboard shortcut for Search (⌘K or /)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const input = document.getElementById('global-search-input');
        input?.focus();
      } else if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        const input = document.getElementById('global-search-input');
        input?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle Admin Login — verified server-side against ADMIN_PASSWORD (env var)
  const handleAdminLogin = async (password: string, email?: string): Promise<boolean> => {
    const newUser = await loginAdmin(password, email);
    if (newUser) {
      setUser(newUser);
      showToast('Signed in as Authorized Admin');
      return true;
    }
    return false;
  };

  // Handle Admin Logout / Switch to Viewer
  const handleAdminLogout = async () => {
    await logoutAdmin();
    setUser({ isAuthenticated: false, role: 'viewer' });
    showToast('Switched to CS/Growth Team Viewer mode');
  };

  // Save / Add Asset
  const handleSaveAsset = async (asset: AssetItem) => {
    try {
      if (editingAsset) {
        await updateAssetDoc(asset.id, asset);
        showToast(`Updated "${asset.title}"`);
      } else {
        await createAssetDoc(asset);
        showToast(`Published "${asset.title}" to repository`);
      }
    } catch (e) {
      console.error('Save asset failed:', e);
      showToast('Saved locally');
    }
  };

  // Delete Asset
  const handleDeleteAsset = async (id: string) => {
    try {
      await deleteAssetDoc(id);
      showToast('Asset deleted');
    } catch (e) {
      console.error('Delete asset failed:', e);
    }
  };

  // Reset to default seed assets
  const handleResetDefaults = async () => {
    if (confirm('Reset repository to initial default Packsify links?')) {
      for (const asset of INITIAL_ASSETS) {
        await createAssetDoc(asset);
      }
      setAssets(INITIAL_ASSETS);
      showToast('Repository refreshed with default links');
    }
  };

  // Export JSON
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(assets, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `packsify-utm-repository-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Exported repository JSON');
  };

  // Extract unique campaigns
  const uniqueCampaigns = useMemo(() => {
    const set = new Set<string>();
    assets.forEach((a) => {
      if (a.campaignName) set.add(a.campaignName);
    });
    return Array.from(set).sort();
  }, [assets]);

  // Counts by Type
  const counts = useMemo(() => {
    return {
      all: assets.length,
      links_only: assets.filter((a) => a.type === 'links_only').length,
      video_image: assets.filter((a) => a.type === 'video_image').length,
      campaign_asset: assets.filter((a) => a.type === 'campaign_asset').length,
    };
  }, [assets]);

  // Filtered & Sorted Assets
  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      // Search query
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchTitle = asset.title.toLowerCase().includes(q);
        const matchCategory = asset.category.toLowerCase().includes(q);
        const matchCampaign = asset.campaignName?.toLowerCase().includes(q) || false;
        const matchCS = asset.csLink.toLowerCase().includes(q);
        const matchGrowth = asset.growthLink.toLowerCase().includes(q);
        const matchDesc = asset.description?.toLowerCase().includes(q) || false;
        const matchTags = asset.tags.some((t) => t.toLowerCase().includes(q));

        if (!matchTitle && !matchCategory && !matchCampaign && !matchCS && !matchGrowth && !matchDesc && !matchTags) {
          return false;
        }
      }

      // Asset Type
      if (filters.selectedType !== 'all' && asset.type !== filters.selectedType) {
        return false;
      }

      // Category / Channel
      if (filters.selectedCategory !== 'all' && asset.category !== filters.selectedCategory) {
        return false;
      }

      // Campaign
      if (filters.selectedCampaign !== 'all' && asset.campaignName !== filters.selectedCampaign) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      // Pinned items always stay on top
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;

      if (filters.sortBy === 'popular') {
        const aTotal = (a.copyCountCS || 0) + (a.copyCountGrowth || 0);
        const bTotal = (b.copyCountCS || 0) + (b.copyCountGrowth || 0);
        return bTotal - aTotal;
      }
      if (filters.sortBy === 'alpha') {
        return a.title.localeCompare(b.title);
      }
      return (b.createdAt || 0) - (a.createdAt || 0);
    });
  }, [assets, filters]);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-zinc-950 text-zinc-200' : 'bg-zinc-900 text-zinc-100'} flex flex-col font-sans transition-colors duration-200`}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 border border-blue-500/40 text-zinc-100 shadow-2xl text-xs font-semibold animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        filters={filters}
        onFilterChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))}
        user={user}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onOpenNewAsset={() => {
          setEditingAsset(null);
          setIsAssetModalOpen(true);
        }}
        onOpenUtmBuilder={() => setIsUtmBuilderOpen(true)}
        onOpenCheatSheet={() => setIsCheatSheetOpen(true)}
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode(!darkMode)}
        totalAssetsCount={assets.length}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto">
        
        {/* Left Sidebar Navigation */}
        <Sidebar
          filters={filters}
          onFilterChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))}
          counts={counts}
          campaigns={uniqueCampaigns}
          user={user}
          onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
          onOpenUtmBuilder={() => setIsUtmBuilderOpen(true)}
          onOpenCheatSheet={() => setIsCheatSheetOpen(true)}
          onOpenStats={() => setIsStatsOpen(true)}
          onOpenNewAsset={() => {
            setEditingAsset(null);
            setIsAssetModalOpen(true);
          }}
        />

        {/* Content Area */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          
          {/* Top Filter Bar & Subheader */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold tracking-tight text-zinc-100">
                  {filters.selectedType === 'all' && 'All Attributed Links & Assets'}
                  {filters.selectedType === 'links_only' && 'Links Only (App & Websites)'}
                  {filters.selectedType === 'video_image' && 'Video & Media Assets'}
                  {filters.selectedType === 'campaign_asset' && 'Campaign Assets'}
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-zinc-900 text-blue-400 border border-zinc-800">
                  {filteredAssets.length} {filteredAssets.length === 1 ? 'asset' : 'assets'}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                1-click copy buttons tailored for Customer Support (CS) and Growth Marketing
              </p>
            </div>

            {/* Quick Segmented Controls */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              {/* Sort selector */}
              <div className="flex items-center gap-1.5 text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-2">
                <ArrowUpDown className="w-3.5 h-3.5" />
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))}
                  className="bg-transparent text-zinc-200 focus:outline-none text-xs"
                >
                  <option value="recent" className="bg-zinc-900">Recently Added</option>
                  <option value="popular" className="bg-zinc-900">Most Copied</option>
                  <option value="alpha" className="bg-zinc-900">Alphabetical (A-Z)</option>
                </select>
              </div>

              {/* Reset seed button */}
              {user.role === 'admin' && (
                <button
                  onClick={handleResetDefaults}
                  className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
                  title="Reset Seed Links"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}

              {/* Export JSON */}
              <button
                onClick={handleExportJson}
                className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
                title="Export Links JSON"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 scrollbar-none text-xs">
            <button
              onClick={() => setFilters((prev) => ({ ...prev, selectedType: 'all', selectedCategory: 'all' }))}
              className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap font-medium transition-all ${
                filters.selectedType === 'all' && filters.selectedCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              All Assets ({counts.all})
            </button>
            <button
              onClick={() => setFilters((prev) => ({ ...prev, selectedType: 'links_only' }))}
              className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap font-medium transition-all flex items-center gap-1.5 ${
                filters.selectedType === 'links_only'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>Links Only ({counts.links_only})</span>
            </button>
            <button
              onClick={() => setFilters((prev) => ({ ...prev, selectedType: 'video_image' }))}
              className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap font-medium transition-all flex items-center gap-1.5 ${
                filters.selectedType === 'video_image'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Videos & Media ({counts.video_image})</span>
            </button>
            <button
              onClick={() => setFilters((prev) => ({ ...prev, selectedType: 'campaign_asset' }))}
              className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap font-medium transition-all flex items-center gap-1.5 ${
                filters.selectedType === 'campaign_asset'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              <Megaphone className="w-3.5 h-3.5" />
              <span>Campaign Kits ({counts.campaign_asset})</span>
            </button>

            {filters.selectedCategory !== 'all' && (
              <span className="px-2.5 py-1 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 font-semibold flex items-center gap-1">
                <span>Channel: {filters.selectedCategory.replace('_', ' ')}</span>
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, selectedCategory: 'all' }))}
                  className="hover:text-white"
                >
                  ×
                </button>
              </span>
            )}
          </div>

          {/* Asset List Rendering: Grid View vs Table View */}
          {assets.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-zinc-800 bg-zinc-900/60 my-6 max-w-2xl mx-auto shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-4">
                <FolderOpen className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-zinc-100 mb-2">
                Packsify Links Vault Ready
              </h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto mb-6 leading-relaxed">
                The repository is ready for your team's attributed links, marketing campaign assets, and walkthroughs.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {user.role === 'admin' ? (
                  <>
                    <button
                      onClick={() => {
                        setEditingAsset(null);
                        setIsAssetModalOpen(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add First Asset</span>
                    </button>
                    <button
                      onClick={() => setIsUtmBuilderOpen(true)}
                      className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <Sparkles className="w-4 h-4 text-blue-400" />
                      <span>Open UTM Builder</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsAdminLoginOpen(true)}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Admin Sign In to Add Assets</span>
                    </button>
                    <button
                      onClick={() => setIsCheatSheetOpen(true)}
                      className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <FileText className="w-4 h-4 text-emerald-400" />
                      <span>Open CS Cheat Sheet</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-zinc-800 bg-zinc-900/40 my-6">
              <FolderOpen className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-zinc-200 mb-1">
                No matching links found
              </h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto mb-4">
                Try adjusting your search terms or clearing your channel/campaign filters.
              </p>
              <button
                onClick={() =>
                  setFilters({
                    searchQuery: '',
                    selectedType: 'all',
                    selectedCategory: 'all',
                    selectedCampaign: 'all',
                    viewMode: 'grid',
                    sortBy: 'recent',
                  })
                }
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : filters.viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAssets.map((asset) => (
                <AssetCard
                  key={asset.id}
                  asset={asset}
                  user={user}
                  onEdit={(item) => {
                    setEditingAsset(item);
                    setIsAssetModalOpen(true);
                  }}
                  onDelete={handleDeleteAsset}
                  onOpenPreview={(item) => setPreviewAsset(item)}
                  onOpenQr={(url, title) => setQrInfo({ url, title })}
                />
              ))}
            </div>
          ) : (
            <AssetTable
              assets={filteredAssets}
              user={user}
              onEdit={(item) => {
                setEditingAsset(item);
                setIsAssetModalOpen(true);
              }}
              onDelete={handleDeleteAsset}
              onOpenPreview={(item) => setPreviewAsset(item)}
              onOpenQr={(url, title) => setQrInfo({ url, title })}
            />
          )}

        </main>
      </div>

      {/* Modals */}
      
      {/* 1. Add / Edit Asset Modal */}
      <AssetModal
        isOpen={isAssetModalOpen}
        onClose={() => {
          setIsAssetModalOpen(false);
          setEditingAsset(null);
        }}
        onSave={handleSaveAsset}
        initialAsset={editingAsset}
      />

      {/* 2. Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        user={user}
        onLogin={handleAdminLogin}
        onLogout={handleAdminLogout}
      />

      {/* 3. UTM Link Builder Modal */}
      <UtmBuilderModal
        isOpen={isUtmBuilderOpen}
        onClose={() => setIsUtmBuilderOpen(false)}
        onSaveAsAsset={
          user.role === 'admin'
            ? (title, csLink, growthLink, campaign) => {
                const newAsset: AssetItem = {
                  id: `asset-${Date.now()}`,
                  title,
                  type: 'links_only',
                  category: 'general',
                  campaignName: campaign || 'Custom Campaign',
                  csLink,
                  csLinkDescription: 'Generated CS Shortlink',
                  growthLink,
                  previewType: 'link_meta',
                  tags: ['Generated', 'UTM'],
                  pinned: false,
                  copyCountCS: 0,
                  copyCountGrowth: 0,
                  createdAt: Date.now(),
                  updatedAt: Date.now(),
                  createdBy: user.email || 'Admin',
                };
                createAssetDoc(newAsset);
                showToast(`Saved "${title}" to repository`);
              }
            : undefined
        }
      />

      {/* 4. Quick CS Cheat Sheet Modal */}
      <QuickCheatSheetModal
        isOpen={isCheatSheetOpen}
        onClose={() => setIsCheatSheetOpen(false)}
      />

      {/* 5. Lightbox Media Preview Modal */}
      <PreviewModal
        asset={previewAsset}
        isOpen={!!previewAsset}
        onClose={() => setPreviewAsset(null)}
        onOpenQr={(url, title) => setQrInfo({ url, title })}
      />

      {/* 6. QR Code Scanner Modal */}
      <QrModal
        isOpen={!!qrInfo}
        onClose={() => setQrInfo(null)}
        url={qrInfo?.url || ''}
        title={qrInfo?.title || ''}
      />

      {/* 7. Usage Analytics Modal (Admin Only) */}
      {user.role === 'admin' && (
        <StatsModal
          isOpen={isStatsOpen}
          onClose={() => setIsStatsOpen(false)}
          assets={assets}
        />
      )}

    </div>
  );
}
