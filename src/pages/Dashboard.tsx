import React from "react";
import { Header } from "@/components/Header";
import { PlaylistTable } from "@/components/PlaylistTable";
import { Playlist } from "@/lib/types";
import { useEffect, useState } from "react";
import apiRequest from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import { Music, TrendingDown, Calendar, AlertCircle } from "lucide-react";

const Dashboard = () => {
  const { settings } = useSettings();
  const { logout } = useAuth();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchPlaylists = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("mn_access_token");
        const res = await apiRequest(`/spotify/playlists`, { token: token || undefined });
        if (mounted && res && Array.isArray(res.playlists)) {
          setPlaylists(
            res.playlists.map((p: any) => ({
              id: p.id,
              name: p.name,
              description: p.description || "",
                  trackCount: p.total_tracks ?? p.tracks?.total ?? p.trackCount ?? 0,
                  external_url: p.external_url || (p.external_urls && p.external_urls.spotify) || undefined,
              isPublic: p.is_public ?? p.public ?? true,
              imageUrl: p.image_url || (p.images && p.images[0] ? p.images[0].url : undefined),
              lastUpdated: p.updated_at || p.last_updated || new Date().toISOString(),
            }))
          );
        }
      } catch (err: any) {
        // If auth failed (401) sign the user out
        if (err && err.status === 401) {
          try {
            logout();
          } catch (e) {
            // ignore
          }
        }
        setError(err?.message || "Failed to load playlists");
        setPlaylists([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchPlaylists();
    return () => {
      mounted = false;
    };
  }, []);

  const stats = [
    {
      icon: Music,
      label: "Total Playlists",
      value: playlists.length,
      color: "text-primary",
    },
    {
      icon: TrendingDown,
      label: "Popularity Threshold",
      value: `${settings.popularityThreshold}%`,
      color: "text-accent",
    },
    {
      icon: Calendar,
      label: "Cleanup Interval",
      value: `${settings.cleanupDays} days`,
      color: "text-secondary-foreground",
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-slide-up">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            Your Playlists
          </h1>
          <p className="text-muted-foreground">
            Manage and monitor all your curated playlists
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-card rounded-xl card-shadow p-5 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg bg-muted ${stat.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-semibold text-foreground">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Playlist Table */}
        <PlaylistTable playlists={playlists} />
      </main>
    </div>
  );
};

export default Dashboard;
