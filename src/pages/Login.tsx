import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { API_BASE } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { SpotifyIcon } from "@/components/SpotifyIcon";
import { Music, Sparkles, Clock, Shield } from "lucide-react";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    // Redirect the browser to the hosted API endpoint that starts Spotify OAuth.
    // The backend should handle the OAuth handshake and redirect back.
    const loginUrl = `${API_BASE}/spotify/login`;
    window.location.href = loginUrl;
  };

  const features = [
    {
      icon: Music,
      title: "Manage Playlists",
      description: "View and organize all your curated playlists in one place.",
    },
    {
      icon: Sparkles,
      title: "Auto Cleanup",
      description: "Automatically remove tracks below your popularity threshold.",
    },
    {
      icon: Clock,
      title: "Scheduled Tasks",
      description: "Set custom intervals for automatic playlist maintenance.",
    },
    {
      icon: Shield,
      title: "Secure Access",
      description: "Your data stays safe with Spotify's official OAuth.",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left side - Hero */}
        <div className="text-center md:text-left animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-card rounded-full card-shadow mb-6">
            <img src="/logo.png" alt="MusiNova" className="h-4 w-4 object-contain" />
            <span className="text-sm font-medium text-muted-foreground">
              For Playlist Curators
            </span>
          </div>
          
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight">
            Keep your playlists{" "}
            <span className="text-primary">fresh & relevant</span>
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto md:mx-0">
            Automatically clean up your Spotify playlists by removing low-popularity 
            tracks on a schedule you define.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="p-4 bg-card/60 rounded-xl text-left animate-fade-in"
                  style={{ animationDelay: `${index * 100 + 200}ms` }}
                >
                  <Icon className="h-5 w-5 text-primary mb-2" />
                  <h3 className="font-medium text-foreground text-sm mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right side - Login Card */}
        <div
          className="bg-card rounded-2xl card-shadow p-8 md:p-10 animate-scale-in"
          style={{ animationDelay: "100ms" }}
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
              <img src="/logo.png" alt="MusiNova" className="h-12 w-12 object-contain" />
            </div>
            <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
              Welcome back
            </h2>
            <p className="text-muted-foreground">
              Sign in with your Spotify account to get started
            </p>
          </div>

          <Button
            variant="default"
            size="lg"
            className="w-full gap-3 shadow-lg hover:shadow-xl"
            onClick={handleLogin}
          >
            <SpotifyIcon className="h-5 w-5" />
            Continue with Spotify
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full mt-3"
            onClick={() => navigate("/pricing")}
          >
            Pricing
          </Button>

          <p className="text-xs text-center text-muted-foreground mt-6">
            By continuing, you agree to our Terms of Service and Privacy Policy.
            We only access your playlist data.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
