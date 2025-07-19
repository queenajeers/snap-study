import React, { useState, useEffect, useRef } from "react";
import { MoreHorizontal, FileText, Loader2 } from "lucide-react";
import { TopicActions } from "./TopicActions";
import { off, onValue, ref } from "firebase/database";
import { database } from "../../firebaseInit";
import { useNavigate } from "react-router-dom";

export const TopicCard = ({
  topic,
  onEditTitle,
  onDeleteTopic,
  onAddSources,
  onDeleteSources,
  uid,
}) => {
  const [showActions, setShowActions] = useState(false);
  const menuRef = useRef(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const uploadStatusRef = useRef(null);
  const navigate = useNavigate();

  const onCardClicked = () => {
    navigate(`topic/${topic.id}/`);
  };

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

  useEffect(() => {
    if (!uid || !topic.id) return;

    const uploadStatusPath = `users/${uid}/projects/${topic.id}/upload_status`;
    uploadStatusRef.current = ref(database, uploadStatusPath);

    const unsubscribe = onValue(uploadStatusRef.current, (snapshot) => {
      const upload_status = snapshot.val();
      setUploadStatus(upload_status.progress);
    });

    // Cleanup function
    return () => {
      if (uploadStatusRef.current) {
        off(uploadStatusRef.current);
      }
    };
  }, [uid, topic.id]);

  return (
    <div
      onClick={onCardClicked}
      className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 p-6 relative cursor-pointer"
    >
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
            onClick={(e) => {
              e.stopPropagation();
              setShowActions(!showActions);
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MoreHorizontal className="w-5 h-5 text-gray-400" />
          </button>
          {showActions && (
            <div onClick={(e) => e.stopPropagation()}>
              {/* ✅ prevent menu clicks from navigating */}
              <TopicActions
                topic={topic}
                onEditTitle={onEditTitle}
                onDeleteTopic={onDeleteTopic}
                onAddSources={onAddSources}
                onDeleteSources={onDeleteSources}
                onClose={() => setShowActions(false)}
              />
            </div>
          )}
        </div>
      </div>

      {topic.isLoading && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${uploadStatus}%` }}
          />
        </div>
      )}
    </div>
  );
};
