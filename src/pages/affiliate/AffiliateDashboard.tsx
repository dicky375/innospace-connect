import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Award, Wallet, TrendingUp, UserPlus, Calculator } from "lucide-react";
import { toast } from "sonner";

const AffiliateDashboard = () => {
  const navigate = useNavigate();

  const [stats] = useState({
    totalReferrals: 24,
    approvedReferrals: 18,
    pendingReferrals: 6,
    totalEarnings: "₦1,245,000",
    thisMonthEarnings: "₦285,000",
  });

  const recentReferrals = [
    { id: 1, name: "Chinedu Eze", program: "Frontend Internship", status: "Approved", earnings: "₦45,000", date: "2 days ago" },
    { id: 2, name: "Blessing Akin", program: "Data Science", status: "Pending", earnings: "₦0", date: "3 days ago" },
    { id: 3, name: "Samuel Ogu", program: "Backend Internship", status: "Approved", earnings: "₦52,000", date: "1 week ago" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Affiliate Dashboard</h1>
            <p className="text-muted-foreground">Track your referrals and earnings</p>
          </div>
          <Button onClick={() => navigate("/affiliate/register-student")}>
            <UserPlus className="mr-2 h-4 w-4" />
            Register New Student
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Referrals" value={stats.totalReferrals} icon={Users} variant="primary" />
          <StatCard title="Approved" value={stats.approvedReferrals} icon={Award} variant="accent" />
          <StatCard title="Pending" value={stats.pendingReferrals} icon={Users} />
          <StatCard 
            title="Total Earnings" 
            value={stats.totalEarnings} 
            icon={Wallet} 
            variant="primary" 
            trend="+24% this month" 
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            size="lg" 
            className="h-28 flex-col"
            onClick={() => navigate("/affiliate/register-student")}
          >
            <UserPlus className="h-8 w-8 mb-2" />
            Register Student
          </Button>

          <Button 
            size="lg" 
            variant="outline" 
            className="h-28 flex-col"
            onClick={() => navigate("/affiliate/registrations")}
          >
            <Users className="h-8 w-8 mb-2" />
            View All Referrals
          </Button>

          {/* New Commission Calculator Button */}
          <Button 
            size="lg" 
            variant="outline" 
            className="h-28 flex-col border-primary/50 hover:bg-primary/5"
            onClick={() => navigate("/affiliate/calculator")}
          >
            <Calculator className="h-8 w-8 mb-2 text-primary" />
            Commission Calculator
            <span className="text-xs text-muted-foreground mt-1">Estimate Earnings</span>
          </Button>
        </div>

        {/* Recent Referrals */}
        <Card className="glass">
          <CardHeader>
            <CardTitle>Recent Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReferrals.map((ref) => (
                <div key={ref.id} className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{ref.name}</p>
                      <p className="text-sm text-muted-foreground">{ref.program}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-green-400">{ref.earnings}</p>
                    <span className={`text-xs px-2.5 py-1 rounded-full ${
                      ref.status === "Approved" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                    }`}>
                      {ref.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AffiliateDashboard;