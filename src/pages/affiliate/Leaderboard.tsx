import { useQuery } from "@tanstack/react-query";
import api, { COMMISSIONS } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Loader2 } from "lucide-react";

const AffiliateLeaderboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const { data } = await api.get(`${COMMISSIONS}/leaderboard`);
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const rankIcon = (index: number) => {
    if (index === 0) return <Medal className="h-5 w-5 text-yellow-500" />;
    if (index === 1) return <Medal className="h-5 w-5 text-slate-400" />;
    if (index === 2) return <Medal className="h-5 w-5 text-amber-600" />;
    return <span className="text-sm font-mono text-muted-foreground">{index + 1}</span>;
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-yellow-500/10 p-4 rounded-2xl">
              <Trophy className="h-12 w-12 text-yellow-500" />
            </div>
          </div>
          <h1 className="text-4xl font-bold">Leaderboard</h1>
          <p className="text-muted-foreground mt-2">
            Top earning affiliates this period
          </p>
        </div>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Top Earners
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : !data || data.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                No data available yet. Start registering students to appear here!
              </p>
            ) : (
              <div className="space-y-3">
                {data.map((entry: any, index: number) => (
                  <div
                    key={entry.affiliateId}
                    className={`flex items-center justify-between p-4 rounded-xl transition-colors ${
                      index === 0
                        ? "bg-yellow-500/10 border border-yellow-500/20"
                        : index === 1
                        ? "bg-slate-500/10 border border-slate-500/20"
                        : index === 2
                        ? "bg-amber-600/10 border border-amber-600/20"
                        : "bg-secondary/30"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 flex justify-center">
                        {rankIcon(index)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          Affiliate #{entry.affiliateId.slice(0, 8)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Rank #{entry.rank}
                        </p>
                      </div>
                    </div>
                    <p className="font-bold text-green-400">
                      ₦{parseFloat(entry.totalCommission).toLocaleString()}
                    </p>
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

export default AffiliateLeaderboard;