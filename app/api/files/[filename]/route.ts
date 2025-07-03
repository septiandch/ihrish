import { storageConfig } from "@/lib/config/storage";
import { readFileSync, statSync } from "fs";
import { stat, unlink } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { notifyClients } from "../../shared/clients";

// Helper function to add CORS headers
function corsHeaders(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return response;
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return corsHeaders(new NextResponse(null, { status: 200 }));
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const filename = (await params).filename;

    // Prevent directory traversal attacks
    const safePath = path.normalize(filename).replace(/^(\.\.(\/|\\|$))+/, "");
    const filePath = path.join(storageConfig.uploadsDir, safePath);

    // Check if file exists
    try {
      await stat(filePath);
    } catch {
      // Removed unused 'e' parameter
      return corsHeaders(NextResponse.json({ error: "File not found" }, { status: 404 }));
    }

    // Get file stats for headers
    const stats = statSync(filePath);
    const fileBuffer = readFileSync(filePath);

    // Determine content type based on file extension
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".svg": "image/svg+xml",
      // Add more mime types as needed
    };

    const contentType = mimeTypes[ext] || "application/octet-stream";

    // Create response with proper headers
    const response = new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Length": stats.size.toString(),
        "Cache-Control": "public, max-age=31536000",
      },
    });

    // Add CORS headers
    return corsHeaders(response);
  } catch (err) {
    console.error("Error serving file:", err);
    return corsHeaders(NextResponse.json({ error: "Error serving file" }, { status: 500 }));
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const filename = (await params).filename;
    const filePath = path.join(storageConfig.uploadsDir, filename);

    await unlink(filePath);

    // Notify clients
    notifyClients(`event: update\ndata: newImage\n\n`);

    return corsHeaders(NextResponse.json({ message: "File deleted successfully" }));
  } catch (err) {
    // Using the error in console.log
    console.error("Failed to delete file:", err);
    return corsHeaders(NextResponse.json({ error: "Failed to delete file" }, { status: 500 }));
  }
}
