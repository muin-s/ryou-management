import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import RepairerDashboard from "./pages/RepairerDashboard";
import NotFound from "./pages/NotFound";
import { useEffect, useState } from "react";
import ProfileAvatar from "@/components/ui/ProfileAvatar";
import Header from "@/components/ui/Header";

// ✅ Added imports for bus timetable pages
import BusTimetableView from "@/components/BusTimetableView";
import BusTimetableAdmin from "@/components/BusTimetableAdmin";
import Medical from "./pages/Medical";

const queryClient = new QueryClient();

const ProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) => {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timeout);
  }, [user]);

  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user && !allowedRoles.includes(user.role))
    return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
};

const DashboardRouter = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case "student":
      return <StudentDashboard />;
    case "admin":
      return <AdminDashboard />;
    case "worker":
      return <RepairerDashboard />;
    default:
      return <Navigate to="/login" replace />;
  }
};

const App = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <DataProvider>
            <TooltipProvider>
              <Header />
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute
                      allowedRoles={["student", "admin", "worker"]}
                    >
                      <DashboardRouter />
                    </ProtectedRoute>
                  }
                />

                <Route path="/bus-timetable" element={<BusTimetableView />} />
                <Route
                  path="/admin/bus-timetable"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <BusTimetableAdmin />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/medical"
                  element={
                    <ProtectedRoute allowedRoles={["student", "admin"]}>
                      <Medical />
                    </ProtectedRoute>
                  }
                />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </DataProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
