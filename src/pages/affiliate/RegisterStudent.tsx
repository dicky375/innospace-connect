import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/lib/api"; // Your custom axios instance
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload, UserPlus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const RegisterStudent = () => {
  const [formData, setFormData] = useState({
    studentName: "",
    email: "",
    phone: "",
    regNo: "",
    department: "",
    hod: "",
    supervisorName: "",
    programId: "", // Changed from text input to an ID from the DB
  });

  const [siwesFile, setSiwesFile] = useState<File | null>(null);

  // 1. Fetch Real Programs from Server 2
  const { data: programs } = useQuery({
    queryKey: ["programs"],
    queryFn: async () => {
      const { data } = await api.get("/programs");
      return data;
    },
  });

  // 2. Mutation to send data to the backend
  const mutation = useMutation({
    mutationFn: async (payload: FormData) => {
      // Hits port 3000 -> Routes to Registration Service
      return await api.post("/registrations", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: (res) => {
      toast.success(`Success! Commission earned: ₦${res.data.commission.toLocaleString()}`);
      // Reset logic
      setFormData({ studentName: "", email: "", phone: "", regNo: "", department: "", hod: "", supervisorName: "", programId: "" });
      setSiwesFile(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Registration failed. Check details.");
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setSiwesFile(e.target.files[0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!siwesFile) return toast.error("Please upload SIWES form");
    if (!formData.programId) return toast.error("Please select a program");

    const data = new FormData();
    // Append all text fields
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    // Append the file
    data.append("siwesForm", siwesFile);

    mutation.mutate(data);
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <UserPlus className="h-8 w-8" /> Register New Student
          </h1>
          <p className="text-muted-foreground">Fill in student details and earn commission</p>
        </div>

        <Card className="glass">
          <CardHeader>
            <CardTitle>Student Registration Form</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input name="studentName" value={formData.studentName} onChange={handleInputChange} required />
                </div>

                <div className="space-y-2">
                  <Label>Program / Course *</Label>
                  <Select onValueChange={(val) => setFormData({ ...formData, programId: val })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an active program" />
                    </SelectTrigger>
                    <SelectContent>
                      {programs?.map((p: any) => (
                        <SelectItem key={p.id} value={p.id.toString()}>
                          {p.name} (₦{p.commissionAmount.toLocaleString()})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* ... other Inputs (Email, Phone, RegNo, Dept, HOD, Supervisor) ... */}
                {/* Re-use your existing Input components here, just ensure 'name' matches formData keys */}
              </div>

              <div className="space-y-2">
                <Label>Upload SIWES Form (PDF/Image) *</Label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary">
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} className="hidden" id="siwes-upload" />
                  <label htmlFor="siwes-upload" className="cursor-pointer flex flex-col items-center">
                    <Upload className="h-10 w-10 text-muted-foreground mb-3" />
                    <p className="font-medium">{siwesFile ? siwesFile.name : "Click to upload SIWES document"}</p>
                  </label>
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={mutation.isPending}>
                {mutation.isPending ? "Processing..." : "Register Student & Claim Commission"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default RegisterStudent;