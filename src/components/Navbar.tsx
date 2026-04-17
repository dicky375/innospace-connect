import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Zap, Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const dashboardPath = user?.role === "admin" ? "/admin" : user?.role === "affiliate" ? "/affiliate" : "/dashboard";

  return (
    <nav className="fixed top-0 w-full z-50 glass-strong">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">InnoSpace Affiliate Program</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link to={dashboardPath}>
                <Button variant="ghost" className="text-foreground hover:text-primary">Dashboard</Button>
              </Link>
              <Button onClick={logout} variant="ghost" className="text-muted-foreground hover:text-foreground">Logout</Button>
            </>
          ) : (
            <>
              <Link to="/login"><Button variant="ghost" className="text-foreground hover:text-primary">Login</Button></Link>
              <Link to="/register"><Button className="gradient-primary text-primary-foreground hover:opacity-90">Register Now</Button></Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {mobileOpen && (
        <div className="md:hidden glass-strong border-t border-border px-4 py-4 space-y-2">
          {isAuthenticated ? (
            <>
              <Link to={dashboardPath} onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">Dashboard</Button>
              </Link>
              <Button onClick={() => { logout(); setMobileOpen(false); }} variant="ghost" className="w-full justify-start text-muted-foreground">Logout</Button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)}><Button variant="ghost" className="w-full justify-start">Login</Button></Link>
              <Link to="/register" onClick={() => setMobileOpen(false)}><Button className="w-full gradient-primary text-primary-foreground">Register Now</Button></Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
