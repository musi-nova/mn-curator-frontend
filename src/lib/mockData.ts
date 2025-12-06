export interface Playlist {
  id: string;
  name: string;
  description: string;
  trackCount: number;
  imageUrl: string;
  owner: string;
  isPublic: boolean;
  lastUpdated: string;
}

export const mockPlaylists: Playlist[] = [
  {
    id: "1",
    name: "Chill Vibes",
    description: "Perfect for relaxing evenings",
    trackCount: 47,
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
    owner: "spotify_curator",
    isPublic: true,
    lastUpdated: "2024-01-15",
  },
  {
    id: "2",
    name: "Workout Energy",
    description: "High-energy tracks to fuel your workout",
    trackCount: 82,
    imageUrl: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=300&h=300&fit=crop",
    owner: "spotify_curator",
    isPublic: true,
    lastUpdated: "2024-01-10",
  },
  {
    id: "3",
    name: "Focus Flow",
    description: "Instrumental music for deep concentration",
    trackCount: 35,
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    owner: "spotify_curator",
    isPublic: false,
    lastUpdated: "2024-01-12",
  },
  {
    id: "4",
    name: "Indie Discoveries",
    description: "Hidden gems from indie artists",
    trackCount: 63,
    imageUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop",
    owner: "spotify_curator",
    isPublic: true,
    lastUpdated: "2024-01-08",
  },
  {
    id: "5",
    name: "Late Night Jazz",
    description: "Smooth jazz for late night sessions",
    trackCount: 29,
    imageUrl: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=300&h=300&fit=crop",
    owner: "spotify_curator",
    isPublic: true,
    lastUpdated: "2024-01-05",
  },
  {
    id: "6",
    name: "Electronic Dreams",
    description: "Best of electronic and EDM",
    trackCount: 94,
    imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop",
    owner: "spotify_curator",
    isPublic: true,
    lastUpdated: "2024-01-03",
  },
];

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
