// Declare the global type
declare global {
  var sseClients: Set<ReadableStreamDefaultController> | undefined;
}

// Initialize the global clients set if it doesn't exist
if (!global.sseClients) {
  global.sseClients = new Set<ReadableStreamDefaultController>();
}

export const clients = global.sseClients;

export function notifyClients() {
  if (clients.size === 0) {
    console.log("Warning: No clients connected to notify");
    return;
  }

  console.log(`Attempting to notify ${clients.size} clients`);
  const deadClients = new Set<ReadableStreamDefaultController>();

  clients.forEach((client) => {
    try {
      // Check if the client's stream is still writable
      if ((client as any).signal?.aborted || (client as any).closed) {
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
