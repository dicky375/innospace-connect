import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api, { COMMISSIONS, PAYOUTS, PAYMENTS } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Wallet as WalletIcon, Loader2, ArrowUpRight, CheckCircle, Clock, XCircle } from "lucide-react";

const AffiliateWallet = () => {
  const queryClient = useQueryClient();
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawForm, setWithdrawForm] = useState({
    amount: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
    note: "",
  });

  const { data: balanceData, isLoading: balanceLoading } = useQuery({
    queryKey: ["affiliate-balance"],
    queryFn: async () => {
      const { data } = await api.get(`${COMMISSIONS}/balance`);
      return data;
    },
  });

  const { data: transactionsData, isLoading: txLoading } = useQuery({
    queryKey: ["affiliate-transactions"],
    queryFn: async () => {
      const { data } = await api.get(`${PAYMENTS}/transactions`);
      return data;
    },
  });

  const { data: payoutsData, isLoading: payoutsLoading } = useQuery({
    queryKey: ["affiliate-payouts"],
    queryFn: async () => {
      const { data } = await api.get(`${PAYOUTS}/my`);
      return data;
    },
  });

  const withdrawMutation = useMutation({
    mutationFn: (payload: typeof withdrawForm) =>
      api.post(`${PAYOUTS}/request`, {
        ...payload,
        amount: parseFloat(payload.amount),
      }),
    onSuccess: () => {
      toast.success("Payout request submitted — pending admin approval");
      setShowWithdraw(false);
      setWithdrawForm({ amount: "", bankName: "", accountNumber: "", accountName: "", note: "" });
      queryClient.invalidateQueries({ queryKey: ["affiliate-payouts"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || "Failed to submit payout request");
    },
  });

  const balance = parseFloat(balanceData?.balance || "0");
  const transactions = transactionsData?.transactions || [];
  const payouts = payoutsData?.payouts || [];

  const approvedPayouts = payouts.filter((p: any) => p.status === "approved");
  const pendingPayouts = payouts.filter((p: any) => p.status === "pending");
  const totalPaidOut = approvedPayouts.reduce(
    (sum: number, p: any) => sum + parseFloat(p.amount || 0), 0
  );

  if (balanceLoading || txLoading || payoutsLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const payoutStatusIcon = (status: string) => {
    if (status === "approved") return <CheckCircle className="h-4 w-4 text-green-400" />;
    if (status === "rejected") return <XCircle className="h-4 w-4 text-destructive" />;
    return <Clock className="h-4 w-4 text-yellow-400" />;
  };

  const payoutStatusColor = (status: string) => {
    if (status === "approved") return "bg-green-500/20 text-green-400";
    if (status === "rejected") return "bg-destructive/20 text-destructive";
    return "bg-yellow-500/20 text-yellow-400";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Wallet</h1>
            <p className="text-muted-foreground">Manage your commission earnings</p>
          </div>
          <Button onClick={() => setShowWithdraw(!showWithdraw)}>
            <ArrowUpRight className="mr-2 h-4 w-4" />
            Request Payout
          </Button>
        </div>

        {/* Balance + Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden">
            <p className="text-slate-400 text-sm mb-1">Available Balance</p>
            <h2 className="text-5xl font-bold">₦{balance.toLocaleString()}</h2>
            <div className="mt-6 flex gap-8 border-t border-slate-800 pt-4">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-widest">Total Paid Out</p>
                <p className="text-xl font-bold text-green-400">
                  ₦{totalPaidOut.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-widest">Pending Requests</p>
                <p className="text-xl font-bold text-yellow-400">{pendingPayouts.length}</p>
              </div>
            </div>
            <WalletIcon className="absolute -right-10 -bottom-10 text-white/5 w-64 h-64" />
          </div>

          <Card className="glass">
            <CardContent className="p-6 flex flex-col justify-center h-full">
              <p className="text-sm text-muted-foreground mb-2">Approved Payouts</p>
              <p className="text-3xl font-bold text-green-400">{approvedPayouts.length}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Total: ₦{totalPaidOut.toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Withdraw Form */}
        {showWithdraw && (
          <Card className="glass border-primary/20">
            <CardHeader>
              <CardTitle>Request Payout</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label>Amount (₦)</Label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={withdrawForm.amount}
                    onChange={(e) => setWithdrawForm({ ...withdrawForm, amount: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Available: ₦{balance.toLocaleString()}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Bank Name</Label>
                  <Input
                    placeholder="e.g. GTBank"
                    value={withdrawForm.bankName}
                    onChange={(e) => setWithdrawForm({ ...withdrawForm, bankName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Account Number</Label>
                  <Input
                    placeholder="0123456789"
                    value={withdrawForm.accountNumber}
                    onChange={(e) => setWithdrawForm({ ...withdrawForm, accountNumber: e.target.value })}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Account Name</Label>
                  <Input
                    placeholder="Name on bank account"
                    value={withdrawForm.accountName}
                    onChange={(e) => setWithdrawForm({ ...withdrawForm, accountName: e.target.value })}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Note (optional)</Label>
                  <Input
                    placeholder="e.g. Monthly commission payout"
                    value={withdrawForm.note}
                    onChange={(e) => setWithdrawForm({ ...withdrawForm, note: e.target.value })}
                  />
                </div>
              </div>
              <Button
                onClick={() => withdrawMutation.mutate(withdrawForm)}
                disabled={withdrawMutation.isPending}
                className="w-full"
              >
                {withdrawMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                  </span>
                ) : (
                  "Submit Payout Request"
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Payout History */}
        <Card className="glass">
          <CardHeader>
            <CardTitle>Payout History</CardTitle>
          </CardHeader>
          <CardContent>
            {payouts.length === 0 ? (
              <p className="text-center text-muted-foreground py-6">
                No payout requests yet
              </p>
            ) : (
              <div className="space-y-3">
                {payouts.map((p: any) => (
                  <div
                    key={p.id}
                    className={`flex justify-between items-center p-4 rounded-lg border ${
                      p.status === "approved"
                        ? "bg-green-500/5 border-green-500/20"
                        : p.status === "rejected"
                        ? "bg-destructive/5 border-destructive/20"
                        : "bg-secondary/30 border-border"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {payoutStatusIcon(p.status)}
                      <div>
                        <p className="font-semibold">
                          ₦{parseFloat(p.amount).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {p.bankName} • {p.accountNumber}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Requested: {new Date(p.createdAt).toLocaleDateString("en-NG")}
                        </p>
                        {p.status === "approved" && p.processedAt && (
                          <p className="text-xs text-green-400">
                            Approved: {new Date(p.processedAt).toLocaleDateString("en-NG")}
                          </p>
                        )}
                        {p.status === "rejected" && p.rejectionReason && (
                          <p className="text-xs text-destructive">
                            Reason: {p.rejectionReason}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${payoutStatusColor(p.status)}`}>
                      {p.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card className="glass">
          <CardHeader>
            <CardTitle>Commission Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-6">
                No transactions yet
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/50">
                    <tr>
                      <th className="text-left py-3 px-4">Reference</th>
                      <th className="text-left py-3 px-4">Amount</th>
                      <th className="text-left py-3 px-4">Commission</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx: any) => (
                      <tr key={tx.id} className="border-b border-border/50 hover:bg-secondary/20">
                        <td className="py-3 px-4 font-mono text-xs">{tx.paystackRef}</td>
                        <td className="py-3 px-4">₦{parseFloat(tx.amount).toLocaleString()}</td>
                        <td className="py-3 px-4 text-green-400 font-medium">
                          ₦{parseFloat(tx.commission).toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            tx.paystackStatus === "success"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}>
                            {tx.paystackStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {new Date(tx.createdAt).toLocaleDateString("en-NG")}
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

export default AffiliateWallet;