import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { GlobalLayout } from "@/components/GlobalLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import CreateAudition from "./pages/CreateAudition";
import Auditions from "./pages/Auditions";
import AuditionDetail from "./pages/AuditionDetail";
import UploadAuditions from "./pages/UploadAuditions";
import SceneAnalysis from "./pages/SceneAnalysis";
import ScriptAnalysis from "./pages/ScriptAnalysis";
import Storyboarding from "./pages/Storyboarding";
import CreateProject from "./pages/CreateProject";
import CreateFestival from "./pages/CreateFestival";
import Applications from "./pages/Applications";
import Festivals from "./pages/Festivals";
import CalendarPage from "./pages/CalendarPage";
import { FilmmakerDashboard } from "./pages/FilmmakerDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminProjects from "./pages/AdminProjects";
import AdminFestivals from "./pages/AdminFestivals";
import AdminApplications from "./pages/AdminApplications";
import AdminCredits from "./pages/AdminCredits";
import AdminCourses from "./pages/AdminCourses";
import AdminQuizzes from "./pages/AdminQuizzes";
import ToolboxHome from "./pages/ToolboxHome";
import MultiStepForm from "./pages/MultiStepForm";
import DocsLibrary from "./pages/DocsLibrary";
import ConsultingIntake from "./pages/ConsultingIntake";
import ActorHub from "./pages/ActorHub";
import ActorProfile from "./pages/ActorProfile";
import CrewHub from "./pages/CrewHub";
import Membership from "./pages/Membership";
import TrainingHub from "./pages/TrainingHub";
import CourseDetail from "./pages/CourseDetail";
import CertificationGallery from "./pages/CertificationGallery";
import VerifyCertificate from "./pages/VerifyCertificate";
import MyLearning from "./pages/MyLearning";

const queryClient = new QueryClient();

const AppContent = () => (
  <GlobalLayout>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/actor" element={<ActorHub />} />
      <Route path="/actor/profile" element={<ActorProfile />} />
      <Route path="/crew" element={<CrewHub />} />
      <Route path="/create-audition" element={<CreateAudition />} />
      <Route path="/auditions" element={<Auditions />} />
      <Route path="/audition/:id" element={<AuditionDetail />} />
      <Route path="/upload-auditions" element={<UploadAuditions />} />
      <Route path="/scene-analysis" element={<SceneAnalysis />} />
      <Route path="/script-analysis" element={<ScriptAnalysis />} />
      <Route path="/storyboarding" element={<Storyboarding />} />
      <Route path="/create-project" element={<CreateProject />} />
      <Route path="/create-festival" element={<CreateFestival />} />
      <Route path="/applications" element={<Applications />} />
      <Route path="/festivals" element={<Festivals />} />
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/filmmaker" element={<FilmmakerDashboard />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<AdminUsers />} />
      <Route path="/admin/projects" element={<AdminProjects />} />
      <Route path="/admin/festivals" element={<AdminFestivals />} />
      <Route path="/admin/applications" element={<AdminApplications />} />
      <Route path="/admin/credits" element={<AdminCredits />} />
      <Route path="/admin/courses" element={<AdminCourses />} />
      <Route path="/admin/quizzes" element={<AdminQuizzes />} />
      <Route path="/toolbox" element={<ToolboxHome />} />
      <Route path="/submit" element={<MultiStepForm />} />
      <Route path="/library" element={<DocsLibrary />} />
          <Route path="/consulting" element={<ConsultingIntake />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/training" element={<TrainingHub />} />
          <Route path="/training/:courseId" element={<CourseDetail />} />
          <Route path="/training/my-learning" element={<MyLearning />} />
          <Route path="/training/certifications" element={<CertificationGallery />} />
          <Route path="/verify-certificate/:certificateNumber" element={<VerifyCertificate />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
    </Routes>
  </GlobalLayout>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
