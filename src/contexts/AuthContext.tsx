import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";
import apiRequest, { API_BASE } from "@/lib/api";

interface User {
  id: string;
  displayName: string;
  email: string;
  imageUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  authenticateWithToken: (token: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = () => {
    // Mock login - in real app this would trigger Spotify OAuth
    setUser({
      id: "mock_user_123",
      displayName: "Spotify Curator",
      email: "curator@example.com",
      imageUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
    });
  };

  const logout = () => {
    try {
      localStorage.clear();
    } catch (e) {
      // ignore
    }
    setUser(null);
  };

  const authenticateWithToken = useCallback(async (token: string) => {
    try {
      // Save token to localStorage so subsequent API calls can use it
      try {
        localStorage.setItem("mn_access_token", token);
      } catch (e) {
        // ignore storage errors
      }

      // Verify token by calling /user/me on the API
      const me = await apiRequest(`${API_BASE}/user/me`, { token });
      // Basic shape checking
      if (me && me.id) {
        // Persist full user payload for hydration
        try {
          localStorage.setItem("mn_user", JSON.stringify(me));
          if (me.access_token) {
            localStorage.setItem("mn_access_token", me.access_token);
          }
        } catch (e) {
          // ignore
        }

        setUser({
          id: me.id,
          displayName: me.display_name || me.displayName || me.name || "",
          email: me.email || "",
          imageUrl: me.imageUrl || me.avatar || "",
        });
        return true;
      }
    } catch (err) {
      // clear token on failure
      try {
        localStorage.removeItem("mn_access_token");
      } catch (e) {}
    }
    return false;
  }, []);

  // Hydrate user from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem("mn_user");
      if (raw) {
        const me = JSON.parse(raw);
        if (me && me.id) {
          setUser({
            id: me.id,
            displayName: me.display_name || me.displayName || me.name || "",
            email: me.email || "",
            imageUrl: me.imageUrl || me.avatar || "",
          });
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        authenticateWithToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
