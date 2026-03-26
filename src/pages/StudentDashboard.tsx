import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { useAuth } from "@/contexts/AuthContext";
import { BookOpen, CreditCard, User } from "lucide-react";

const mockPrograms = [
  { id: 1, name: "Frontend Development Internship", status: "active", startDate: "2026-02-01", paymentStatus: "paid" },
  { id: 2, name: "SIWES - Software Engineering", status: "pending", startDate: "2026-04-01", paymentStatus: "pending" },
];

const paymentColors: Record<string, string> = {
  paid: "bg-green-500/20 text-green-400",
  pending: "bg-accent/20 text-accent",
  overdue: "bg-destructive/20 text-destructive",
};

const StudentDashboard = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {user?.name || "Student"}</h1>
          <p className="text-muted-foreground text-sm">Your enrolled programs and payment status</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Enrolled Programs" value={2} icon={BookOpen} variant="primary" />
          <StatCard title="Payment Status" value="1 Pending" icon={CreditCard} variant="accent" />
          <StatCard title="Profile" value="Complete" icon={User} />
        </div>

        <div className="glass p-6 animate-fade-in">
          <h3 className="text-lg font-bold mb-4">My Programs</h3>
          <div className="space-y-4">
            {mockPrograms.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/50">
                <div>
                  <h4 className="font-semibold">{p.name}</h4>
                  <p className="text-sm text-muted-foreground">Starts: {p.startDate}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${paymentColors[p.paymentStatus]}`}>
                    {p.paymentStatus}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${p.status === "active" ? "bg-green-500/20 text-green-400" : "bg-accent/20 text-accent"}`}>
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass p-6 animate-fade-in">
          <h3 className="text-lg font-bold mb-4">Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><p className="text-sm text-muted-foreground">Name</p><p className="font-medium">{user?.name || "—"}</p></div>
            <div><p className="text-sm text-muted-foreground">Email</p><p className="font-medium">{user?.email || "—"}</p></div>
            <div><p className="text-sm text-muted-foreground">Role</p><p className="font-medium capitalize">{user?.role || "—"}</p></div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
