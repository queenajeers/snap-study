import React, { useState, useRef } from "react";
import { X, Upload, FileText, Plus } from "lucide-react";

export const AddTopicModal = ({ isOpen, onClose, onAddTopic }) => {
  const [title, setTitle] = useState("");
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const resetForm = () => {
    setTitle("");
    setFiles([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() && files.length > 0) {
      onAddTopic(title.trim(), files);
      resetForm();
      onClose();
    }
  };

  const handleFileSelect = (selectedFiles) => {
    const validFiles = selectedFiles.filter(
      (file) => file.type === "application/pdf" || file.type === "text/plain"
    );
    setFiles((prev) => [...prev, ...validFiles]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFileSelect(droppedFiles);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  const uploading = files.length > 0 && !title.trim();

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="bg-neutral-100 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6">
          <h2 className="text-lg font-medium text-neutral-900">
            Add New Topic
          </h2>
          <button onClick={handleClose} className="text-neutral-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm text-neutral-700 mb-2"
            >
              Topic Name
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter topic name"
              className="w-full px-4 py-2 bg-white text-neutral-900 rounded-lg border border-neutral-300 focus:outline-none focus:ring-0"
              required
            />
          </div>

          {files.length === 0 && (
            <div>
              <label className="block text-sm text-neutral-700 mb-2">
                Upload Sources (PDF or TXT)
              </label>
              <div
                className={`rounded-lg p-6 text-center bg-white ${
                  isDragging ? "bg-neutral-200" : "bg-neutral-100"
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <Upload className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
                <p className="text-sm text-neutral-600 mb-1">
                  Drag and drop files, or{" "}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-blue-600 underline"
                  >
                    browse
                  </button>
                </p>
                <p className="text-xs text-neutral-500">PDF and TXT only</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.txt"
                onChange={(e) =>
                  handleFileSelect(Array.from(e.target.files || []))
                }
                className="hidden"
              />
            </div>
          )}

          {files.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-neutral-700">Selected Files:</p>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between px-3 py-2 bg-neutral-200 rounded-lg"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileText className="w-4 h-4 text-neutral-500 shrink-0" />
                      <span className="text-sm text-neutral-800 truncate">
                        {file.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-neutral-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 bg-neutral-200 text-neutral-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || files.length === 0}
              className="flex-1 px-4 py-2 bg-neutral-800 text-white rounded-lg disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Topic
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
