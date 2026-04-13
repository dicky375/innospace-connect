import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// Main pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

// Main dashboards
import AffiliateDashboard from "./pages/AffiliateDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";

// Affillliate sub-pages
import AffiliateRegistrations from "./pages/affiliate/Registrations";
import AffiliateLeaderboard from "./pages/affiliate/Leaderboard";
import AffiliateWallet from "./pages/affiliate/Wallet";
import AffiliateProfile from "./pages/affiliate/Profile";

// Admin sub-pages
import AdminPrograms from "./pages/admin/Programs";
import AdminRegistrations from "./pages/admin/Registrations";
import AdminApprovals from "./pages/admin/Approvals";
import AdminUsers from "./pages/admin/Users";
import AdminSettings from "./pages/admin/Settings";

// Student sub-pages
import StudentProfile from "./pages/student/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Affiliate */}
            <Route path="/affiliate" element={<ProtectedRoute allowedRoles={["affiliate"]}><AffiliateDashboard /></ProtectedRoute>} />
            <Route path="/affiliate/registrations" element={<ProtectedRoute allowedRoles={["affiliate"]}><AffiliateRegistrations/></ProtectedRoute>} />
            <Route path="/affiliate/leaderboard" element={<ProtectedRoute allowedRoles={["affiliate"]}><AffiliateLeaderboard users={[]} /></ProtectedRoute>} />
            <Route path="/affiliate/wallet" element={<ProtectedRoute allowedRoles={["affiliate"]}><AffiliateWallet /></ProtectedRoute>} />
            <Route path="/affiliate/profile" element={<ProtectedRoute allowedRoles={["affiliate"]}><AffiliateProfile /></ProtectedRoute>} />

            {/* Admin */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/programs" element={<ProtectedRoute allowedRoles={["admin"]}><AdminPrograms /></ProtectedRoute>} />
            <Route path="/admin/registrations" element={<ProtectedRoute allowedRoles={["admin"]}><AdminRegistrations /></ProtectedRoute>} />
            <Route path="/admin/approvals" element={<ProtectedRoute allowedRoles={["admin"]}><AdminApprovals /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute allowedRoles={["admin"]}><AdminUsers /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={["admin"]}><AdminSettings /></ProtectedRoute>} />

            {/* Student */}
            <Route path="/dashboard" element={<ProtectedRoute allowedRoles={["user"]}><StudentDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/profile" element={<ProtectedRoute allowedRoles={["user"]}><StudentProfile /></ProtectedRoute>} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;