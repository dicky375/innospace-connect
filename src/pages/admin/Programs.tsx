import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Program {
  id: number;
  title: string;
  type: "internship" | "siwes" | "bootcamp";
  duration: string;
  amount: number;
  status: "active" | "inactive";
}

const AdminPrograms = () => {
  const [programs, setPrograms] = useState<Program[]>([
    {
      id: 1,
      title: "Frontend Development Internship",
      type: "internship",
      duration: "3 Months",
      amount: 45000,
      status: "active",
    },
    {
      id: 2,
      title: "SIWES - Data Science",
      type: "siwes",
      duration: "6 Months",
      amount: 35000,
      status: "active",
    },
    {
      id: 3,
      title: "Backend Engineering Bootcamp",
      type: "bootcamp",
      duration: "4 Months",
      amount: 60000,
      status: "inactive",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newProgram, setNewProgram] = useState({
    title: "",
    type: "internship" as const,
    duration: "",
    amount: "",
  });

  const handleAddProgram = () => {
    if (!newProgram.title || !newProgram.duration || !newProgram.amount) {
      toast.error("Please fill all fields");
      return;
    }

    setPrograms([
      ...programs,
      {
        id: Date.now(),
        title: newProgram.title,
        type: newProgram.type,
        duration: newProgram.duration,
        amount: Number(newProgram.amount),
        status: "active",
      },
    ]);

    toast.success("Program added successfully");
    setNewProgram({ title: "", type: "internship", duration: "", amount: "" });
    setShowForm(false);
  };

  const toggleStatus = (id: number) => {
    setPrograms(programs.map(p =>
      p.id === id ? { ...p, status: p.status === "active" ? "inactive" : "active" } : p
    ));
    toast.success("Program status updated");
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
            Add New Program
          </Button>
        </div>

        {/* Add New Program Form */}
        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>Add New Program</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Program Title"
                value={newProgram.title}
                onChange={(e) => setNewProgram({ ...newProgram, title: e.target.value })}
              />
              <select
                className="border border-input bg-background px-3 py-2 rounded-md"
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
                placeholder="Monthly Amount (₦)"
                value={newProgram.amount}
                onChange={(e) => setNewProgram({ ...newProgram, amount: e.target.value })}
              />
              <Button onClick={handleAddProgram} className="md:col-span-2">
                Add Program
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Programs List */}
        <div className="grid gap-4">
          {programs.map((program) => (
            <Card key={program.id} className="glass">
              <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-lg">{program.title}</h3>
                  <p className="text-muted-foreground">
                    {program.duration} • ₦{program.amount.toLocaleString()}/month
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant={program.status === "active" ? "default" : "secondary"}>
                    {program.status.toUpperCase()}
                  </Badge>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleStatus(program.id)}
                  >
                    {program.status === "active" ? "Deactivate" : "Activate"}
                  </Button>

                  <Button variant="ghost" size="sm">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminPrograms;