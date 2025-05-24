import { storageConfig } from "@/lib/config/storage";
import { mkdir, readdir } from "fs/promises";
import { NextResponse } from "next/server";

// Helper function to add CORS headers (to match [filename]/route.ts)
function corsHeaders(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return response;
}

// Initialize storage directory
try {
  await mkdir(storageConfig.uploadsDir, { recursive: true });
} catch (error) {
  console.error("Failed to create storage directory:", error);
}

export async function OPTIONS() {
  return corsHeaders(new NextResponse(null, { status: 200 }));
}

export async function GET() {
  try {
    // Make sure the directory exists
    const mediaDir = storageConfig.uploadsDir;
    const files = await readdir(mediaDir);

    const fileList = files.map((filename) => ({
      name: filename,
      url: `/api/files/${filename}`, // Updated to use the API route instead of public path
    }));

    return corsHeaders(NextResponse.json({ files: fileList }));
  } catch (error) {
    console.error("Error reading files:", error);
    return corsHeaders(NextResponse.json({ error: "Failed to fetch files" }, { status: 500 }));
  }
}
