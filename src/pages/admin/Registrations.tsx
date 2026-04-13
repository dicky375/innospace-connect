import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";

const statusColors: Record<string, string> = {
  paid: "bg-green-500/20 text-green-400",
  approved: "bg-blue-500/20 text-blue-400",
  pending_approval: "bg-accent/20 text-accent",
  rejected: "bg-destructive/20 text-destructive",
  cancelled: "bg-muted/20 text-muted-foreground",
};

const statusLabels: Record<string, string> = {
  paid: "Paid", approved: "Approved", pending_approval: "Pending",
  rejected: "Rejected", cancelled: "Cancelled",
};

const AdminRegistrations = () => {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["all-registrations"],
    queryFn: async () => {
      const { data } = await api.get("/api/registrations/all");
      return data;
    },
  });

  const registrations = data || [];
  const filtered = registrations.filter((r: any) => {
    const matchStatus = filter === "all" || r.status === filter;
    const matchSearch = !search || r.Program?.title?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">All Registrations</h1>
          <p className="text-muted-foreground text-sm">Complete registration history</p>
        </div>

        <div className="flex gap-3 flex-wrap items-center">
          <Input
            placeholder="Search by program..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs bg-secondary/50 border-glass-border"
          />
          <div className="flex gap-2 flex-wrap">
            {["all", "pending_approval", "approved", "paid", "rejected"].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  filter === s ? "gradient-primary text-white" : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                }`}
              >
                {s === "all" ? "All" : statusLabels[s]}
              </button>
            ))}
          </div>
        </div>

        <div className="glass p-6 animate-fade-in">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">No registrations found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="text-left py-3 px-2">Program</th>
                    <th className="text-left py-3 px-2">Type</th>
                    <th className="text-left py-3 px-2">Amount</th>
                    <th className="text-left py-3 px-2">Self Reg</th>
                    <th className="text-left py-3 px-2">Status</th>
                    <th className="text-left py-3 px-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r: any) => (
                    <tr key={r.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                      <td className="py-3 px-2 font-medium">{r.Program?.title || "—"}</td>
                      <td className="py-3 px-2 text-muted-foreground capitalize">{r.Program?.type || "—"}</td>
                      <td className="py-3 px-2 text-muted-foreground">₦{Number(r.amount).toLocaleString()}</td>
                      <td className="py-3 px-2 text-muted-foreground">{r.isSelfRegistered ? "Yes" : "No"}</td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[r.status] || ""}`}>
                          {statusLabels[r.status] || r.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-muted-foreground">{new Date(r.createdAt).toLocaleDateString("en-NG")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminRegistrations;