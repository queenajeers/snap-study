import React, { useState, useEffect, useRef } from "react";
import { MoreHorizontal, FileText, Loader2 } from "lucide-react";
import { TopicActions } from "./TopicActions";

export const TopicCard = ({
  topic,
  onEditTitle,
  onDeleteTopic,
  onAddSources,
  onDeleteSources,
}) => {
  const [showActions, setShowActions] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowActions(false);
      }
    };

    if (showActions) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showActions]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 p-6 relative">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {topic.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FileText className="w-4 h-4" />
            <span>{topic.sources.length} sources</span>
          </div>
        </div>
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MoreHorizontal className="w-5 h-5 text-gray-400" />
          </button>
          {showActions && (
            <TopicActions
              topic={topic}
              onEditTitle={onEditTitle}
              onDeleteTopic={onDeleteTopic}
              onAddSources={onAddSources}
              onDeleteSources={onDeleteSources}
              onClose={() => setShowActions(false)}
            />
          )}
        </div>
      </div>

      {topic.isLoading && (
        <div className="flex items-center gap-2 text-sm text-blue-600 mt-4">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Uploading sources...</span>
        </div>
      )}
    </div>
  );
};
