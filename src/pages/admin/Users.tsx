import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api, { USERS } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Ban, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

const AdminUsers = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: affiliates, isLoading } = useQuery({
    queryKey: ["admin-affiliates"],
    queryFn: async () => {
      const { data } = await api.get(USERS);
      // Filter to only affiliates
      return data.filter((u: any) => u.role === "affiliate");
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: (id: string) => api.patch(`${USERS}/${id}/deactivate`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-affiliates"] });
      toast.success("Account deactivated");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || "Failed to deactivate account");
    },
  });

  const activateMutation = useMutation({
    mutationFn: (id: string) => api.patch(`${USERS}/${id}/activate`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-affiliates"] });
      toast.success("Account activated");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || "Failed to activate account");
    },
  });

  const filtered =
    affiliates?.filter(
      (user: any) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground">
              Monitor affiliate accounts
            </p>
          </div>
          <Input
            placeholder="Search affiliates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-secondary/20 w-full md:w-72"
          />
        </div>

        <Card className="glass border-white/10">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                  Loading affiliates...
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/50">
                    <tr className="text-muted-foreground">
                      <th className="text-left py-4 px-6 font-semibold">
                        Affiliate
                      </th>
                      <th className="text-left py-4 px-6 font-semibold">
                        Phone
                      </th>
                      <th className="text-left py-4 px-6 font-semibold">
                        Bank Details
                      </th>
                      <th className="text-left py-4 px-6 font-semibold">
                        Status
                      </th>
                      <th className="text-center py-4 px-6 font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="text-center py-12 text-muted-foreground"
                        >
                          No affiliates found
                        </td>
                      </tr>
                    ) : (
                      filtered.map((user: any) => (
                        <tr
                          key={user.id}
                          className="border-b border-white/5 hover:bg-secondary/20 transition-colors"
                        >
                          <td className="py-4 px-6">
                            <p className="font-bold">{user.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {user.email}
                            </p>
                          </td>
                          <td className="py-4 px-6 text-muted-foreground">
                            {user.phone || "—"}
                          </td>
                          <td className="py-4 px-6 text-muted-foreground">
                            {user.bankName ? (
                              <div>
                                <p className="font-medium text-foreground">
                                  {user.bankName}
                                </p>
                                <p className="text-xs">{user.accountNumber}</p>
                              </div>
                            ) : (
                              <span className="text-xs italic">
                                Not provided
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-6">
                            <Badge
                              variant={
                                user.isActive ? "default" : "destructive"
                              }
                              className="capitalize"
                            >
                              {user.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </td>
                          <td className="py-4 px-6 text-center">
                            {user.isActive ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:bg-destructive/10"
                                onClick={() => {
                                  if (
                                    confirm(`Deactivate ${user.name}?`)
                                  )
                                    deactivateMutation.mutate(user.id);
                                }}
                              >
                                <Ban className="h-4 w-4 mr-1" />
                                Deactivate
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-green-500 hover:bg-green-500/10"
                                onClick={() => activateMutation.mutate(user.id)}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Activate
                              </Button>
                            )}
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

export default AdminUsers;