import React, { useState, useMemo } from "react";
import { Playlist } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Music, Globe, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import apiRequest from "@/lib/api";
// tooltip removed — titles now link directly when external_url is present

interface Track {
  id: string;
  name: string;
  artists: string[];
  album_name?: string;
  duration_ms?: number;
  popularity?: number;
  external_url?: string;
  image_url?: string;
  added_at?: string;
}

interface PlaylistTableProps {
  playlists: Playlist[];
}

function formatDuration(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export const PlaylistTable = ({ playlists }: PlaylistTableProps) => {
  const [open, setOpen] = useState(false);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loadingTracks, setLoadingTracks] = useState(false);
  const [title, setTitle] = useState("");

  const avgPopularity = useMemo(() => {
    if (!tracks || tracks.length === 0) return null;
    const vals = tracks.map((t) => t.popularity).filter((p) => typeof p === "number") as number[];
    if (vals.length === 0) return null;
    const sum = vals.reduce((s, v) => s + v, 0);
    return Math.round(sum / vals.length);
  }, [tracks]);

  const avgDuration = useMemo(() => {
    if (!tracks || tracks.length === 0) return null;
    const vals = tracks.map((t) => t.duration_ms).filter((d) => typeof d === "number") as number[];
    if (vals.length === 0) return null;
    const sum = vals.reduce((s, v) => s + v, 0);
    return Math.round(sum / vals.length);
  }, [tracks]);

  const openTracks = async (playlistId: string, playlistName: string) => {
    setTitle(playlistName);
    setOpen(true);
    setLoadingTracks(true);
    try {
      const token = localStorage.getItem("mn_access_token");
      const res = await apiRequest(`/spotify/playlists/${playlistId}/tracks`, { token: token || undefined });
        if (res && Array.isArray(res.tracks)) {
        setTracks(
          res.tracks.map((t: any) => ({
            id: t.id,
            name: t.name,
            artists: Array.isArray(t.artists)
              ? // artists might be objects or strings
                t.artists.map((a: any) => (typeof a === "string" ? a : a.name))
              : [],
            album_name: t.album_name || (t.album && t.album.name) || "",
            duration_ms: t.duration_ms,
            popularity: typeof t.popularity === "number" ? t.popularity : t.popularity_score ?? undefined,
            external_url: t.external_url || (t.external_urls && t.external_urls.spotify) || undefined,
            image_url:
              t.image_url || (t.album && t.album.images && t.album.images[0] && t.album.images[0].url) || undefined,
            added_at: t.added_at || t.addedAt || undefined,
          })),
        );
      } else {
        setTracks([]);
      }
    } catch (e) {
      setTracks([]);
    } finally {
      setLoadingTracks(false);
    }
  };

  return (
    <div className="bg-card rounded-xl card-shadow overflow-hidden animate-fade-in">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="w-[80px]"></TableHead>
            <TableHead className="font-semibold">Playlist</TableHead>
            <TableHead className="font-semibold hidden md:table-cell">
              Description
            </TableHead>
            <TableHead className="font-semibold text-center">Tracks</TableHead>
            <TableHead className="font-semibold text-center hidden sm:table-cell">
              Visibility
            </TableHead>
            <TableHead className="font-semibold text-right hidden lg:table-cell">
              Last Updated
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {playlists.map((playlist, index) => (
            <TableRow
              key={playlist.id}
              className="border-border hover:bg-muted/50 transition-colors cursor-pointer group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <TableCell className="py-3">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted">
                  {playlist.imageUrl ? (
                    <img
                      src={playlist.imageUrl}
                      alt={playlist.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Music className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                  {playlist.external_url ? (
                    <a href={playlist.external_url} target="_blank" rel="noreferrer" className="hover:underline relative z-10 inline-block">
                      {playlist.name}
                    </a>
                  ) : (
                    playlist.name
                  )}
                </div>
                <div className="text-sm text-muted-foreground md:hidden">
                  {playlist.trackCount} tracks
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <span className="text-muted-foreground text-sm line-clamp-2">
                  {playlist.description}
                </span>
              </TableCell>
              <TableCell className="text-center">
                <Button size="sm" variant="ghost" onClick={() => openTracks(playlist.id, playlist.name)}>
                  <span className="font-medium">{playlist.trackCount}</span>
                </Button>
              </TableCell>
              <TableCell className="text-center hidden sm:table-cell">
                <Badge
                  variant={playlist.isPublic ? "default" : "secondary"}
                  className="gap-1"
                >
                  {playlist.isPublic ? (
                    <>
                      <Globe className="h-3 w-3" />
                      Public
                    </>
                  ) : (
                    <>
                      <Lock className="h-3 w-3" />
                      Private
                    </>
                  )}
                </Badge>
              </TableCell>
              <TableCell className="text-right hidden lg:table-cell">
                <span className="text-sm text-muted-foreground">
                  {new Date(playlist.lastUpdated).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    
      <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent className="max-w-5xl w-[80%] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Tracks — {title}</DialogTitle>
            <DialogDescription>
              {loadingTracks ? "Loading tracks..." : `Showing ${tracks.length} tracks`}
              {avgPopularity !== null && !loadingTracks ? (
                <span className="ml-4 text-sm text-muted-foreground">Avg popularity: {avgPopularity}</span>
              ) : null}
              {avgDuration !== null && !loadingTracks ? (
                <span className="ml-4 text-sm text-muted-foreground">Avg duration: {formatDuration(avgDuration)}</span>
              ) : null}
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-auto max-h-[60vh] mt-4">
            <table className="w-full text-left">
              <thead>
                  <tr>
                    <th className="pb-2"></th>
                    <th className="pb-2">#</th>
                    <th className="pb-2">Title</th>
                    <th className="pb-2">Popularity</th>
                    <th className="pb-2">Artists</th>
                    <th className="pb-2">Album</th>
                    <th className="pb-2">Added</th>
                  </tr>
                </thead>
              <tbody>
                {tracks.map((t, i) => (
                  <tr key={t.id} className="border-t">
                    <td className="py-2 align-top w-16">
                      {t.image_url ? (
                        <img
                          src={t.image_url}
                          alt={t.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                          <Music className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                    </td>
                    <td className="py-2 align-top text-sm text-muted-foreground">{i + 1}</td>
                    <td className="py-2 align-top">
                      <a href={t.external_url} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                        {t.name}
                      </a>
                    </td>
                    <td className="py-2 align-top">{typeof t.popularity === 'number' ? t.popularity : '-'}</td>
                    <td className="py-2 align-top">{t.artists.join(", ")}</td>
                    <td className="py-2 align-top">{t.album_name}</td>
                    <td className="py-2 align-top">{t.added_at ? Math.max(0, Math.floor((Date.now() - new Date(t.added_at).getTime()) / (1000 * 60 * 60 * 24))) + 'd' : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};
