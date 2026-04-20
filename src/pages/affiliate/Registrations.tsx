import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api"; // Your central axios instance
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Eye, UserPlus, Loader2 } from "lucide-react";
import { format } from "date-fns"; // Recommended: npm install date-fns

const AffiliateRegistrations = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("all");

  // 1. Fetch real referrals from Server 2 (Registration Service)
  const { data: registrations, isLoading } = useQuery({
    queryKey: ["my-registrations", filterStatus],
    queryFn: async () => {
      // We pass the status as a query param to let the backend handle filtering
      const statusParam = filterStatus !== "all" ? `?status=${filterStatus}` : "";
      const { data } = await api.get(`/registrations/me${statusParam}`);
      return data;
    },
  });

  // 2. Client-side search (for better UX)
  const filteredRegistrations = registrations?.filter((reg: any) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      reg.studentName.toLowerCase().includes(searchLower) ||
      reg.Program?.name.toLowerCase().includes(searchLower)
    );
  }) || [];

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return <Badge className="bg-green-500/20 text-green-400">Approved</Badge>;
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">Pending</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">My Referrals</h1>
            <p className="text-muted-foreground">Track and manage all your referred students</p>
          </div>

          <Button 
            onClick={() => navigate("/affiliate/register-student")}
            size="lg"
            className="flex items-center gap-2"
          >
            <UserPlus className="h-5 w-5" />
            Register New Student
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Search className="h-5 w-5 text-primary" /> Filter Referrals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:row gap-4">
              <Input
                placeholder="Search by student name or program..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <div className="flex flex-wrap gap-2">
                {(["all", "pending", "approved", "rejected"] as const).map((status) => (
                  <Button
                    key={status}
                    variant={filterStatus === status ? "default" : "outline"}
                    onClick={() => setFilterStatus(status)}
                    className="capitalize px-6"
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Registrations Table */}
        <Card className="glass overflow-hidden">
          <CardContent className="p-0"> {/* Remove padding for full-bleed table */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground">Fetching your referrals...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/50">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold">Student</th>
                      <th className="text-left py-4 px-6 font-semibold">Program</th>
                      <th className="text-left py-4 px-6 font-semibold">Date</th>
                      <th className="text-left py-4 px-6 font-semibold">Status</th>
                      <th className="text-right py-4 px-6 font-semibold">Earnings</th>
                      <th className="text-center py-4 px-6 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRegistrations.map((reg: any) => (
                      <tr key={reg.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                        <td className="py-4 px-6">
                          <div>
                            <p className="font-medium">{reg.studentName}</p>
                            <p className="text-xs text-muted-foreground">{reg.email}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-muted-foreground">
                          {reg.Program?.name || "N/A"}
                        </td>
                        <td className="py-4 px-6 text-muted-foreground">
                          {format(new Date(reg.createdAt), "MMM dd, yyyy")}
                        </td>
                        <td className="py-4 px-6">{getStatusBadge(reg.status)}</td>
                        <td className="py-4 px-6 text-right font-bold text-green-400">
                          ₦{(reg.commission || 0).toLocaleString()}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <Button variant="ghost" size="icon" title="View Details">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredRegistrations.length === 0 && (
                  <div className="text-center py-20">
                    <p className="text-muted-foreground text-lg">No referrals found matching your criteria.</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AffiliateRegistrations;