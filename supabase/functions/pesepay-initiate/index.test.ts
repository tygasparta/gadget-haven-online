import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";

const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY")!;

Deno.test("pesepay-initiate returns redirect URL for valid payment", async () => {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/pesepay-initiate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      "apikey": SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({
      amount: 10.00,
      currencyCode: "USD",
      reasonForPayment: "Test payment",
    }),
  });

  const data = await response.json();
  console.log("PesePay initiate response:", JSON.stringify(data, null, 2));

  assertEquals(response.status, 200);
  assertEquals(data.success, true);
  assertEquals(typeof data.redirectUrl, "string");
  assertEquals(typeof data.referenceNumber, "string");
});

Deno.test("pesepay-initiate rejects invalid amount", async () => {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/pesepay-initiate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      "apikey": SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({
      amount: -5,
      currencyCode: "USD",
      reasonForPayment: "Test invalid",
    }),
  });

  const data = await response.json();
  assertEquals(data.success, false);
});
