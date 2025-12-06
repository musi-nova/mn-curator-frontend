import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import apiRequest, { API_BASE } from "@/lib/api";

interface SubscriptionContextType {
  isPremium: boolean;
  subscribe: () => void;
  unsubscribe: () => void;
  refreshSubscription: () => Promise<boolean>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const token = localStorage.getItem("mn_access_token");
        if (token) {
          const me = await apiRequest(`${API_BASE}/user/me`, { token });
          if (me && me.id) {
            try {
              localStorage.setItem("mn_user", JSON.stringify(me));
            } catch (e) {}
            setIsPremium(!!me.paid);
            return;
          }
        }

        // fallback to local cache
        const raw = localStorage.getItem("mn_user");
        if (raw) {
          const me = JSON.parse(raw);
          setIsPremium(!!me.paid);
        }
      } catch (e) {
        // ignore
      }
    };

    init();
  }, []);

  const subscribe = () => {
    // Mock subscription - in real app this would be handled by payment provider
    setIsPremium(true);
    try {
      const raw = localStorage.getItem("mn_user");
      if (raw) {
        const me = JSON.parse(raw);
        me.paid = true;
        localStorage.setItem("mn_user", JSON.stringify(me));
      }
    } catch (e) {
      // ignore
    }
  };

  const unsubscribe = () => {
    setIsPremium(false);
    try {
      const raw = localStorage.getItem("mn_user");
      if (raw) {
        const me = JSON.parse(raw);
        me.paid = false;
        localStorage.setItem("mn_user", JSON.stringify(me));
      }
    } catch (e) {
      // ignore
    }
  };

  const refreshSubscription = useCallback(async () => {
    try {
      const token = localStorage.getItem("mn_access_token");
      if (!token) return false;
      const me = await apiRequest(`${API_BASE}/user/me`, { token });
      if (me && me.id) {
        try {
          localStorage.setItem("mn_user", JSON.stringify(me));
        } catch (e) {}
        setIsPremium(!!me.paid);
        return true;
      }
    } catch (e) {
      // ignore
    }
    return false;
  }, []);

  return (
    <SubscriptionContext.Provider value={{ isPremium, subscribe, unsubscribe, refreshSubscription }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
};
