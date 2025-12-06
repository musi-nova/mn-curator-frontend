export interface Playlist {
  id: string;
  name: string;
  description?: string;
  trackCount: number;
  imageUrl?: string;
  external_url?: string;
  owner?: string;
  isPublic: boolean;
  lastUpdated: string;
}

export interface UserSettings {
  popularityThreshold: number;
  cleanupDays: number;
  schedulingEnabled: boolean;
}

export const defaultSettings: UserSettings = {
  popularityThreshold: 30,
  cleanupDays: 30,
  schedulingEnabled: false,
};
