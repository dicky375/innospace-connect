import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Users, TrendingUp, Ban } from "lucide-react";
import { toast } from "sonner";

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"affiliates" | "students">("affiliates");

  // Mock Data
  const affiliates = [
    { id: 1, name: "Adewale Johnson", email: "adewale@example.com", students: 18, earnings: 1245000, status: "active", joinDate: "2025-12-01" },
    { id: 2, name: "Chioma Nwosu", email: "chioma@example.com", students: 12, earnings: 875000, status: "active", joinDate: "2026-01-15" },
    { id: 3, name: "Ibrahim Musa", email: "ibrahim@example.com", students: 25, earnings: 2150000, status: "active", joinDate: "2025-11-20" },
    { id: 4, name: "Fatima Bello", email: "fatima@example.com", students: 5, earnings: 320000, status: "suspended", joinDate: "2026-02-10" },
  ];

  const students = [
    { id: 101, name: "Chinedu Eze", email: "chinedu@example.com", program: "Frontend Internship", affiliate: "Adewale Johnson", status: "approved", date: "2026-04-10" },
    { id: 102, name: "Blessing Akin", email: "blessing@example.com", program: "Data Science", affiliate: "Chioma Nwosu", status: "pending", date: "2026-04-16" },
  ];

  const filteredAffiliates = affiliates.filter(a =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSuspend = (id: number, name: string) => {
    toast.error(`User ${name} has been suspended`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Users Management</h1>
            <p className="text-muted-foreground">Manage Affiliates and Students</p>
          </div>
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-border">
          <Button
            variant={activeTab === "affiliates" ? "default" : "ghost"}
            onClick={() => setActiveTab("affiliates")}
          >
            <Users className="mr-2 h-4 w-4" />
            Affiliates ({affiliates.length})
          </Button>
          <Button
            variant={activeTab === "students" ? "default" : "ghost"}
            onClick={() => setActiveTab("students")}
          >
            Students ({students.length})
          </Button>
        </div>

        {/* Affiliates Table */}
        {activeTab === "affiliates" && (
          <Card className="glass">
            <CardHeader>
              <CardTitle>All Affiliates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-4 px-4">Affiliate</th>
                      <th className="text-left py-4 px-4">Students Referred</th>
                      <th className="text-left py-4 px-4">Total Earnings</th>
                      <th className="text-left py-4 px-4">Joined</th>
                      <th className="text-center py-4 px-4">Status</th>
                      <th className="text-center py-4 px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAffiliates.map((aff) => (
                      <tr key={aff.id} className="border-b border-border hover:bg-secondary/30">
                        <td className="py-4 px-4">
                          <p className="font-medium">{aff.name}</p>
                          <p className="text-xs text-muted-foreground">{aff.email}</p>
                        </td>
                        <td className="py-4 px-4 font-semibold">{aff.students}</td>
                        <td className="py-4 px-4 font-semibold text-green-400">
                          ₦{aff.earnings.toLocaleString()}
                        </td>
                        <td className="py-4 px-4 text-muted-foreground">{aff.joinDate}</td>
                        <td className="py-4 px-4 text-center">
                          <Badge variant={aff.status === "active" ? "default" : "destructive"}>
                            {aff.status.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleSuspend(aff.id, aff.name)}
                          >
                            <Ban className="h-4 w-4 mr-1" />
                            Suspend
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Students Table */}
        {activeTab === "students" && (
          <Card className="glass">
            <CardHeader>
              <CardTitle>All Registered Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-4 px-4">Student</th>
                      <th className="text-left py-4 px-4">Program</th>
                      <th className="text-left py-4 px-4">Affiliate</th>
                      <th className="text-left py-4 px-4">Date</th>
                      <th className="text-center py-4 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id} className="border-b hover:bg-secondary/30">
                        <td className="py-4 px-4">
                          <p className="font-medium">{student.name}</p>
                          <p className="text-xs text-muted-foreground">{student.email}</p>
                        </td>
                        <td className="py-4 px-4">{student.program}</td>
                        <td className="py-4 px-4 text-muted-foreground">{student.affiliate}</td>
                        <td className="py-4 px-4 text-muted-foreground">{student.date}</td>
                        <td className="py-4 px-4 text-center">
                          <Badge variant={student.status === "approved" ? "default" : "secondary"}>
                            {student.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminUsers;