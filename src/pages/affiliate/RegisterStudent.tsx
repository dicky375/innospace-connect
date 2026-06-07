import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import api, { PROGRAMS, REGISTRATIONS } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload, UserPlus, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const RegisterStudent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    studentName: "",
    studentEmail: "",
    studentPhone: "",
    regNumber: "",
    course: "",
    department: "",
    hodName: "",
    supervisorName: "",
    programId: "",
  });
  const [siwesFile, setSiwesFile] = useState<File | null>(null);

  const { data: programsData } = useQuery({
    queryKey: ["programs"],
    queryFn: async () => {
      const { data } = await api.get(PROGRAMS);
      return data;
    },
  });

  const programs = programsData?.programs || programsData || [];

  const mutation = useMutation({
    mutationFn: async (payload: FormData) => {
      return await api.post(REGISTRATIONS, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: (res) => {
      const commission = parseFloat(res.data.registration?.commissionEarned || 0);
      toast.success(
        `Registration submitted! ₦${(res.data.registration?.amount * 0.1).toLocaleString()} commission pending approval.`
      );
      setFormData({
        studentName: "",
        studentEmail: "",
        studentPhone: "",
        regNumber: "",
        course: "",
        department: "",
        hodName: "",
        supervisorName: "",
        programId: "",
      });
      setSiwesFile(null);
      navigate("/affiliate/registrations");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.error || "Registration failed. Check details."
      );
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

    if (!formData.programId) return toast.error("Please select a program");
    if (!formData.studentName) return toast.error("Student name is required");
    if (!formData.studentPhone) return toast.error("Student phone is required");
    if (!formData.regNumber) return toast.error("Registration number is required");
    if (!formData.course) return toast.error("Course is required");
    if (!formData.department) return toast.error("Department is required");
    

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (siwesFile) data.append("siwesForm", siwesFile);

    mutation.mutate(data);
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <UserPlus className="h-8 w-8" /> Register New Student
          </h1>
          <p className="text-muted-foreground">
            Fill in student details and earn 10% commission on approval
          </p>
        </div>

        <Card className="glass">
          <CardHeader>
            <CardTitle>Student Registration Form</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Program */}
                <div className="space-y-2 md:col-span-2">
                  <Label>Program *</Label>
                  <Select
                    value={formData.programId}
                    onValueChange={(val) =>
                      setFormData({ ...formData, programId: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an active program" />
                    </SelectTrigger>
                    <SelectContent>
                      {programs.map((p: any) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.title} — ₦{parseFloat(p.monthlyFee).toLocaleString()} (
                          {p.type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Student Name */}
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input
                    name="studentName"
                    placeholder="e.g. Emeka Eze"
                    value={formData.studentName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label>Phone Number *</Label>
                  <Input
                    name="studentPhone"
                    placeholder="e.g. 08012345678"
                    value={formData.studentPhone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input
                    name="studentEmail"
                    type="email"
                    placeholder="student@email.com"
                    value={formData.studentEmail}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Reg Number */}
                <div className="space-y-2">
                  <Label>Matric / Reg Number *</Label>
                  <Input
                    name="regNumber"
                    placeholder="e.g. CSC/2021/001"
                    value={formData.regNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Course */}
                <div className="space-y-2">
                  <Label>Course *</Label>
                  <Input
                    name="course"
                    placeholder="e.g. Computer Science"
                    value={formData.course}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Department */}
                <div className="space-y-2">
                  <Label>Department *</Label>
                  <Input
                    name="department"
                    placeholder="e.g. Science"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* HOD */}
                <div className="space-y-2">
                  <Label>HOD Name *(Optional)</Label>
                  <Input
                    name="hodName"
                    placeholder="e.g. Dr. Adeyemi"
                    value={formData.hodName}
                    onChange={handleInputChange}
                   
                  />
                </div>

                {/* Supervisor */}
                <div className="space-y-2">
                  <Label>Supervisor Name *(Optional)</Label>
                  <Input
                    name="supervisorName"
                    placeholder="e.g. Engr. Bello"
                    value={formData.supervisorName}
                    onChange={handleInputChange}
                    
                  />
                </div>
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <Label>Upload SIWES Form (PDF/Image)</Label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                    id="siwes-upload"
                  />
                  <label
                    htmlFor="siwes-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="h-10 w-10 text-muted-foreground mb-3" />
                    <p className="font-medium">
                      {siwesFile
                        ? siwesFile.name
                        : "Click to upload SIWES document"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PDF, DOC, JPG, PNG up to 10MB
                    </p>
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  "Register Student"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default RegisterStudent;