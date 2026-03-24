import "https://deno.land/std@0.224.0/dotenv/load.ts";

Deno.test("undici fetch works with PesePay live API", async () => {
  const { fetch: undiciFetch } = await import("npm:undici@6.19.2");
  
  try {
    const response = await undiciFetch("https://api.pesepay.com/api/payments-engine/v1/payments/initiate", {
      method: "POST",
      headers: {
        "Authorization": "test-key",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload: "test" }),
    });
    const text = await response.text();
    console.log("undici response status:", response.status);
    console.log("undici response:", text.substring(0, 300));
  } catch (e) {
    console.log("undici error:", (e as Error).message);
  }
});
