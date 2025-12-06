import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Button } from "@/components/ui/button";
import { Settings, LayoutDashboard, LogOut, CreditCard, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: "/dashboard", label: "Playlists", icon: LayoutDashboard },
    { path: "/settings", label: "Settings", icon: Settings },
    { path: "/pricing", label: "Pricing", icon: CreditCard },
  ];

  const { isPremium } = useSubscription();

  return (
    <header className="sticky top-0 z-50 w-full bg-card/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* If user is not logged in, show a simple back button */}
          {!user ? (
            <div className="flex items-center">
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            // ...existing header when user is present
            <>
              <Link to="/dashboard" className="flex items-center gap-2 group">
                <div className="p-1 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <img src="/logo.png" alt="MusiNova Curator" className="h-5 w-5 object-contain" />
                </div>
                <span className="font-display text-xl font-semibold text-foreground">
                  MusiNova Curator
                </span>
              </Link>

              <nav className="hidden md:flex items-center gap-1">
                {navItems.map((item) => {
                  if (isPremium && item.path === "/pricing") return null;
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link key={item.path} to={item.path}>
                      <Button
                        variant="ghost"
                        className={cn(
                          "gap-2",
                          isActive && "bg-accent text-accent-foreground"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Button>
                    </Link>
                  );
                })}
              </nav>

              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2">
                  <div
                    role="img"
                    aria-label={`User ${user.displayName}`}
                    className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary"
                  >
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {user.displayName}
                  </span>
                </div>
                <Button variant="ghost" size="icon" onClick={logout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
