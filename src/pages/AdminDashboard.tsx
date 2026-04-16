import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { BookOpen, Users, ClipboardCheck, DollarSign, Check, X } from "lucide-react";

const mockPending = [
  { id: 1, student: "Chinedu Eze", program: "SIWES - Data Science", affiliate: "Adewale J.", date: "2026-03-22" },
  { id: 2, student: "Blessing Akin", program: "Frontend Internship", affiliate: "Chioma N.", date: "2026-03-23" },
  { id: 3, student: "Samuel Ogu", program: "Backend Internship", affiliate: "Ibrahim M.", date: "2026-03-24" },
];

const mockAllRegs = [
  { id: 1, student: "Amaka Okonkwo", program: "Frontend Internship", affiliate: "Adewale J.", status: "approved", date: "2026-03-20" },
  { id: 2, student: "Chinedu Eze", program: "SIWES - Data Science", affiliate: "Adewale J.", status: "pending", date: "2026-03-22" },
  { id: 3, student: "Fatima Bello", program: "Backend Internship", affiliate: "Chioma N.", status: "approved", date: "2026-03-18" },
  { id: 4, student: "Oluwaseun Ade", program: "SIWES - Software Eng", affiliate: "Ibrahim M.", status: "rejected", date: "2026-03-15" },
];

const statusColors: Record<string, string> = {
  approved: "bg-green-500/20 text-green-400",
  pending: "bg-accent/20 text-accent",
  rejected: "bg-destructive/20 text-destructive",
};

const AdminDashboard = () => {
  const [pending, setPending] = useState(mockPending);
  const [filter, setFilter] = useState("");

  const handleApprove = (id: number) => {
    setPending((p) => p.filter((r) => r.id !== id));
    toast.success("Registration approved");
  };

  const handleReject = (id: number) => {
    setPending((p) => p.filter((r) => r.id !== id));
    toast.error("Registration rejected");
  };

  const filteredRegs = mockAllRegs.filter(
    (r) => !filter || r.status === filter || r.student.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground text-sm">Manage programs, registrations, and users</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Programs" value={4} icon={BookOpen} variant="primary" />
          <StatCard title="Total Registrations" value={156} icon={ClipboardCheck} variant="accent" />
          <StatCard title="Pending Approvals" value={pending.length} icon={ClipboardCheck} />
          <StatCard title="Total Revenue" value="₦2.4M" icon={DollarSign} variant="primary" trend="+18% this month" />
        </div>

        {/* Pending Approvals */}
        <div className="glass p-6 animate-fade-in">
          <h3 className="text-lg font-bold mb-4">Pending Approvals</h3>
          {pending.length === 0 ? (
            <p className="text-muted-foreground text-sm">No pending approvals</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="text-left py-3 px-2">Student</th>
                    <th className="text-left py-3 px-2">Program</th>
                    <th className="text-left py-3 px-2">Affiliate</th>
                    <th className="text-left py-3 px-2">Date</th>
                    <th className="text-right py-3 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pending.map((r) => (
                    <tr key={r.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                      <td className="py-3 px-2 font-medium">{r.student}</td>
                      <td className="py-3 px-2 text-muted-foreground">{r.program}</td>
                      <td className="py-3 px-2 text-muted-foreground">{r.affiliate}</td>
                      <td className="py-3 px-2 text-muted-foreground">{r.date}</td>
                      <td className="py-3 px-2 text-right space-x-2">
                        <Button size="sm" onClick={() => handleApprove(r.id)} className="bg-green-600 hover:bg-green-700 text-primary-foreground h-8 px-3">
                          <Check className="h-3 w-3 mr-1" /> Approve
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleReject(r.id)} className="h-8 px-3">
                          <X className="h-3 w-3 mr-1" /> Reject
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* All Registrations */}
        <div className="glass p-6 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">All Registrations</h3>
            <Input
              placeholder="Filter by status or name..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="max-w-xs bg-secondary/50 border-glass-border"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left py-3 px-2">Student</th>
                  <th className="text-left py-3 px-2">Program</th>
                  <th className="text-left py-3 px-2">Affiliate</th>
                  <th className="text-left py-3 px-2">Status</th>
                  <th className="text-left py-3 px-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegs.map((r) => (
                  <tr key={r.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="py-3 px-2 font-medium">{r.student}</td>
                    <td className="py-3 px-2 text-muted-foreground">{r.program}</td>
                    <td className="py-3 px-2 text-muted-foreground">{r.affiliate}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[r.status]}`}>{r.status}</span>
                    </td>
                    <td className="py-3 px-2 text-muted-foreground">{r.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
