import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Ban, Loader2, GraduationCap, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const AdminUsers = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"affiliates" | "students">("affiliates");

  // 1. Fetch Affiliates from Server 1
  const { data: affiliates, isLoading: loadingAffiliates } = useQuery({
    queryKey: ["admin-affiliates"],
    queryFn: async () => {
      const { data } = await api.get("/admin/users/affiliates");
      return data;
    },
    enabled: activeTab === "affiliates",
  });

  // 2. Fetch Students from Server 2
  const { data: students, isLoading: loadingStudents } = useQuery({
    queryKey: ["admin-students"],
    queryFn: async () => {
      const { data } = await api.get("/admin/users/students");
      return data;
    },
    enabled: activeTab === "students",
  });

  // 3. Suspend Mutation
  const suspendMutation = useMutation({
    mutationFn: (id: number) => api.patch(`/admin/users/${id}/status`, { status: "suspended" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-affiliates"] });
      toast.error("Account has been suspended");
    }
  });

  const filteredData = (activeTab === "affiliates" ? affiliates : students)?.filter((user: any) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground">Monitor platform participants and activity</p>
          </div>
          <div className="relative w-full md:w-72">
            <Input
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-secondary/20"
            />
          </div>
        </div>

        {/* Custom Tabs */}
        <div className="flex p-1 bg-secondary/30 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab("affiliates")}
            className={`flex items-center px-6 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "affiliates" ? "bg-primary text-white shadow-lg" : "hover:bg-secondary"
            }`}
          >
            <Users className="mr-2 h-4 w-4" />
            Affiliates
          </button>
          <button
            onClick={() => setActiveTab("students")}
            className={`flex items-center px-6 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "students" ? "bg-primary text-white shadow-lg" : "hover:bg-secondary"
            }`}
          >
            <GraduationCap className="mr-2 h-4 w-4" />
            Students
          </button>
        </div>

        <Card className="glass border-white/10">
          <CardContent className="p-0">
            {(loadingAffiliates || loadingStudents) ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading user directory...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/50">
                    <tr className="text-muted-foreground">
                      <th className="text-left py-4 px-6 font-semibold">User Details</th>
                      {activeTab === "affiliates" ? (
                        <>
                          <th className="text-left py-4 px-6 font-semibold">Referrals</th>
                          <th className="text-left py-4 px-6 font-semibold">Total Revenue</th>
                        </>
                      ) : (
                        <>
                          <th className="text-left py-4 px-6 font-semibold">Program</th>
                          <th className="text-left py-4 px-6 font-semibold">Referrer</th>
                        </>
                      )}
                      <th className="text-left py-4 px-6 font-semibold">Status</th>
                      <th className="text-center py-4 px-6 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((user: any) => (
                      <tr key={user.id} className="border-b border-white/5 hover:bg-secondary/20 transition-colors">
                        <td className="py-4 px-6">
                          <p className="font-bold">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </td>
                        
                        {activeTab === "affiliates" ? (
                          <>
                            <td className="py-4 px-6 font-medium">{user._count?.students || 0}</td>
                            <td className="py-4 px-6 font-bold text-green-400">
                              ₦{(user.totalEarnings || 0).toLocaleString()}
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="py-4 px-6 text-muted-foreground">{user.Program?.name}</td>
                            <td className="py-4 px-6 text-xs">{user.Affiliate?.name || "Direct"}</td>
                          </>
                        ) }

                        <td className="py-4 px-6">
                          <Badge 
                            variant={user.status === "active" || user.status === "approved" ? "default" : "destructive"}
                            className="capitalize"
                          >
                            {user.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-6 text-center">
                          {activeTab === "affiliates" ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:bg-destructive/10"
                              onClick={() => {
                                if(confirm(`Suspend ${user.name}?`)) suspendMutation.mutate(user.id);
                              }}
                              disabled={user.status === "suspended"}
                            >
                              <Ban className="h-4 w-4 mr-1" />
                              Suspend
                            </Button>
                          ) : (
                            <Button variant="ghost" size="sm">View Docs</Button>
                          )}
                        </td>
                      </tr>
                    ))}
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

export default AdminUsers;