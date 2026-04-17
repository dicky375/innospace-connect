// src/pages/admin/AdminDashboard.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Award, DollarSign, Clock, ArrowRight } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const stats = {
    totalRegistrations: 156,
    pendingApprovals: 12,
    totalPayouts: "₦4.85M",
    activeAffiliates: 28,
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Platform overview and quick actions</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Registrations" value={stats.totalRegistrations} icon={Users} variant="primary" />
          <StatCard title="Pending Approvals" value={stats.pendingApprovals} icon={Clock} />
          <StatCard title="Total Payouts" value={stats.totalPayouts} icon={DollarSign} variant="accent" />
          <StatCard title="Active Affiliates" value={stats.activeAffiliates} icon={Award} />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="glass hover:border-primary/50 transition-all cursor-pointer"
                onClick={() => navigate("/admin/approvals")}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Clock className="h-6 w-6 text-orange-500" />
                Pending Approvals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold mb-2">{stats.pendingApprovals}</p>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                Review now <ArrowRight className="h-4 w-4" />
              </p>
            </CardContent>
          </Card>

          <Card className="glass hover:border-primary/50 transition-all cursor-pointer"
                onClick={() => navigate("/admin/payouts")}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <DollarSign className="h-6 w-6 text-green-500" />
                Commission Payouts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold mb-2">₦{stats.totalPayouts}</p>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
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