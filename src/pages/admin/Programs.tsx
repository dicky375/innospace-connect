import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api, { PROGRAMS } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Loader2, Edit2, X } from "lucide-react";
import { toast } from "sonner";

interface Program {
  id: string;
  title: string;
  description: string;
  type: "internship" | "siwes";
  price: string;
  durationMonths: number;
  category: string;
  isActive: boolean;
}

const emptyForm = {
  title: "",
  description: "",
  type: "internship" as "internship" | "siwes",
  price: "",
  durationMonths: "",
  category: "",
};

const ProgramForm = ({
  form,
  setForm,
  onSubmit,
  loading,
  submitLabel,
}: {
  form: typeof emptyForm;
  setForm: (f: typeof emptyForm) => void;
  onSubmit: () => void;
  loading: boolean;
  submitLabel: string;
}) => {
  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2 md:col-span-2">
        <Label>Program Title *</Label>
        <Input
          placeholder="e.g. Software Engineering Internship"
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Type *</Label>
        <select
          className="w-full border border-input bg-background px-3 py-2 rounded-md outline-none"
          value={form.type}
          onChange={(e) => handleChange("type", e.target.value)}
        >
          <option value="internship">Internship</option>
          <option value="siwes">SIWES</option>
        </select>
      </div>
      <div className="space-y-2">
        <Label>Duration (months) *</Label>
        <Input
          placeholder="e.g. 3"
          value={form.durationMonths}
          onChange={(e) => handleChange("durationMonths", e.target.value)}
        />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label>Price (₦) *</Label>
        <Input
          placeholder="e.g. 250000"
          value={form.price}
          onChange={(e) => handleChange("price", e.target.value)}
        />
        <p className="text-xs text-muted-foreground">Total program price</p>
      </div>
      <div className="space-y-2">
        <Label>Category</Label>
        <Input
          placeholder="e.g. Technology"
          value={form.category}
          onChange={(e) => handleChange("category", e.target.value)}
        />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label>Description</Label>
        <Input
          placeholder="Brief description"
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </div>
      <Button
        onClick={onSubmit}
        className="md:col-span-2 h-11"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving...
          </span>
        ) : (
          submitLabel
        )}
      </Button>
    </div>
  );
};

const AdminPrograms = () => {
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newProgram, setNewProgram] = useState(emptyForm);
  const [editForm, setEditForm] = useState(emptyForm);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-programs"],
    queryFn: async () => {
      const { data } = await api.get(PROGRAMS);
      return data;
    },
  });

  const programs: Program[] = data?.programs || data || [];

  const createMutation = useMutation({
    mutationFn: (payload: any) => api.post(PROGRAMS, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-programs"] });
      toast.success("Program added successfully");
      setShowAddForm(false);
      setNewProgram(emptyForm);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || "Failed to add program");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      api.patch(`${PROGRAMS}/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-programs"] });
      toast.success("Program updated");
      setEditingId(null);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || "Failed to update program");
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      api.patch(`${PROGRAMS}/${id}`, { isActive: !isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-programs"] });
      toast.success("Program status updated");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`${PROGRAMS}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-programs"] });
      toast.success("Program deactivated");
    },
  });

  const handleAdd = () => {
    if (!newProgram.title || !newProgram.price || !newProgram.durationMonths) {
      toast.error("Title, price and duration are required");
      return;
    }
    createMutation.mutate({
      ...newProgram,
      price: parseFloat(newProgram.price),
      durationMonths: parseInt(newProgram.durationMonths),
    });
  };

  const startEdit = (program: Program) => {
    setEditingId(program.id);
    setEditForm({
      title: program.title,
      description: program.description || "",
      type: program.type,
      price: program.price,
      durationMonths: program.durationMonths.toString(),
      category: program.category || "",
    });
  };

  const handleEdit = (id: string) => {
    if (!editForm.title || !editForm.price || !editForm.durationMonths) {
      toast.error("Title, price and duration are required");
      return;
    }
    updateMutation.mutate({
      id,
      payload: {
        ...editForm,
        price: parseFloat(editForm.price),
        durationMonths: parseInt(editForm.durationMonths),
      },
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
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="mr-2 h-4 w-4" />
            {showAddForm ? "Cancel" : "Add New Program"}
          </Button>
        </div>

        {showAddForm && (
          <Card className="border-primary/20 shadow-lg">
            <CardHeader>
              <CardTitle>Add New Program</CardTitle>
            </CardHeader>
            <CardContent>
              <ProgramForm
                form={newProgram}
                setForm={setNewProgram}
                onSubmit={handleAdd}
                loading={createMutation.isPending}
                submitLabel="Add Program"
              />
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin h-10 w-10 text-primary" />
            </div>
          ) : programs.length === 0 ? (
            <p className="text-center py-10 text-muted-foreground">
              No programs created yet.
            </p>
          ) : (
            programs.map((program) => (
              <Card
                key={program.id}
                className="glass group hover:border-primary/30 transition-colors"
              >
                <CardContent className="p-6">
                  {editingId === program.id ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold">Editing: {program.title}</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingId(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <ProgramForm
                        form={editForm}
                        setForm={setEditForm}
                        onSubmit={() => handleEdit(program.id)}
                        loading={updateMutation.isPending}
                        submitLabel="Save Changes"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-lg">{program.title}</h3>
                        <p className="text-muted-foreground text-sm uppercase tracking-wider">
                          {program.type} • {program.durationMonths} months
                          {program.category && ` • ${program.category}`}
                        </p>
                        <div className="flex items-center gap-4 mt-1">
                          <p className="font-bold text-primary">
                            ₦{parseFloat(program.price).toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            10% commission: ₦{(parseFloat(program.price) * 0.10).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge variant={program.isActive ? "default" : "secondary"}>
                          {program.isActive ? "ACTIVE" : "INACTIVE"}
                        </Badge>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            toggleMutation.mutate({
                              id: program.id,
                              isActive: program.isActive,
                            })
                          }
                        >
                          {program.isActive ? "Deactivate" : "Activate"}
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:text-primary"
                          onClick={() => startEdit(program)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => {
                            if (window.confirm("Deactivate this program?"))
                              deleteMutation.mutate(program.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminPrograms;