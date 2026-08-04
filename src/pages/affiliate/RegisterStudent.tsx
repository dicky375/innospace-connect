import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import api, { REGISTRATIONS, PROGRAMS } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { UserPlus, Loader2, Upload, File, X } from "lucide-react";
import { useDropzone } from "react-dropzone";
import PaymentModal from "@/components/PaymentModal";

const RegisterStudent = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    programId: "",
    studentName: "",
    studentPhone: "",
    studentEmail: "",
    course: "",
    department: "",
    regNumber: "",
    hodName: "",
    supervisorName: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [registrationId, setRegistrationId] = useState("");
  const [amount, setAmount] = useState(0);
  const [studentEmail, setStudentEmail] = useState("");
  const [studentName, setStudentName] = useState("");

  // Fetch programs
  const { data: programsData, isLoading: programsLoading } = useQuery({
    queryKey: ["programs"],
    queryFn: async () => {
      const { data } = await api.get(PROGRAMS);
      return data;
    },
  });

  const programs = programsData?.programs || [];

  // File dropzone configuration
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        const error = rejectedFiles[0].errors[0];
        if (error.code === 'file-too-large') {
          setFileError('File is too large. Max size is 10MB.');
        } else if (error.code === 'file-invalid-type') {
          setFileError('Invalid file type. Only PDF, DOC, DOCX, JPG, PNG allowed.');
        } else {
          setFileError(error.message || 'Invalid file');
        }
        setFile(null);
        return;
      }
      setFileError(null);
      setFile(acceptedFiles[0]);
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: typeof form) => {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (data[key as keyof typeof form]) {
          formData.append(key, data[key as keyof typeof form]);
        }
      });
      if (file) {
        formData.append('siwesForm', file);
      }
      const { data: response } = await api.post(REGISTRATIONS, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response;
    },
    onSuccess: (data) => {
      console.log("[RegisterStudent] Full response:", data);
      
      toast.success("Student registered! Waiting for admin approval.");
      
      const registration = data?.registration || data?.data?.registration || data;
      
      console.log("[RegisterStudent] Registration object:", registration);
      
      if (registration && registration.id) {
        console.log("[RegisterStudent] ✅ Registration found, showing payment modal");
        setRegistrationId(registration.id);
        setAmount(parseFloat(registration.amount) || 0);
        setStudentEmail(registration.studentEmail || "");
        setStudentName(registration.studentName || "");
        setShowPayment(true);
      } else {
        console.log("[RegisterStudent] ❌ No registration found in response");
        console.log("[RegisterStudent] Response structure:", Object.keys(data));
      }
      
      setForm({
        programId: "",
        studentName: "",
        studentPhone: "",
        studentEmail: "",
        course: "",
        department: "",
        regNumber: "",
        hodName: "",
        supervisorName: "",
      });
      setFile(null);
    },
    onError: (err: any) => {
      console.error("[RegisterStudent] Error:", err);
      toast.error(err?.response?.data?.error || "Failed to register student");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.programId || !form.studentName || !form.studentPhone || !form.course || !form.department || !form.regNumber) {
      toast.error("Please fill in all required fields");
      return;
    }
    registerMutation.mutate(form);
  };

  const update = (key: string, val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const selectedProgram = programs.find((p: any) => p.id === form.programId);

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold">Register Student</h1>
          <p className="text-muted-foreground">
            Register a new student for a program
          </p>
        </div>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              Student Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Program *</Label>
                  <Select
                    value={form.programId}
                    onValueChange={(v) => update("programId", v)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select program" />
                    </SelectTrigger>
                    <SelectContent>
                      {programsLoading ? (
                        <SelectItem value="loading" disabled>
                          Loading...
                        </SelectItem>
                      ) : programs.length === 0 ? (
                        <SelectItem value="none" disabled>
                          No programs available
                        </SelectItem>
                      ) : (
                        programs.map((program: any) => (
                          <SelectItem key={program.id} value={program.id}>
                            {program.title} - ₦{parseFloat(program.price).toLocaleString()}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {selectedProgram && (
                    <p className="text-xs text-muted-foreground">
                      Price: ₦{parseFloat(selectedProgram.price).toLocaleString()}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Student Name *</Label>
                  <Input
                    value={form.studentName}
                    onChange={(e) => update("studentName", e.target.value)}
                    placeholder="Full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Student Phone *</Label>
                  <Input
                    value={form.studentPhone}
                    onChange={(e) => update("studentPhone", e.target.value)}
                    placeholder="08012345678"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Student Email</Label>
                  <Input
                    value={form.studentEmail}
                    onChange={(e) => update("studentEmail", e.target.value)}
                    placeholder="student@example.com"
                    type="email"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Course *</Label>
                  <Input
                    value={form.course}
                    onChange={(e) => update("course", e.target.value)}
                    placeholder="Computer Science"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Department *</Label>
                  <Input
                    value={form.department}
                    onChange={(e) => update("department", e.target.value)}
                    placeholder="Computing"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Registration Number *</Label>
                  <Input
                    value={form.regNumber}
                    onChange={(e) => update("regNumber", e.target.value)}
                    placeholder="CS/2024/001"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>HOD Name</Label>
                  <Input
                    value={form.hodName}
                    onChange={(e) => update("hodName", e.target.value)}
                    placeholder="Dr. Smith"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Supervisor Name</Label>
                  <Input
                    value={form.supervisorName}
                    onChange={(e) => update("supervisorName", e.target.value)}
                    placeholder="Mr. Johnson"
                  />
                </div>

                {/* ✅ FILE UPLOAD SECTION */}
                <div className="space-y-2 md:col-span-2">
                  <Label>SIWES Form (Optional)</Label>
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                      isDragActive
                        ? "border-primary bg-primary/10"
                        : file
                        ? "border-green-500 bg-green-500/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <input {...getInputProps()} />
                    {file ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <File className="h-8 w-8 text-primary" />
                          <div className="text-left">
                            <p className="font-medium truncate max-w-[200px]">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFile(null);
                            setFileError(null);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <Upload className="h-10 w-10 mx-auto text-muted-foreground/50" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          {isDragActive
                            ? "Drop the file here..."
                            : "Drag & drop your SIWES form, or click to browse"}
                        </p>
                        <p className="text-xs text-muted-foreground/70 mt-1">
                          PDF, DOC, DOCX, JPG, PNG (Max 10MB)
                        </p>
                      </div>
                    )}
                  </div>
                  {fileError && (
                    <p className="text-sm text-destructive mt-1">{fileError}</p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                disabled={registerMutation.isPending}
                className="w-full"
              >
                {registerMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Registering...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Register Student
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        open={showPayment}
        onOpenChange={setShowPayment}
        registrationId={registrationId}
        amount={amount}
        studentName={studentName}
        studentEmail={studentEmail}
        onSuccess={() => {
          toast.success("Payment completed! Registration is now paid.");
          navigate("/affiliate/registrations");
        }}
      />
    </DashboardLayout>
  );
};

export default RegisterStudent;