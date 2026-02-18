/**
 * GTM Route Tracker
 *
 * SPA-aware route change listener. Pushes page_view events to the GTM
 * dataLayer on every Next.js App Router client-side navigation.
 * Must be wrapped in <Suspense> in the parent.
 *
 * @purpose Fire page_view on every App Router navigation
 */

"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { pushDataLayer } from "@/lib/gtm";

export function GTMRouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const qs = searchParams?.toString();
    const url = pathname + (qs ? `?${qs}` : "");

    pushDataLayer({
      event: "page_view",
      page_path: pathname,
      page_url: url,
      page_title: typeof document !== "undefined" ? document.title : "",
    });
  }, [pathname, searchParams]);

  return null;
}
