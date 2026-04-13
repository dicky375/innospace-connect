// src/components/LeaderboardWidget.tsx

// 1. Define the shape of a single user (adjust fields based on your API)
interface LeaderboardUser {
  id: string;
  name: string;
  totalEarnings: number;
  // add other fields like avatar, rank, etc.
}

// 2. Define the props interface
interface LeaderboardWidgetProps {
  users: LeaderboardUser[];
}

// 3. Apply the interface to the component
const LeaderboardWidget = ({ users }: LeaderboardWidgetProps) => {
  return (
    <div className="rounded-lg border bg-card p-4">
      {users?.map((user) => (
        <div key={user.id} className="flex justify-between py-2 border-b last:border-0">
          <span>{user.name}</span>
          <span className="font-bold">${user.totalEarnings}</span>
        </div>
      ))}
    </div>
  );
};

export default LeaderboardWidget;