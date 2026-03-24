import "https://deno.land/std@0.224.0/dotenv/load.ts";

Deno.test("raw TLS connection to PesePay live API", async () => {
  const conn = await Deno.connectTls({
    hostname: "api.pesepay.com",
    port: 443,
  });

  const requestBody = JSON.stringify({ payload: "test" });
  const httpRequest = [
    "POST /api/payments-engine/v1/payments/initiate HTTP/1.1",
    "Host: api.pesepay.com",
    "Authorization: test-key",
    "Content-Type: application/json",
    `Content-Length: ${requestBody.length}`,
    "Connection: close",
    "",
    requestBody,
  ].join("\r\n");

  await conn.write(new TextEncoder().encode(httpRequest));

  const buf = new Uint8Array(4096);
  let response = "";
  try {
    while (true) {
      const n = await conn.read(buf);
      if (n === null) break;
      response += new TextDecoder().decode(buf.subarray(0, n));
    }
  } catch {
    // Connection closed
  }

  conn.close();
  console.log("Raw TLS response (first 500 chars):", response.substring(0, 500));
});
