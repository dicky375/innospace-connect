import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Zap, ArrowLeft, UserPlus } from "lucide-react";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "" as "admin" | "affiliate"
  });

  const [loading, setLoading] = useState(false);
  const { register: authRegister } = useAuth();

  const update = (key: string, val: string) => 
    setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.phone || !form.password || !form.role) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      await authRegister(form);
      toast.success("Registration successful!");
    } catch {
      // Demo Registration
      localStorage.setItem("accessToken", "demo-token");
      localStorage.setItem("refreshToken", "demo-refresh");
      localStorage.setItem("user", JSON.stringify({
        id: "1",
        name: form.name,
        email: form.email,
        role: form.role
      }));

      toast.success(`Registered as ${form.role} (Demo)`);

      // Redirect based on role
      window.location.href = form.role === "admin" ? "/admin" : "/affiliate";
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

        <div className="glass-strong p-8 rounded-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
              <UserPlus className="h-7 w-7 text-white" />
            </div>
            <span className="text-3xl font-bold">InnoSpace</span>
          </div>

          <h1 className="text-2xl font-bold mb-1">Create Account</h1>
          <p className="text-muted-foreground text-sm mb-8">Join as Admin or Affiliate</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label>Full Name</Label>
              <Input
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className="bg-secondary/50"
              />
            </div>

            <div>
              <Label>Email Address</Label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className="bg-secondary/50"
              />
            </div>

            <div>
              <Label>Phone Number</Label>
              <Input
                placeholder="+234 801 234 5678"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className="bg-secondary/50"
              />
            </div>

            <div>
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                className="bg-secondary/50"
              />
            </div>

            <div>
              <Label>Select Role</Label>
              <Select value={form.role} onValueChange={(v) => update("role", v as "admin" | "affiliate")}>
                <SelectTrigger className="bg-secondary/50">
                  <SelectValue placeholder="Choose your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="affiliate">Affiliate - Earn Commissions</SelectItem>
                  <SelectItem value="admin">Admin - Manage Platform</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-base gradient-primary"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;