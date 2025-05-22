import { unlink } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { notifyClients } from "../../shared/clients";

type Params = {
  params: Promise<{ filename: string }>;
};

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    const filename = (await params).filename;
    const filePath = path.join(process.cwd(), "public/images", filename);

    await unlink(filePath);

    // Notify clients
    notifyClients();

    return NextResponse.json({ message: "File deleted successfully" });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
  }
}
