import path from 'path';

// Storage configuration
export const storageConfig = {
    // Store files outside of Next.js public directory
    uploadsDir: path.join(process.cwd(), '..', 'storage', 'uploads'),
    // Add more storage configuration as needed
};

// Create storage directory if it doesn't exist
import { mkdir } from 'fs/promises';
export const initStorage = async () => {
    try {
        await mkdir(storageConfig.uploadsDir, { recursive: true });
    } catch (error) {
        console.error('Failed to create storage directory:', error);
    }
};
