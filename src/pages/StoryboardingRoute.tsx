import { useAuth } from "@/hooks/useAuth";
import { useSearchParams } from "react-router-dom";
import StoryboardingLanding from "./StoryboardingLanding";
import Storyboarding from "./Storyboarding";

export default function StoryboardingRoute() {
  const { user, loading } = useAuth();
  const [params] = useSearchParams();
  const showTool = params.get("tool") === "1";

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  // Logged-in users with ?tool=1 see the tool; otherwise show landing with "Go to Tool" CTA.
  // Logged-out users always see the landing page.
  if (user && showTool) {
    return <Storyboarding />;
  }
  return <StoryboardingLanding isAuthenticated={!!user} />;
}
