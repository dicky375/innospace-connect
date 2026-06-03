import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api, { REGISTRATIONS } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, UserPlus, Loader2 } from "lucide-react";

const statusColors: Record<string, string> = {
  paid: "bg-green-500/20 text-green-400",
  approved: "bg-blue-500/20 text-blue-400",
  pending_approval: "bg-yellow-500/20 text-yellow-400",
  rejected: "bg-destructive/20 text-destructive",
  cancelled: "bg-muted/20 text-muted-foreground",
};

const statusLabels: Record<string, string> = {
  paid: "Paid",
  approved: "Approved",
  pending_approval: "Pending",
  rejected: "Rejected",
  cancelled: "Cancelled",
};

const AffiliateRegistrations = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const { data, isLoading } = useQuery({
    queryKey: ["my-registrations"],
    queryFn: async () => {
      const { data } = await api.get(`${REGISTRATIONS}/my`);
      return data;
    },
  });

  const registrations = Array.isArray(data) ? data : [];

  const filtered = registrations.filter((reg: any) => {
    const matchStatus =
      filterStatus === "all" || reg.status === filterStatus;
    const matchSearch =
      !searchTerm ||
      reg.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.Program?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">My Registrations</h1>
            <p className="text-muted-foreground">
              Track all your referred students
            </p>
          </div>
          <Button
            onClick={() => navigate("/affiliate/register-student")}
            size="lg"
          >
            <UserPlus className="h-5 w-5 mr-2" />
            Register New Student
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Search className="h-5 w-5 text-primary" /> Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <Input
                placeholder="Search by student name or program..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="flex flex-wrap gap-2">
                {["all", "pending_approval", "approved", "paid", "rejected", "cancelled"].map(
                  (status) => (
                    <Button
                      key={status}
                      variant={filterStatus === status ? "default" : "outline"}
                      onClick={() => setFilterStatus(status)}
                      className="capitalize px-4"
                      size="sm"
                    >
                      {status === "all" ? "All" : statusLabels[status]}
                    </Button>
                  )
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="glass overflow-hidden">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading registrations...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/50">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold">Student</th>
                      <th className="text-left py-4 px-6 font-semibold">Program</th>
                      <th className="text-left py-4 px-6 font-semibold">Reg No.</th>
                      <th className="text-left py-4 px-6 font-semibold">Date</th>
                      <th className="text-left py-4 px-6 font-semibold">Status</th>
                      <th className="text-right py-4 px-6 font-semibold">Commission</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="text-center py-20 text-muted-foreground"
                        >
                          No registrations found
                        </td>
                      </tr>
                    ) : (
                      filtered.map((reg: any) => (
                        <tr
                          key={reg.id}
                          className="border-b border-border/50 hover:bg-secondary/20 transition-colors"
                        >
                          <td className="py-4 px-6">
                            <p className="font-medium">{reg.studentName}</p>
                            <p className="text-xs text-muted-foreground">
                              {reg.studentEmail}
                            </p>
                          </td>
                          <td className="py-4 px-6 text-muted-foreground">
                            {reg.Program?.title || "—"}
                          </td>
                          <td className="py-4 px-6 text-muted-foreground">
                            {reg.regNumber}
                          </td>
                          <td className="py-4 px-6 text-muted-foreground">
                            {new Date(reg.createdAt).toLocaleDateString("en-NG")}
                          </td>
                          <td className="py-4 px-6">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                statusColors[reg.status] || ""
                              }`}
                            >
                              {statusLabels[reg.status] || reg.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right font-bold text-green-400">
                            ₦{parseFloat(reg.commissionEarned || 0).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AffiliateRegistrations;