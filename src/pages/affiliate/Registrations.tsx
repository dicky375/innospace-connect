import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Search, Eye, UserPlus } from "lucide-react";
import { toast } from "sonner";

const AffiliateRegistrations = () => {
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("all");

  const registrations = [
    {
      id: 1,
      studentName: "Chinedu Eze",
      program: "Frontend Internship",
      email: "chinedu.eze@example.com",
      date: "2026-04-10",
      status: "approved",
      earnings: "₦45,000",
    },
    {
      id: 2,
      studentName: "Blessing Akin",
      program: "Data Science Bootcamp",
      email: "blessing.akin@example.com",
      date: "2026-04-12",
      status: "pending",
      earnings: "₦0",
    },
    {
      id: 3,
      studentName: "Samuel Ogu",
      program: "Backend Development",
      email: "samuel.ogu@example.com",
      date: "2026-04-08",
      status: "approved",
      earnings: "₦52,000",
    },
    {
      id: 4,
      studentName: "Fatima Bello",
      program: "UI/UX Design",
      email: "fatima.bello@example.com",
      date: "2026-04-14",
      status: "rejected",
      earnings: "₦0",
    },
  ];

  const filteredRegistrations = registrations.filter((reg) => {
    const matchesSearch =
      reg.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.program.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || reg.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500/20 text-green-400">Approved</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
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

          {/* Register New Student Button */}
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
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" /> Filter Referrals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                placeholder="Search by name or program..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <div className="flex gap-2">
                {(["all", "pending", "approved", "rejected"] as const).map((status) => (
                  <Button
                    key={status}
                    variant={filterStatus === status ? "default" : "outline"}
                    onClick={() => setFilterStatus(status)}
                    className="capitalize"
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Registrations Table */}
        <Card className="glass">
          <CardHeader>
            <CardTitle>Referral List ({filteredRegistrations.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4">Student</th>
                    <th className="text-left py-4 px-4">Program</th>
                    <th className="text-left py-4 px-4">Date</th>
                    <th className="text-left py-4 px-4">Status</th>
                    <th className="text-right py-4 px-4">Earnings</th>
                    <th className="text-center py-4 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRegistrations.map((reg) => (
                    <tr key={reg.id} className="border-b border-border hover:bg-secondary/30">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium">{reg.studentName}</p>
                          <p className="text-xs text-muted-foreground">{reg.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground">{reg.program}</td>
                      <td className="py-4 px-4 text-muted-foreground">{reg.date}</td>
                      <td className="py-4 px-4">{getStatusBadge(reg.status)}</td>
                      <td className="py-4 px-4 text-right font-semibold text-green-400">
                        {reg.earnings}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredRegistrations.length === 0 && (
                <p className="text-center py-10 text-muted-foreground">
                  No referrals found.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AffiliateRegistrations;