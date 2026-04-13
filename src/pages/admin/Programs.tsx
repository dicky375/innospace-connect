import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import api from "@/lib/api";

const AdminPrograms = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", monthlyFee: "", durationMonths: "", type: "", category: "",
  });

  const { data: programsData, isLoading } = useQuery({
    queryKey: ["programs"],
    queryFn: async () => {
      const { data } = await api.get("/api/programs");
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.post("/api/programs", {
        ...form,
        monthlyFee: parseFloat(form.monthlyFee),
        durationMonths: parseInt(form.durationMonths),
      });
      return data;
    },
    onSuccess: () => {
      toast.success("Program created!");
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      setModalOpen(false);
      setForm({ title: "", description: "", monthlyFee: "", durationMonths: "", type: "", category: "" });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || "Failed to create program");
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/programs/${id}`);
    },
    onSuccess: () => {
      toast.success("Program deactivated");
      queryClient.invalidateQueries({ queryKey: ["programs"] });
    },
  });

  const programs = programsData?.programs || [];
  const update = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Programs</h1>
            <p className="text-muted-foreground text-sm">Manage internship and SIWES programs</p>
          </div>
          <Button onClick={() => setModalOpen(true)} className="gradient-primary text-white hover:opacity-90">
            <Plus className="h-4 w-4 mr-2" /> New Program
          </Button>
        </div>

        <div className="glass p-6 animate-fade-in">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          ) : programs.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">No programs yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="text-left py-3 px-2">Title</th>
                    <th className="text-left py-3 px-2">Type</th>
                    <th className="text-left py-3 px-2">Monthly Fee</th>
                    <th className="text-left py-3 px-2">Duration</th>
                    <th className="text-left py-3 px-2">Status</th>
                    <th className="text-right py-3 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {programs.map((p: any) => (
                    <tr key={p.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                      <td className="py-3 px-2 font-medium">{p.title}</td>
                      <td className="py-3 px-2 text-muted-foreground capitalize">{p.type}</td>
                      <td className="py-3 px-2 text-muted-foreground">₦{Number(p.monthlyFee).toLocaleString()}</td>
                      <td className="py-3 px-2 text-muted-foreground">{p.durationMonths} months</td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.isActive ? "bg-green-500/20 text-green-400" : "bg-muted/20 text-muted-foreground"}`}>
                          {p.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right">
                        {p.isActive && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deactivateMutation.mutate(p.id)}
                            className="h-7 px-3 text-xs"
                          >
                            Deactivate
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="glass-strong border-glass-border sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Program</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="e.g. Software Engineering Internship" className="bg-secondary/50 border-glass-border" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Brief description" className="bg-secondary/50 border-glass-border" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Monthly Fee (₦)</Label>
                <Input type="number" value={form.monthlyFee} onChange={(e) => update("monthlyFee", e.target.value)} placeholder="45000" className="bg-secondary/50 border-glass-border" />
              </div>
              <div className="space-y-2">
                <Label>Duration (months)</Label>
                <Input type="number" value={form.durationMonths} onChange={(e) => update("durationMonths", e.target.value)} placeholder="3" className="bg-secondary/50 border-glass-border" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(v) => update("type", v)}>
                <SelectTrigger className="bg-secondary/50 border-glass-border">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-card border-glass-border">
                  <SelectItem value="internship">Internship</SelectItem>
                  <SelectItem value="siwes">SIWES</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Input value={form.category} onChange={(e) => update("category", e.target.value)} placeholder="e.g. Technology" className="bg-secondary/50 border-glass-border" />
            </div>
            <Button
              onClick={() => createMutation.mutate()}
              disabled={createMutation.isPending || !form.title || !form.monthlyFee || !form.type}
              className="w-full gradient-primary text-white hover:opacity-90"
            >
              {createMutation.isPending ? "Creating..." : "Create Program"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminPrograms;