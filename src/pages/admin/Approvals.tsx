import React from "react";
import { Check, FileText, X } from "lucide-react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"; // Updated import
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"; // eslint-disable-line import/no-unresolved
import api from "@/lib/api";

const AdminApprovals = () => {
  const queryClient = useQueryClient();

  // Fetch pending registrations
  const { data, isLoading } = useQuery({
    queryKey: ["pending-registrations"],
    queryFn: async () => {
      const { data } = await api.get("/api/registrations/pending");
      return data;
    },
  });

  // Mutation for approval
  const approveMutation = useMutation({
    mutationFn: async (id: string) => api.patch(`/api/registrations/${id}/approve`),
    onSuccess: () => {
      toast.success("Registration approved!");
      queryClient.invalidateQueries({ queryKey: ["pending-registrations"] });
    },
    onError: (err: any) => toast.error(err?.response?.data?.error || "Failed to approve"),
  });

  // Mutation for rejection
  const rejectMutation = useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) =>
      api.patch(`/api/registrations/${id}/reject`, { reason }),
    onSuccess: () => {
      toast.success("Registration rejected");
      queryClient.invalidateQueries({ queryKey: ["pending-registrations"] });
    },
    onError: (err: any) => toast.error(err?.response?.data?.error || "Failed to reject"),
  });

  const pending = data || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Pending Approvals</h1>
          <p className="text-muted-foreground text-sm">
            {pending.length} registration(s) awaiting review
          </p>
        </div>

        <div className="glass p-6 animate-fade-in">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          ) : pending.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">
              No pending approvals 🎉
            </p>
          ) : (
            <div className="space-y-4">
              {pending.map((r: any) => (
                <div
                  key={r.id}
                  className="border border-border/50 rounded-lg p-4 hover:bg-secondary/20 transition-colors"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    {/* Student info */}
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Student</p>
                      <p className="font-semibold">{r.studentName}</p>
                      <p className="text-sm text-muted-foreground">{r.studentPhone}</p>
                      {r.studentEmail && (
                        <p className="text-sm text-muted-foreground">{r.studentEmail}</p>
                      )}
                    </div>

                    {/* Academic info */}
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Academic</p>
                      <p className="text-sm font-medium">{r.regNumber}</p>
                      <p className="text-sm text-muted-foreground">{r.course}</p>
                      <p className="text-sm text-muted-foreground">{r.department}</p>
                    </div>

                    {/* Program info */}
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Program</p>
                      <p className="text-sm font-medium">{r.Program?.title || "—"}</p>
                      <p className="text-sm text-muted-foreground capitalize">{r.Program?.type}</p>
                      <p className="text-sm text-muted-foreground">
                        ₦{Number(r.amount).toLocaleString()}/month
                      </p>
                    </div>

                    {/* Supervisor info */}
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Head of Department</p>
                      <p className="text-sm font-medium">{r.hodName}</p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Supervisor</p>
                      <p className="text-sm font-medium">{r.supervisorName}</p>
                    </div>

                    {/* Date */}
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Submitted</p>
                      <p className="text-sm font-medium">
                        {new Date(r.createdAt).toLocaleDateString("en-NG")}
                      </p>
                    </div>
                  </div>

                  {/* File + Actions row */}
                  <div className="flex items-center justify-between pt-3 border-t border-border/30">
                    <div>
                      {r.siwesFormPath ? (
                        <a
                          href={`http://localhost:3002/uploads/${r.siwesFormPath}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-primary text-sm hover:opacity-80 transition-opacity"
                        >
                          <FileText className="h-4 w-4" />
                          View SIWES Form ({r.siwesFormName})
                        </a>
                      ) : (
                        <span className="text-sm text-muted-foreground">No form uploaded</span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => approveMutation.mutate(r.id)}
                        disabled={approveMutation.isPending}
                        className="bg-green-600 hover:bg-green-700 text-white h-8 px-4"
                      >
                        <Check className="h-3 w-3 mr-1" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => rejectMutation.mutate({ id: r.id })}
                        disabled={rejectMutation.isPending}
                        className="h-8 px-4"
                      >
                        <X className="h-3 w-3 mr-1" /> Reject
                      </Button>
                    </div>
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