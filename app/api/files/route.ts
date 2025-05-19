import { readdir } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

export async function GET() {
  try {
    const mediaDir = path.join(process.cwd(), "public/images");
    const files = await readdir(mediaDir);

    const fileList = files.map((filename) => ({
      name: filename,
      url: `/images/${filename}`,
    }));

    return NextResponse.json({ files: fileList });
  } catch (error) {
    console.error("Error reading files:", error);
    return NextResponse.json({ error: "Failed to fetch files" }, { status: 500 });
  }
}
