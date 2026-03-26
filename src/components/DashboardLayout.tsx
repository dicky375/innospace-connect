import DashboardSidebar from "./DashboardSidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-background">
    <DashboardSidebar />
    <main className="ml-64 p-6 min-h-screen">
      {children}
    </main>
  </div>
);

export default DashboardLayout;
