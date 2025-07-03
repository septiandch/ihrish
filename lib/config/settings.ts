import path from "path";

// Storage configuration
export const settingConfig = {
  // Store files outside of Next.js public directory
  settingsDir: path.join(process.cwd(), "..", "setting"),
  // Add more storage configuration as needed
};

// Create storage directory if it doesn't exist
import { mkdir } from "fs/promises";
export const initSetting = async () => {
  try {
    await mkdir(settingConfig.settingsDir, { recursive: true });
  } catch (error) {
    console.error("Failed to create settings directory:", error);
  }
};
