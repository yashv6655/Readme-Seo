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
        capture_pageview: false, // we will capture manually with correct event names
        capture_pageleave: false, // we will capture manually
      });
      window.__posthog_inited = true;

      posthog.register({
        environment: process.env.NODE_ENV,
      });
    }

    // Set up page leave tracking
    const handlePageLeave = () => {
      if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
        posthog.capture("$pageleave");
      }
    };

    // Track page leaves on various events
    window.addEventListener("beforeunload", handlePageLeave);
    window.addEventListener("pagehide", handlePageLeave);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        handlePageLeave();
      }
    });

    // Cleanup function
    return () => {
      window.removeEventListener("beforeunload", handlePageLeave);
      window.removeEventListener("pagehide", handlePageLeave);
      document.removeEventListener("visibilitychange", handlePageLeave);
    };
  }, []);

  // Track route changes as standard PostHog pageviews
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key) return;
    const path = pathname + (searchParams?.toString() ? `?${searchParams?.toString()}` : "");
    
    // Use standard PostHog $pageview event
    posthog.capture("$pageview", { 
      $current_url: window.location.href,
      $pathname: pathname,
      $search: searchParams?.toString() || ""
    });
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
