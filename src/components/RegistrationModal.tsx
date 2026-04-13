import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";
import api from "@/lib/api";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const RegistrationModal = ({ open, onClose, onSuccess }: Props) => {
  const [form, setForm] = useState({
    studentName: "", studentPhone: "", studentEmail: "",
    course: "", department: "", regNumber: "",
    hodName: "", supervisorName: "", programId: "",
  });
  const [file, setFile] = useState<File | null>(null);

  const update = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  // Fetch real programs
  const { data: programsData, isLoading: programsLoading } = useQuery({
    queryKey: ["programs"],
    queryFn: async () => {
      const { data } = await api.get("/api/programs");
      return data;
    },
    enabled: open,
  });

  const programs = programsData?.programs || [];

  const registerMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => formData.append(key, val));
      if (file) formData.append("siwesForm", file);
      const { data } = await api.post("/api/registrations", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Registration submitted!");
      setForm({
        studentName: "", studentPhone: "", studentEmail: "",
        course: "", department: "", regNumber: "",
        hodName: "", supervisorName: "", programId: "",
      });
      setFile(null);
      onSuccess?.();
      onClose();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || "Registration failed");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const required = ["studentName", "studentPhone", "course", "department", "regNumber", "hodName", "supervisorName", "programId"];
    const missing = required.filter((k) => !form[k as keyof typeof form]);
    if (missing.length > 0) {
      toast.error("Please fill all required fields");
      return;
    }
    registerMutation.mutate();
  };

  const handleClose = () => {
    setForm({
      studentName: "", studentPhone: "", studentEmail: "",
      course: "", department: "", regNumber: "",
      hodName: "", supervisorName: "", programId: "",
    });
    setFile(null);
    onClose();
  };

  const selectedProgram = programs.find((p: any) => p.id === form.programId);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="glass-strong border-glass-border sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Register a Student</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">

          {/* Program */}
          <div className="space-y-2">
            <Label>Program <span className="text-destructive">*</span></Label>
            <Select value={form.programId} onValueChange={(v) => update("programId", v)} disabled={programsLoading}>
              <SelectTrigger className="bg-secondary/50 border-glass-border">
                <SelectValue placeholder={programsLoading ? "Loading..." : "Select a program"} />
              </SelectTrigger>
              <SelectContent className="bg-card border-glass-border">
                {programs.map((p: any) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.title} — ₦{Number(p.monthlyFee).toLocaleString()}/month ({p.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedProgram && (
              <p className="text-xs text-muted-foreground">
                {selectedProgram.type === "siwes"
                  ? "⚠️ No commission for SIWES registrations"
                  : "✓ 5% commission after approval and first payment"}
              </p>
            )}
          </div>

          {/* Student details */}
          <div className="border border-border/50 rounded-lg p-4 space-y-3">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Student Details</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Full Name <span className="text-destructive">*</span></Label>
                <Input value={form.studentName} onChange={(e) => update("studentName", e.target.value)} placeholder="John Doe" className="bg-secondary/50 border-glass-border" />
              </div>
              <div className="space-y-1">
                <Label>Phone <span className="text-destructive">*</span></Label>
                <Input value={form.studentPhone} onChange={(e) => update("studentPhone", e.target.value)} placeholder="08012345678" className="bg-secondary/50 border-glass-border" />
              </div>
              <div className="space-y-1">
                <Label>Email <span className="text-muted-foreground text-xs">(optional)</span></Label>
                <Input value={form.studentEmail} onChange={(e) => update("studentEmail", e.target.value)} placeholder="student@email.com" className="bg-secondary/50 border-glass-border" />
              </div>
              <div className="space-y-1">
                <Label>Reg Number <span className="text-destructive">*</span></Label>
                <Input value={form.regNumber} onChange={(e) => update("regNumber", e.target.value)} placeholder="CSC/2021/001" className="bg-secondary/50 border-glass-border" />
              </div>
              <div className="space-y-1">
                <Label>Course <span className="text-destructive">*</span></Label>
                <Input value={form.course} onChange={(e) => update("course", e.target.value)} placeholder="Computer Science" className="bg-secondary/50 border-glass-border" />
              </div>
              <div className="space-y-1">
                <Label>Department <span className="text-destructive">*</span></Label>
                <Input value={form.department} onChange={(e) => update("department", e.target.value)} placeholder="Engineering" className="bg-secondary/50 border-glass-border" />
              </div>
            </div>
          </div>

          {/* Supervisor details */}
          <div className="border border-border/50 rounded-lg p-4 space-y-3">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Supervisor Details</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Head of Department <span className="text-destructive">*</span></Label>
                <Input value={form.hodName} onChange={(e) => update("hodName", e.target.value)} placeholder="Dr. Adebayo" className="bg-secondary/50 border-glass-border" />
              </div>
              <div className="space-y-1">
                <Label>Supervisor Name <span className="text-destructive">*</span></Label>
                <Input value={form.supervisorName} onChange={(e) => update("supervisorName", e.target.value)} placeholder="Engr. Chukwu" className="bg-secondary/50 border-glass-border" />
              </div>
            </div>
          </div>

          {/* File upload */}
          <div className="space-y-2">
            <Label>SIWES Form <span className="text-muted-foreground text-xs">(PDF, DOC, DOCX, JPG, PNG — max 10MB)</span></Label>
            <div className="border-2 border-dashed border-border/50 rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
              {file ? (
                <div className="flex items-center justify-between p-2 rounded-md bg-secondary/30">
                  <span className="text-sm truncate">{file.name}</span>
                  <button type="button" onClick={() => setFile(null)} className="ml-2 text-muted-foreground hover:text-destructive">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </label>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full gradient-primary text-white hover:opacity-90"
          >
            {registerMutation.isPending ? "Submitting..." : "Submit Registration"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RegistrationModal;