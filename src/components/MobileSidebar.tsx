import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard, Users, BookOpen, ClipboardCheck, Wallet, User, LogOut, Zap, Trophy, Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const affiliateLinks = [
  { to: "/affiliate", icon: LayoutDashboard, label: "Overview" },
  { to: "/affiliate/registrations", icon: ClipboardCheck, label: "My Registrations" },
  { to: "/affiliate/leaderboard", icon: Trophy, label: "Leaderboard" },
  { to: "/affiliate/wallet", icon: Wallet, label: "Wallet" },
  { to: "/affiliate/profile", icon: User, label: "Profile" },
];

const adminLinks = [
  { to: "/admin", icon: LayoutDashboard, label: "Overview" },
  { to: "/admin/programs", icon: BookOpen, label: "Programs" },
  { to: "/admin/registrations", icon: ClipboardCheck, label: "Registrations" },
  { to: "/admin/approvals", icon: ClipboardCheck, label: "Approvals" },
  { to: "/admin/users", icon: Users, label: "Users" },
  { to: "/admin/settings", icon: Settings, label: "Settings" },
];

const MobileSidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const links = user?.role === "admin" ? adminLinks : user?.role === "affiliate" ? affiliateLinks : [];

  if (!user) return null;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold">InnoSpaceX</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const active = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors touch-min",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <link.icon className="h-5 w-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-border space-y-3">
        {/* User Info */}
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-secondary/50">
          <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.email}</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors w-full touch-min"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default MobileSidebar;