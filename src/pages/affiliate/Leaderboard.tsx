import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Trophy, Medal, Loader2 } from "lucide-react";

interface LeaderboardUser {
  id: string;
  name: string;
  totalEarnings: number;
}

const LeaderboardWidget = () => {
  // 1. Fetch Top 5 Affiliates from the Backend
  const { data: users, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      // Hits port 3000 -> Routes to appropriate service (likely Payments or Registrations)
      const { data } = await api.get("/affiliates/leaderboard");
      return data;
    },
    // Refresh every 5 minutes since this doesn't change every second
    staleTime: 1000 * 60 * 5, 
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card/50 backdrop-blur-sm overflow-hidden">
      <div className="p-4 border-b bg-primary/5 flex items-center gap-2">
        <Trophy className="h-5 w-5 text-yellow-500" />
        <h2 className="font-bold">Top Earners</h2>
      </div>
      
      <div className="p-2">
        {users?.map((user: LeaderboardUser, index: number) => (
          <div 
            key={user.id} 
            className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              {/* Rank Icons for Top 3 */}
              <div className="w-6 text-center font-mono text-sm">
                {index === 0 ? <Medal className="h-4 w-4 text-yellow-500 mx-auto" /> : 
                 index === 1 ? <Medal className="h-4 w-4 text-slate-400 mx-auto" /> :
                 index === 2 ? <Medal className="h-4 w-4 text-amber-600 mx-auto" /> : 
                 index + 1}
              </div>
              <span className="font-medium text-sm">{user.name}</span>
            </div>
            
            <span className="font-bold text-sm text-green-500">
              ₦{user.totalEarnings.toLocaleString()}
            </span>
          </div>
        ))}

        {(!users || users.length === 0) && (
          <p className="text-center py-4 text-xs text-muted-foreground">
            No data available yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default LeaderboardWidget;