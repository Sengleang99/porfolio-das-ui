import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const backendUrl = `${process.env.BACKEND_API_BASE_URL}/contacts/stream`;

  const headers: Record<string, string> = {
    "Accept": "text/event-stream",
  };

  if (process.env.X_API_KEY) {
    headers["x-api-key"] = process.env.X_API_KEY;
  }

  const response = await fetch(backendUrl, {
    headers,
    cache: "no-store",
  });

  if (!response.body) {
    return new Response("No response body from backend", { status: 500 });
  }

  const reader = response.body.getReader();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            controller.close();
            break;
          }
          controller.enqueue(value);
        }
      } catch (error) {
        console.log("SSE proxy stream closed by remote server (keep-alive timeout). Client will reconnect automatically.");
        try {
          controller.close();
        } catch {
          // Ignore
        }
      } finally {
        reader.releaseLock();
      }
    },
    cancel() {
      reader.cancel();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
    },
  });
}
