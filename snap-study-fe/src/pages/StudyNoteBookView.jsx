import React, { useState } from "react";
import {
  Edit3,
  Plus,
  BookOpen,
  Brain,
  Zap,
  FileText,
  Trash2,
  Upload,
  X,
} from "lucide-react";

function StudyNoteBookView() {
  const [title, setTitle] = useState("StudyNote Untitled");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [sources, setSources] = useState([]);
  const [studyItems, setStudyItems] = useState([]);
  const [dragOver, setDragOver] = useState(false);

  const handleTitleEdit = () => {
    setIsEditingTitle(true);
  };

  const handleTitleSave = (e) => {
    if (e.key === "Enter") {
      setIsEditingTitle(false);
    }
  };

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
  };

  const handleFileUpload = (files) => {
    if (files) {
      const newSources = Array.from(files).map((file) => file.name);
      setSources((prev) => [...prev, ...newSources]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const removeSource = (index) => {
    setSources((prev) => prev.filter((_, i) => i !== index));
  };

  const createStudyItem = (type) => {
    const typeLabels = {
      quiz: "Quiz",
      flashcard: "Flashcard",
      mnemonic: "Mnemonic",
      "case-study": "Case Study",
    };

    const newItem = {
      id: Date.now().toString(),
      type,
      title: `${typeLabels[type]} ${
        studyItems.filter((item) => item.type === type).length + 1
      }`,
      createdAt: new Date(),
      sourceFile: sources[0] || undefined,
    };

    setStudyItems((prev) => [newItem, ...prev]);
  };

  const deleteStudyItem = (id) => {
    setStudyItems((prev) => prev.filter((item) => item.id !== id));
  };

  const getItemIcon = (type) => {
    switch (type) {
      case "quiz":
        return <BookOpen className="w-5 h-5" />;
      case "flashcard":
        return <Zap className="w-5 h-5" />;
      case "mnemonic":
        return <Brain className="w-5 h-5" />;
      case "case-study":
        return <FileText className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getItemColor = (type) => {
    switch (type) {
      case "quiz":
        return "from-blue-500 to-blue-600";
      case "flashcard":
        return "from-purple-500 to-purple-600";
      case "mnemonic":
        return "from-orange-500 to-orange-600";
      case "case-study":
        return "from-emerald-500 to-emerald-600";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-850 rounded-2xl p-8 mb-8 border border-gray-700/50 shadow-2xl backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-8">
            {isEditingTitle ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={handleTitleSave}
                onBlur={handleTitleBlur}
                className="text-3xl font-bold bg-transparent border-b-2 border-emerald-500 outline-none text-white px-2 py-1 min-w-0 flex-1"
                autoFocus
              />
            ) : (
              <h1
                className="text-3xl font-bold text-white cursor-pointer hover:text-emerald-400 transition-all duration-300 hover:scale-105"
                onClick={handleTitleEdit}
              >
                {title}
              </h1>
            )}
            <button
              onClick={handleTitleEdit}
              className="p-2 hover:bg-gray-700/50 rounded-xl transition-all duration-200 hover:scale-110"
            >
              <Edit3 className="w-5 h-5 text-gray-400 hover:text-emerald-400" />
            </button>
          </div>

          {/* File Upload */}
          <div
            className={`mb-8 p-6 border-2 border-dashed rounded-xl transition-all duration-300 ${
              dragOver
                ? "border-emerald-500 bg-emerald-500/10 scale-105"
                : "border-gray-600 hover:border-gray-500"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="text-center">
              <Upload
                className={`w-8 h-8 mx-auto mb-3 transition-colors duration-300 ${
                  dragOver ? "text-emerald-400" : "text-gray-400"
                }`}
              />
              <p className="text-gray-300 mb-3">
                Drag & drop PDF files or click to upload
              </p>
              <label className="inline-block">
                <input
                  type="file"
                  multiple
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files)}
                />
                <span className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl font-medium transition-all duration-200 cursor-pointer hover:scale-105 shadow-lg">
                  <Plus className="w-4 h-4" />
                  Add Sources
                </span>
              </label>
            </div>
          </div>

          {/* Uploaded Files */}
          {sources.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-lg font-semibold text-white">
                  Uploaded Files
                </h3>
                <span className="px-3 py-1 bg-emerald-600/20 text-emerald-400 rounded-full text-sm font-medium">
                  {sources.length} files
                </span>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                {sources.map((source, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 px-4 py-3 bg-gray-700/50 rounded-xl border border-gray-600/50 min-w-fit hover:bg-gray-700 transition-all duration-200 group"
                  >
                    <FileText className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span className="text-sm text-gray-200 whitespace-nowrap max-w-48 truncate">
                      {source}
                    </span>
                    <button
                      onClick={() => removeSource(index)}
                      className="p-1 hover:bg-gray-600 rounded-lg transition-colors duration-200 opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-3 h-3 text-gray-400 hover:text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-wrap gap-4">
            <StudyButton
              type="quiz"
              icon={<BookOpen className="w-5 h-5" />}
              onClick={createStudyItem}
              disabled={sources.length === 0}
            />
            <StudyButton
              type="flashcard"
              icon={<Zap className="w-5 h-5" />}
              onClick={createStudyItem}
              disabled={sources.length === 0}
            />
            <StudyButton
              type="mnemonic"
              icon={<Brain className="w-5 h-5" />}
              onClick={createStudyItem}
              disabled={sources.length === 0}
            />
            <StudyButton
              type="case-study"
              icon={<FileText className="w-5 h-5" />}
              onClick={createStudyItem}
              disabled={sources.length === 0}
            />
          </div>
        </div>

        {/* Study Items */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-850 rounded-2xl border border-gray-700/50 shadow-2xl backdrop-blur-sm min-h-96">
          {studyItems.length === 0 ? (
            <div className="flex items-center justify-center h-96 text-gray-400">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center">
                  <FileText className="w-10 h-10 text-gray-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  No study materials yet
                </h3>
                <p className="text-gray-500">
                  Upload PDF files and create your first study material
                </p>
              </div>
            </div>
          ) : (
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">
                  Created Study Materials
                </h3>
                <span className="px-3 py-1 bg-emerald-600/20 text-emerald-400 rounded-full text-sm font-medium">
                  {studyItems.length} items
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                {studyItems.map((item) => (
                  <div
                    key={item.id}
                    className="group p-6 bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-xl border border-gray-600/50 hover:border-gray-500/50 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`p-3 bg-gradient-to-br ${getItemColor(
                          item.type
                        )} rounded-xl shadow-lg`}
                      >
                        {getItemIcon(item.type)}
                      </div>
                      <button
                        onClick={() => deleteStudyItem(item.id)}
                        className="p-2 hover:bg-gray-600/50 rounded-lg text-gray-400 hover:text-red-400 transition-all duration-200 opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <h4 className="font-semibold text-white mb-2 line-clamp-2">
                      {item.title}
                    </h4>
                    <p className="text-xs text-gray-400 capitalize mb-3">
                      {item.type.replace("-", " ")}
                    </p>
                    {item.sourceFile && (
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                        <FileText className="w-3 h-3" />
                        <span className="truncate">{item.sourceFile}</span>
                      </div>
                    )}
                    <div className="text-xs text-gray-500">
                      {item.createdAt.toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper button component to reduce repetition
const StudyButton = ({ type, icon, onClick, disabled }) => {
  const labelMap = {
    quiz: "Add Quiz",
    flashcard: "Add Flashcard",
    mnemonic: "Add Mnemonic",
    "case-study": "Simulate Case Study",
  };

  const gradientMap = {
    quiz: "from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800",
    flashcard:
      "from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800",
    mnemonic:
      "from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800",
    "case-study":
      "from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800",
  };

  return (
    <button
      onClick={() => onClick(type)}
      disabled={disabled}
      className={`inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r ${gradientMap[type]} disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg disabled:hover:scale-100`}
    >
      {icon}
      {labelMap[type]}
    </button>
  );
};

export default StudyNoteBookView;
