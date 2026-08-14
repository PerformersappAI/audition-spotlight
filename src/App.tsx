import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import PitchDeckMaker from "./pages/PitchDeckMaker";
import PitchDeckPreview from "./pages/PitchDeckPreview";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { GlobalLayout } from "@/components/GlobalLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import CreateAudition from "./pages/CreateAudition";
import Auditions from "./pages/Auditions";
import AuditionDetail from "./pages/AuditionDetail";
import UploadAuditions from "./pages/UploadAuditions";
import SceneAnalysis from "./pages/SceneAnalysis";
import ScriptAnalysis from "./pages/ScriptAnalysis";
import StoryboardingRoute from "./pages/StoryboardingRoute";
import CallSheet from "./pages/CallSheet";
import CreateProject from "./pages/CreateProject";
import CreateFestival from "./pages/CreateFestival";
import Applications from "./pages/Applications";
import Festivals from "./pages/Festivals";
import CalendarPage from "./pages/CalendarPage";
import { FilmmakerDashboard } from "./pages/FilmmakerDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminMembers from "./pages/AdminMembers";
import AdminAuditions from "./pages/AdminAuditions";
import AdminProjects from "./pages/AdminProjects";
import AdminFestivals from "./pages/AdminFestivals";
import AdminApplications from "./pages/AdminApplications";
import AdminCredits from "./pages/AdminCredits";
import AdminCreditUsage from "./pages/AdminCreditUsage";
import AdminCourses from "./pages/AdminCourses";
import AdminQuizzes from "./pages/AdminQuizzes";
import AdminQuizAnalytics from "./pages/AdminQuizAnalytics";
import AdminBlog from "./pages/AdminBlog";
import ToolboxHome from "./pages/ToolboxHome";
import Toolbox from "./pages/Toolbox";
import Recut from "./pages/Recut";
import AdminHomepageSettings from "./pages/AdminHomepageSettings";
import PreProductionPhase from "./pages/PreProductionPhase";
import ProductionPhase from "./pages/ProductionPhase";
import PostProductionPhase from "./pages/PostProductionPhase";
import FilmReleasePhase from "./pages/FilmReleasePhase";
import DistributionPhase from "./pages/DistributionPhase";
import MultiStepForm from "./pages/MultiStepForm";
import DocsLibrary from "./pages/DocsLibrary";
import ConsultingIntake from "./pages/ConsultingIntake";
import ActorHub from "./pages/ActorHub";
import ActorProfile from "./pages/ActorProfile";
import CrewHub from "./pages/CrewHub";
import CrewHire from "./pages/CrewHire";
import Membership from "./pages/Membership";
import TrainingHub from "./pages/TrainingHub";
import CourseDetail from "./pages/CourseDetail";
import CertificationGallery from "./pages/CertificationGallery";
import VerifyCertificate from "./pages/VerifyCertificate";
import MyLearning from "./pages/MyLearning";
import ContractAssistant from "./pages/ContractAssistant";
import FundingStrategy from "./pages/FundingStrategy";
import ContractFiller from "./pages/ContractFiller";
import DistributionReadiness from "./pages/DistributionReadiness";
import TableRead from "./pages/TableRead";
import TableReadShared from "./pages/TableReadShared";
import VideoEvaluation from "./pages/VideoEvaluation";
import { ActorDashboard } from "./pages/ActorDashboard";
import Social from "./pages/Social";
import AnimaticView from "./pages/AnimaticView";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import HomeMarketing from "./pages/HomeMarketing";
import Academy from "./pages/Academy";
import EducationModules from "./pages/EducationModules";
import CoursePage from "./pages/CoursePage";
import CourseChapter from "./pages/CourseChapter";
import RobertsFilmmaking from "./pages/RobertsFilmmaking";
import RobertsChapter from "./pages/RobertsChapter";
import GreenLightEngine from "./pages/GreenLightEngine";
import GleTier from "./pages/GleTier";
import GleNiche from "./pages/GleNiche";
import GleNichePage from "./pages/GleNichePage";
import MonetizationHub from "./pages/MonetizationHub";
import MonetizationSubPage from "./pages/MonetizationSubPage";
import Refill from "./pages/Refill";
import Launch from "./pages/Launch";
import Marketing from "./pages/Marketing";
import MovieInABox from "./pages/MovieInABox";
import EngineRoom from "./pages/EngineRoom";
import StructureFlow from "./pages/StructureFlow";
import CompareStructures from "./pages/CompareStructures";
import BeatPage from "./pages/BeatPage";
import MoviePage from "./pages/MoviePage";
import ShotBeatPage from "./pages/ShotBeatPage";
import SceneBeatPage from "./pages/SceneBeatPage";
import OptionPurchaseAgreement from "./pages/agreements/OptionPurchaseAgreement";
import LiteraryRightsOption from "./pages/agreements/LiteraryRightsOption";
import WriterAgreement from "./pages/agreements/WriterAgreement";
import LifeRightsAgreement from "./pages/agreements/LifeRightsAgreement";
import CollaborationAgreement from "./pages/agreements/CollaborationAgreement";
import CertificateOfAuthorship from "./pages/agreements/CertificateOfAuthorship";
import RightsAssignmentAgreement from "./pages/agreements/RightsAssignmentAgreement";
import NonDisclosureAgreement from "./pages/agreements/NonDisclosureAgreement";
import LLCOperatingAgreement from "./pages/agreements/LLCOperatingAgreement";
import InvestorAgreement from "./pages/agreements/InvestorAgreement";
import FinancingTermSheet from "./pages/agreements/FinancingTermSheet";
import RecoupmentWaterfall from "./pages/agreements/RecoupmentWaterfall";
import DeferredCompensationAgreement from "./pages/agreements/DeferredCompensationAgreement";
import ExecutiveProducerAgreement from "./pages/agreements/ExecutiveProducerAgreement";
import CoProductionAgreement from "./pages/agreements/CoProductionAgreement";
import ScriptBreakdownSheet from "./pages/agreements/ScriptBreakdownSheet";
import StripboardProductionBoard from "./pages/agreements/StripboardProductionBoard";
import OneLineSchedule from "./pages/agreements/OneLineSchedule";
import ShootingSchedule from "./pages/agreements/ShootingSchedule";
import DayOutOfDays from "./pages/agreements/DayOutOfDays";
import ShotList from "./pages/agreements/ShotList";
import StoryboardTemplate from "./pages/agreements/StoryboardTemplate";
import BudgetTopSheet from "./pages/agreements/BudgetTopSheet";
import DetailedBudget from "./pages/agreements/DetailedBudget";
import CrewContactList from "./pages/agreements/CrewContactList";
import CastDealMemo from "./pages/agreements/CastDealMemo";
import CrewDealMemo from "./pages/agreements/CrewDealMemo";
import DirectorAgreement from "./pages/agreements/DirectorAgreement";
import ProducerAgreement from "./pages/agreements/ProducerAgreement";
import CinematographerAgreement from "./pages/agreements/CinematographerAgreement";
import IndependentContractorAgreement from "./pages/agreements/IndependentContractorAgreement";
import LoanOutAgreement from "./pages/agreements/LoanOutAgreement";
import KitBoxRentalAgreement from "./pages/agreements/KitBoxRentalAgreement";
import InternVolunteerAgreement from "./pages/agreements/InternVolunteerAgreement";
import ParentalGuardianConsentMinor from "./pages/agreements/ParentalGuardianConsentMinor";
import AdultTalentRelease from "./pages/agreements/AdultTalentRelease";
import BackgroundExtraRelease from "./pages/agreements/BackgroundExtraRelease";
import MinorTalentRelease from "./pages/agreements/MinorTalentRelease";
import DepictionAppearanceRelease from "./pages/agreements/DepictionAppearanceRelease";
import PersonalRelease from "./pages/agreements/PersonalRelease";
import InterviewSubjectRelease from "./pages/agreements/InterviewSubjectRelease";
import CrowdNoticeSignage from "./pages/agreements/CrowdNoticeSignage";
import LocationAgreement from "./pages/agreements/LocationAgreement";
import PropertyRelease from "./pages/agreements/PropertyRelease";
import LocationScoutReport from "./pages/agreements/LocationScoutReport";
import TechScoutSurvey from "./pages/agreements/TechScoutSurvey";
import PermitApplicationChecklist from "./pages/agreements/PermitApplicationChecklist";
import FilmOfficeCoverLetter from "./pages/agreements/FilmOfficeCoverLetter";
import DailyProductionReport from "./pages/agreements/DailyProductionReport";
import CrewTimecard from "./pages/agreements/CrewTimecard";
import CameraReport from "./pages/agreements/CameraReport";
import SoundReport from "./pages/agreements/SoundReport";
import ContinuityReport from "./pages/agreements/ContinuityReport";
import BackgroundVoucher from "./pages/agreements/BackgroundVoucher";
import EquipmentInventory from "./pages/agreements/EquipmentInventory";
import AccidentIncidentReport from "./pages/agreements/AccidentIncidentReport";
import SafetyMeetingAcknowledgement from "./pages/agreements/SafetyMeetingAcknowledgement";
import PurchaseOrder from "./pages/agreements/PurchaseOrder";
import PurchaseOrderLog from "./pages/agreements/PurchaseOrderLog";
import CheckRequest from "./pages/agreements/CheckRequest";
import PettyCashReconciliation from "./pages/agreements/PettyCashReconciliation";
import ExpenseReport from "./pages/agreements/ExpenseReport";
import MileageLog from "./pages/agreements/MileageLog";
import CreditCardLog from "./pages/agreements/CreditCardLog";
import InvoiceTemplate from "./pages/agreements/InvoiceTemplate";































import ShoppingAgreement from "./pages/agreements/ShoppingAgreement";









import ToolGate from "@/components/ToolGate";

const queryClient = new QueryClient();

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const AppContent = () => (
  <GlobalLayout>
    <Routes>
          <Route path="/" element={<HomeMarketing />} />
          <Route path="/welcome" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/actor" element={<ActorHub />} />
      <Route path="/actor/profile" element={<ActorProfile />} />
      <Route path="/crew" element={<ToolGate><CrewHub /></ToolGate>} />
      <Route path="/crew-hire" element={<ToolGate><CrewHire /></ToolGate>} />
      <Route path="/create-audition" element={<ToolGate><CreateAudition /></ToolGate>} />
      <Route path="/auditions" element={<ToolGate><Auditions /></ToolGate>} />
      <Route path="/audition/:id" element={<AuditionDetail />} />
      <Route path="/upload-auditions" element={<ToolGate><UploadAuditions /></ToolGate>} />
      <Route path="/scene-analysis" element={<ToolGate><SceneAnalysis /></ToolGate>} />
      <Route path="/script-analysis" element={<ToolGate><ScriptAnalysis /></ToolGate>} />
      <Route path="/storyboarding" element={<ToolGate><StoryboardingRoute /></ToolGate>} />
      <Route path="/storyboarding/pricing" element={<Navigate to="/membership" replace />} />
      <Route path="/call-sheet" element={<ToolGate><CallSheet /></ToolGate>} />
      <Route path="/create-project" element={<CreateProject />} />
      <Route path="/create-festival" element={<CreateFestival />} />
      <Route path="/applications" element={<Applications />} />
      <Route path="/festivals" element={<Festivals />} />
      <Route path="/calendar" element={<ToolGate><CalendarPage /></ToolGate>} />
      <Route path="/calendar" element={<ToolGate><CalendarPage /></ToolGate>} />
      <Route path="/filmmaker" element={<FilmmakerDashboard />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<AdminUsers />} />
      <Route path="/admin/members" element={<AdminMembers />} />
      <Route path="/admin/auditions" element={<AdminAuditions />} />
      <Route path="/admin/projects" element={<AdminProjects />} />
      <Route path="/admin/festivals" element={<AdminFestivals />} />
      <Route path="/admin/applications" element={<AdminApplications />} />
      <Route path="/admin/credits" element={<AdminCredits />} />
      <Route path="/admin/credit-usage" element={<AdminCreditUsage />} />
      <Route path="/admin/courses" element={<AdminCourses />} />
      <Route path="/admin/quizzes" element={<AdminQuizzes />} />
      <Route path="/admin/quiz-analytics" element={<AdminQuizAnalytics />} />
      <Route path="/admin/homepage" element={<AdminHomepageSettings />} />
      <Route path="/admin/blog" element={<AdminBlog />} />
      <Route path="/toolbox" element={<Toolbox />} />
      <Route path="/toolbox/pre-production" element={<PreProductionPhase />} />
      <Route path="/toolbox/production" element={<ProductionPhase />} />
      <Route path="/toolbox/post-production" element={<PostProductionPhase />} />
      <Route path="/toolbox/film-release" element={<FilmReleasePhase />} />
      <Route path="/toolbox/distribution" element={<DistributionPhase />} />
      <Route path="/submit" element={<ToolGate><MultiStepForm /></ToolGate>} />
      <Route path="/library" element={<ToolGate><DocsLibrary /></ToolGate>} />
      <Route path="/library/option-purchase-agreement" element={<ToolGate><OptionPurchaseAgreement /></ToolGate>} />
      <Route path="/library/literary-rights-option-agreement" element={<ToolGate><LiteraryRightsOption /></ToolGate>} />
      <Route path="/library/writer-agreement-work-for-hire" element={<ToolGate><WriterAgreement /></ToolGate>} />
      <Route path="/library/life-rights-agreement" element={<ToolGate><LifeRightsAgreement /></ToolGate>} />
      <Route path="/library/collaboration-agreement" element={<ToolGate><CollaborationAgreement /></ToolGate>} />
      <Route path="/library/certificate-of-authorship" element={<ToolGate><CertificateOfAuthorship /></ToolGate>} />
          <Route path="/library/rights-assignment-agreement" element={<ToolGate><RightsAssignmentAgreement /></ToolGate>} />
          <Route path="/library/shopping-agreement" element={<ToolGate><ShoppingAgreement /></ToolGate>} />
          <Route path="/library/non-disclosure-agreement" element={<ToolGate><NonDisclosureAgreement /></ToolGate>} />
          <Route path="/library/llc-operating-agreement" element={<ToolGate><LLCOperatingAgreement /></ToolGate>} />
          <Route path="/library/investor-agreement" element={<ToolGate><InvestorAgreement /></ToolGate>} />
          <Route path="/library/financing-term-sheet" element={<ToolGate><FinancingTermSheet /></ToolGate>} />
          <Route path="/library/recoupment-waterfall-schedule" element={<ToolGate><RecoupmentWaterfall /></ToolGate>} />
          <Route path="/library/deferred-compensation-agreement" element={<ToolGate><DeferredCompensationAgreement /></ToolGate>} />
          <Route path="/library/executive-producer-agreement" element={<ToolGate><ExecutiveProducerAgreement /></ToolGate>} />
          <Route path="/library/co-production-agreement" element={<ToolGate><CoProductionAgreement /></ToolGate>} />
          <Route path="/library/script-breakdown-sheet" element={<ToolGate><ScriptBreakdownSheet /></ToolGate>} />
          <Route path="/library/stripboard-production-board" element={<ToolGate><StripboardProductionBoard /></ToolGate>} />
          <Route path="/library/one-line-schedule" element={<ToolGate><OneLineSchedule /></ToolGate>} />
          <Route path="/library/shooting-schedule" element={<ToolGate><ShootingSchedule /></ToolGate>} />
          <Route path="/library/day-out-of-days" element={<ToolGate><DayOutOfDays /></ToolGate>} />
          <Route path="/library/shot-list" element={<ToolGate><ShotList /></ToolGate>} />
          <Route path="/library/storyboard-template" element={<ToolGate><StoryboardTemplate /></ToolGate>} />
          <Route path="/library/budget-top-sheet" element={<ToolGate><BudgetTopSheet /></ToolGate>} />
          <Route path="/library/detailed-budget" element={<ToolGate><DetailedBudget /></ToolGate>} />
          <Route path="/library/crew-contact-list" element={<ToolGate><CrewContactList /></ToolGate>} />
          <Route path="/library/cast-deal-memo" element={<ToolGate><CastDealMemo /></ToolGate>} />
          <Route path="/library/crew-deal-memo" element={<ToolGate><CrewDealMemo /></ToolGate>} />
          <Route path="/library/director-agreement" element={<ToolGate><DirectorAgreement /></ToolGate>} />
          <Route path="/library/producer-agreement" element={<ToolGate><ProducerAgreement /></ToolGate>} />
          <Route path="/library/cinematographer-agreement" element={<ToolGate><CinematographerAgreement /></ToolGate>} />
          <Route path="/library/independent-contractor-agreement" element={<ToolGate><IndependentContractorAgreement /></ToolGate>} />
          <Route path="/library/loan-out-agreement" element={<ToolGate><LoanOutAgreement /></ToolGate>} />
          <Route path="/library/kit-box-rental-agreement" element={<ToolGate><KitBoxRentalAgreement /></ToolGate>} />
          <Route path="/library/intern-volunteer-agreement" element={<ToolGate><InternVolunteerAgreement /></ToolGate>} />
          <Route path="/library/parental-guardian-consent-minor" element={<ToolGate><ParentalGuardianConsentMinor /></ToolGate>} />
          <Route path="/library/adult-talent-release" element={<ToolGate><AdultTalentRelease /></ToolGate>} />
          <Route path="/library/background-extra-release" element={<ToolGate><BackgroundExtraRelease /></ToolGate>} />
          <Route path="/library/minor-talent-release" element={<ToolGate><MinorTalentRelease /></ToolGate>} />
          <Route path="/library/depiction-appearance-release" element={<ToolGate><DepictionAppearanceRelease /></ToolGate>} />
          <Route path="/library/personal-release" element={<ToolGate><PersonalRelease /></ToolGate>} />
          <Route path="/library/interview-subject-release" element={<ToolGate><InterviewSubjectRelease /></ToolGate>} />
          <Route path="/library/crowd-notice-signage" element={<ToolGate><CrowdNoticeSignage /></ToolGate>} />
          <Route path="/library/location-agreement" element={<ToolGate><LocationAgreement /></ToolGate>} />
          <Route path="/library/property-release" element={<ToolGate><PropertyRelease /></ToolGate>} />
          <Route path="/library/location-scout-report" element={<ToolGate><LocationScoutReport /></ToolGate>} />
          <Route path="/library/tech-scout-survey" element={<ToolGate><TechScoutSurvey /></ToolGate>} />
          <Route path="/library/permit-application-checklist" element={<ToolGate><PermitApplicationChecklist /></ToolGate>} />
          <Route path="/library/film-office-cover-letter" element={<ToolGate><FilmOfficeCoverLetter /></ToolGate>} />
          <Route path="/library/daily-production-report" element={<ToolGate><DailyProductionReport /></ToolGate>} />
          <Route path="/library/crew-timecard" element={<ToolGate><CrewTimecard /></ToolGate>} />
          <Route path="/library/camera-report" element={<ToolGate><CameraReport /></ToolGate>} />
          <Route path="/library/sound-report" element={<ToolGate><SoundReport /></ToolGate>} />
          <Route path="/library/continuity-report" element={<ToolGate><ContinuityReport /></ToolGate>} />
          <Route path="/library/background-voucher" element={<ToolGate><BackgroundVoucher /></ToolGate>} />
          <Route path="/library/equipment-inventory" element={<ToolGate><EquipmentInventory /></ToolGate>} />
          <Route path="/library/accident-incident-report" element={<ToolGate><AccidentIncidentReport /></ToolGate>} />
          <Route path="/library/safety-meeting-acknowledgement" element={<ToolGate><SafetyMeetingAcknowledgement /></ToolGate>} />
          <Route path="/library/purchase-order" element={<ToolGate><PurchaseOrder /></ToolGate>} />
          <Route path="/library/purchase-order-log" element={<ToolGate><PurchaseOrderLog /></ToolGate>} />
          <Route path="/library/check-request" element={<ToolGate><CheckRequest /></ToolGate>} />
          <Route path="/library/petty-cash-reconciliation" element={<ToolGate><PettyCashReconciliation /></ToolGate>} />
          <Route path="/library/expense-report" element={<ToolGate><ExpenseReport /></ToolGate>} />
          <Route path="/library/mileage-log" element={<ToolGate><MileageLog /></ToolGate>} />
          <Route path="/library/credit-card-log" element={<ToolGate><CreditCardLog /></ToolGate>} />
          <Route path="/library/invoice-template" element={<ToolGate><InvoiceTemplate /></ToolGate>} />








































          <Route path="/consulting" element={<Navigate to="/" replace />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/training" element={<Navigate to="/" replace />} />
          <Route path="/training/:courseId" element={<Navigate to="/" replace />} />
          <Route path="/training/my-learning" element={<Navigate to="/" replace />} />
          <Route path="/training/certifications" element={<Navigate to="/" replace />} />
          <Route path="/verify-certificate/:certificateNumber" element={<VerifyCertificate />} />
          <Route path="/contract-assistant" element={<ToolGate><ContractAssistant /></ToolGate>} />
          <Route path="/funding-strategy" element={<ToolGate><FundingStrategy /></ToolGate>} />
          <Route path="/contract-filler" element={<ToolGate><ContractFiller /></ToolGate>} />
          <Route path="/pitch-deck" element={<ToolGate><PitchDeckMaker /></ToolGate>} />
          <Route path="/pitch-deck/preview" element={<ToolGate><PitchDeckPreview /></ToolGate>} />
          <Route path="/distribution-readiness" element={<ToolGate><DistributionReadiness /></ToolGate>} />
          <Route path="/table-read" element={<ToolGate><TableRead /></ToolGate>} />
          <Route path="/table-read/shared/:id" element={<TableReadShared />} />
          <Route path="/video-evaluation" element={<ToolGate><VideoEvaluation /></ToolGate>} />
          <Route path="/actor-dashboard" element={<ActorDashboard />} />
          <Route path="/social" element={<Social />} />
          <Route path="/animatic/:projectId" element={<AnimaticView />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/academy" element={<Academy />} />
          <Route path="/academy/education" element={<EducationModules />} />
          <Route path="/academy/education-modules" element={<EducationModules />} />
          <Route path="/academy/roberts-filmmaking" element={<RobertsFilmmaking />} />
          <Route path="/academy/roberts-filmmaking/:chapterId" element={<RobertsChapter />} />
          <Route path="/academy/aggregators" element={<MonetizationHub hubKey="aggregators" />} />
          <Route path="/academy/distributors" element={<MonetizationHub hubKey="distributors" />} />
          <Route path="/academy/vod" element={<MonetizationHub hubKey="vod" />} />
          <Route path="/academy/aggregators/:slug" element={<MonetizationSubPage group="aggregators" />} />
          <Route path="/academy/distributors/:slug" element={<MonetizationSubPage group="distributors" />} />
          <Route path="/academy/vod/:slug" element={<MonetizationSubPage group="vod" />} />
          <Route path="/green-light-engine" element={<GreenLightEngine />} />
          <Route path="/green-light-engine/niche" element={<GleNiche />} />
          <Route path="/green-light-engine/niche/:slug" element={<GleNichePage />} />
          <Route path="/green-light-engine/:tier" element={<GleTier />} />
          <Route path="/academy/:courseSlug" element={<CoursePage />} />
          <Route path="/academy/:courseSlug/:chapterSlug" element={<CourseChapter />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/pricing" element={<Navigate to="/membership" replace />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/recut" element={<ToolGate><Recut /></ToolGate>} />
          <Route path="/launch" element={<Launch />} />
          <Route path="/marketing" element={<Marketing />} />
          <Route path="/refill" element={<Refill />} />
          <Route path="/movie-in-a-box" element={<MovieInABox />} />
          <Route path="/movie-in-a-box/save-the-cat" element={<Navigate to="/movie-in-a-box/save-the-cat/structure" replace />} />
          <Route path="/movie-in-a-box/save-the-cat/:stop" element={<StructureFlow structureKey="save-the-cat" />} />
          <Route path="/movie-in-a-box/three-act" element={<Navigate to="/movie-in-a-box/three-act/structure" replace />} />
          <Route path="/movie-in-a-box/three-act/:stop" element={<StructureFlow structureKey="three-act" />} />
          <Route path="/movie-in-a-box/heros-journey" element={<Navigate to="/movie-in-a-box/heros-journey/structure" replace />} />
          <Route path="/movie-in-a-box/heros-journey/:stop" element={<StructureFlow structureKey="heros-journey" />} />
          <Route path="/movie-in-a-box/story-circle" element={<Navigate to="/movie-in-a-box/story-circle/structure" replace />} />
          <Route path="/movie-in-a-box/story-circle/:stop" element={<StructureFlow structureKey="story-circle" />} />
          <Route path="/movie-in-a-box/compare" element={<CompareStructures />} />
          <Route path="/movie-in-a-box/engine-room" element={<EngineRoom />} />
          <Route path="/movie-in-a-box/:structure/beat/:slug" element={<BeatPage />} />
          <Route path="/movie-in-a-box/movie/:slug" element={<MoviePage />} />
          <Route path="/movie-in-a-box/:structure/shots/:beat" element={<ShotBeatPage />} />
          <Route path="/movie-in-a-box/:structure/scene/:beat" element={<SceneBeatPage />} />
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
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ScrollToTop />
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
