import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/DashboardLayout";
import api from "@/lib/api";

const roleColors: Record<string, string> = {
  admin: "bg-purple-500/20 text-purple-400",
  intern: "bg-blue-500/20 text-blue-400",
  user: "bg-green-500/20 text-green-400",
};

const AdminUsers = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["all-users"],
    queryFn: async () => {
      const { data } = await api.get("/api/users");
      return data;
    },
  });

  const users = data || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-muted-foreground text-sm">All registered users</p>
        </div>

        <div className="glass p-6 animate-fade-in">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          ) : users.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">No users found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="text-left py-3 px-2">Name</th>
                    <th className="text-left py-3 px-2">Email</th>
                    <th className="text-left py-3 px-2">Phone</th>
                    <th className="text-left py-3 px-2">Role</th>
                    <th className="text-left py-3 px-2">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u: any) => (
                    <tr key={u.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                      <td className="py-3 px-2 font-medium">{u.name}</td>
                      <td className="py-3 px-2 text-muted-foreground">{u.email}</td>
                      <td className="py-3 px-2 text-muted-foreground">{u.phone || "—"}</td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${roleColors[u.role] || ""}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-muted-foreground">{new Date(u.createdAt).toLocaleDateString("en-NG")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminUsers;