import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Settings, UserCircle, Save } from "lucide-react";
import { toast } from "sonner";

const AdminSettings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // 1. Fetch System Config (like the commission rate) from Server 2 or 3
  const { data: config, isLoading } = useQuery({
    queryKey: ["system-config"],
    queryFn: async () => {
      const { data } = await api.get("/admin/config");
      return data;
    }
  });

  // 2. Mutation to update commission
  const updateConfig = useMutation({
    mutationFn: (newRate: string) => api.patch("/admin/config", { commissionRate: newRate }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["system-config"] });
      toast.success("Platform configuration updated");
    }
  });

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="h-8 w-8 text-primary" />
            Settings
          </h1>
          <p className="text-muted-foreground text-sm">Manage your profile and platform-wide rules</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Section */}
          <Card className="lg:col-span-2 glass border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCircle className="h-5 w-5 text-primary" />
                Admin Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-secondary/20 border border-white/5">
                  <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Full Name</p>
                  <p className="font-semibold text-lg">{user?.name || "Admin User"}</p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/20 border border-white/5">
                  <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Email Address</p>
                  <p className="font-semibold">{user?.email}</p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/20 border border-white/5">
                  <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Account Role</p>
                  <Badge className="bg-primary/20 text-primary border-none capitalize">
                    {user?.role}
                  </Badge>
                </div>
                <div className="p-4 rounded-xl bg-secondary/20 border border-white/5">
                  <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Access Level</p>
                  <p className="font-semibold">Super Admin</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Platform Config Section */}
          <Card className="glass border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg">Platform Rules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rate">Default Commission Rate (%)</Label>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <div className="flex gap-2">
                    <Input 
                      id="rate"
                      defaultValue={config?.commissionRate || "5"} 
                      className="bg-background/50"
                      type="number"
                    />
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => updateConfig.mutate("5")} // Simplified for example
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <p className="text-[10px] text-muted-foreground italic">
                  * Applied to all new affiliate registrations.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

// Simple Badge component if you don't want to import it
const Badge = ({ children, className }: any) => (
  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${className}`}>
    {children}
  </span>
);

export default AdminSettings;