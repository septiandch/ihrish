import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { notifyClients } from "../shared/clients";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file received" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Make sure this path matches your getMediaFiles path
    const filePath = path.join(process.cwd(), "public/images", file.name);
    await writeFile(filePath, buffer);

    // Add a small delay to ensure file is written
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Notify clients
    notifyClients();

    return NextResponse.json({
      success: true,
      file: `/images/${file.name}`,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
