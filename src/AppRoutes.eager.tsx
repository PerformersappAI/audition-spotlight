import { Routes, Route, Navigate } from "react-router-dom";
import { GlobalLayout } from "@/components/GlobalLayout";
import ToolGate from "@/components/ToolGate";
import HomeMarketing from "./pages/HomeMarketing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Toolbox from "./pages/Toolbox";
import Recut from "./pages/Recut";
import CrewHire from "./pages/CrewHire";
import Membership from "./pages/Membership";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Academy from "./pages/Academy";
import EducationModules from "./pages/EducationModules";
import RobertsFilmmaking from "./pages/RobertsFilmmaking";
import RobertsChapter from "./pages/RobertsChapter";
import MonetizationHub from "./pages/MonetizationHub";
import MonetizationSubPage from "./pages/MonetizationSubPage";
import GreenLightEngine from "./pages/GreenLightEngine";
import GleNiche from "./pages/GleNiche";
import GleNichePage from "./pages/GleNichePage";
import GleTier from "./pages/GleTier";
import GlePlatformPage from "./pages/GlePlatformPage";
import CoursePage from "./pages/CoursePage";
import CourseChapter from "./pages/CourseChapter";
import NotFound from "./pages/NotFound";
import Launch from "./pages/Launch";
import MovieInABox from "./pages/MovieInABox";
import ScriptAnalysis from "./pages/ScriptAnalysis";
import SceneAnalysis from "./pages/SceneAnalysis";
import StoryboardingRoute from "./pages/StoryboardingRoute";
import CallSheet from "./pages/CallSheet";
import PitchDeckMaker from "./pages/PitchDeckMaker";
import ContractAssistant from "./pages/ContractAssistant";
import FundingStrategy from "./pages/FundingStrategy";
import DistributionReadiness from "./pages/DistributionReadiness";
import TableRead from "./pages/TableRead";
import Marketing from "./pages/Marketing";
import ContactCastCrew from "./pages/ContactCastCrew";
import PublicCastCrewForm from "./pages/PublicCastCrewForm";
import DocsLibrary from "./pages/DocsLibrary";
import OptionPurchaseAgreement from "./pages/agreements/OptionPurchaseAgreement";
import LiteraryRightsOption from "./pages/agreements/LiteraryRightsOption";
import WriterAgreement from "./pages/agreements/WriterAgreement";
import LifeRightsAgreement from "./pages/agreements/LifeRightsAgreement";
import CollaborationAgreement from "./pages/agreements/CollaborationAgreement";
import CertificateOfAuthorship from "./pages/agreements/CertificateOfAuthorship";
import RightsAssignmentAgreement from "./pages/agreements/RightsAssignmentAgreement";
import ShoppingAgreement from "./pages/agreements/ShoppingAgreement";
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
import { ToolSeo } from "@/components/ToolSeo";


export const AppRoutes = () => (
  <GlobalLayout>
    <Routes>
      <Route path="/" element={<HomeMarketing />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/pricing" element={<Navigate to="/membership" replace />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/toolbox" element={<Toolbox />} />
      <Route path="/recut" element={<ToolGate><Recut /></ToolGate>} />
      <Route path="/crew-hire" element={<ToolGate><CrewHire /></ToolGate>} />
      <Route path="/membership" element={<Membership />} />
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
      <Route path="/launch" element={<><ToolSeo path="/launch" /><Launch /></>} />
      <Route path="/movie-in-a-box" element={<MovieInABox />} />
      <Route path="/script-analysis" element={<><ToolSeo path="/script-analysis" /><ToolGate><ScriptAnalysis /></ToolGate></>} />
      <Route path="/scene-analysis" element={<><ToolSeo path="/scene-analysis" /><ToolGate><SceneAnalysis /></ToolGate></>} />
      <Route path="/storyboarding" element={<><ToolSeo path="/storyboarding" /><ToolGate><StoryboardingRoute /></ToolGate></>} />
      <Route path="/call-sheet" element={<><ToolSeo path="/call-sheet" /><ToolGate><CallSheet /></ToolGate></>} />
      <Route path="/pitch-deck" element={<><ToolSeo path="/pitch-deck" /><ToolGate><PitchDeckMaker /></ToolGate></>} />
      <Route path="/contract-assistant" element={<><ToolSeo path="/contract-assistant" /><ToolGate><ContractAssistant /></ToolGate></>} />
      <Route path="/funding-strategy" element={<><ToolSeo path="/funding-strategy" /><ToolGate><FundingStrategy /></ToolGate></>} />
      <Route path="/distribution-readiness" element={<><ToolSeo path="/distribution-readiness" /><ToolGate><DistributionReadiness /></ToolGate></>} />
      <Route path="/table-read" element={<><ToolSeo path="/table-read" /><ToolGate><TableRead /></ToolGate></>} />
      <Route path="/marketing" element={<Marketing />} />
      <Route path="/contact-cast-crew" element={<ToolGate><ContactCastCrew /></ToolGate>} />
      <Route path="/f/:slug" element={<PublicCastCrewForm />} />
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
      <Route path="*" element={<NotFound />} />

    </Routes>
  </GlobalLayout>
);
