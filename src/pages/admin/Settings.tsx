import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";

const AdminSettings = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground text-sm">System configuration</p>
        </div>

        <div className="glass p-6 animate-fade-in">
          <h3 className="text-lg font-bold mb-4">Admin Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-secondary/30">
              <p className="text-xs text-muted-foreground mb-1">Name</p>
              <p className="font-medium">{user?.name}</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/30">
              <p className="text-xs text-muted-foreground mb-1">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/30">
              <p className="text-xs text-muted-foreground mb-1">Commission Rate</p>
              <p className="font-medium">5% (first month)</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/30">
              <p className="text-xs text-muted-foreground mb-1">Role</p>
              <p className="font-medium capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminSettings;