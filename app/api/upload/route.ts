import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { notifyClients } from "../shared/clients";
import { storageConfig, initStorage } from "@/lib/config/storage";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    // Initialize storage directory
    await initStorage();

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file received" }, { status: 400 });
    }

    // Generate a unique filename to prevent collisions
    const fileExt = path.extname(file.name);
    const uniqueFilename = `${crypto.randomUUID()}${fileExt}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Store file in the storage directory
    const filePath = path.join(storageConfig.uploadsDir, uniqueFilename);
    await writeFile(filePath, buffer);

    // Add a small delay to ensure file is written
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Notify clients
    notifyClients();

    // Return the unique filename - we'll create an endpoint to serve these files
    return NextResponse.json({
      success: true,
      file: `/api/files/${uniqueFilename}`,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
