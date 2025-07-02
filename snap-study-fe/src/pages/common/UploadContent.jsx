import React, { useRef, useState } from "react";

const UploadContent = ({ onUpload, onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [url, setUrl] = useState("");
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (
      file &&
      (file.type === "application/pdf" || file.type === "text/plain")
    ) {
      setSelectedFile(file);
    } else {
      alert("Only PDF and TXT files are allowed.");
      e.target.value = null;
    }
  };

  const handleUpload = () => {
    const payload = {
      file: selectedFile,
      url,
    };
    onUpload(payload);
    onClose();
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6 sm:p-8 space-y-8 rounded-2xl bg-white dark:bg-zinc-900 shadow-2xl">
      <h2 className="text-2xl sm:text-3xl font-bold text-zinc-800 dark:text-zinc-100">
        Upload Document
      </h2>

      {/* File Dropzone */}
      <div
        className="w-full h-40 sm:h-44 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl flex items-center justify-center text-zinc-500 dark:text-zinc-400 text-sm cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
        onClick={() => fileInputRef.current.click()}
      >
        <span className="text-center px-2">
          {selectedFile
            ? selectedFile.name
            : "Tap or click to select document (.pdf, .txt)"}
        </span>
        <input
          type="file"
          accept=".pdf,.txt"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>
      <p className="text-center text-xs text-zinc-400 dark:text-zinc-500">
        Max file size: 10MB
      </p>

      {/* OR Divider */}
      <div className="flex items-center gap-3 text-zinc-400 dark:text-zinc-600 text-xs">
        <div className="flex-grow h-px bg-zinc-200 dark:bg-zinc-700" />
        <span>OR</span>
        <div className="flex-grow h-px bg-zinc-200 dark:bg-zinc-700" />
      </div>

      {/* URL Input */}
      <div>
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
          Import from URL
        </label>
        <input
          type="url"
          placeholder="https://example.com/document.pdf"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="mt-2 w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
          Google Drive and Dropbox links are also supported.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
        <button
          onClick={onClose}
          className="w-full sm:w-auto px-5 py-3 rounded-xl text-sm bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-zinc-700 dark:text-zinc-100 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleUpload}
          disabled={!selectedFile && !url}
          className="w-full sm:w-auto px-5 py-3 rounded-xl text-sm bg-white text-zinc-800 border border-zinc-300 hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-600 dark:hover:bg-zinc-700 disabled:opacity-50 transition"
        >
          Upload
        </button>
      </div>
    </div>
  );
};

export default UploadContent;
