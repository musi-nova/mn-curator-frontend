import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { UserSettings, defaultSettings } from "@/lib/types";
import apiRequest from "@/lib/api";

interface SettingsContextType {
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const token = localStorage.getItem("mn_access_token");
        if (!token) return;
        const res = await apiRequest(`/user/schedule-settings`, { token });
        if (mounted && res) {
          // Map server snake_case fields to our camelCase UserSettings
          const mapped: Partial<UserSettings> = {};
          if (typeof res.popularity_threshold === "number") mapped.popularityThreshold = res.popularity_threshold;
          if (typeof res.clean_up_interval_days === "number") mapped.cleanupDays = res.clean_up_interval_days;
          if (typeof res.active === "boolean") mapped.schedulingEnabled = !!res.active;
          setSettings((prev) => ({ ...prev, ...mapped }));
        }
      } catch (e) {
        // ignore
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    try {
      const token = localStorage.getItem("mn_access_token");
      if (token) {
        // Convert camelCase to snake_case expected by server
        const body: any = {};
        if (typeof newSettings.popularityThreshold === "number") body.popularity_threshold = newSettings.popularityThreshold;
        if (typeof newSettings.cleanupDays === "number") body.clean_up_interval_days = newSettings.cleanupDays;
        if (typeof newSettings.schedulingEnabled === "boolean") body.active = newSettings.schedulingEnabled;
        apiRequest(`/user/schedule-settings`, { method: "PUT", token, body });
      }
    } catch (e) {
      // ignore
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
