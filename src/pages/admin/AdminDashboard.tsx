import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api"; // Your central axios instance
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Award, DollarSign, Clock, ArrowRight, Loader2 } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Fetching Admin Stats - This endpoint should aggregate data on the backend
  // or you can make multiple queries here.
  const { data: adminStats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const { data } = await api.get("/admin/stats/overview");
      return data;
    },
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  // Formatting for Naira (M for Millions, K for Thousands)
  const formatCurrency = (num: number) => {
    if (num >= 1000000) return `₦${(num / 1000000).toFixed(2)}M`;
    return `₦${num.toLocaleString()}`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Platform overview and quick actions</p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total Registrations" 
            value={adminStats?.totalRegistrations || 0} 
            icon={Users} 
            variant="primary" 
          />
          <StatCard 
            title="Pending Approvals" 
            value={adminStats?.pendingApprovals || 0} 
            icon={Clock} 
          />
          <StatCard 
            title="Total Payouts" 
            value={formatCurrency(adminStats?.totalPayouts || 0)} 
            icon={DollarSign} 
            variant="accent" 
          />
          <StatCard 
            title="Active Affiliates" 
            value={adminStats?.totalAffiliates || 0} 
            icon={Award} 
          />
        </div>

        {/* Quick Actions Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="glass hover:border-primary/50 transition-all cursor-pointer group"
                onClick={() => navigate("/admin/approvals")}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Clock className="h-6 w-6 text-orange-500" />
                Pending Approvals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold mb-2">{adminStats?.pendingApprovals || 0}</p>
              <p className="text-sm text-muted-foreground flex items-center gap-1 group-hover:text-primary transition-colors">
                Review now <ArrowRight className="h-4 w-4" />
              </p>
            </CardContent>
          </Card>

          <Card className="glass hover:border-primary/50 transition-all cursor-pointer group"
                onClick={() => navigate("/admin/payouts")}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <DollarSign className="h-6 w-6 text-green-500" />
                Commission Payouts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold mb-2">₦{adminStats?.totalPayouts?.toLocaleString() || 0}</p>
              <p className="text-sm text-muted-foreground flex items-center gap-1 group-hover:text-primary transition-colors">
                Process payments <ArrowRight className="h-4 w-4" />
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;