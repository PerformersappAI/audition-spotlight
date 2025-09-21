import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import UploadAuditions from "./pages/UploadAuditions";
import SceneAnalysis from "./pages/SceneAnalysis";
import CreateProject from "./pages/CreateProject";
import CreateFestival from "./pages/CreateFestival";
import Applications from "./pages/Applications";
import Festivals from "./pages/Festivals";
import CalendarPage from "./pages/CalendarPage";
import { FilmmakerDashboard } from "./pages/FilmmakerDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/upload-auditions" element={<UploadAuditions />} />
            <Route path="/scene-analysis" element={<SceneAnalysis />} />
            <Route path="/create-project" element={<CreateProject />} />
            <Route path="/create-festival" element={<CreateFestival />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/festivals" element={<Festivals />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/filmmaker" element={<FilmmakerDashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
