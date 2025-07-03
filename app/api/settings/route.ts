import { initSetting, settingConfig } from "@/lib/config/settings";
import { readFile, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { notifyClients } from "../shared/clients";

const SETTINGS_FILENAME = "settings.json";

export async function GET() {
  try {
    await initSetting();
    const filePath = path.join(settingConfig.settingsDir, SETTINGS_FILENAME);
    const data = await readFile(filePath, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    // If file doesn't exist, return empty object
    console.error("Error retrieving settings:", error);
    return NextResponse.json({}, { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await initSetting();
    const body = await request.json();

    const filePath = path.join(settingConfig.settingsDir, SETTINGS_FILENAME);
    const data = JSON.stringify(body, null, 2);

    await writeFile(filePath, data, "utf-8");

    // Add a small delay to ensure file is written
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Notify clients
    notifyClients(`event: update\ndata: newSettings\n\n`);

    return NextResponse.json({
      success: true,
      file: `/api/settings/${SETTINGS_FILENAME}`,
    });
  } catch (error) {
    console.error("Settings error:", error);
    return NextResponse.json({ error: "Settings update failed" }, { status: 500 });
  }
}
