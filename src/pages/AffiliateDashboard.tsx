import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import LeaderboardWidget from "@/components/LeaderboardWidget";
import RegistrationModal from "@/components/RegistrationModal";
import { Button } from "@/components/ui/button";
import { Users, DollarSign, Clock, TrendingUp, Plus } from "lucide-react";

const mockRegistrations = [
  { id: 1, student: "Amaka Okonkwo", program: "Frontend Internship", status: "approved", date: "2026-03-20", commission: 5000 },
  { id: 2, student: "Chinedu Eze", program: "SIWES - Data Science", status: "pending", date: "2026-03-22", commission: 0 },
  { id: 3, student: "Fatima Bello", program: "Backend Internship", status: "approved", date: "2026-03-18", commission: 5000 },
  { id: 4, student: "Oluwaseun Ade", program: "SIWES - Software Eng", status: "rejected", date: "2026-03-15", commission: 0 },
  { id: 5, student: "Grace Udo", program: "Frontend Internship", status: "approved", date: "2026-03-10", commission: 5000 },
];

const statusColors: Record<string, string> = {
  approved: "bg-green-500/20 text-green-400",
  pending: "bg-accent/20 text-accent",
  rejected: "bg-destructive/20 text-destructive",
};

const AffiliateDashboard = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Affiliate Dashboard</h1>
            <p className="text-muted-foreground text-sm">Track your registrations and earnings</p>
          </div>
          <Button onClick={() => setModalOpen(true)} className="gradient-primary text-primary-foreground hover:opacity-90">
            <Plus className="h-4 w-4 mr-2" /> Register Student
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Registrations" value={25} icon={Users} variant="primary" />
          <StatCard title="Total Earnings" value="₦125,000" icon={DollarSign} variant="accent" trend="+12% this month" />
          <StatCard title="Pending Approvals" value={3} icon={Clock} />
          <StatCard title="This Month" value="₦35,000" icon={TrendingUp} variant="primary" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass p-6 animate-fade-in">
            <h3 className="text-lg font-bold mb-4">My Registrations</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="text-left py-3 px-2">Student</th>
                    <th className="text-left py-3 px-2">Program</th>
                    <th className="text-left py-3 px-2">Status</th>
                    <th className="text-left py-3 px-2">Date</th>
                    <th className="text-right py-3 px-2">Commission</th>
                  </tr>
                </thead>
                <tbody>
                  {mockRegistrations.map((r) => (
                    <tr key={r.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                      <td className="py-3 px-2 font-medium">{r.student}</td>
                      <td className="py-3 px-2 text-muted-foreground">{r.program}</td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[r.status]}`}>{r.status}</span>
                      </td>
                      <td className="py-3 px-2 text-muted-foreground">{r.date}</td>
                      <td className="py-3 px-2 text-right font-medium">{r.commission ? `₦${r.commission.toLocaleString()}` : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <LeaderboardWidget />
        </div>

        <div className="glass p-6 animate-fade-in">
          <h3 className="text-lg font-bold mb-2">Wallet Balance</h3>
          <p className="text-4xl font-black gradient-text">₦125,000</p>
          <p className="text-sm text-muted-foreground mt-1">Available for withdrawal</p>
        </div>
      </div>

      <RegistrationModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </DashboardLayout>
  );
};

export default AffiliateDashboard;
