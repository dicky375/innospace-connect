import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext"; // ✅ Use the updated AuthContext
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
  const { user, refreshUser, updateUser } = useAuth(); // ✅ Get refreshUser and updateUser
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
      const changes: any = {};
      
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
      
      if (data?.user) {
        // ✅ Update the AuthContext user directly
        updateUser(data.user);
        
        // ✅ Also refresh from backend to ensure consistency
        refreshUser();
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

  const hasChanges = () => {
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
        {/* ... rest of the component */}
      </div>
    </DashboardLayout>
  );
};

export default AffiliateProfile;