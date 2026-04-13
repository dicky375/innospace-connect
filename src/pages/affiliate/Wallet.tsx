import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/DashboardLayout";
import api from "@/lib/api";
import { Wallet } from "lucide-react";

const AffiliateWallet = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["balance"],
    queryFn: async () => {
      const { data } = await api.get("/api/commissions/balance");
      return data;
    },
  });

  const balance = data?.balance || "0.00";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Wallet</h1>
          <p className="text-muted-foreground text-sm">Your commission earnings</p>
        </div>

        <div className="glass p-8 animate-fade-in flex flex-col items-center justify-center text-center">
          <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
            <Wallet className="h-8 w-8 text-primary" />
          </div>
          <p className="text-muted-foreground text-sm mb-2">Available Balance</p>
          {isLoading ? (
            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
          ) : (
            <p className="text-5xl font-black gradient-text">
              ₦{Number(balance).toLocaleString()}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-4">
            Withdrawals coming soon
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AffiliateWallet;