import { type ReactNode, useState } from "react";
import { createRoot } from "react-dom/client";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient, ConvexProvider } from "convex/react";
import { ConvexQueryClient } from "@convex-dev/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import "./index.css";
import { registerSW } from "virtual:pwa-register";
import { ConvexQueryCacheProvider } from "convex-helpers/react/cache/provider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { convexDeploymentUrl } from "./lib/runtime-mode";

// Create a new router instance
const router = createRouter({
  routeTree,
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function ConvexAppProviders({
  url,
  children,
}: {
  url: string;
  children: ReactNode;
}) {
  const [{ convex, queryClient }] = useState(() => {
    const client = new ConvexReactClient(url);
    const convexQueryClient = new ConvexQueryClient(client);
    const tanstackQueryClient = new QueryClient({
      defaultOptions: {
        queries: {
          queryKeyHashFn: convexQueryClient.hashFn(),
          queryFn: convexQueryClient.queryFn(),
          gcTime: 5 * 60 * 1000,
          staleTime: 0,
        },
      },
    });
    convexQueryClient.connect(tanstackQueryClient);
    return { convex: client, queryClient: tanstackQueryClient };
  });

  return (
    <ConvexProvider client={convex}>
      <ConvexAuthProvider client={convex}>
        <ConvexQueryCacheProvider>
          <QueryClientProvider client={queryClient}>
            {children}
            {import.meta.env.DEV && (
              <ReactQueryDevtools initialIsOpen={false} />
            )}
          </QueryClientProvider>
        </ConvexQueryCacheProvider>
      </ConvexAuthProvider>
    </ConvexProvider>
  );
}

function AppTree() {
  const tree = (
    <>
      <RouterProvider router={router} />
      {import.meta.env.NODE_ENV === "production" && (
        <>
          <Analytics />
          <SpeedInsights />
        </>
      )}
    </>
  );

  if (!convexDeploymentUrl) {
    return tree;
  }

  return (
    <ConvexAppProviders url={convexDeploymentUrl}>{tree}</ConvexAppProviders>
  );
}

createRoot(document.getElementById("root")!).render(<AppTree />);

// Register PWA update checker
if (typeof window !== "undefined" && !import.meta.env.DEV) {
  const updateSW = registerSW({
    immediate: true,
    // Vite PWA v1 exposes either onRegistered or onRegisteredSW depending on import
    // Set up periodic/background checks for updates
    onRegistered(registration) {
      if (!registration) return;
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
          registration.update().catch(() => {});
        }
      });
      setInterval(
        () => {
          registration.update().catch(() => {});
        },
        60 * 60 * 1000,
      );
    },
    // Back-compat: some versions expose onRegisteredSW
    onRegisteredSW(_swUrl: string, registration?: ServiceWorkerRegistration) {
      if (!registration) return;
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
          registration.update().catch(() => {});
        }
      });
      setInterval(
        () => {
          registration.update().catch(() => {});
        },
        60 * 60 * 1000,
      );
    },
    // If the plugin ever signals a waiting SW (prompt mode), activate it immediately
    onNeedRefresh() {
      updateSW().catch(() => {});
    },
    onOfflineReady() {},
  });

  // When a new SW takes control, reload the page once to load the fresh bundle
  let hasRefreshed = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (hasRefreshed) return;
    hasRefreshed = true;
    window.location.reload();
  });
}
