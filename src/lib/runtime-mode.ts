const convexUrl = import.meta.env.VITE_CONVEX_URL ?? "";

export const isMaintenanceMode = import.meta.env.VITE_MAINTENANCE_MODE === "true";

export const isConvexAvailable =
  convexUrl.startsWith("https://") || convexUrl.startsWith("http://");

/** App cannot talk to Convex — show the static maintenance screen instead. */
export const isOfflineApp = isMaintenanceMode || !isConvexAvailable;

export const convexDeploymentUrl = isOfflineApp ? null : convexUrl;
