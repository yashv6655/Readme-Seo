"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// Importing posthog-js directly; ensure dependency exists in package.json
import posthog from "posthog-js";

declare global {
  interface Window {
    __posthog_inited?: boolean;
  }
}

type Props = { children?: React.ReactNode };

// Component that uses useSearchParams (needs to be wrapped in Suspense)
function AnalyticsProviderInner({ children }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize once on mount
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key) return; // no-op if not configured

    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com";

    // Avoid double init in Fast Refresh
    if (!window.__posthog_inited) {
      posthog.init(key, {
        api_host: host,
        capture_pageview: false, // we will capture manually
      });
      window.__posthog_inited = true;

      posthog.register({
        environment: process.env.NODE_ENV,
      });
    }

    // Do not capture here; the route effect below will handle initial + subsequent views
  }, []);

  // Track route changes as page views
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key) return;
    const path = pathname + (searchParams?.toString() ? `?${searchParams?.toString()}` : "");
    posthog.capture("page_view", { path: path });
  }, [pathname, searchParams]);

  return children as React.ReactElement | null;
}

// Initializes PostHog and tracks page views on route changes.
export default function AnalyticsProvider({ children }: Props) {
  return (
    <Suspense fallback={children as React.ReactElement | null}>
      <AnalyticsProviderInner>{children}</AnalyticsProviderInner>
    </Suspense>
  );
}
