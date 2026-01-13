
import React from 'react';

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
  // Content Formats
  REELS = 'Reels',
  CAROUSELS = 'Carousels',
}

export type Brand = 'Terribly Tiny Tales' | 'Dobara' | 'Fingertips' | 'Juice Box' | 'Personal' | 'Other';

export interface MediaItem {
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  contentType: 'Editorial' | 'Social' | 'Promotional';
  contentFormat: string;
  contentStyle: string;
  brand: Brand;
  imageUrl: string; // Keep as fallback/primary
  media?: MediaItem[]; // New: support for multiple assets
  date: string;
  instagramLink?: string;
  stats?: {
    value: string;
    label: string;
  }[];
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
