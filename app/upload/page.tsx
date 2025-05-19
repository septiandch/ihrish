"use client";

import { useEffect, useState } from "react";

type UploadedFile = {
  name: string;
  url: string;
};

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);

  // Fetch existing files on mount
  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await fetch("/api/files");
      if (!response.ok) throw new Error("Failed to fetch files");
      const data = await response.json();
      setFiles(data.files);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      await fetchFiles(); // Refresh file list
      setSelectedFile(null);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (filename: string) => {
    try {
      const response = await fetch(`/api/files/${encodeURIComponent(filename)}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Delete failed");
      await fetchFiles(); // Refresh file list
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-500 to-emerald-600 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-8">
        {/* Upload Form */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-md overflow-hidden p-4 sm:p-6">
          <h1 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-emerald-800">
            Upload Media
          </h1>
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 sm:p-4">
              <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-1">
                Upload File
              </label>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="w-full text-sm sm:text-base"
              />
            </div>

            {selectedFile && (
              <p className="text-xs sm:text-sm text-gray-500 truncate">
                Selected: {selectedFile.name}
              </p>
            )}

            <button
              type="submit"
              disabled={!selectedFile || uploading}
              className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 disabled:opacity-50 text-sm sm:text-base"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </form>
        </div>

        {/* File List */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-md overflow-hidden p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-emerald-800">
            Uploaded Files
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {files.map((file) => (
              <div
                key={file.name}
                className="relative border rounded-lg overflow-hidden bg-gray-50"
              >
                <img src={file.url} alt={file.name} className="w-full h-32 sm:h-48 object-cover" />
                <div className="flex items-center justify-between gap-2 p-2 bg-white">
                  <p className="text-xs sm:text-sm truncate flex-1">{file.name}</p>
                  <button
                    onClick={() => handleDelete(file.name)}
                    className="shrink-0 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs sm:text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
