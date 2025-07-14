import React, { useState, useRef, useEffect } from "react";
import { Edit2, Trash2, Plus, FolderMinus, X, Upload } from "lucide-react";

export const TopicActions = ({
  topic,
  onEditTitle,
  onDeleteTopic,
  onAddSources,
  onDeleteSources,
  onClose,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(topic.title);
  const [showDeleteSources, setShowDeleteSources] = useState(false);
  const [showAddSources, setShowAddSources] = useState(false);
  const [selectedSources, setSelectedSources] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [newFiles, setNewFiles] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isEditing || showDeleteSources || showAddSources) {
        const target = event.target;
        if (!target.closest(".modal-content")) {
          handleCloseModal();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isEditing, showDeleteSources, showAddSources]);

  const handleCloseModal = () => {
    setIsEditing(false);
    setShowDeleteSources(false);
    setShowAddSources(false);
    setSelectedSources([]);
    setNewFiles([]);
    setEditTitle(topic.title);
    onClose();
  };

  const handleEditTitle = () => {
    if (editTitle.trim()) {
      onEditTitle(topic.id, editTitle.trim());
      handleCloseModal();
    }
  };

  const handleFileSelect = (selectedFiles) => {
    const validFiles = selectedFiles.filter(
      (file) => file.type === "application/pdf" || file.type === "text/plain"
    );
    setNewFiles((prev) => [...prev, ...validFiles]);
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

  const handleAddSourcesSubmit = () => {
    if (newFiles.length > 0) {
      onAddSources(topic.id, newFiles);
      handleCloseModal();
    }
  };

  const handleDeleteSources = () => {
    if (topic.sources.length - selectedSources.length >= 1) {
      onDeleteSources(topic.id, selectedSources);
      handleCloseModal();
    }
  };

  const toggleSourceSelection = (sourceId) => {
    setSelectedSources((prev) =>
      prev.includes(sourceId)
        ? prev.filter((id) => id !== sourceId)
        : [...prev, sourceId]
    );
  };

  // Modals and Actions (same as original)
  // ---- Edit Title Modal ----
  if (isEditing) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="modal-content bg-white rounded-xl shadow-xl max-w-md w-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Edit Topic Title
            </h2>
            <button
              onClick={handleCloseModal}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-6">
            <label
              htmlFor="edit-title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Topic Name
            </label>
            <input
              type="text"
              id="edit-title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter topic name"
              onKeyPress={(e) => e.key === "Enter" && handleEditTitle()}
            />
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleEditTitle}
                disabled={!editTitle.trim()}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---- Add Sources Modal ----
  if (showAddSources) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="modal-content bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Add Sources</h2>
            <button
              onClick={handleCloseModal}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-6 space-y-6">
            {newFiles.length === 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Sources (PDF or TXT files)
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    isDragging
                      ? "border-blue-400 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-600 mb-2">
                    Drag and drop files here, or{" "}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      browse
                    </button>
                  </p>
                  <p className="text-xs text-gray-500">
                    PDF and TXT files only
                  </p>
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

            {newFiles.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">
                  Selected Files:
                </h4>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {newFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700 truncate">
                          {file.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSourcesSubmit}
                disabled={newFiles.length === 0}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Sources
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---- Delete Sources Modal ----
  if (showDeleteSources) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="modal-content bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Delete Sources
            </h2>
            <button
              onClick={handleCloseModal}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-600 mb-4">
              Select sources to delete. You must keep at least 1 source.
            </p>
            <div className="max-h-64 overflow-y-auto space-y-2 mb-6">
              {topic.sources.map((source) => (
                <label
                  key={source.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedSources.includes(source.id)}
                    onChange={() => toggleSourceSelection(source.id)}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 truncate flex-1">
                    {source.name}
                  </span>
                </label>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSources}
                disabled={
                  selectedSources.length === 0 ||
                  topic.sources.length - selectedSources.length < 1
                }
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Delete ({selectedSources.length})
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---- Actions Menu ----
  return (
    <div className="absolute top-12 right-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-48 z-10">
      <button
        onClick={() => setIsEditing(true)}
        className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-50 text-sm text-gray-700"
      >
        <Edit2 className="w-4 h-4" />
        Edit Title
      </button>
      <button
        onClick={() => setShowAddSources(true)}
        className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-50 text-sm text-gray-700"
      >
        <Plus className="w-4 h-4" />
        Add Sources
      </button>
      <button
        onClick={() => setShowDeleteSources(true)}
        className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-50 text-sm text-gray-700"
      >
        <FolderMinus className="w-4 h-4" />
        Delete Sources
      </button>
      <button
        onClick={() => onDeleteTopic(topic.id)}
        className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-50 text-sm text-red-600"
      >
        <Trash2 className="w-4 h-4" />
        Delete Topic
      </button>
    </div>
  );
};
