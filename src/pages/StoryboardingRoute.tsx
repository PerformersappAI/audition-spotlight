import { useAuth } from "@/hooks/useAuth";
import Storyboarding from "./Storyboarding";

export default function StoryboardingRoute() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return <Storyboarding />;
}
