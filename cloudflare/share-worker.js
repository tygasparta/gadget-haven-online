/**
 * Cloudflare Worker for share.gadgetgenie.org
 *
 * Route: share.gadgetgenie.org/*
 *
 * Behaviour:
 * - Proxies the request to the Supabase `og-meta` edge function which
 *   inspects the User-Agent and either:
 *     - returns Open Graph HTML to social crawlers, or
 *     - 302-redirects real users to https://gadgetgenie.org/product/<id>
 * - The redirect Location from og-meta already points at the real
 *   product page (`/product/<id>`), so users land in the right place.
 *
 * Paste this file as the Worker code in the Cloudflare dashboard for the
 * share.gadgetgenie.org route.
 */

const OG_META_ENDPOINT =
  "https://ktpxqjyfguxckdzlqwai.supabase.co/functions/v1/og-meta";

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Accept both `/123` and `/?id=123`
    let id = url.searchParams.get("id");
    if (!id) {
      const parts = url.pathname.split("/").filter(Boolean);
      id = parts[parts.length - 1] || "";
    }

    if (!id) {
      return Response.redirect("https://gadgetgenie.org/", 302);
    }

    const upstream = `${OG_META_ENDPOINT}?id=${encodeURIComponent(id)}`;

    // Forward the User-Agent so og-meta can detect crawlers vs users.
    // `redirect: "manual"` lets us pass og-meta's 302 straight back to
    // the browser instead of following it inside the worker.
    const resp = await fetch(upstream, {
      method: "GET",
      headers: {
        "User-Agent": request.headers.get("User-Agent") || "",
        Accept: request.headers.get("Accept") || "*/*",
      },
      redirect: "manual",
    });

    // Rebuild the response so we can force text/html for crawler HTML.
    const headers = new Headers(resp.headers);
    if (resp.status === 200) {
      headers.set("Content-Type", "text/html; charset=utf-8");
    }
    headers.delete("content-encoding");
    headers.delete("content-length");

    return new Response(resp.body, {
      status: resp.status,
      headers,
    });
  },
};