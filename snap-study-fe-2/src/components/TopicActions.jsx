import React, { useState, useRef, useEffect } from "react";
import {
  Edit2,
  Trash2,
  Plus,
  FolderMinus,
  X,
  Upload,
  FileText,
} from "lucide-react";

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

  // ----------- Modal Layouts -------------
  const ModalWrapper = ({ title, children }) => (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="modal-content bg-neutral-100 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6">
          <h2 className="text-lg font-medium text-neutral-900">{title}</h2>
          <button onClick={handleCloseModal} className="text-neutral-500">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );

  if (isEditing) {
    return (
      <ModalWrapper title="Edit Topic Title">
        <div>
          <label
            htmlFor="edit-title"
            className="block text-sm text-neutral-700 mb-2"
          >
            Topic Name
          </label>
          <input
            id="edit-title"
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleEditTitle()}
            className="w-full px-4 py-2 bg-white text-neutral-900 rounded-lg border border-neutral-300 focus:outline-none"
            placeholder="Enter topic name"
          />
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleCloseModal}
            className="flex-1 px-4 py-2 bg-neutral-200 text-neutral-800 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleEditTitle}
            disabled={!editTitle.trim()}
            className="flex-1 px-4 py-2 bg-neutral-800 text-white rounded-lg disabled:opacity-40 disabled:pointer-events-none"
          >
            Save
          </button>
        </div>
      </ModalWrapper>
    );
  }

  if (showAddSources) {
    return (
      <ModalWrapper title="Add Sources">
        {newFiles.length === 0 && (
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
                Drag and drop, or{" "}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-blue-600 underline"
                >
                  browse
                </button>
              </p>
              <p className="text-xs text-neutral-500">PDF or TXT only</p>
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
            <p className="text-sm text-neutral-700 mb-1">Selected Files:</p>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {newFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-neutral-200 px-3 py-2 rounded-lg"
                >
                  <FileText className="w-4 h-4 text-neutral-500" />
                  <span className="text-sm text-neutral-800 truncate">
                    {file.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleCloseModal}
            className="flex-1 px-4 py-2 bg-neutral-200 text-neutral-800 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleAddSourcesSubmit}
            disabled={newFiles.length === 0}
            className="flex-1 px-4 py-2 bg-neutral-800 text-white rounded-lg disabled:opacity-40 disabled:pointer-events-none"
          >
            Add Sources
          </button>
        </div>
      </ModalWrapper>
    );
  }

  if (showDeleteSources) {
    return (
      <ModalWrapper title="Delete Sources">
        <p className="text-sm text-neutral-600 mb-4">
          Select sources to delete. You must keep at least 1 source.
        </p>
        <div className="space-y-2 max-h-64 overflow-y-auto mb-6">
          {topic.sources.map((source) => (
            <label
              key={source.id}
              className="flex items-center gap-3 bg-neutral-100 p-3 rounded-lg"
            >
              <input
                type="checkbox"
                checked={selectedSources.includes(source.id)}
                onChange={() => toggleSourceSelection(source.id)}
                className="w-4 h-4 accent-blue-600"
              />
              <span className="text-sm text-neutral-800 truncate">
                {source.name}
              </span>
            </label>
          ))}
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleCloseModal}
            className="flex-1 px-4 py-2 bg-neutral-200 text-neutral-800 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteSources}
            disabled={
              selectedSources.length === 0 ||
              topic.sources.length - selectedSources.length < 1
            }
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg disabled:opacity-40 disabled:pointer-events-none"
          >
            Delete ({selectedSources.length})
          </button>
        </div>
      </ModalWrapper>
    );
  }

  // ----------- Main Menu UI ------------
  return (
    <div className="absolute top-12 right-0 bg-white rounded-xl py-2 min-w-48 z-10">
      <button
        onClick={() => setIsEditing(true)}
        className="w-full px-4 py-2 text-left text-sm text-neutral-800"
      >
        <div className="flex items-center gap-3">
          <Edit2 className="w-4 h-4 text-neutral-500" />
          Edit Title
        </div>
      </button>
      <button
        onClick={() => setShowAddSources(true)}
        className="w-full px-4 py-2 text-left text-sm text-neutral-800"
      >
        <div className="flex items-center gap-3">
          <Plus className="w-4 h-4 text-neutral-500" />
          Add Sources
        </div>
      </button>
      <button
        onClick={() => setShowDeleteSources(true)}
        className="w-full px-4 py-2 text-left text-sm text-neutral-800"
      >
        <div className="flex items-center gap-3">
          <FolderMinus className="w-4 h-4 text-neutral-500" />
          Delete Sources
        </div>
      </button>
      <button
        onClick={() => onDeleteTopic(topic.id)}
        className="w-full px-4 py-2 text-left text-sm text-red-600"
      >
        <div className="flex items-center gap-3">
          <Trash2 className="w-4 h-4" />
          Delete Topic
        </div>
      </button>
    </div>
  );
};
