import React from "react";
import { Header } from "@/components/Header";
import { useSettings } from "@/contexts/SettingsContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Save, TrendingDown, Calendar, Info, Power, Lock, Crown } from "lucide-react";
import apiRequest, { API_BASE } from "@/lib/api";

const Settings = () => {
  const { settings, updateSettings } = useSettings();
  const { isPremium } = useSubscription();
  const navigate = useNavigate();
  const [localSettings, setLocalSettings] = React.useState(settings);

  React.useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSave = () => {
    updateSettings(localSettings);
    toast({
      title: "Settings saved",
      description: "Your cleanup preferences have been updated.",
    });
  };

  const handleSchedulingToggle = (enabled: boolean) => {
    if (!isPremium && enabled) {
      toast({
        title: "Premium required",
        description: "Subscribe to enable automatic scheduling.",
      });
      navigate("/pricing");
      return;
    }
    setLocalSettings((prev) => ({ ...prev, schedulingEnabled: enabled }));
  };

  const [portalLoading, setPortalLoading] = React.useState(false);

  const openCustomerPortal = async () => {
    setPortalLoading(true);
    try {
      const token = localStorage.getItem("mn_access_token");
      const res = await apiRequest(`/stripe/customer-portal`, {
        method: "GET",
        token: token || undefined,
      });
      const url = res.url || res.portalUrl || res.portal_url;
      if (url) {
        window.location.href = url;
        return;
      }
      throw new Error("No portal URL returned");
    } catch (err: any) {
      toast({
        title: "Portal error",
        description: err?.message || "Unable to open customer portal",
        variant: "destructive",
      });
    } finally {
      setPortalLoading(false);
    }
  };

  const hasChanges =
    localSettings.popularityThreshold !== settings.popularityThreshold ||
    localSettings.cleanupDays !== settings.cleanupDays ||
    localSettings.schedulingEnabled !== settings.schedulingEnabled;

  return (
    <div className="min-h-screen">
      <Header />
      {!isPremium && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="max-w-lg w-full p-8 bg-card rounded-2xl card-shadow text-center">
            <Lock className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Premium Feature</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Subscribe to enable automatic scheduling and other premium features.
            </p>
            <div className="flex justify-center gap-3">
              <Button size="sm" onClick={() => navigate("/pricing")}>
                <Crown className="mr-2 h-4 w-4" />
                View Pricing
              </Button>
              <Button size="sm" variant="ghost" onClick={() => navigate(-1)}>
                Back
              </Button>
            </div>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8 animate-slide-up flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Cleanup Settings
            </h1>
            <p className="text-muted-foreground">
              Configure how your playlists should be automatically cleaned up
            </p>
          </div>
          {/* Save Button */}
          <div
            className="flex justify-end animate-fade-in"
            style={{ animationDelay: "300ms" }}
          >
            <Button
              size="lg"
              onClick={handleSave}
              disabled={!hasChanges}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              Save Settings
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Scheduling Toggle */}
          <div className="bg-card rounded-xl card-shadow p-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-spotify/10">
                  <Power className="h-5 w-5 text-spotify" />
                </div>
                <div>
                  <Label className="text-base font-semibold text-foreground">
                    Enable Automatic Scheduling
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Turn on to automatically clean your playlists on schedule
                  </p>
                </div>
              </div>
              <Switch
                checked={localSettings.schedulingEnabled}
                onCheckedChange={handleSchedulingToggle}
                disabled={!isPremium}
              />
            </div>
          </div>

          {/* Popularity Threshold */}
          <div
            className="bg-card rounded-xl card-shadow p-6 animate-fade-in"
            style={{ animationDelay: "100ms" }}
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 rounded-lg bg-primary/10">
                <TrendingDown className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <Label className="text-base font-semibold text-foreground">
                  Track Popularity Threshold
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Tracks with popularity below this percentage will be removed
                  from your playlists.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">0%</span>
                <span className="text-2xl font-bold text-primary">
                  {localSettings.popularityThreshold}%
                </span>
                <span className="text-sm text-muted-foreground">100%</span>
              </div>
              <Slider
                value={[localSettings.popularityThreshold]}
                onValueChange={([value]) =>
                  setLocalSettings((prev) => ({
                    ...prev,
                    popularityThreshold: value,
                  }))
                }
                max={100}
                step={1}
                className="w-full"
              />
              <div className="flex items-start gap-2 p-3 bg-muted rounded-lg">
                <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  Spotify popularity is a 0-100 score based on how many plays a
                  track has had recently. Higher values mean more popular tracks.
                </p>
              </div>
            </div>
          </div>

          {/* Cleanup Days */}
          <div
            className="bg-card rounded-xl card-shadow p-6 animate-fade-in"
            style={{ animationDelay: "200ms" }}
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 rounded-lg bg-accent/20">
                <Calendar className="h-5 w-5 text-accent" />
              </div>
              <div className="flex-1">
                <Label className="text-base font-semibold text-foreground">
                  Cleanup Interval
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  How often the scheduler should check and clean your playlists.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Input
                type="number"
                min={1}
                max={365}
                value={localSettings.cleanupDays}
                onChange={(e) =>
                  setLocalSettings((prev) => ({
                    ...prev,
                    cleanupDays: Math.max(
                      1,
                      Math.min(365, parseInt(e.target.value) || 1)
                    ),
                  }))
                }
                className="w-24 text-center text-lg font-semibold"
              />
              <span className="text-muted-foreground">days</span>
            </div>
          </div>
          {isPremium && (
            <div className="mt-2">
              <Button onClick={openCustomerPortal} disabled={portalLoading} className="gap-2">
                Manage Subscription
              </Button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Settings;
