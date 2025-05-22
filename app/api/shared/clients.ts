// Define the extended controller type with the properties we need
interface ExtendedController extends ReadableStreamDefaultController {
  signal?: {
    aborted: boolean;
  };
  closed?: boolean;
}

type GlobalWithSSE = typeof globalThis & {
  sseClients: Set<ExtendedController> | undefined;
};

const globalWithSSE = globalThis as GlobalWithSSE;

// Initialize the global clients set if it doesn't exist
if (!globalWithSSE.sseClients) {
  globalWithSSE.sseClients = new Set<ExtendedController>();
}

export const clients = globalWithSSE.sseClients;

export function notifyClients() {
  if (clients.size === 0) {
    console.log("Warning: No clients connected to notify");
    return;
  }

  console.log(`Attempting to notify ${clients.size} clients`);
  const deadClients = new Set<ExtendedController>();

  clients.forEach((client: ExtendedController) => {
    try {
      // Check if the client's stream is still writable
      if (client.signal?.aborted || client.closed) {
        deadClients.add(client);
        return;
      }

      const message = `event: update\ndata: newImage\n\n`;
      client.enqueue(message);
      console.log("Successfully sent update to client");
    } catch (error) {
      console.log("Error notifying client, will remove:", error);
      deadClients.add(client);
    }
  });

  // Clean up dead clients
  if (deadClients.size > 0) {
    console.log(`Removing ${deadClients.size} dead clients`);
    deadClients.forEach((client) => {
      clients.delete(client);
    });
    console.log(`Remaining active clients: ${clients.size}`);
  }
}
