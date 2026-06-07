import React from "react";
import { Check, X, FileText, User } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import api, { REGISTRATIONS } from "@/lib/api";

const AdminApprovals = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["pending-registrations"],
    queryFn: async () => {
      const { data } = await api.get(`${REGISTRATIONS}/pending`);
      return data;
    },
  });

  const pending = data?.registrations || [];

  const approveMutation = useMutation({
    mutationFn: async (id: string) =>
      api.patch(`${REGISTRATIONS}/${id}/approve`),
    onSuccess: () => {
      toast.success("Registration approved! Commission assigned.");
      queryClient.invalidateQueries({ queryKey: ["pending-registrations"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || "Failed to approve registration");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) =>
      api.patch(`${REGISTRATIONS}/${id}/reject`, {
        reason: reason || "Not approved",
      }),
    onSuccess: () => {
      toast.success("Registration rejected");
      queryClient.invalidateQueries({ queryKey: ["pending-registrations"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || "Failed to reject registration");
    },
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold">Pending Approvals</h1>
            <p className="text-muted-foreground">
              Review student registrations submitted by affiliates
            </p>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            {pending.length} Pending
          </Badge>
        </div>

        <div className="glass p-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : pending.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-2xl mb-2">🎉 No pending approvals</p>
              <p className="text-muted-foreground">
                All registrations have been reviewed
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {pending.map((r: any) => (
                <div
                  key={r.id}
                  className="border border-border rounded-xl p-6 hover:border-primary/50 transition-all"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                        Student
                      </p>
                      <p className="font-semibold text-lg">{r.studentName}</p>
                      <p className="text-sm text-muted-foreground">
                        {r.studentEmail}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {r.studentPhone}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                        Academic Details
                      </p>
                      <p className="font-medium">{r.regNumber}</p>
                      <p>{r.department}</p>
                      <p className="text-sm text-muted-foreground">{r.course}</p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                        Program
                      </p>
                      <p className="font-medium">{r.Program?.title || "—"}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {r.Program?.type}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                        Commission (10%)
                      </p>
                      <p className="text-2xl font-bold text-green-400">
                        ₦{(Number(r.amount) * 0.1).toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                        HOD
                      </p>
                      <p>{r.hodName}</p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                        Supervisor
                      </p>
                      <p>{r.supervisorName}</p>
                    </div>
                  </div>

                  {r.siwesFormName && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <a
                        href={`http://localhost:3000/reg/api/registrations/file/${r.id}?token=${localStorage.getItem('accessToken')}`}
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-primary hover:underline"
                      >
                        <FileText className="h-4 w-4" />
                        View Uploaded SIWES Form
                      </a>
                    </div>
                  )}

                  <div className="flex gap-3 mt-6">
                    <Button
                      onClick={() => approveMutation.mutate(r.id)}
                      disabled={approveMutation.isPending}
                      className="bg-green-600 hover:bg-green-700 flex-1 md:flex-none"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Approve & Assign Commission
                    </Button>

                    <Button
                      variant="destructive"
                      onClick={() => rejectMutation.mutate({ id: r.id })}
                      disabled={rejectMutation.isPending}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminApprovals;