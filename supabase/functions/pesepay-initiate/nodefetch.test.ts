import "https://deno.land/std@0.224.0/dotenv/load.ts";

Deno.test("node-fetch works with PesePay live API", async () => {
  // @ts-ignore
  const nodeFetch = (await import("npm:node-fetch@3.3.2")).default;
  
  try {
    const response = await nodeFetch("https://api.pesepay.com/api/payments-engine/v1/payments/initiate", {
      method: "POST",
      headers: {
        "Authorization": "test-key",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload: "test" }),
    });
    const text = await response.text();
    console.log("node-fetch response status:", response.status);
    console.log("node-fetch response:", text.substring(0, 300));
  } catch (e: any) {
    console.log("node-fetch error:", e.message);
  }
});
