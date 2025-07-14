import React, { useState } from "react";
import {
  ArrowLeft,
  Edit2,
  MessageSquare,
  Upload,
  Plus,
  FileText,
  Zap,
  HelpCircle,
  BookOpen,
  X,
} from "lucide-react";

const StudyMaterialView = () => {
  const material = {
    id: "1",
    title: "Machine Learning Fundamentals",
    sources: 0,
    flashcards: 0,
    quizzes: 0,
    caseStudies: 0,
  };

  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [contentItems, setContentItems] = useState([]);
  const [newItemType, setNewItemType] = useState("flashcard");

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(
      (file) => file.type === "application/pdf" || file.type === "text/plain"
    );

    if (validFiles.length > 0) {
      setUploadedFiles((prev) => [...prev, ...validFiles.map((f) => f.name)]);
    }
  };

  const handleFileUpload = (e) => {
    const files = e.target.files;
    if (files) {
      const validFiles = Array.from(files).filter(
        (file) => file.type === "application/pdf" || file.type === "text/plain"
      );

      if (validFiles.length > 0) {
        setUploadedFiles((prev) => [...prev, ...validFiles.map((f) => f.name)]);
      }
    }
  };

  const handleAddItem = () => {
    const newItem = {
      id: Date.now().toString(),
      type: newItemType,
      createdAt: new Date(),
    };

    setContentItems((prev) => [...prev, newItem]);
    setShowAddModal(false);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "flashcard":
        return <Zap className="w-5 h-5 text-blue-600" />;
      case "quiz":
        return <HelpCircle className="w-5 h-5 text-green-600" />;
      case "casestudy":
        return <BookOpen className="w-5 h-5 text-purple-600" />;
      default:
        return null;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "flashcard":
        return "bg-blue-50 border-blue-200";
      case "quiz":
        return "bg-green-50 border-green-200";
      case "casestudy":
        return "bg-purple-50 border-purple-200";
      default:
        return "";
    }
  };

  const getTypeTitle = (type) => {
    switch (type) {
      case "flashcard":
        return "Flashcard";
      case "quiz":
        return "Quiz";
      case "casestudy":
        return "Case Study";
      default:
        return "";
    }
  };

  const getTypeDescription = (type) => {
    switch (type) {
      case "flashcard":
        return "Create interactive flashcards for quick review and memorization";
      case "quiz":
        return "Generate quizzes to test your knowledge on specific topics";
      case "casestudy":
        return "Develop comprehensive case studies for in-depth analysis";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-noto">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-semibold text-gray-900">
                  {material.title}
                </h1>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <Edit2 className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
            <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>Chat</span>
            </button>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Uploaded Files */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 text-gray-600">
            <FileText className="w-4 h-4" />
            <span className="text-sm">{uploadedFiles.length} sources</span>
          </div>
        </div>

        {/* Upload Zone */}
        <div className="mb-8">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              isDragging
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 bg-gray-100"
            }`}
          >
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700 mb-1">
              Upload File
            </p>
            <p className="text-xs text-gray-500 mb-3">
              Drag and drop your PDF or TXT files here
            </p>
            <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer">
              <input
                type="file"
                accept=".pdf,.txt"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
              Choose Files
            </label>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium text-gray-900 mb-2">
                Uploaded Files:
              </h3>
              <div className="space-y-2">
                {uploadedFiles.map((fileName, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 text-sm text-gray-600"
                  >
                    <FileText className="w-4 h-4" />
                    <span>{fileName}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Study Materials */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Study Materials
            </h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>

          {contentItems.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No study materials created yet</p>
              <p className="text-sm">
                Click "Add" to create your first flashcard, quiz, or case study
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {contentItems.map((item) => (
                <div
                  key={item.id}
                  className={`border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${getTypeColor(
                    item.type
                  )}`}
                >
                  <div className="flex items-start space-x-3">
                    {getTypeIcon(item.type)}
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">
                        {getTypeTitle(item.type)}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {getTypeDescription(item.type)}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="capitalize">{item.type}</span>
                        <span>•</span>
                        <span>{item.createdAt.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Add Study Material
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {["flashcard", "quiz", "casestudy"].map((type) => (
                <button
                  key={type}
                  onClick={() => setNewItemType(type)}
                  className={`w-full p-4 rounded-lg border text-left transition-colors ${
                    newItemType === type
                      ? `border-${
                          type === "flashcard"
                            ? "blue"
                            : type === "quiz"
                            ? "green"
                            : "purple"
                        }-500 bg-${
                          type === "flashcard"
                            ? "blue"
                            : type === "quiz"
                            ? "green"
                            : "purple"
                        }-50 text-${
                          type === "flashcard"
                            ? "blue"
                            : type === "quiz"
                            ? "green"
                            : "purple"
                        }-700`
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {getTypeIcon(type)}
                    <div>
                      <div className="font-medium">{getTypeTitle(type)}</div>
                      <div className="text-sm opacity-75">
                        {getTypeDescription(type)}
                      </div>
                    </div>
                  </div>
                </button>
              ))}

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddItem}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyMaterialView;
