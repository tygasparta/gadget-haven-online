import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify admin auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify user is admin
    const anonClient = createClient(
      supabaseUrl,
      Deno.env.get("SUPABASE_ANON_KEY")!
    );
    const {
      data: { user },
      error: authError,
    } = await anonClient.auth.getUser(authHeader.replace("Bearer ", ""));
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .single();

    if (!roleData) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "A prompt is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "LOVABLE_API_KEY is not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Generate image using Lovable AI gateway, with model fallbacks
    const models = [
      "google/gemini-3-pro-image",
      "google/gemini-3.1-flash-image",
      "google/gemini-2.5-flash-image",
    ];

    let imageBase64: string | null = null;
    let lastError = "";
    let lastStatus = 500;

    for (const model of models) {
      const aiResponse = await fetch(
        "https://ai.gateway.lovable.dev/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            messages: [
              {
                role: "system",
                content:
                  "You are an expert at generating wide cinematic banner images for e-commerce websites. Always create images in ultra-wide 1920x544 aspect ratio suitable for website hero banners. Make images vibrant, professional, and visually striking with good contrast.",
              },
              {
                role: "user",
                content: `Generate a wide cinematic e-commerce banner image (1920x544 aspect ratio): ${prompt.trim()}`,
              },
            ],
            modalities: ["image", "text"],
          }),
        }
      );

      if (!aiResponse.ok) {
        lastStatus = aiResponse.status;
        lastError = await aiResponse.text();
        console.error("AI gateway error:", model, aiResponse.status, lastError);

        // Terminal errors: stop immediately
        if (aiResponse.status === 429) {
          return new Response(
            JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
            { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        if (aiResponse.status === 402) {
          return new Response(
            JSON.stringify({
              error: "Lovable AI credits exhausted. Please add funds in Settings > Workspace > Usage.",
            }),
            { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        continue; // try next model
      }

      const aiData = await aiResponse.json();
      const message = aiData.choices?.[0]?.message;

      // Gateway format: images array
      if (message?.images && Array.isArray(message.images)) {
        for (const img of message.images) {
          const url = img?.image_url?.url;
          if (typeof url === "string" && url.startsWith("data:")) {
            const m = url.match(/^data:image\/[^;]+;base64,(.+)$/);
            if (m) {
              imageBase64 = m[1];
              break;
            }
          }
        }
      }

      // Fallback: content parts
      if (!imageBase64 && message?.content && Array.isArray(message.content)) {
        for (const part of message.content) {
          const url = part?.image_url?.url;
          if (typeof url === "string" && url.startsWith("data:")) {
            const m = url.match(/^data:image\/[^;]+;base64,(.+)$/);
            if (m) {
              imageBase64 = m[1];
              break;
            }
          }
        }
      }

      if (imageBase64) {
        console.log("Image generated with model:", model);
        break;
      }

      lastError = "Model returned no image";
      console.error("No image returned by model:", model);
    }

    if (!imageBase64) {
      return new Response(
        JSON.stringify({
          error: `AI did not return an image. ${lastError ? lastError.slice(0, 300) : "Try a different prompt."}`,
        }),
        {
          status: lastStatus === 500 ? 422 : lastStatus,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }


    // Decode and upload to Supabase storage
    const imageBytes = Uint8Array.from(atob(imageBase64), (c) =>
      c.charCodeAt(0)
    );
    const fileName = `ai_banner_${Date.now()}.png`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("gallary")
      .upload(fileName, imageBytes, {
        contentType: "image/png",
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return new Response(
        JSON.stringify({ error: "Failed to save generated image" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { data: urlData } = supabase.storage
      .from("gallary")
      .getPublicUrl(uploadData.path);

    return new Response(
      JSON.stringify({
        imageUrl: urlData.publicUrl,
        message: "Banner image generated successfully",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
