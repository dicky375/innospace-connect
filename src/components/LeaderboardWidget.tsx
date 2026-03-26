import { Trophy } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  name: string;
  earnings: number;
  registrations: number;
}

const mockData: LeaderboardEntry[] = [
  { rank: 1, name: "Adewale Johnson", earnings: 125000, registrations: 25 },
  { rank: 2, name: "Chioma Nwosu", earnings: 98000, registrations: 19 },
  { rank: 3, name: "Ibrahim Musa", earnings: 87500, registrations: 17 },
  { rank: 4, name: "Funke Adeyemi", earnings: 76000, registrations: 15 },
  { rank: 5, name: "Emmanuel Obi", earnings: 64000, registrations: 13 },
];

const LeaderboardWidget = () => (
  <div className="glass p-6 animate-fade-in">
    <div className="flex items-center gap-2 mb-4">
      <Trophy className="h-5 w-5 text-accent" />
      <h3 className="text-lg font-bold">Top Interns</h3>
    </div>
    <div className="space-y-3">
      {mockData.map((entry) => (
        <div key={entry.rank} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            entry.rank === 1 ? "gradient-accent text-accent-foreground" : entry.rank === 2 ? "bg-muted text-foreground" : entry.rank === 3 ? "bg-muted text-foreground" : "bg-secondary text-muted-foreground"
          }`}>
            {entry.rank}
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{entry.name}</p>
            <p className="text-xs text-muted-foreground">{entry.registrations} registrations</p>
          </div>
          <p className="text-sm font-semibold text-accent">₦{entry.earnings.toLocaleString()}</p>
        </div>
      ))}
    </div>
  </div>
);

export default LeaderboardWidget;
