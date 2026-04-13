import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";

const AffiliateProfile = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-muted-foreground text-sm">Your account details</p>
        </div>

        <div className="glass p-6 animate-fade-in">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-16 w-16 rounded-full gradient-primary flex items-center justify-center text-2xl font-bold text-white">
              {user?.name?.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold">{user?.name}</h2>
              <p className="text-muted-foreground capitalize">{user?.role}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-secondary/30">
              <p className="text-xs text-muted-foreground mb-1">Full Name</p>
              <p className="font-medium">{user?.name || "—"}</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/30">
              <p className="text-xs text-muted-foreground mb-1">Email</p>
              <p className="font-medium">{user?.email || "—"}</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/30">
              <p className="text-xs text-muted-foreground mb-1">Phone</p>
              <p className="font-medium">{user?.phone || "—"}</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/30">
              <p className="text-xs text-muted-foreground mb-1">Role</p>
              <p className="font-medium capitalize">{user?.role || "—"}</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AffiliateProfile;