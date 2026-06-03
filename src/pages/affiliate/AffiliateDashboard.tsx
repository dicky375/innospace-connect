import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import api, { REGISTRATIONS, COMMISSIONS } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { UserPlus, Users, Award, Wallet, Loader2 } from "lucide-react";

const statusColors: Record<string, string> = {
  paid: "bg-green-500/20 text-green-400",
  approved: "bg-blue-500/20 text-blue-400",
  pending_approval: "bg-yellow-500/20 text-yellow-400",
  rejected: "bg-destructive/20 text-destructive",
  cancelled: "bg-muted/20 text-muted-foreground",
};

const AffiliateDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["affiliate-stats"],
    queryFn: async () => {
      const { data } = await api.get(`${REGISTRATIONS}/my/stats`);
      return data;
    },
  });

  const { data: balance, isLoading: balanceLoading } = useQuery({
    queryKey: ["affiliate-balance"],
    queryFn: async () => {
      const { data } = await api.get(`${COMMISSIONS}/balance`);
      return data;
    },
  });

  const { data: recentData, isLoading: recentLoading } = useQuery({
    queryKey: ["recent-registrations"],
    queryFn: async () => {
      const { data } = await api.get(`${REGISTRATIONS}/my?limit=5`);
      return data;
    },
  });

  const isLoading = statsLoading || balanceLoading || recentLoading;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const recent = Array.isArray(recentData) ? recentData.slice(0, 5) : [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {user?.name}!</h1>
            <p className="text-muted-foreground">Here's your affiliate overview</p>
          </div>
          <Button onClick={() => navigate("/affiliate/register-student")}>
            <UserPlus className="mr-2 h-4 w-4" />
            Register New Student
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Registrations"
            value={stats?.total || 0}
            icon={Users}
            variant="primary"
          />
          <StatCard
            title="Approved"
            value={stats?.approved || 0}
            icon={Award}
            variant="accent"
          />
          <StatCard
            title="Pending"
            value={stats?.pending || 0}
            icon={Users}
          />
          <StatCard
            title="Wallet Balance"
            value={`₦${parseFloat(balance?.balance || "0").toLocaleString()}`}
            icon={Wallet}
            variant="primary"
          />
        </div>

        {/* Recent Registrations */}
        <Card className="glass">
          <CardHeader>
            <CardTitle>Recent Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            {recent.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No registrations yet. Start by registering a student!
              </p>
            ) : (
              <div className="space-y-4">
                {recent.map((reg: any) => (
                  <div
                    key={reg.id}
                    className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{reg.studentName}</p>
                        <p className="text-sm text-muted-foreground">
                          {reg.Program?.title || "—"} •{" "}
                          {reg.regNumber}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-400">
                        ₦{parseFloat(reg.commissionEarned || 0).toLocaleString()}
                      </p>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full ${
                          statusColors[reg.status] || ""
                        }`}
                      >
                        {reg.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AffiliateDashboard;