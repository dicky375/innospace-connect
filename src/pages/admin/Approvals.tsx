import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Check, X } from "lucide-react";
import api from "@/lib/api";

const AdminApprovals = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["pending-registrations"],
    queryFn: async () => {
      const { data } = await api.get("/api/registrations/pending");
      return data;
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (id: string) => api.patch(`/api/registrations/${id}/approve`),
    onSuccess: () => {
      toast.success("Registration approved!");
      queryClient.invalidateQueries({ queryKey: ["pending-registrations"] });
    },
    onError: (err: any) => toast.error(err?.response?.data?.error || "Failed"),
  });

  const rejectMutation = useMutation({
    mutationFn: async (id: string) => api.patch(`/api/registrations/${id}/reject`),
    onSuccess: () => {
      toast.success("Registration rejected");
      queryClient.invalidateQueries({ queryKey: ["pending-registrations"] });
    },
    onError: (err: any) => toast.error(err?.response?.data?.error || "Failed"),
  });

  const pending = data || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Pending Approvals</h1>
          <p className="text-muted-foreground text-sm">{pending.length} registration(s) awaiting review</p>
        </div>

        <div className="glass p-6 animate-fade-in">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          ) : pending.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">No pending approvals 🎉</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="text-left py-3 px-2">Program</th>
                    <th className="text-left py-3 px-2">Type</th>
                    <th className="text-left py-3 px-2">Amount</th>
                    <th className="text-left py-3 px-2">Self Reg</th>
                    <th className="text-left py-3 px-2">Date</th>
                    <th className="text-right py-3 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pending.map((r: any) => (
                    <tr key={r.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                      <td className="py-3 px-2 font-medium">{r.Program?.title || "—"}</td>
                      <td className="py-3 px-2 text-muted-foreground capitalize">{r.Program?.type || "—"}</td>
                      <td className="py-3 px-2 text-muted-foreground">₦{Number(r.amount).toLocaleString()}</td>
                      <td className="py-3 px-2 text-muted-foreground">{r.isSelfRegistered ? "Yes" : "No"}</td>
                      <td className="py-3 px-2 text-muted-foreground">{new Date(r.createdAt).toLocaleDateString("en-NG")}</td>
                      <td className="py-3 px-2 text-right space-x-2">
                        <Button size="sm" onClick={() => approveMutation.mutate(r.id)} disabled={approveMutation.isPending} className="bg-green-600 hover:bg-green-700 text-white h-8 px-3">
                          <Check className="h-3 w-3 mr-1" /> Approve
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => rejectMutation.mutate(r.id)} disabled={rejectMutation.isPending} className="h-8 px-3">
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
      </div>
    </DashboardLayout>
  );
};

export default AdminApprovals;