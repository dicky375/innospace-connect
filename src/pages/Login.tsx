// src/pages/Login.tsx
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
    if (!email.trim() || !password.trim()) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      await login(email, password);
      toast.success("Login successful!");
      // Real login will handle redirect via AuthContext
    } catch {
      // Demo Mode
      const demoRole = email.includes("admin") ? "admin" : "affiliate";

      localStorage.setItem("accessToken", "demo-token");
      localStorage.setItem("user", JSON.stringify({
        id: "1",
        name: demoRole === "admin" ? "Admin User" : "Affiliate User",
        email,
        role: demoRole
      }));

      toast.success(`Logged in as ${demoRole} (Demo)`);

      // Clean redirect
      window.location.href = demoRole === "admin" ? "/admin" : "/affiliate";
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <div className="glass-strong p-8 rounded-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
              <Zap className="h-7 w-7 text-white" />
            </div>
            <span className="text-3xl font-bold">InnoSpace</span>
          </div>

          <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
          <p className="text-muted-foreground mb-8">Sign in to manage your platform</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="admin@innospace.com or affiliate@innospace.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-secondary/50"
              />
            </div>

            <div>
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-secondary/50"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full h-12 text-base">
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Demo: Use <span className="font-mono">admin@</span> or <span className="font-mono">affiliate@</span> in email
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;