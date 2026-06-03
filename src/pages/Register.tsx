import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Zap, ArrowLeft, UserPlus, Loader2 } from "lucide-react";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const { register: authRegister } = useAuth();
  const navigate = useNavigate();

  const update = (key: string, val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.phone || !form.password) {
      toast.error("Please fill all fields");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await authRegister(form);
      toast.success("Registration successful! Welcome to InnoSpace.");
      navigate("/affiliate");
    } catch (error: any) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl opacity-30 pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 text-sm transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to home
        </Link>

        <div className="glass-strong p-8 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <UserPlus className="h-7 w-7 text-white" />
            </div>
            <span className="text-3xl font-bold">InnoSpace</span>
          </div>

          <h1 className="text-2xl font-bold mb-1">Create Account</h1>
          <p className="text-muted-foreground text-sm mb-8">
            Join as an affiliate and start earning commissions
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className="bg-secondary/30 border-white/5 focus:bg-secondary/50 h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className="bg-secondary/30 border-white/5 focus:bg-secondary/50 h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input
                placeholder="+234 801 234 5678"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className="bg-secondary/30 border-white/5 focus:bg-secondary/50 h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                className="bg-secondary/30 border-white/5 focus:bg-secondary/50 h-11"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/10 transition-all active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;