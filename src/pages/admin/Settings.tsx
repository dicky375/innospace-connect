import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api, { STATS } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Settings, UserCircle, Percent, Save, Loader2 } from "lucide-react";

const COMMISSION_URL = "/reg/api/config/commission";

const AdminSettings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newRate, setNewRate] = useState("");

  const { data: config, isLoading } = useQuery({
    queryKey: ["commission-rate"],
    queryFn: async () => {
      const { data } = await api.get(COMMISSION_URL);
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: (rate: string) =>
      api.patch(COMMISSION_URL, { commissionRate: parseFloat(rate) }),
    onSuccess: (res) => {
      toast.success(res.data.message);
      queryClient.invalidateQueries({ queryKey: ["commission-rate"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      setNewRate("");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || "Failed to update commission rate");
    },
  });

  const handleUpdate = () => {
    if (!newRate) return toast.error("Enter a commission rate");
    const rate = parseFloat(newRate);
    if (isNaN(rate) || rate < 1 || rate > 50)
      return toast.error("Rate must be between 1% and 50%");
    updateMutation.mutate(newRate);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="h-8 w-8 text-primary" />
            Settings
          </h1>
          <p className="text-muted-foreground text-sm">
            Platform configuration and admin profile
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Admin Profile */}
          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCircle className="h-5 w-5 text-primary" />
                Admin Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 rounded-xl bg-secondary/20 border border-white/5">
                  <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">
                    Full Name
                  </p>
                  <p className="font-semibold text-lg">{user?.name}</p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/20 border border-white/5">
                  <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">
                    Email Address
                  </p>
                  <p className="font-semibold">{user?.email}</p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/20 border border-white/5">
                  <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">
                    Account Role
                  </p>
                  <Badge className="bg-primary/20 text-primary border-none capitalize">
                    {user?.role}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Commission Rate */}
          <Card className="glass border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Percent className="h-5 w-5 text-primary" />
                Commission Rate
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Rate Display */}
              <div className="p-6 rounded-xl bg-secondary/20 border border-white/5 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                  Current Global Rate
                </p>
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                ) : (
                  <p className="text-5xl font-bold text-green-400">
                    {config?.commissionRate}%
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  Applied to all affiliate registrations
                </p>
              </div>

              {/* Update Rate */}
              <div className="space-y-3">
                <Label htmlFor="rate">New Commission Rate (%)</Label>
                <div className="flex gap-2">
                  <Input
                    id="rate"
                    type="number"
                    min="1"
                    max="50"
                    step="0.5"
                    placeholder="e.g. 15"
                    value={newRate}
                    onChange={(e) => setNewRate(e.target.value)}
                    className="bg-background/50"
                  />
                  <Button
                    onClick={handleUpdate}
                    disabled={updateMutation.isPending}
                  >
                    {updateMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Must be between 1% and 50%. Changes apply to all new approvals immediately.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminSettings;