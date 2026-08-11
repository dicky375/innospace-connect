import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api, { STATS, PAYOUTS } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Award, DollarSign, Clock, ArrowRight, Loader2, RefreshCw, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: stats, isLoading: loadingStats, refetch: refetchStats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const { data } = await api.get(`${STATS}/admin`);
      console.log('[API] Stats response:', data);
      return data;
    },
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const { data: payoutsData, isLoading: loadingPayouts, refetch: refetchPayouts } = useQuery({
    queryKey: ["pending-payouts-count"],
    queryFn: async () => {
      const { data } = await api.get(`${PAYOUTS}/pending`);
      return data;
    },
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    queryClient.invalidateQueries({ queryKey: ["pending-payouts-count"] });
    refetchStats();
    refetchPayouts();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    console.log('[Dashboard] 🔄 Refreshing data...');
    try {
      await queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      await queryClient.invalidateQueries({ queryKey: ["pending-payouts-count"] });
      await refetchStats();
      await refetchPayouts();
      console.log('[Dashboard] ✅ Data refreshed!');
    } catch (error) {
      console.error('[Dashboard] ❌ Refresh error:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const isLoading = loadingStats || loadingPayouts;

  console.log('[Dashboard] Stats:', stats);
  console.log('[Dashboard] Pending:', stats?.stats?.registrations?.pending);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const formatCurrency = (num: number) => {
    if (num >= 1000000) return `₦${(num / 1000000).toFixed(2)}M`;
    return `₦${num.toLocaleString()}`;
  };

  const pendingCount = stats?.stats?.registrations?.pending || 0;
  
  // ✅ Revenue breakdown
  const totalRevenue = parseFloat(stats?.stats?.revenue?.total || "0");
  const totalCommissions = parseFloat(stats?.stats?.revenue?.commissions || "0");
  const adminRevenue = parseFloat(stats?.stats?.revenue?.adminRevenue || "0");

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Platform overview and quick actions</p>
          </div>
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            size="sm"
            className="gap-2"
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Registrations"
            value={stats?.stats?.registrations?.total || 0}
            icon={Users}
            variant="primary"
          />
          <StatCard
            title="Pending Approvals"
            value={pendingCount}
            icon={Clock}
          />
          <StatCard
            title="Total Revenue"
            value={formatCurrency(totalRevenue)}
            icon={DollarSign}
            variant="accent"
          />
          <StatCard
            title="Active Programs"
            value={stats?.stats?.programs?.active || 0}
            icon={Award}
          />
        </div>

        {/* ✅ Revenue Breakdown Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-green-500/20 bg-green-500/5">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-500">{formatCurrency(totalRevenue)}</p>
              <p className="text-xs text-muted-foreground">From all paid registrations</p>
            </CardContent>
          </Card>
          <Card className="border-blue-500/20 bg-blue-500/5">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Affiliate Commissions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-500">{formatCurrency(totalCommissions)}</p>
              <p className="text-xs text-muted-foreground">Paid out to affiliates</p>
            </CardContent>
          </Card>
          <Card className="border-purple-500/20 bg-purple-500/5">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Admin Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-purple-500">{formatCurrency(adminRevenue)}</p>
              <p className="text-xs text-muted-foreground">Platform earnings</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card
            className="hover:border-primary/50 transition-all cursor-pointer group"
            onClick={() => navigate("/admin/approvals")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Clock className="h-6 w-6 text-orange-500" />
                Pending Approvals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold mb-2">{pendingCount}</p>
              <p className="text-sm text-muted-foreground flex items-center gap-1 group-hover:text-primary transition-colors">
                Review now <ArrowRight className="h-4 w-4" />
              </p>
            </CardContent>
          </Card>

          <Card
            className="hover:border-primary/50 transition-all cursor-pointer group"
            onClick={() => navigate("/admin/payouts")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <DollarSign className="h-6 w-6 text-green-500" />
                Pending Payouts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold mb-2">{payoutsData?.count || 0}</p>
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