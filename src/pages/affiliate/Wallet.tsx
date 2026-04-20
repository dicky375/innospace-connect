import DashboardLayout from "@/components/DashboardLayout";
import LeaderboardWidget from "@/components/LeaderboardWidget";
import { Trophy } from "lucide-react";

const AffiliateLeaderboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Trophy className="h-8 w-8 text-yellow-500" />
          <div>
            <h1 className="text-3xl font-bold">Leaderboard</h1>
            <p className="text-muted-foreground">See how you rank among other affiliates</p>
          </div>
        </div>

        <div className="max-w-2xl">
          <LeaderboardWidget />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AffiliateLeaderboard;