import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async () => {
  const key = Deno.env.get("LOVABLE_API_KEY");
  if (!key) return new Response(JSON.stringify({ error: "no key" }), { status: 500 });

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-3-pro-image",
      messages: [{ role: "user", content: "Generate a wide cinematic e-commerce banner: blue headphones" }],
      modalities: ["image", "text"],
    }),
  });

  const text = await res.text();
  let len = 0;
  try {
    const data = JSON.parse(text);
    const url = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    len = typeof url === "string" ? url.length : 0;
  } catch { /* ignore */ }

  return new Response(
    JSON.stringify({ status: res.status, imageUrlLength: len, preview: len ? "ok" : text.slice(0, 300) }),
    { headers: { "Content-Type": "application/json" } },
  );
});
