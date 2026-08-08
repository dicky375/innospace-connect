import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api, { CONFIG, PROGRAMS } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Settings, UserCircle, Percent, Save, Loader2, RefreshCw } from "lucide-react";

const AdminSettings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newRate, setNewRate] = useState("");
  const [selectedProgramId, setSelectedProgramId] = useState("");
  const [programRate, setProgramRate] = useState("");

  // ✅ Fetch all programs
  const { data: programsData, isLoading: programsLoading } = useQuery({
    queryKey: ["programs"],
    queryFn: async () => {
      const { data } = await api.get(PROGRAMS);
      return data;
    },
  });

  const programs = programsData?.programs || [];

  // ✅ Fetch current global commission rate
  const { data: config, isLoading } = useQuery({
    queryKey: ["commission-rate"],
    queryFn: async () => {
      const { data } = await api.get(`${CONFIG}/commission`);
      return data;
    },
  });

  // ✅ Update global commission rate (updates ALL programs)
  const updateGlobalMutation = useMutation({
    mutationFn: (rate: string) =>
      api.patch(`${CONFIG}/commission`, { commissionRate: parseFloat(rate) }),
    onSuccess: (res) => {
      toast.success(res.data.message || "Global commission rate updated!");
      queryClient.invalidateQueries({ queryKey: ["commission-rate"] });
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      setNewRate("");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || "Failed to update commission rate");
    },
  });

  // ✅ Update a single program's commission rate
  const updateProgramMutation = useMutation({
    mutationFn: ({ programId, rate }: { programId: string; rate: string }) =>
      api.patch(`${PROGRAMS}/${programId}/commission`, { commissionRate: parseFloat(rate) }),
    onSuccess: (res) => {
      toast.success(res.data.message || "Program commission rate updated!");
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      queryClient.invalidateQueries({ queryKey: ["commission-rate"] });
      setProgramRate("");
      setSelectedProgramId("");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || "Failed to update program commission");
    },
  });

  // ✅ Handle global update
  const handleGlobalUpdate = () => {
    if (!newRate) return toast.error("Enter a commission rate");
    const rate = parseFloat(newRate);
    if (isNaN(rate) || rate < 1 || rate > 50)
      return toast.error("Rate must be between 1% and 50%");
    updateGlobalMutation.mutate(newRate);
  };

  // ✅ Handle program update
  const handleProgramUpdate = () => {
    if (!selectedProgramId) return toast.error("Select a program");
    if (!programRate) return toast.error("Enter a commission rate");
    const rate = parseFloat(programRate);
    if (isNaN(rate) || rate < 1 || rate > 50)
      return toast.error("Rate must be between 1% and 50%");
    updateProgramMutation.mutate({ programId: selectedProgramId, rate: programRate });
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
            Platform configuration and commission management
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

          {/* Global Commission Rate */}
          <Card className="glass border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Percent className="h-5 w-5 text-primary" />
                Global Commission Rate
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
                    {config?.commissionRate || 10}%
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  Applied to all programs by default
                </p>
              </div>

              {/* Update Global Rate */}
              <div className="space-y-3">
                <Label htmlFor="globalRate">New Global Commission Rate (%)</Label>
                <div className="flex gap-2">
                  <Input
                    id="globalRate"
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
                    onClick={handleGlobalUpdate}
                    disabled={updateGlobalMutation.isPending}
                  >
                    {updateGlobalMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Updates ALL programs to this rate. Affects new registrations and pending approvals.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Program-Specific Commission Rates */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-primary" />
              Program-Specific Commission Rates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Program List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {programsLoading ? (
                  <p className="text-muted-foreground">Loading programs...</p>
                ) : programs.length === 0 ? (
                  <p className="text-muted-foreground">No programs available</p>
                ) : (
                  programs.map((program: any) => (
                    <div
                      key={program.id}
                      className={`p-4 rounded-xl border transition-all ${
                        selectedProgramId === program.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/30"
                      }`}
                      onClick={() => {
                        setSelectedProgramId(program.id);
                        setProgramRate(program.commissionRate || "10");
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{program.title}</p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {program.type} • ₦{parseFloat(program.price).toLocaleString()}
                          </p>
                        </div>
                        <Badge className="bg-green-500/20 text-green-400 border-none">
                          {program.commissionRate || 10}%
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Update Program Rate */}
              {selectedProgramId && (
                <div className="p-4 rounded-xl bg-secondary/20 border border-white/5">
                  <h4 className="font-medium mb-3">Update Selected Program</h4>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min="1"
                      max="50"
                      step="0.5"
                      placeholder="Commission rate %"
                      value={programRate}
                      onChange={(e) => setProgramRate(e.target.value)}
                      className="bg-background/50 max-w-[200px]"
                    />
                    <Button
                      onClick={handleProgramUpdate}
                      disabled={updateProgramMutation.isPending}
                    >
                      {updateProgramMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Updates only this program's commission rate.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminSettings;