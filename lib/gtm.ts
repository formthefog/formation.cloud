/**
 * GTM DataLayer Utility
 *
 * Typed helpers for pushing events to the GTM dataLayer.
 *
 * @purpose DataLayer push helpers for GTM — single source of truth for all event firing
 */

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

export function pushDataLayer(payload: { event: string; [key: string]: unknown }): void {
  if (typeof window === "undefined") return;
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
  } catch {
    // Analytics should never break user flows.
  }
}

export function gtmEvent(name: string, params?: Record<string, unknown>): void {
  pushDataLayer({ event: name, ...params });
}
