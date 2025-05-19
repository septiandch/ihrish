export async function getMediaFiles() {
  try {
    const response = await fetch("/api/files", {
      // Prevent caching
      cache: "no-store",
      next: { revalidate: 0 },
    });

    if (!response.ok) throw new Error("Failed to fetch files");

    const data = await response.json();
    return data.files.map((file: { url: string }) => file.url);
  } catch (error) {
    console.error("Error fetching files:", error);
    return [];
  }
}
