import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import api from "@/lib/api";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const mockPrograms = [
  { id: "1", name: "Frontend Development Internship" },
  { id: "2", name: "Backend Development Internship" },
  { id: "3", name: "SIWES - Software Engineering" },
  { id: "4", name: "SIWES - Data Science" },
];

const RegistrationModal = ({ open, onClose, onSuccess }: Props) => {
  const [studentEmail, setStudentEmail] = useState("");
  const [programId, setProgramId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentEmail.trim() || !programId) {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      await api.post("/api/registrations", { studentEmail, programId });
      toast.success("Student registered successfully!");
      setStudentEmail("");
      setProgramId("");
      onSuccess?.();
      onClose();
    } catch {
      toast.error("Registration submitted (demo mode)");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass-strong border-glass-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Register a Student</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label>Student Email / ID</Label>
            <Input
              placeholder="student@example.com"
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              className="bg-secondary/50 border-glass-border"
            />
          </div>
          <div className="space-y-2">
            <Label>Program</Label>
            <Select value={programId} onValueChange={setProgramId}>
              <SelectTrigger className="bg-secondary/50 border-glass-border">
                <SelectValue placeholder="Select a program" />
              </SelectTrigger>
              <SelectContent className="bg-card border-glass-border">
                {mockPrograms.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={loading} className="w-full gradient-primary text-primary-foreground hover:opacity-90">
            {loading ? "Registering..." : "Submit Registration"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RegistrationModal;
