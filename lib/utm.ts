/**
 * UTM Capture Utility
 *
 * Reads UTM parameters from the current URL and persists them.
 * - First-touch: stored in localStorage, never overwritten
 * - Session UTM: stored in sessionStorage, updated each visit
 *
 * @purpose Capture + persist UTM attribution for acquisition funnel analysis
 */

const FIRST_TOUCH_KEY = "utm_first_touch";
const SESSION_KEY = "utm_session";

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

export function captureUTM(): UTMParams | null {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);
  const utm: UTMParams = {};

  const source = params.get("utm_source");
  const medium = params.get("utm_medium");
  const campaign = params.get("utm_campaign");
  const term = params.get("utm_term");
  const content = params.get("utm_content");

  if (!source && !medium && !campaign) return null;

  if (source) utm.utm_source = source;
  if (medium) utm.utm_medium = medium;
  if (campaign) utm.utm_campaign = campaign;
  if (term) utm.utm_term = term;
  if (content) utm.utm_content = content;

  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(utm));
    if (!localStorage.getItem(FIRST_TOUCH_KEY)) {
      localStorage.setItem(FIRST_TOUCH_KEY, JSON.stringify(utm));
    }
  } catch {
    // Storage may be blocked in private browsing.
  }

  return utm;
}

export function getFirstTouchUTM(): UTMParams {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem(FIRST_TOUCH_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}
