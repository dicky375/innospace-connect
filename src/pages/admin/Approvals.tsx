import React from "react";
import { Check, X, FileText, User } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import api from "@/lib/api";

const AdminApprovals = () => {
  const queryClient = useQueryClient();

  // Fetch pending registrations
  const { data: pending = [], isLoading } = useQuery({
    queryKey: ["pending-registrations"],
    queryFn: async () => {
      const { data } = await api.get("/api/registrations/pending");
      return data;
    },
  });

  // Approve Mutation
  const approveMutation = useMutation({
    mutationFn: async (id: string) => api.patch(`/api/registrations/${id}/approve`),
    onSuccess: () => {
      toast.success("✅ Registration approved! Commission marked for payout.");
      queryClient.invalidateQueries({ queryKey: ["pending-registrations"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || "Failed to approve registration");
    },
  });

  // Reject Mutation
  const rejectMutation = useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) =>
      api.patch(`/api/registrations/${id}/reject`, { reason: reason || "Not approved" }),
    onSuccess: () => {
      toast.success("❌ Registration rejected");
      queryClient.invalidateQueries({ queryKey: ["pending-registrations"] });
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
              <p className="text-muted-foreground">All registrations have been reviewed</p>
            </div>
          ) : (
            <div className="space-y-6">
              {pending.map((r: any) => (
                <div
                  key={r.id}
                  className="border border-border rounded-xl p-6 hover:border-primary/50 transition-all"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                    {/* Student Info */}
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Student</p>
                      <p className="font-semibold text-lg">{r.studentName}</p>
                      <p className="text-sm text-muted-foreground">{r.studentEmail}</p>
                      <p className="text-sm text-muted-foreground">{r.studentPhone}</p>
                    </div>

                    {/* Academic Info */}
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Academic Details</p>
                      <p className="font-medium">{r.regNumber}</p>
                      <p>{r.department}</p>
                      <p className="text-sm text-muted-foreground">{r.course}</p>
                    </div>

                    {/* Program & Affiliate */}
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Program</p>
                      <p className="font-medium">{r.Program?.title || "—"}</p>
                      <p className="text-sm text-muted-foreground capitalize">{r.Program?.type}</p>

                      <div className="mt-4">
                        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Affiliate</p>
                        <p className="flex items-center gap-2">
                          <User className="h-4 w-4" /> {r.Affiliate?.name || "Unknown"}
                        </p>
                      </div>
                    </div>

                    {/* Commission & Supervisor */}
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Commission</p>
                      <p className="text-2xl font-bold text-green-400">
                        ₦{Number(r.commission || 35000).toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">HOD</p>
                      <p>{r.hodName}</p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Supervisor</p>
                      <p>{r.supervisorName}</p>
                    </div>
                  </div>

                  {/* SIWES Form */}
                  {r.siwesFormPath && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <a
                        href={`http://localhost:3002/uploads/${r.siwesFormPath}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-primary hover:underline"
                      >
                        <FileText className="h-4 w-4" />
                        View Uploaded SIWES Form
                      </a>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-6">
                    <Button
                      onClick={() => approveMutation.mutate(r.id)}
                      disabled={approveMutation.isPending}
                      className="bg-green-600 hover:bg-green-700 flex-1 md:flex-none"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Approve & Release Commission
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