import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Zap, ArrowLeft } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) { toast.error("Please fill all fields"); return; }
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Login successful!");
      // navigate handled by auth state
    } catch {
      // Demo: simulate login
      const demoRole = email.includes("admin") ? "admin" : email.includes("affiliate") ? "affiliate" : "user";
      localStorage.setItem("accessToken", "demo-token");
      localStorage.setItem("refreshToken", "demo-refresh");
      localStorage.setItem("user", JSON.stringify({ id: "1", name: "Demo User", email, role: demoRole }));
      toast.success(`Logged in as ${demoRole} (demo)`);
      window.location.href = 
  demoRole === "admin" 
    ? "/admin/dashboard" 
    : demoRole === "affiliate" 
      ? "/affiliate/dashboard" 
      : "/dashboard";
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      <div className="w-full max-w-md relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 text-sm">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>
        <div className="glass-strong p-8 animate-scale-in">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center">
              <Zap className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">InnoSpace</span>
          </div>
          <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
          <p className="text-muted-foreground text-sm mb-6">Sign in to your account</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-secondary/50 border-glass-border" />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-secondary/50 border-glass-border" />
            </div>
            <Button type="submit" disabled={loading} className="w-full gradient-primary text-primary-foreground hover:opacity-90 h-11">
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account? <Link to="/register" className="text-primary hover:underline">Register</Link>
          </p>
          <p className="text-center text-xs text-muted-foreground mt-4">
            Demo: use admin@, affiliate@, or user@ in email
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
