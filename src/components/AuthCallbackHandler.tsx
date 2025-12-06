import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const AuthCallbackHandler = () => {
  const { search, pathname } = useLocation();
  const navigate = useNavigate();
  const { authenticateWithToken } = useAuth();

  useEffect(() => {
    if (pathname !== "/dashboard") return; // only run on dashboard callback
    const params = new URLSearchParams(search);
    const token = params.get("token");

    const run = async () => {
      if (!token) {
        // No token in query, check localStorage
        const stored = localStorage.getItem("mn_access_token");
        if (stored) {
          const ok = await authenticateWithToken(stored);
          if (ok) {
            navigate("/dashboard", { replace: true });
            return;
          }
        }
        navigate("/", { replace: true });
        return;
      }

      const success = await authenticateWithToken(token);
      if (success) {
        toast({ title: "Signed in", description: "Welcome back!" });
        navigate("/dashboard", { replace: true });
      } else {
        toast({ title: "Sign in failed", description: "Unable to verify token", variant: "destructive" });
        navigate("/", { replace: true });
      }
    };

    run();
  }, [search, navigate, authenticateWithToken]);

  return null;
};

export default AuthCallbackHandler;
