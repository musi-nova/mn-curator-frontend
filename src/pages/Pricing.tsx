import React from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Check, Sparkles, Zap, Shield, Clock } from "lucide-react";
import apiRequest, { API_BASE } from "@/lib/api";
import { useState } from "react";

const Pricing = () => {
  const { isPremium, subscribe } = useSubscription();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isPremium) {
      navigate("/dashboard");
    }
  }, [isPremium, navigate]);

  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      // If not authenticated, redirect to start the Spotify login flow
      const loginUrl = `${API_BASE}/spotify/login`;
      window.location.href = loginUrl;
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("mn_access_token");
      const res = await apiRequest(`/stripe/create-checkout-session`, {
        method: "POST",
        token: token || undefined,
      });

      const checkout = res.checkout_url || res.checkoutUrl || res.url;
      if (checkout) {
        window.location.href = checkout;
        return;
      }

      throw new Error("No checkout URL returned from server");
    } catch (err: any) {
      toast({
        title: "Checkout error",
        description: err?.message || "Unable to start checkout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: Zap,
      title: "Automatic Cleanup",
      description: "Set it and forget it. Your playlists stay fresh automatically.",
    },
    {
      icon: Clock,
      title: "Custom Scheduling",
      description: "Choose how often your playlists get cleaned up.",
    },
    {
      icon: Shield,
      title: "Popularity Control",
      description: "Set your own threshold for track removal.",
    },
    {
      icon: Sparkles,
      title: "All Playlists",
      description: "Works across all your Spotify playlists.",
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Hero */}
        <div className="text-center mb-12 animate-slide-up">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Keep Your Playlists Fresh
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Automatically remove unpopular tracks from your playlists. 
            One simple subscription, zero effort required.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="max-w-md mx-auto mb-16 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <div className="bg-card rounded-2xl card-shadow p-8 border-2 border-primary/20 relative overflow-hidden">
            {/* Badge */}
            <div className="absolute top-4 right-4">
              <span className="bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">
                Monthly
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold text-foreground">€20</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Cancel anytime. No hidden fees.
              </p>
            </div>

            {/* Features List */}
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3">
                <div className="p-1 rounded-full bg-primary/10">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <span className="text-foreground">Unlimited playlist cleanup</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="p-1 rounded-full bg-primary/10">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <span className="text-foreground">Customizable popularity threshold</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="p-1 rounded-full bg-primary/10">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <span className="text-foreground">Flexible scheduling (1-365 days)</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="p-1 rounded-full bg-primary/10">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <span className="text-foreground">Works with all your playlists</span>
              </li>
            </ul>

            {/* CTA Button */}
            {isPremium ? (
              <Button size="lg" className="w-full" disabled>
                <Check className="mr-2 h-5 w-5" />
                Already Subscribed
              </Button>
            ) : (
              <Button size="lg" className="w-full" onClick={handleSubscribe} disabled={loading}>
                <Sparkles className="mr-2 h-5 w-5" />
                {isAuthenticated ? (loading ? "Starting checkout..." : "Subscribe Now") : "Get Started"}
              </Button>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 animate-fade-in" style={{ animationDelay: "200ms" }}>
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="bg-card rounded-xl card-shadow p-6 flex gap-4"
              style={{ animationDelay: `${200 + index * 50}ms` }}
            >
              <div className="p-3 rounded-lg bg-primary/10 h-fit">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Pricing;
