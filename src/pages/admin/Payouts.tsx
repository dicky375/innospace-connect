import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, DollarSign, Calendar, X } from "lucide-react";
import { toast } from "sonner";
import api, { PAYOUTS } from "@/lib/api";

const AdminPayouts = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["pending-payouts"],
    queryFn: async () => {
      const { data } = await api.get(`${PAYOUTS}/pending`);
      return data;
    },
  });

  const payouts = data?.payouts || [];

  const approveMutation = useMutation({
    mutationFn: async (id: string) => api.patch(`${PAYOUTS}/${id}/approve`),
    onSuccess: () => {
      toast.success("Payout approved and balance deducted");
      queryClient.invalidateQueries({ queryKey: ["pending-payouts"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || "Failed to approve payout");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) =>
      api.patch(`${PAYOUTS}/${id}/reject`, { reason: reason || "Not approved" }),
    onSuccess: () => {
      toast.success("Payout rejected");
      queryClient.invalidateQueries({ queryKey: ["pending-payouts"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || "Failed to reject payout");
    },
  });

  const totalPending = payouts.reduce(
    (sum: number, item: any) => sum + parseFloat(item.amount || 0),
    0
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold">Commission Payouts</h1>
            <p className="text-muted-foreground">
              Approve or reject affiliate payout requests
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total Pending</p>
            <p className="text-3xl font-bold text-green-400">
              ₦{totalPending.toLocaleString()}
            </p>
          </div>
        </div>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Pending Payout Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            ) : payouts.length === 0 ? (
              <div className="text-center py-16">
                <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
                <p className="text-xl">No pending payout requests</p>
                <p className="text-muted-foreground mt-2">
                  All requests have been processed
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {payouts.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex flex-col md:flex-row md:items-center justify-between border border-border rounded-xl p-5 hover:border-primary/50 transition-all"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-green-500/10 rounded-full flex items-center justify-center">
                          <DollarSign className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                          <p className="font-semibold">{item.accountName}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.bankName} • {item.accountNumber}
                          </p>
                          {item.note && (
                            <p className="text-xs text-muted-foreground mt-1 italic">
                              "{item.note}"
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 mt-4 md:mt-0">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-400">
                          ₦{parseFloat(item.amount).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(item.createdAt).toLocaleDateString("en-NG")}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => approveMutation.mutate(item.id)}
                          disabled={approveMutation.isPending}
                          className="bg-green-600 hover:bg-green-700 whitespace-nowrap"
                        >
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => rejectMutation.mutate({ id: item.id })}
                          disabled={rejectMutation.isPending}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminPayouts;