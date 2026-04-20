import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

const AdminPrograms = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [newProgram, setNewProgram] = useState({
    name: "", // Changed from 'title' to 'name' to match typical DB columns
    type: "internship" as const,
    duration: "6 Months", // Changed from 'duration' to a more descriptive format
    commissionAmount: "10%", // Renamed for clarity in the backend
  });

  // 1. Fetch real programs from Server 2 (Registration Service)
  const { data: programs, isLoading } = useQuery({
    queryKey: ["admin-programs"],
    queryFn: async () => {
      const { data } = await api.get("/programs");
      return data;
    },
  });

  // 2. Mutation: Create New Program
  const createMutation = useMutation({
    mutationFn: (payload: any) => api.post("/programs", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-programs"] });
      toast.success("Program added successfully");
      setShowForm(false);
      setNewProgram({ name: "", type: "internship", duration: "", commissionAmount: "" });
    },
    onError: () => toast.error("Failed to add program")
  });

  // 3. Mutation: Update Status (Active/Inactive)
  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => 
      api.patch(`/programs/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-programs"] });
      toast.success("Status updated");
    }
  });

  // 4. Mutation: Delete
  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/programs/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-programs"] });
      toast.success("Program deleted");
    }
  });

  const handleAddProgram = () => {
    if (!newProgram.name || !newProgram.duration || !newProgram.commissionAmount) {
      return toast.error("Please fill all fields");
    }
    createMutation.mutate({
      ...newProgram,
      commissionAmount: Number(newProgram.commissionAmount)
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Programs</h1>
            <p className="text-muted-foreground">Manage all available programs</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="mr-2 h-4 w-4" />
            {showForm ? "Cancel" : "Add New Program"}
          </Button>
        </div>

        {/* Add New Program Form */}
        {showForm && (
          <Card className="border-primary/20 shadow-lg animate-in slide-in-from-top duration-300">
            <CardHeader>
              <CardTitle>Add New Program</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Program Name"
                value={newProgram.name}
                onChange={(e) => setNewProgram({ ...newProgram, name: e.target.value })}
              />
              <select
                className="border border-input bg-background px-3 py-2 rounded-md focus:ring-2 ring-primary/20 outline-none"
                value={newProgram.type}
                onChange={(e) => setNewProgram({ ...newProgram, type: e.target.value as any })}
              >
                <option value="internship">Internship</option>
                <option value="siwes">SIWES</option>
                <option value="bootcamp">Bootcamp</option>
              </select>
              <Input
                placeholder="Duration (e.g. 3 Months)"
                value={newProgram.duration}
                onChange={(e) => setNewProgram({ ...newProgram, duration: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Commission Amount (₦)"
                value={newProgram.commissionAmount}
                onChange={(e) => setNewProgram({ ...newProgram, commissionAmount: e.target.value })}
              />
              <Button 
                onClick={handleAddProgram} 
                className="md:col-span-2 h-11"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? "Adding..." : "Add Program"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Programs List */}
        <div className="grid gap-4">
          {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>
          ) : programs?.map((program: any) => (
            <Card key={program.id} className="glass group hover:border-primary/30 transition-colors">
              <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-lg">{program.name}</h3>
                  <p className="text-muted-foreground text-sm uppercase tracking-wider">
                    {program.type} • {program.duration}
                  </p>
                  <p className="font-bold text-primary mt-1">
                    ₦{program.commissionAmount.toLocaleString()} Commission
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant={program.status === "active" ? "default" : "secondary"}>
                    {program.status.toUpperCase()}
                  </Badge>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateMutation.mutate({ 
                      id: program.id, 
                      status: program.status === "active" ? "inactive" : "active" 
                    })}
                  >
                    {program.status === "active" ? "Deactivate" : "Activate"}
                  </Button>

                  <Button variant="ghost" size="sm" className="hover:text-primary">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      if(window.confirm("Delete this program?")) deleteMutation.mutate(program.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {!isLoading && programs?.length === 0 && (
            <p className="text-center py-10 text-muted-foreground">No programs created yet.</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminPrograms;