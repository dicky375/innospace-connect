import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload, UserPlus, FileText } from "lucide-react";

const RegisterStudent = () => {
  const [formData, setFormData] = useState({
    studentName: "",
    email: "",
    phone: "",
    regNo: "",
    department: "",
    hod: "",
    courseOfStudy: "",
    supervisorName: "",
  });

  const [siwesFile, setSiwesFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSiwesFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siwesFile) {
      toast.error("Please upload SIWES form (PDF or Image)");
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast.success("Student registered successfully! You earned ₦35,000 commission 🎉");
      
      // Reset form
      setFormData({
        studentName: "", email: "", phone: "", regNo: "", department: "",
        hod: "", courseOfStudy: "", supervisorName: ""
      });
      setSiwesFile(null);
      
      setLoading(false);
    }, 1500);
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
                  <Label>Full Name of Student *</Label>
                  <Input
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleInputChange}
                    placeholder="Chinedu Eze"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Email Address *</Label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="student@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Phone Number *</Label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="08012345678"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Registration/Matric Number *</Label>
                  <Input
                    name="regNo"
                    value={formData.regNo}
                    onChange={handleInputChange}
                    placeholder="U2019/1234567"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Department *</Label>
                  <Input
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    placeholder="Computer Science"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Course of Study / Program *</Label>
                  <Input
                    name="courseOfStudy"
                    value={formData.courseOfStudy}
                    onChange={handleInputChange}
                    placeholder="B.Sc Computer Science"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Head of Department (HOD) *</Label>
                  <Input
                    name="hod"
                    value={formData.hod}
                    onChange={handleInputChange}
                    placeholder="Dr. Adewale Johnson"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Supervisor Name *</Label>
                  <Input
                    name="supervisorName"
                    value={formData.supervisorName}
                    onChange={handleInputChange}
                    placeholder="Mr. Okoro Emmanuel"
                    required
                  />
                </div>
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <Label>Upload SIWES Form / Acceptance Letter (PDF or Image) *</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="hidden"
                    id="siwes-upload"
                  />
                  <label htmlFor="siwes-upload" className="cursor-pointer flex flex-col items-center">
                    <Upload className="h-10 w-10 text-muted-foreground mb-3" />
                    <p className="font-medium">Click to upload SIWES document</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {siwesFile ? siwesFile.name : "PDF, JPG or PNG (Max 5MB)"}
                    </p>
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full text-lg h-12"
                disabled={loading}
              >
                {loading ? "Registering Student..." : "Register Student & Claim Commission"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default RegisterStudent;