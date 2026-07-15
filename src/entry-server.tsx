import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { HelmetProvider, type HelmetServerState } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { AppRoutes } from "./AppRoutes.eager";

export type RenderResult = { html: string; helmet: HelmetServerState | undefined };

export async function render(url: string): Promise<RenderResult> {
  const helmetContext: { helmet?: HelmetServerState } = {};
  const queryClient = new QueryClient();
  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <StaticRouter location={url}>
              <AppRoutes />
            </StaticRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
  return { html, helmet: helmetContext.helmet };
}
