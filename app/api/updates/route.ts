import { NextResponse } from "next/server";
import { clients } from "../shared/clients";

export const dynamic = "force-dynamic";

export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      // Clean up any existing dead clients first
      const deadClients = new Set<ReadableStreamDefaultController>();
      clients.forEach((client) => {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if ((client as any).signal?.aborted || (client as any).closed) {
            deadClients.add(client);
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          deadClients.add(client);
        }
      });
      deadClients.forEach((client) => clients.delete(client));

      // Add the new client
      clients.add(controller);
      console.log(`Total clients connected: ${clients.size}`);

      try {
        // Send initial message
        controller.enqueue("event: connect\ndata: connected\n\n");
      } catch (error) {
        console.error("Error sending initial message:", error);
        clients.delete(controller);
      }
    },
    cancel(controller) {
      clients.delete(controller);
      console.log(`Remaining clients: ${clients.size}`);
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
