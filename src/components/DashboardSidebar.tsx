import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard, Users, BookOpen, ClipboardCheck, Wallet, User, LogOut, Zap, Trophy, Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const internLinks = [
  { to: "/intern", icon: LayoutDashboard, label: "Overview" },
  { to: "/intern/registrations", icon: ClipboardCheck, label: "My Registrations" },
  { to: "/intern/leaderboard", icon: Trophy, label: "Leaderboard" },
  { to: "/intern/wallet", icon: Wallet, label: "Wallet" },
  { to: "/intern/profile", icon: User, label: "Profile" },
];

const adminLinks = [
  { to: "/admin", icon: LayoutDashboard, label: "Overview" },
  { to: "/admin/programs", icon: BookOpen, label: "Programs" },
  { to: "/admin/registrations", icon: ClipboardCheck, label: "Registrations" },
  { to: "/admin/approvals", icon: ClipboardCheck, label: "Approvals" },
  { to: "/admin/users", icon: Users, label: "Users" },
  { to: "/admin/settings", icon: Settings, label: "Settings" },
];

const userLinks = [
  { to: "/dashboard", icon: LayoutDashboard, label: "My Programs" },
  { to: "/dashboard/profile", icon: User, label: "Profile" },
];

const DashboardSidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const links = user?.role === "admin" ? adminLinks : user?.role === "intern" ? internLinks : userLinks;

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col z-40">
      <div className="p-4 border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-sidebar-foreground">InnoSpace</span>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const active = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "gradient-primary text-primary-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-sidebar-foreground">{user?.name}</p>
            <p className="text-xs text-sidebar-foreground/50 capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-destructive/10 hover:text-destructive transition-colors w-full"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
