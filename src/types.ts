export type AssetType = 'links_only' | 'video_image' | 'campaign_asset';

export type ChannelCategory =
  | 'discord'
  | 'intercom'
  | 'app_store'
  | 'google_play'
  | 'trustpilot'
  | 'help_center'
  | 'blog'
  | 'social_ads'
  | 'influencer'
  | 'general';

export interface UtmParameters {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
}

export interface AssetItem {
  id: string;
  title: string;
  type: AssetType;
  category: ChannelCategory | string;
  campaignName?: string;
  csLink: string;
  csLinkDescription?: string;
  growthLink: string;
  growthUtmParams?: UtmParameters;
  previewUrl?: string;
  previewType?: 'image' | 'video' | 'link_meta' | 'none';
  videoEmbedUrl?: string;
  description?: string;
  tags: string[];
  pinned?: boolean;
  copyCountCS: number;
  copyCountGrowth: number;
  createdAt: number;
  updatedAt: number;
  createdBy?: string;
}

export type ViewMode = 'grid' | 'table';

export interface FilterState {
  searchQuery: string;
  selectedType: 'all' | AssetType;
  selectedCategory: 'all' | string;
  selectedCampaign: 'all' | string;
  viewMode: ViewMode;
  sortBy: 'recent' | 'popular' | 'alpha' | 'title';
}

export interface AdminUser {
  isAuthenticated: boolean;
  role: 'admin' | 'viewer';
  email?: string;
  displayName?: string;
}
