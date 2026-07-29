import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api, { USERS } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { UserCircle, Save, Loader2 } from "lucide-react";

const AffiliateProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    bankName: user?.bankName || "",
    accountNumber: user?.accountNumber || "",
    accountName: user?.accountName || "",
  });

const updateMutation = useMutation({
  mutationFn: async (payload: typeof form) => {
    // ✅ Only send fields that have changed AND have a value
    const changes: any = {};
    
    // Check each field individually
    if (payload.name !== user?.name && payload.name.trim() !== '') {
      changes.name = payload.name.trim();
    }
    if (payload.phone !== user?.phone && payload.phone.trim() !== '') {
      changes.phone = payload.phone.trim();
    }
    if (payload.bankName !== user?.bankName && payload.bankName.trim() !== '') {
      changes.bankName = payload.bankName.trim();
    }
    if (payload.accountNumber !== user?.accountNumber && payload.accountNumber.trim() !== '') {
      changes.accountNumber = payload.accountNumber.trim();
    }
    if (payload.accountName !== user?.accountName && payload.accountName.trim() !== '') {
      changes.accountName = payload.accountName.trim();
    }
    
    // If no changes, don't send the request
    if (Object.keys(changes).length === 0) {
      toast.info("No changes to save");
      return;
    }
    
    console.log('[FRONTEND] Sending changes:', changes);
    
    const { data } = await api.patch(`${USERS}/profile`, changes);
    return data;
  },
  onSuccess: (data) => {
    toast.success("Profile updated successfully");
    
    // Update the user in localStorage and context
    if (data?.user) {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...storedUser, ...data.user };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      // Force a refresh
      window.dispatchEvent(new Event('storage'));
    }
    
    queryClient.invalidateQueries({ queryKey: ["affiliate-profile"] });
    queryClient.invalidateQueries({ queryKey: ["user-profile"] });
  },
  onError: (err: any) => {
    console.error('[FRONTEND] Update error:', err.response?.data);
    toast.error(err?.response?.data?.error || "Failed to update profile");
  },
});

  const update = (key: string, val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  // ✅ Check if any field has changed
 const hasChanges = () => {
  // Check if any field has changed AND has a value
  const nameChanged = form.name !== user?.name && form.name.trim() !== '';
  const phoneChanged = form.phone !== user?.phone && form.phone.trim() !== '';
  const bankNameChanged = form.bankName !== user?.bankName && form.bankName.trim() !== '';
  const accountNumberChanged = form.accountNumber !== user?.accountNumber && form.accountNumber.trim() !== '';
  const accountNameChanged = form.accountName !== user?.accountName && form.accountName.trim() !== '';
  
  return nameChanged || phoneChanged || bankNameChanged || accountNumberChanged || accountNameChanged;
};

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-muted-foreground text-sm">
            Your account details and bank information
          </p>
        </div>

        {/* Account Info */}
        <div className="glass p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-16 w-16 rounded-full gradient-primary flex items-center justify-center text-2xl font-bold text-white">
              {user?.name?.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold">{user?.name}</h2>
              <p className="text-muted-foreground capitalize">{user?.role}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="p-4 rounded-lg bg-secondary/30">
              <p className="text-xs text-muted-foreground mb-1">Email</p>
              <p className="font-medium">{user?.email || "—"}</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/30">
              <p className="text-xs text-muted-foreground mb-1">Role</p>
              <p className="font-medium capitalize">{user?.role || "—"}</p>
            </div>
          </div>
        </div>

        {/* Edit Profile */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCircle className="h-5 w-5 text-primary" />
              Edit Profile & Bank Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Your full name"
                />
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="08012345678"
                />
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <p className="text-sm font-medium mb-3 text-muted-foreground">
                Bank Details (for commission payouts)
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Bank Name</Label>
                  <Input
                    value={form.bankName}
                    onChange={(e) => update("bankName", e.target.value)}
                    placeholder="e.g. GTBank"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Account Number</Label>
                  <Input
                    value={form.accountNumber}
                    onChange={(e) => update("accountNumber", e.target.value)}
                    placeholder="0123456789"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Account Name</Label>
                  <Input
                    value={form.accountName}
                    onChange={(e) => update("accountName", e.target.value)}
                    placeholder="Name on bank account"
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={() => updateMutation.mutate(form)}
              disabled={updateMutation.isPending || !hasChanges()}
              className="w-full"
            >
              {updateMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {hasChanges() ? "Save Changes" : "No Changes"}
                </span>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AffiliateProfile;