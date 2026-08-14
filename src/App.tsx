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
import ContactCastCrew from "./pages/ContactCastCrew";
import PublicCastCrewForm from "./pages/PublicCastCrewForm";
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
import GlePlatformPage from "./pages/GlePlatformPage";
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
import CostReportActuals from "./pages/agreements/CostReportActuals";
import MusicLicenseSync from "./pages/agreements/MusicLicenseSync";
import MusicCueSheet from "./pages/agreements/MusicCueSheet";
import ComposerAgreement from "./pages/agreements/ComposerAgreement";
import MusicianSessionRelease from "./pages/agreements/MusicianSessionRelease";
import MaterialsArtworkRelease from "./pages/agreements/MaterialsArtworkRelease";
import ProductPlacementRelease from "./pages/agreements/ProductPlacementRelease";
import ClearanceLog from "./pages/agreements/ClearanceLog";
import PostSchedule from "./pages/agreements/PostSchedule";
import VfxShotList from "./pages/agreements/VfxShotList";
import DeliverablesChecklist from "./pages/agreements/DeliverablesChecklist";
import QcChecklist from "./pages/agreements/QcChecklist";
import EditorAgreement from "./pages/agreements/EditorAgreement";
import CcslList from "./pages/agreements/CcslList";
import CreditsTitleList from "./pages/agreements/CreditsTitleList";
import DistributionPackageChecklist from "./pages/agreements/DistributionPackageChecklist";
import DeliverySchedule from "./pages/agreements/DeliverySchedule";
import SalesAgentAgreement from "./pages/agreements/SalesAgentAgreement";
import DistributionAgreement from "./pages/agreements/DistributionAgreement";
import EpkFeature from "./pages/agreements/EpkFeature";
import EpkShort from "./pages/agreements/EpkShort";
import OneSheetPoster from "./pages/agreements/OneSheetPoster";
import PressRelease from "./pages/agreements/PressRelease";
import DirectorsStatement from "./pages/agreements/DirectorsStatement";
import SynopsisTemplate from "./pages/agreements/SynopsisTemplate";
import CastCrewBio from "./pages/agreements/CastCrewBio";
import FestivalCoverLetter from "./pages/agreements/FestivalCoverLetter";
import FestivalQA from "./pages/agreements/FestivalQA";

















































import ShoppingAgreement from "./pages/agreements/ShoppingAgreement";









import ToolGate from "@/components/ToolGate";
import { ToolSeo } from "@/components/ToolSeo";

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
      <Route path="/contact-cast-crew" element={<ToolGate><ContactCastCrew /></ToolGate>} />
      <Route path="/f/:slug" element={<PublicCastCrewForm />} />
      <Route path="/create-audition" element={<ToolGate><CreateAudition /></ToolGate>} />
      <Route path="/auditions" element={<ToolGate><Auditions /></ToolGate>} />
      <Route path="/audition/:id" element={<AuditionDetail />} />
      <Route path="/upload-auditions" element={<ToolGate><UploadAuditions /></ToolGate>} />
      <Route path="/scene-analysis" element={<><ToolSeo path="/scene-analysis" /><ToolGate><SceneAnalysis /></ToolGate></>} />
      <Route path="/script-analysis" element={<><ToolSeo path="/script-analysis" /><ToolGate><ScriptAnalysis /></ToolGate></>} />
      <Route path="/storyboarding" element={<><ToolSeo path="/storyboarding" /><ToolGate><StoryboardingRoute /></ToolGate></>} />
      <Route path="/storyboarding/pricing" element={<Navigate to="/membership" replace />} />
      <Route path="/call-sheet" element={<><ToolSeo path="/call-sheet" /><ToolGate><CallSheet /></ToolGate></>} />
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
      <Route path="/library" element={<DocsLibrary />} />
      <Route path="/library/option-purchase-agreement" element={<OptionPurchaseAgreement />} />
      <Route path="/library/literary-rights-option-agreement" element={<LiteraryRightsOption />} />
      <Route path="/library/writer-agreement-work-for-hire" element={<WriterAgreement />} />
      <Route path="/library/life-rights-agreement" element={<LifeRightsAgreement />} />
      <Route path="/library/collaboration-agreement" element={<CollaborationAgreement />} />
      <Route path="/library/certificate-of-authorship" element={<CertificateOfAuthorship />} />
          <Route path="/library/rights-assignment-agreement" element={<RightsAssignmentAgreement />} />
          <Route path="/library/shopping-agreement" element={<ShoppingAgreement />} />
          <Route path="/library/non-disclosure-agreement" element={<NonDisclosureAgreement />} />
          <Route path="/library/llc-operating-agreement" element={<LLCOperatingAgreement />} />
          <Route path="/library/investor-agreement" element={<InvestorAgreement />} />
          <Route path="/library/financing-term-sheet" element={<FinancingTermSheet />} />
          <Route path="/library/recoupment-waterfall-schedule" element={<RecoupmentWaterfall />} />
          <Route path="/library/deferred-compensation-agreement" element={<DeferredCompensationAgreement />} />
          <Route path="/library/executive-producer-agreement" element={<ExecutiveProducerAgreement />} />
          <Route path="/library/co-production-agreement" element={<CoProductionAgreement />} />
          <Route path="/library/script-breakdown-sheet" element={<ScriptBreakdownSheet />} />
          <Route path="/library/stripboard-production-board" element={<StripboardProductionBoard />} />
          <Route path="/library/one-line-schedule" element={<OneLineSchedule />} />
          <Route path="/library/shooting-schedule" element={<ShootingSchedule />} />
          <Route path="/library/day-out-of-days" element={<DayOutOfDays />} />
          <Route path="/library/shot-list" element={<ShotList />} />
          <Route path="/library/storyboard-template" element={<StoryboardTemplate />} />
          <Route path="/library/budget-top-sheet" element={<BudgetTopSheet />} />
          <Route path="/library/detailed-budget" element={<DetailedBudget />} />
          <Route path="/library/crew-contact-list" element={<CrewContactList />} />
          <Route path="/library/cast-deal-memo" element={<CastDealMemo />} />
          <Route path="/library/crew-deal-memo" element={<CrewDealMemo />} />
          <Route path="/library/director-agreement" element={<DirectorAgreement />} />
          <Route path="/library/producer-agreement" element={<ProducerAgreement />} />
          <Route path="/library/cinematographer-agreement" element={<CinematographerAgreement />} />
          <Route path="/library/independent-contractor-agreement" element={<IndependentContractorAgreement />} />
          <Route path="/library/loan-out-agreement" element={<LoanOutAgreement />} />
          <Route path="/library/kit-box-rental-agreement" element={<KitBoxRentalAgreement />} />
          <Route path="/library/intern-volunteer-agreement" element={<InternVolunteerAgreement />} />
          <Route path="/library/parental-guardian-consent-minor" element={<ParentalGuardianConsentMinor />} />
          <Route path="/library/adult-talent-release" element={<AdultTalentRelease />} />
          <Route path="/library/background-extra-release" element={<BackgroundExtraRelease />} />
          <Route path="/library/minor-talent-release" element={<MinorTalentRelease />} />
          <Route path="/library/depiction-appearance-release" element={<DepictionAppearanceRelease />} />
          <Route path="/library/personal-release" element={<PersonalRelease />} />
          <Route path="/library/interview-subject-release" element={<InterviewSubjectRelease />} />
          <Route path="/library/crowd-notice-signage" element={<CrowdNoticeSignage />} />
          <Route path="/library/location-agreement" element={<LocationAgreement />} />
          <Route path="/library/property-release" element={<PropertyRelease />} />
          <Route path="/library/location-scout-report" element={<LocationScoutReport />} />
          <Route path="/library/tech-scout-survey" element={<TechScoutSurvey />} />
          <Route path="/library/permit-application-checklist" element={<PermitApplicationChecklist />} />
          <Route path="/library/film-office-cover-letter" element={<FilmOfficeCoverLetter />} />
          <Route path="/library/daily-production-report" element={<DailyProductionReport />} />
          <Route path="/library/crew-timecard" element={<CrewTimecard />} />
          <Route path="/library/camera-report" element={<CameraReport />} />
          <Route path="/library/sound-report" element={<SoundReport />} />
          <Route path="/library/continuity-report" element={<ContinuityReport />} />
          <Route path="/library/background-voucher" element={<BackgroundVoucher />} />
          <Route path="/library/equipment-inventory" element={<EquipmentInventory />} />
          <Route path="/library/accident-incident-report" element={<AccidentIncidentReport />} />
          <Route path="/library/safety-meeting-acknowledgement" element={<SafetyMeetingAcknowledgement />} />
          <Route path="/library/purchase-order" element={<PurchaseOrder />} />
          <Route path="/library/purchase-order-log" element={<PurchaseOrderLog />} />
          <Route path="/library/check-request" element={<CheckRequest />} />
          <Route path="/library/petty-cash-reconciliation" element={<PettyCashReconciliation />} />
          <Route path="/library/expense-report" element={<ExpenseReport />} />
          <Route path="/library/mileage-log" element={<MileageLog />} />
          <Route path="/library/credit-card-log" element={<CreditCardLog />} />
          <Route path="/library/invoice-template" element={<InvoiceTemplate />} />
          <Route path="/library/cost-report-actuals" element={<CostReportActuals />} />
          <Route path="/library/music-license-sync" element={<MusicLicenseSync />} />
          <Route path="/library/music-cue-sheet" element={<MusicCueSheet />} />
          <Route path="/library/composer-agreement" element={<ComposerAgreement />} />
          <Route path="/library/musician-session-release" element={<MusicianSessionRelease />} />
          <Route path="/library/materials-artwork-release" element={<MaterialsArtworkRelease />} />
          <Route path="/library/product-placement-release" element={<ProductPlacementRelease />} />
          <Route path="/library/clearance-log" element={<ClearanceLog />} />
          <Route path="/library/post-schedule" element={<PostSchedule />} />
          <Route path="/library/vfx-shot-list" element={<VfxShotList />} />
          <Route path="/library/deliverables-checklist" element={<DeliverablesChecklist />} />
          <Route path="/library/qc-checklist" element={<QcChecklist />} />
          <Route path="/library/editor-agreement" element={<EditorAgreement />} />
          <Route path="/library/ccsl" element={<CcslList />} />
          <Route path="/library/credits-title-list" element={<CreditsTitleList />} />
          <Route path="/library/distribution-package-checklist" element={<DistributionPackageChecklist />} />
          <Route path="/library/delivery-schedule" element={<DeliverySchedule />} />
          <Route path="/library/sales-agent-agreement" element={<SalesAgentAgreement />} />
          <Route path="/library/distribution-agreement" element={<DistributionAgreement />} />
          <Route path="/library/epk-feature" element={<EpkFeature />} />
          <Route path="/library/epk-short" element={<EpkShort />} />
          <Route path="/library/one-sheet-poster" element={<OneSheetPoster />} />
          <Route path="/library/press-release" element={<PressRelease />} />
          <Route path="/library/directors-statement" element={<DirectorsStatement />} />
          <Route path="/library/synopsis" element={<SynopsisTemplate />} />
          <Route path="/library/cast-crew-bio" element={<CastCrewBio />} />
          <Route path="/library/festival-cover-letter" element={<FestivalCoverLetter />} />
          <Route path="/library/festival-qa" element={<FestivalQA />} />

























































          <Route path="/consulting" element={<Navigate to="/" replace />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/training" element={<Navigate to="/" replace />} />
          <Route path="/training/:courseId" element={<Navigate to="/" replace />} />
          <Route path="/training/my-learning" element={<Navigate to="/" replace />} />
          <Route path="/training/certifications" element={<Navigate to="/" replace />} />
          <Route path="/verify-certificate/:certificateNumber" element={<VerifyCertificate />} />
          <Route path="/contract-assistant" element={<><ToolSeo path="/contract-assistant" /><ToolGate><ContractAssistant /></ToolGate></>} />
          <Route path="/funding-strategy" element={<><ToolSeo path="/funding-strategy" /><ToolGate><FundingStrategy /></ToolGate></>} />
          <Route path="/contract-filler" element={<ToolGate><ContractFiller /></ToolGate>} />
          <Route path="/pitch-deck" element={<><ToolSeo path="/pitch-deck" /><ToolGate><PitchDeckMaker /></ToolGate></>} />
          <Route path="/pitch-deck/preview" element={<ToolGate><PitchDeckPreview /></ToolGate>} />
          <Route path="/distribution-readiness" element={<><ToolSeo path="/distribution-readiness" /><ToolGate><DistributionReadiness /></ToolGate></>} />
          <Route path="/table-read" element={<><ToolSeo path="/table-read" /><ToolGate><TableRead /></ToolGate></>} />
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
          <Route path="/green-light-engine/:tier/:platform" element={<GlePlatformPage />} />
          <Route path="/academy/:courseSlug" element={<CoursePage />} />
          <Route path="/academy/:courseSlug/:chapterSlug" element={<CourseChapter />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/pricing" element={<Navigate to="/membership" replace />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/recut" element={<ToolGate><Recut /></ToolGate>} />
          <Route path="/launch" element={<><ToolSeo path="/launch" /><Launch /></>} />
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
