import { Routes, Route } from "react-router-dom";
import { GlobalLayout } from "@/components/GlobalLayout";
import HomeMarketing from "./pages/HomeMarketing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Pricing from "./pages/Pricing";
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
import CoursePage from "./pages/CoursePage";
import CourseChapter from "./pages/CourseChapter";
import NotFound from "./pages/NotFound";

export const AppRoutes = () => (
  <GlobalLayout>
    <Routes>
      <Route path="/" element={<HomeMarketing />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/toolbox" element={<Toolbox />} />
      <Route path="/recut" element={<Recut />} />
      <Route path="/crew-hire" element={<CrewHire />} />
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
      <Route path="/academy/:courseSlug" element={<CoursePage />} />
      <Route path="/academy/:courseSlug/:chapterSlug" element={<CourseChapter />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </GlobalLayout>
);
