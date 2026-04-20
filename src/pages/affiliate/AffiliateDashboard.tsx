import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api"; // Your adjusted axios instance
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
// UI components (shadcn)
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { UserPlus, Users, Award, Wallet } from "lucide-react";

const AffiliateDashboard = () => {
  const navigate = useNavigate();

  // 1. Fetch Stats from Server 2 (Registration)
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["affiliate-stats"],
    queryFn: async () => {
      const response = await api.get("/registrations/stats/me");
      return response.data;
    },
  });

  // 2. Fetch Recent Referrals
  const { data: recentReferrals, isLoading: refsLoading } = useQuery({
    queryKey: ["recent-referrals"],
    queryFn: async () => {
      const response = await api.get("/registrations/recent");
      return response.data;
    },
  });

  if (statsLoading || refsLoading) return <div className="p-10 text-center">Loading Dashboard...</div>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Affiliate Dashboard</h1>
            <p className="text-muted-foreground">Welcome back!</p>
          </div>
          <Button onClick={() => navigate("/affiliate/register-student")}>
            <UserPlus className="mr-2 h-4 w-4" />
            Register New Student
          </Button>
        </div>

        {/* Stats - Now using real data */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Referrals" value={stats?.totalReferrals || 0} icon={Users} variant="primary" />
          <StatCard title="Approved" value={stats?.approvedReferrals || 0} icon={Award} variant="accent" />
          <StatCard title="Pending" value={stats?.pendingReferrals || 0} icon={Users} />
          <StatCard 
            title="Total Earnings" 
            value={`₦${stats?.totalEarnings?.toLocaleString() || 0}`} 
            icon={Wallet} 
            variant="primary" 
          />
        </div>

        {/* ... Quick Actions remain the same ... */}

        {/* Recent Referrals - Mapping real DB rows */}
        <Card className="glass">
          <CardHeader>
            <CardTitle>Recent Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReferrals?.map((ref: any) => (
                <div key={ref.id} className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{ref.fullName}</p>
                      <p className="text-sm text-muted-foreground">{ref.Program?.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-400">₦{ref.commission?.toLocaleString() || 0}</p>
                    <span className={`text-xs px-2.5 py-1 rounded-full ${
                      ref.status === "Approved" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                    }`}>
                      {ref.status}
                    </span>
                  </div>
                </div>
              ))}
              {recentReferrals?.length === 0 && <p className="text-center text-muted-foreground">No referrals yet.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};
export default AffiliateDashboard;