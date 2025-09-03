import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

console.log("WhatsApp webhook function starting...");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

serve(async (req) => {
  console.log("=== WEBHOOK REQUEST RECEIVED ===");
  console.log(`Method: ${req.method}`);
  console.log(`URL: ${req.url}`);
  console.log(`Headers: ${JSON.stringify([...req.headers.entries()])}`);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 200, 
      headers: corsHeaders 
    });
  }
  
  // Handle GET request for webhook verification
  if (req.method === "GET") {
    console.log("Processing GET request for webhook verification");
    
    try {
      const url = new URL(req.url);
      const mode = url.searchParams.get("hub.mode");
      const token = url.searchParams.get("hub.verify_token");
      const challenge = url.searchParams.get("hub.challenge");
      
      console.log(`Parameters: mode=${mode}, token=${token}, challenge=${challenge}`);
      
      const VERIFY_TOKEN = Deno.env.get("WHATSAPP_VERIFY_TOKEN");
      console.log(`Environment verify token exists: ${!!VERIFY_TOKEN}`);
      console.log(`Environment verify token value: "${VERIFY_TOKEN}"`);
      console.log(`Received token value: "${token}"`);
      console.log(`Token length comparison: env=${VERIFY_TOKEN?.length || 0}, received=${token?.length || 0}`);
      console.log(`Token match: ${token === VERIFY_TOKEN}`);
      
      if (mode === "subscribe" && token === VERIFY_TOKEN) {
        console.log("✅ Webhook verification successful!");
        return new Response(challenge, { 
          status: 200,
          headers: { "Content-Type": "text/plain" }
        });
      } else {
        console.log("❌ Webhook verification failed");
        console.log(`Expected mode: subscribe, got: ${mode}`);
        console.log(`Token comparison: expected "${VERIFY_TOKEN}", got "${token}"`);
        return new Response("Forbidden - Invalid verification", { 
          status: 403,
          headers: { "Content-Type": "text/plain" }
        });
      }
    } catch (error) {
      console.error("Error processing GET request:", error);
      return new Response("Internal Error", { 
        status: 500,
        headers: { "Content-Type": "text/plain" }
      });
    }
  }
  
  // Handle POST request (webhook messages)
  if (req.method === "POST") {
    console.log("Processing POST request for incoming message");
    try {
      const body = await req.json();
      console.log("Received message:", JSON.stringify(body, null, 2));
      return new Response("OK", { 
        status: 200,
        headers: { "Content-Type": "text/plain" }
      });
    } catch (error) {
      console.error("Error processing POST request:", error);
      return new Response("Error processing message", { 
        status: 500,
        headers: { "Content-Type": "text/plain" }
      });
    }
  }
  
  console.log(`Unsupported method: ${req.method}`);
  return new Response("Method not allowed", { 
    status: 405,
    headers: { "Content-Type": "text/plain" }
  });
});