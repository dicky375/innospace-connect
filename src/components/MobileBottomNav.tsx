import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, BookOpen, Wallet, User, LogOut, Users, Settings, ClipboardCheck, Trophy } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const MobileBottomNav = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  if (!user) return null;

  const links = user?.role === "admin" ? [
    { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/admin/registrations", icon: BookOpen, label: "Registrations" },
    { path: "/admin/users", icon: Users, label: "Users" },
    { path: "/admin/settings", icon: Settings, label: "Settings" },
  ] : [
    { path: "/affiliate", icon: LayoutDashboard, label: "Home" },
    { path: "/affiliate/registrations", icon: ClipboardCheck, label: "Registrations" },
    { path: "/affiliate/leaderboard", icon: Trophy, label: "Leaderboard" },
    { path: "/affiliate/wallet", icon: Wallet, label: "Wallet" },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-40 flex items-center justify-around h-16 safe-bottom px-2">
      {links.map((link) => {
        const Icon = link.icon;
        const active = isActive(link.path);
        return (
          <Link
            key={link.path}
            to={link.path}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 text-xs transition-colors touch-min px-2 py-1 rounded-lg",
              active ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="text-[10px]">{link.label}</span>
          </Link>
        );
      })}
      <button
        onClick={logout}
        className="flex flex-col items-center justify-center gap-0.5 text-xs text-muted-foreground transition-colors hover:text-destructive touch-min px-2 py-1 rounded-lg"
      >
        <LogOut className="h-5 w-5" />
        <span className="text-[10px]">Logout</span>
      </button>
    </nav>
  );
};

export default MobileBottomNav;