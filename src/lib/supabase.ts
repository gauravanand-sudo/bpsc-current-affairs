"use client";

import { createClient } from "@supabase/supabase-js";

let browserClient: ReturnType<typeof createClient> | null = null;
const DEFAULT_APP_URL = "https://www.oneshotgs.com";

export function getSupabaseBrowserClient() {
  if (browserClient) return browserClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error("Missing Supabase public environment variables.");
  }

  browserClient = createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  return browserClient;
}

function normalizeBaseUrl(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

export function getAppBaseUrl() {
  let configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configuredUrl) {
    // Ensure the URL always has a scheme
    if (!configuredUrl.startsWith("http://") && !configuredUrl.startsWith("https://")) {
      configuredUrl = `https://${configuredUrl}`;
    }
    return normalizeBaseUrl(configuredUrl);
  }

  if (typeof window !== "undefined") {
    const origin = window.location.origin.trim();
    if (origin.startsWith("http://") || origin.startsWith("https://")) {
      const { hostname } = new URL(origin);
      if (!hostname.endsWith(".supabase.co")) {
        return normalizeBaseUrl(origin);
      }
    }
  }

  return DEFAULT_APP_URL;
}

export function getAuthRedirectUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalizedPath, `${getAppBaseUrl()}/`).toString();
}
