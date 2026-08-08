// src/pages/affiliate/CommissionCalculator.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api, { PROGRAMS } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calculator, Users, Info } from "lucide-react";

const CommissionCalculator = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient(); // ✅ Required for invalidateQueries
  const [students, setStudents] = useState(5);
  const [selectedProgramId, setSelectedProgramId] = useState("");

  // ✅ Fetch programs with commission rate
  const { data: programsData, isLoading } = useQuery({
    queryKey: ["programs"],
    queryFn: async () => {
      const { data } = await api.get(PROGRAMS);
      console.log("[CommissionCalculator] Programs data:", data);
      return data;
    },
    // ✅ Refresh when window regains focus
    refetchOnWindowFocus: true,
    // ✅ Refresh every 30 seconds
    refetchInterval: 30000,
  });

  // ✅ Force refetch when component mounts
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["programs"] });
    console.log("[CommissionCalculator] Force refetched programs");
  }, []);

  const programs = programsData?.programs || [];
  const selectedProgram = programs.find((p: any) => p.id === selectedProgramId);
  
  // ✅ Get commission rate from selected program (default 10%)
  const commissionRate = selectedProgram?.commissionRate 
    ? parseFloat(selectedProgram.commissionRate) 
    : 10;
  
  const fee = selectedProgram ? parseFloat(selectedProgram.price || 0) : 0;
  const commissionPerStudent = fee * (commissionRate / 100);
  const totalCommission = students * commissionPerStudent;

  // ✅ Debug: Log selected program details when it changes
  useEffect(() => {
    if (selectedProgram) {
      console.log("[CommissionCalculator] Selected program:", {
        title: selectedProgram.title,
        commissionRate: selectedProgram.commissionRate,
        price: selectedProgram.price,
      });
    }
  }, [selectedProgram]);

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-500/10 p-4 rounded-2xl">
              <Calculator className="h-12 w-12 text-green-500" />
            </div>
          </div>
          <h1 className="text-4xl font-bold">Commission Calculator</h1>
          <p className="text-muted-foreground mt-2">
            Estimate how much you can earn as an affiliate
          </p>
          <div className="mt-2 inline-flex items-center gap-2 bg-muted/50 px-4 py-1.5 rounded-full text-sm">
            <Info className="h-4 w-4" />
            Commission rates are set per program by admin
          </div>
        </div>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Calculate Your Earnings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Number of Students */}
            <div>
              <Label className="text-base">
                How many students do you want to refer?
              </Label>
              <div className="flex items-center gap-4 mt-3">
                <Input
                  type="number"
                  value={students}
                  onChange={(e) =>
                    setStudents(Math.max(1, Number(e.target.value)))
                  }
                  className="text-3xl font-bold h-16 text-center"
                />
              </div>
              <div className="flex gap-2 mt-3">
                {[3, 5, 10, 15, 20].map((num) => (
                  <Button
                    key={num}
                    variant={students === num ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStudents(num)}
                  >
                    {num}
                  </Button>
                ))}
              </div>
            </div>

            {/* Program Selection */}
            <div>
              <Label className="text-base mb-3 block">Select Program</Label>
              {isLoading ? (
                <p className="text-muted-foreground text-sm">Loading programs...</p>
              ) : programs.length === 0 ? (
                <p className="text-muted-foreground text-sm">No programs available</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {programs.map((p: any) => {
                    const programFee = parseFloat(p.price || 0);
                    const programCommissionRate = parseFloat(p.commissionRate || 10);
                    const programCommission = programFee * (programCommissionRate / 100);
                    
                    return (
                      <button
                        key={p.id}
                        onClick={() => setSelectedProgramId(p.id)}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          selectedProgramId === p.id
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <p className="font-medium">{p.title}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {p.type} • {p.durationMonths} months
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Commission Rate: {programCommissionRate}%
                        </p>
                        <p className="text-green-400 font-semibold mt-1">
                          ₦{programCommission.toLocaleString()} commission per student
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Results */}
            {selectedProgram && (
              <div className="bg-secondary/50 rounded-2xl p-8 text-center">
                <p className="text-muted-foreground">
                  Potential Total Commission
                </p>
                <p className="text-5xl font-bold text-green-400 mt-2">
                  ₦{totalCommission.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  from {students} {students === 1 ? "student" : "students"}
                </p>

                <div className="h-px bg-border my-6" />

                <div className="grid grid-cols-3 gap-4 text-left">
                  <div>
                    <p className="text-sm text-muted-foreground">Per Student</p>
                    <p className="text-2xl font-semibold">
                      ₦{commissionPerStudent.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Program Fee</p>
                    <p className="text-2xl font-semibold">
                      ₦{fee.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Rate</p>
                    <p className="text-2xl font-semibold">
                      {commissionRate}%
                    </p>
                  </div>
                </div>

                {/* ✅ Debug: Show raw data for selected program */}
                <div className="mt-4 pt-4 border-t border-border/50 text-left">
                  <p className="text-xs text-muted-foreground font-mono">
                    Debug: commissionRate = {selectedProgram.commissionRate}
                  </p>
                </div>
              </div>
            )}

            <Button
              size="lg"
              className="w-full h-12 text-lg"
              onClick={() => navigate("/affiliate/register-student")}
            >
              Start Registering Students Now
            </Button>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          * Commission is {selectedProgram ? `${commissionRate}%` : '10%'} of program fee, 
          paid after admin approval and student payment.
        </p>
      </div>
    </DashboardLayout>
  );
};

export default CommissionCalculator;