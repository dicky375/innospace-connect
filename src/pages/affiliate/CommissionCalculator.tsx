import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api, { PROGRAMS } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calculator, Users } from "lucide-react";

const CommissionCalculator = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState(5);
  const [selectedProgramId, setSelectedProgramId] = useState("");

  const { data: programsData } = useQuery({
    queryKey: ["programs"],
    queryFn: async () => {
      const { data } = await api.get(PROGRAMS);
      return data;
    },
  });

  const programs = programsData?.programs || programsData || [];
  const selectedProgram = programs.find((p: any) => p.id === selectedProgramId);
  const fee = selectedProgram ? parseFloat(selectedProgram.monthlyFee) : 0;
  const commissionPerStudent = fee * 0.1;
  const totalCommission = students * commissionPerStudent;

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
              {programs.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  Loading programs...
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {programs.map((p: any) => (
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
                      <p className="text-green-400 font-semibold mt-1">
                        ₦{(parseFloat(p.monthlyFee) * 0.1).toLocaleString()}{" "}
                        commission per student
                      </p>
                    </button>
                  ))}
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

                <div className="grid grid-cols-2 gap-6 text-left">
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
          * Commission is 10% of program fee, paid after admin approval and
          student payment.
        </p>
      </div>
    </DashboardLayout>
  );
};

export default CommissionCalculator;