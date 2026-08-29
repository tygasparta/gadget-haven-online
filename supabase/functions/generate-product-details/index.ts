import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const openAIApiKey = Deno.env.get("OPENAI_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are an expert e-commerce product manager. Generate compelling product details that will help products sell well.

IMPORTANT: You must respond with ONLY valid JSON. Do not include any markdown formatting, code fences, explanations, or additional text.

CRITICAL: Always include a "specifications" array with REAL specification names based on the product type. NEVER use generic names like "Feature 1", "Feature 2", etc.

For tablets/iPads use: Display, Storage, Processor, Connectivity, Battery Life, Operating System, Weight, Dimensions, Camera.
For smartphones use: Display, Storage, RAM, Processor, Battery, Camera, Operating System, Connectivity.
For laptops use: Display, Processor, RAM, Storage, Graphics, Operating System, Battery Life, Weight.

The JSON structure must be exactly:
{
  "name": "Product name",
  "description": "Product description (2-3 sentences)",
  "category": "Category from: Smartphones, Laptops, Tablets, Headphones, Cameras, Gaming, Accessories, Smart Watches, Audio, Home & Garden, Electronics",
  "brand": "Brand name",
  "price": 299.99,
  "features": ["Real feature 1", "Real feature 2", "Real feature 3"],
  "whats_in_box": ["Item 1", "Item 2", "Item 3"],
  "tags": ["tag1", "tag2", "tag3"],
  "specifications": [
    {"key": "Display", "value": "10.9-inch Liquid Retina display"},
    {"key": "Storage", "value": "256GB internal storage"},
    {"key": "Processor", "value": "A14 Bionic chip"}
  ]
}

MANDATORY: The specifications array MUST contain at least 5-8 real specifications with proper technical names, not generic placeholders.`;

function stripFences(text: string) {
  return text.trim().replace(/^```(?:json)?\s*/i, "").replace(/```$/, "").trim();
}

async function callLovable(prompt: string) {
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3.7-flash",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    const err: any = new Error(
      res.status === 429
        ? "Rate limit exceeded. Please try again in a moment."
        : res.status === 402
        ? "AI credits exhausted. Please add funds in Settings > Workspace > Usage."
        : `AI gateway error (${res.status}): ${errorText.slice(0, 300)}`,
    );
    err.status = res.status;
    throw err;
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("AI returned an empty response");
  return stripFences(content);
}

async function callOpenAI(prompt: string) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openAIApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`OpenAI error (${res.status}): ${errorText.slice(0, 300)}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("OpenAI returned an empty response");
  return stripFences(content);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let generatedData: string | null = null;
    let lastError: any = null;

    // Primary: Lovable AI (no OpenAI credits needed)
    if (LOVABLE_API_KEY) {
      try {
        generatedData = await callLovable(prompt);
      } catch (e) {
        lastError = e;
        console.error("Lovable AI failed:", e instanceof Error ? e.message : e);
      }
    }

    // Fallback: OpenAI, only if a key is configured
    if (!generatedData && openAIApiKey) {
      try {
        generatedData = await callOpenAI(prompt);
      } catch (e) {
        lastError = e;
        console.error("OpenAI fallback failed:", e instanceof Error ? e.message : e);
      }
    }

    if (!generatedData) {
      const status = lastError?.status === 429 || lastError?.status === 402 ? lastError.status : 500;
      return new Response(
        JSON.stringify({ error: lastError?.message || "No AI provider configured" }),
        { status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    let parsedData: any;
    try {
      parsedData = JSON.parse(generatedData);
    } catch {
      console.error("Generated data is not valid JSON:", generatedData.slice(0, 500));
      return new Response(JSON.stringify({ error: "AI generated invalid JSON format" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (
      !Array.isArray(parsedData.specifications) ||
      parsedData.specifications.length === 0 ||
      !parsedData.specifications.every(
        (s: any) =>
          typeof s?.key === "string" &&
          typeof s?.value === "string" &&
          !s.key.toLowerCase().includes("feature"),
      )
    ) {
      return new Response(
        JSON.stringify({ error: "AI failed to generate proper specifications. Please try again." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(JSON.stringify({ generatedData: JSON.stringify(parsedData) }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in generate-product-details function:", error);
    return new Response(JSON.stringify({ error: error?.message || "An unexpected error occurred" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
