import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCredits } from "@/hooks/useCredits";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const isBrowser = typeof window !== "undefined";

/**
 * Strict paywall gate for tool pages.
 * - SSR / prerender: always render children (never navigate).
 * - Loading: centered spinner.
 * - Admins: always allowed.
 * - Signed-in with active subscription: allowed.
 * - Everyone else: redirected to /membership.
 */
const ToolGate = ({ children }: { children: React.ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const { subscription, loading: creditsLoading } = useCredits();
  const { isAdmin, isChecking } = useAdminAuth(false);

  if (!isBrowser) return <>{children}</>;

  if (authLoading || (user && (creditsLoading || isChecking))) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (isAdmin) return <>{children}</>;

  const hasActiveSubscription = !!user && subscription?.status === "active";
  if (!hasActiveSubscription) return <Navigate to="/membership" replace />;

  return <>{children}</>;
};

export default ToolGate;
