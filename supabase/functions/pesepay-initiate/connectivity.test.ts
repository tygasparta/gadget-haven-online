import "https://deno.land/std@0.224.0/dotenv/load.ts";

const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY")!;

// Test: Try calling PesePay API directly to check if it's a server-side issue
Deno.test("direct PesePay API connectivity test - live", async () => {
  try {
    const response = await fetch("https://api.pesepay.com/api/payments-engine/v1/payments/initiate", {
      method: "POST",
      headers: {
        "Authorization": "test-key",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload: "test" }),
    });
    const text = await response.text();
    console.log("Live API response status:", response.status);
    console.log("Live API response:", text.substring(0, 300));
  } catch (e) {
    console.log("Live API error:", (e as Error).message);
  }
});

Deno.test("direct PesePay API connectivity test - sandbox", async () => {
  try {
    const response = await fetch("https://api.test.sandbox.pesepay.com/payments-engine/v1/payments/initiate", {
      method: "POST",
      headers: {
        "Authorization": "test-key",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload: "test" }),
    });
    const text = await response.text();
    console.log("Sandbox API response status:", response.status);
    console.log("Sandbox API response:", text.substring(0, 300));
  } catch (e) {
    console.log("Sandbox API error:", (e as Error).message);
  }
});
