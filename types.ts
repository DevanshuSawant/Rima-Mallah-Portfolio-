export enum SectionType {
  TYPE = 'Content Type',
  FORMAT = 'Content Format'
}

export enum TabId {
  // Content Types
  EDITORIAL = 'Editorial',
  SOCIAL = 'Social',
  PROMOTIONAL = 'Promotional',

  // Content Formats
  MUSINGS = 'Musings',
  REELS = 'Reels',
  CAROUSELS = 'Carousels',
  SCRIPTS = 'Scripts'
}

export type Brand = 'Terribly Tiny Tales' | 'Dobara' | 'Fingertips' | 'Juice Box' | 'Personal' | 'Other';

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  contentType: 'Editorial' | 'Social' | 'Promotional';
  contentFormat: string; // e.g., 'Static Musing', 'Animated Reel', 'Vox Pop'
  contentStyle: string; // Adjective e.g., 'Witty', 'Emotional'
  brand: Brand;
  imageUrl: string;
  date: string;
  instagramLink?: string;
  stats?: {
    value: string;
    label: string;
  };
}

export interface TabConfig {
  id: TabId;
  label: string;
  icon?: React.ReactNode;
  subFilters?: string[];
}

export interface SectionConfig {
  id: SectionType;
  tabs: TabConfig[];
}