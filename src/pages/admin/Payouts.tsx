import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, DollarSign, Calendar } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

interface PayoutItem {
  id: string;
  studentName: string;
  affiliateName: string;
  affiliateId: string;
  program: string;
  commission: number;
  approvedAt: string;
  status: "approved" | "paid";
}

const AdminPayouts = () => {
  const queryClient = useQueryClient();

  // Fetch approved but unpaid registrations
  const { data: payouts = [], isLoading } = useQuery({
    queryKey: ["pending-payouts"],
    queryFn: async () => {
      const { data } = await api.get("/api/payouts/pending");
      return data;
    },
  });

  // Mark as Paid Mutation
  const markPaidMutation = useMutation({
    mutationFn: async (registrationId: string) =>
      api.patch(`/api/registrations/${registrationId}/pay`),
    onSuccess: () => {
      toast.success("✅ Commission paid successfully");
      queryClient.invalidateQueries({ queryKey: ["pending-payouts"] });
      queryClient.invalidateQueries({ queryKey: ["pending-registrations"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || "Failed to process payout");
    },
  });

  const totalPending = payouts.reduce((sum: number, item: PayoutItem) => sum + item.commission, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold">Commission Payouts</h1>
            <p className="text-muted-foreground">Pay approved commissions to affiliates</p>
          </div>

          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total Pending Payout</p>
            <p className="text-3xl font-bold text-green-400">
              ₦{totalPending.toLocaleString()}
            </p>
          </div>
        </div>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Approved Registrations Awaiting Payment
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
                <p className="text-xl">All commissions have been paid</p>
                <p className="text-muted-foreground mt-2">No pending payouts</p>
              </div>
            ) : (
              <div className="space-y-4">
                {payouts.map((item: PayoutItem) => (
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
                          <p className="font-semibold">{item.studentName}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.program} • {item.affiliateName}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 mt-4 md:mt-0">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-400">
                          ₦{item.commission.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(item.approvedAt).toLocaleDateString("en-NG")}
                        </p>
                      </div>

                      <Button
                        onClick={() => markPaidMutation.mutate(item.id)}
                        disabled={markPaidMutation.isPending}
                        className="bg-green-600 hover:bg-green-700 whitespace-nowrap"
                      >
                        {markPaidMutation.isPending ? "Processing..." : "Mark as Paid"}
                      </Button>
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