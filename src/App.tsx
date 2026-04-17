import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// Public Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

// Dashboards
import AdminDashboard from "./pages/admin/AdminDashboard";
import AffiliateDashboard from "./pages/affiliate/AffiliateDashboard";

// Affiliate Pages
import AffiliateRegistrations from "./pages/affiliate/Registrations";
import RegisterStudent from "./pages/affiliate/RegisterStudent";
import CommissionCalculator from "./pages/affiliate/CommissionCalculator";
// Admin Pages
import AdminApprovals from "./pages/admin/Approvals";
import AdminRegistrations from "./pages/admin/Registrations";
import AdminPayouts from "./pages/admin/Payouts";
import AdminPrograms from "./pages/admin/Programs";
import Users from "./pages/admin/Users";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" richColors closeButton />

      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* ===================== PUBLIC ROUTES ===================== */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* ===================== AFFILIATE ROUTES ===================== */}
            <Route
              path="/affiliate"
              element={
                <ProtectedRoute allowedRoles={["affiliate"]}>
                  <AffiliateDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/affiliate/registrations"
              element={
                <ProtectedRoute allowedRoles={["affiliate"]}>
                  <AffiliateRegistrations />
                </ProtectedRoute>
              }
            />
            <Route
              path="/affiliate/register-student"
              element={
                <ProtectedRoute allowedRoles={["affiliate"]}>
                  <RegisterStudent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/affiliate/commission-calculator"
              element={
                <ProtectedRoute allowedRoles={["affiliate"]}>
                  <CommissionCalculator />
                </ProtectedRoute>
              }
            />

            {/* ===================== ADMIN ROUTES ===================== */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/approvals"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminApprovals />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/registrations"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminRegistrations />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/payouts"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminPayouts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/programs"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminPrograms />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Users />
                </ProtectedRoute>
              }
            />

            {/* ===================== REDIRECTS ===================== */}
            <Route path="/admin/dashboard" element={<Navigate to="/admin" replace />} />
            <Route path="/dashboard" element={<Navigate to="/login" replace />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;